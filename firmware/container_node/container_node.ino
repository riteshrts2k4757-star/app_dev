#include <Arduino.h>
#include <SPI.h>
#include <RF24.h>
#include <DHT.h>
#include <SD.h>
#include "mbedtls/md.h"
#include "../shared/farmtrace_protocol.h"
#include "config.h"

// ---------------------------------------------------------
// Globals
// ---------------------------------------------------------
DHT dht(DHT_PIN, DHT_TYPE);
RF24 radio(NRF24_CE_PIN, NRF24_CSN_PIN);

uint16_t currentSequence = 1;
unsigned long lastSensorPoll = 0;
uint8_t previousHash[32] = {0}; // Initialize with 0 for genesis

// ---------------------------------------------------------
// Helper: SHA256 Hashing
// ---------------------------------------------------------
void generateHash(SensorDataPacket &packet, uint8_t* outHash) {
    mbedtls_md_context_t ctx;
    mbedtls_md_type_t md_type = MBEDTLS_MD_SHA256;
    mbedtls_md_init(&ctx);
    mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type), 0);
    mbedtls_md_starts(&ctx);
    
    // Hash the previous hash
    mbedtls_md_update(&ctx, previousHash, 32);
    // Hash the payload
    mbedtls_md_update(&ctx, (const unsigned char*)&packet.sequence, sizeof(packet.sequence));
    mbedtls_md_update(&ctx, (const unsigned char*)&packet.temperature, sizeof(packet.temperature));
    mbedtls_md_update(&ctx, (const unsigned char*)&packet.humidity, sizeof(packet.humidity));
    
    mbedtls_md_finish(&ctx, outHash);
    mbedtls_md_free(&ctx);
}

// ---------------------------------------------------------
// Setup
// ---------------------------------------------------------
void setup() {
    Serial.begin(115200);
    Serial.println("FarmTrace Container Node Starting...");

    // Init Sensors
    dht.begin();
    pinMode(MQ6_PIN, INPUT);
    pinMode(BATTERY_ADC_PIN, INPUT);
    pinMode(SOLAR_ADC_PIN, INPUT);

    // Init SD Card
    if (!SD.begin(SD_CS_PIN)) {
        Serial.println("SD Card Mount Failed!");
    } else {
        Serial.println("SD Card Mounted.");
    }

    // Init nRF24
    if (!radio.begin()) {
        Serial.println("Radio hardware is not responding!");
    } else {
        radio.setPALevel(RF24_PA_MAX);
        radio.setDataRate(RF24_1MBPS);
        radio.setChannel(NRF24_CHANNEL);
        
        // Two-way communication pipes
        radio.openWritingPipe(NRF24_ADDRESS_GATEWAY);
        radio.openReadingPipe(1, NRF24_ADDRESS_CONTAINER);
        radio.startListening();
        Serial.println("nRF24 Init Success.");
    }
}

// ---------------------------------------------------------
// Loop
// ---------------------------------------------------------
void loop() {
    // 1. Process Incoming Commands from Gateway
    if (radio.available()) {
        uint8_t buffer[32];
        radio.read(&buffer, sizeof(buffer));
        
        if (buffer[0] == PKT_COMMAND) {
            CommandPacket* cmd = (CommandPacket*)buffer;
            Serial.print("Received Command Code: ");
            Serial.println(cmd->commandCode, HEX);
            
            // Handle command
            ResponsePacket resp;
            resp.type = PKT_RESPONSE;
            resp.commandCode = cmd->commandCode;
            resp.commandId = cmd->commandId;
            resp.value1 = 0;
            
            if (cmd->commandCode == CMD_REQUEST_BATTERY) {
                resp.value1 = (analogRead(BATTERY_ADC_PIN) / 4095.0) * 4.2; // Mock calculation
            }
            
            // Send Response
            radio.stopListening();
            radio.write(&resp, sizeof(ResponsePacket));
            radio.startListening();
        }
    }

    // 2. Poll Sensors and Send Data (Every SENSOR_POLL_INTERVAL)
    if (millis() - lastSensorPoll > SENSOR_POLL_INTERVAL) {
        lastSensorPoll = millis();
        
        SensorDataPacket packet;
        packet.type = PKT_DATA;
        packet.sequence = currentSequence++;
        packet.timestamp = millis() / 1000; // In a real app, use RTC
        
        // Read DHT11
        packet.temperature = dht.readTemperature();
        packet.humidity = dht.readHumidity();
        if (isnan(packet.temperature)) packet.temperature = 0.0;
        if (isnan(packet.humidity)) packet.humidity = 0.0;
        
        // Read MQ6 & Power
        packet.mq6Raw = analogRead(MQ6_PIN);
        
        // Convert ADC to approximate voltage (ESP32 ADC is 12-bit)
        float battVolt = (analogRead(BATTERY_ADC_PIN) / 4095.0) * 3.3 * 2.0; // Assuming voltage divider
        packet.batteryPct = (battVolt > 3.0) ? (uint8_t)((battVolt - 3.0) * 100) : 0;
        if (packet.batteryPct > 100) packet.batteryPct = 100;
        
        packet.solarVoltage = (analogRead(SOLAR_ADC_PIN) / 4095.0) * 3.3 * 2.0;

        // Security: Hash chaining
        uint8_t currentFullHash[32];
        generateHash(packet, currentFullHash);
        memcpy(packet.hashFragment, currentFullHash, 8); // Store first 8 bytes for radio packet size limits
        memcpy(previousHash, currentFullHash, 32); // Update chain
        
        // Log to SD Card
        File logFile = SD.open("/data_log.bin", FILE_APPEND);
        if (logFile) {
            logFile.write((uint8_t*)&packet, sizeof(SensorDataPacket));
            logFile.close();
            Serial.println("Saved record to SD.");
        }
        
        // Transmit via nRF24
        radio.stopListening();
        bool success = radio.write(&packet, sizeof(SensorDataPacket));
        
        if (success) {
            // Wait for ACK
            radio.startListening();
            unsigned long waitStart = millis();
            bool ackReceived = false;
            
            while (millis() - waitStart < RADIO_TIMEOUT_MS) {
                if (radio.available()) {
                    uint8_t buffer[32];
                    radio.read(&buffer, sizeof(buffer));
                    if (buffer[0] == PKT_ACK) {
                        AckPacket* ack = (AckPacket*)buffer;
                        if (ack->sequence == packet.sequence) {
                            ackReceived = true;
                            break;
                        }
                    }
                }
            }
            
            if (ackReceived) {
                Serial.println("Data sent & ACK received.");
            } else {
                Serial.println("Data sent but NO ACK (Gateway unreachable). Record kept on SD.");
            }
        } else {
            Serial.println("TX Failed. Device Offline.");
        }
        radio.startListening();
    }
}
