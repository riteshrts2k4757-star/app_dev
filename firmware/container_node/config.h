#ifndef CONTAINER_CONFIG_H
#define CONTAINER_CONFIG_H

// Device Identification
#define DEVICE_ID "CONTAINER-001"

// ---------------------------------------------------------
// Pin Configurations for ESP32
// ---------------------------------------------------------

// DHT11 Sensor
#define DHT_PIN 4
#define DHT_TYPE 11 // 11 for DHT11

// MQ-6 Gas Sensor (Analog)
#define MQ6_PIN 34

// Power / Battery Monitoring (Analog)
#define BATTERY_ADC_PIN 35
#define SOLAR_ADC_PIN 36

// SPI / nRF24L01 Module
// Uses default ESP32 VSPI pins: MOSI=23, MISO=19, SCK=18
#define NRF24_CE_PIN 22
#define NRF24_CSN_PIN 21

// SD Card Module (SPI)
#define SD_CS_PIN 5

// ---------------------------------------------------------
// Timing Configurations (Milliseconds)
// ---------------------------------------------------------
#define SENSOR_POLL_INTERVAL 10000 // Read sensors every 10 seconds
#define RADIO_TIMEOUT_MS 500       // Wait 500ms for an ACK
#define RETRY_DELAY_MS 2000        // Retry after 2 seconds if no ACK

#endif // CONTAINER_CONFIG_H
