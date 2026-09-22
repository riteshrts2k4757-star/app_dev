#ifndef GATEWAY_CONFIG_H
#define GATEWAY_CONFIG_H

// Local Wi-Fi Access Point Details
#define AP_SSID "FarmTrace-Gateway"
#define AP_PASS "farmtrace123"

// ---------------------------------------------------------
// Pin Configurations for NodeMCU ESP8266
// ---------------------------------------------------------

// MPU6050 (I2C)
// NodeMCU default I2C pins: D1 (SCL), D2 (SDA)
#define I2C_SDA D2
#define I2C_SCL D1

// MQ-3 Alcohol Sensor (Analog)
// ESP8266 has only one ADC pin (A0)
#define MQ3_PIN A0

// SPI / nRF24L01 Module
// NodeMCU HSPI pins: D7 (MOSI), D6 (MISO), D5 (SCK)
#define NRF24_CE_PIN D4
#define NRF24_CSN_PIN D8

// ---------------------------------------------------------
// Timing
// ---------------------------------------------------------
#define MPU_POLL_INTERVAL 1000 // Poll MPU every 1 second

#endif // GATEWAY_CONFIG_H
