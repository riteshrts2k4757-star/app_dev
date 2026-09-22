#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <SPI.h>
#include <RF24.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include "../shared/farmtrace_protocol.h"
#include "config.h"

// ---------------------------------------------------------
// Globals
// ---------------------------------------------------------
ESP8266WebServer server(80);
RF24 radio(NRF24_CE_PIN, NRF24_CSN_PIN);
Adafruit_MPU6050 mpu;

// Store the latest received packet from Container
SensorDataPacket latestContainerData;
bool hasContainerData = false;

// Driver Side Data
float mpuAccelX = 0, mpuAccelY = 0, mpuAccelZ = 0;
uint16_t mq3Raw = 0;
unsigned long lastMpuPoll = 0;

// Command state
uint32_t pendingCommandId = 0;
bool pendingCommand = false;
CommandPacket queuedCommand;
ResponsePacket lastResponse;
bool responseReady = false;

// ---------------------------------------------------------
// Web Handlers
// ---------------------------------------------------------

// Endpoint: GET /api/data
// Phone calls this every few seconds to pull data
void handleGetData() {
    String json = "{";
    
    // Driver Node Data
    json += "\"driver\": {";
    json += "\"mq3\":" + String(mq3Raw) + ",";
    json += "\"motion\": {";
    json += "\"x\":" + String(mpuAccelX) + ",";
    json += "\"y\":" + String(mpuAccelY) + ",";
    json += "\"z\":" + String(mpuAccelZ);
    json += "}}";
    
    // Container Data
    if (hasContainerData) {
        json += ", \"container\": {";
        json += "\"sequence\":" + String(latestContainerData.sequence) + ",";
        json += "\"temperature\":" + String(latestContainerData.temperature) + ",";
        json += "\"humidity\":" + String(latestContainerData.humidity) + ",";
        json += "\"mq6\":" + String(latestContainerData.mq6Raw) + ",";
        json += "\"battery\":" + String(latestContainerData.batteryPct) + ",";
        json += "\"solar\":" + String(latestContainerData.solarVoltage);
        json += "}";
    } else {
        json += ", \"container\": null";
    }
    
    json += "}";
    server.send(200, "application/json", json);
}

// Endpoint: POST /api/command
// Phone sends a command to be forwarded to ESP32
void handleCommand() {
    if (server.hasArg("plain")) {
        String body = server.arg("plain");
        // Very basic parsing for prototype
        if (body.indexOf("REQUEST_BATTERY") > 0) {
            queuedCommand.type = PKT_COMMAND;
            queuedCommand.commandCode = CMD_REQUEST_BATTERY;
            queuedCommand.commandId = millis();
            pendingCommand = true;
            responseReady = false;
            
            server.send(200, "application/json", "{\"status\":\"queued\", \"commandId\":" + String(queuedCommand.commandId) + "}");
            return;
        }
    }
    server.send(400, "application/json", "{\"error\":\"Invalid command\"}");
}

// Endpoint: GET /api/response?id=XYZ
void handleResponse() {
    if (responseReady) {
        String json = "{\"status\":\"success\", \"value1\":" + String(lastResponse.value1) + "}";
        server.send(200, "application/json", json);
        responseReady = false;
    } else {
        server.send(200, "application/json", "{\"status\":\"pending\"}");
    }
}

// ---------------------------------------------------------
// Setup
// ---------------------------------------------------------
void setup() {
    Serial.begin(115200);
    Serial.println("FarmTrace Driver Gateway Starting...");

    // Init Wi-Fi AP
    WiFi.softAP(AP_SSID, AP_PASS);
    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(IP);

    // Init API Routes
    server.on("/api/data", HTTP_GET, handleGetData);
    server.on("/api/command", HTTP_POST, handleCommand);
    server.on("/api/response", HTTP_GET, handleResponse);
    server.begin();
    Serial.println("HTTP server started");

    // Init MPU6050
    Wire.begin(I2C_SDA, I2C_SCL);
    if (!mpu.begin()) {
        Serial.println("Failed to find MPU6050 chip");
    } else {
        mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
        mpu.setGyroRange(MPU6050_RANGE_500_DEG);
        mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
        Serial.println("MPU6050 Found.");
    }

    // Init nRF24
    if (!radio.begin()) {
        Serial.println("Radio hardware is not responding!");
    } else {
        radio.setPALevel(RF24_PA_MAX);
        radio.setDataRate(RF24_1MBPS);
        radio.setChannel(NRF24_CHANNEL);
        
        radio.openWritingPipe(NRF24_ADDRESS_CONTAINER);
        radio.openReadingPipe(1, NRF24_ADDRESS_GATEWAY);
        radio.startListening();
        Serial.println("nRF24 Init Success.");
    }
}

// ---------------------------------------------------------
// Loop
// ---------------------------------------------------------
void loop() {
    // 1. Handle Web Requests
    server.handleClient();

    // 2. Poll Driver Sensors
    if (millis() - lastMpuPoll > MPU_POLL_INTERVAL) {
        lastMpuPoll = millis();
        sensors_event_t a, g, temp;
        mpu.getEvent(&a, &g, &temp);
        
        mpuAccelX = a.acceleration.x;
        mpuAccelY = a.acceleration.y;
        mpuAccelZ = a.acceleration.z;
        
        mq3Raw = analogRead(MQ3_PIN);
    }

    // 3. Process Radio Rx
    if (radio.available()) {
        uint8_t buffer[32];
        radio.read(&buffer, sizeof(buffer));
        
        if (buffer[0] == PKT_DATA) {
            memcpy(&latestContainerData, buffer, sizeof(SensorDataPacket));
            hasContainerData = true;
            Serial.print("Received Data Seq: ");
            Serial.println(latestContainerData.sequence);
            
            // Send ACK back
            AckPacket ack;
            ack.type = PKT_ACK;
            ack.sequence = latestContainerData.sequence;
            
            radio.stopListening();
            radio.write(&ack, sizeof(AckPacket));
            radio.startListening();
            Serial.println("ACK Sent.");
        }
        else if (buffer[0] == PKT_RESPONSE) {
            memcpy(&lastResponse, buffer, sizeof(ResponsePacket));
            responseReady = true;
            Serial.println("Received Command Response from Container.");
        }
    }

    // 4. Send Pending Commands
    if (pendingCommand) {
        radio.stopListening();
        bool ok = radio.write(&queuedCommand, sizeof(CommandPacket));
        radio.startListening();
        
        if (ok) {
            Serial.println("Command sent to Container.");
        } else {
            Serial.println("Command failed to send.");
        }
        pendingCommand = false; // We sent it, wait for response asynchronously via radio.available()
    }
}
