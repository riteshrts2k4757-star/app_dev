#ifndef FARMTRACE_PROTOCOL_H
#define FARMTRACE_PROTOCOL_H

#include <stdint.h>

// Packet Types
enum PacketType : uint8_t {
    PKT_DATA = 0x01,
    PKT_ACK = 0x02,
    PKT_COMMAND = 0x03,
    PKT_RESPONSE = 0x04,
    PKT_PING = 0x05,
    PKT_ERROR = 0x06
};

// Command Codes
enum CommandCode : uint8_t {
    CMD_REQUEST_STATUS = 0x10,
    CMD_REQUEST_BATTERY = 0x11,
    CMD_REQUEST_LATEST_DATA = 0x12,
    CMD_REQUEST_PENDING_COUNT = 0x13,
    CMD_SYNC_REQUEST = 0x14,
    CMD_PING = 0x15
};

// Shared Constants
const uint16_t NRF24_CHANNEL = 115;
const uint8_t NRF24_ADDRESS_CONTAINER[6] = "FT_C1";
const uint8_t NRF24_ADDRESS_GATEWAY[6] = "FT_G1";

// ---------------------------------------------------------
// Binary Structures for nRF24L01 (Max 32 bytes per packet)
// We use __attribute__((packed)) to ensure no padding bytes
// ---------------------------------------------------------

struct __attribute__((packed)) SensorDataPacket {
    uint8_t type;             // Always PKT_DATA (1 byte)
    uint16_t sequence;        // Sequence ID (2 bytes)
    uint32_t timestamp;       // Unix epoch (4 bytes)
    float temperature;        // (4 bytes)
    float humidity;           // (4 bytes)
    uint16_t mq6Raw;          // Gas sensor (2 bytes)
    uint8_t batteryPct;       // 0-100 (1 byte)
    float solarVoltage;       // (4 bytes)
    uint8_t hashFragment[8];  // First 8 bytes of SHA256 (8 bytes)
    // Total: 30 bytes (fits in 32-byte nRF24 payload)
};

struct __attribute__((packed)) AckPacket {
    uint8_t type;             // Always PKT_ACK
    uint16_t sequence;        // Which sequence is being ACKed
};

struct __attribute__((packed)) CommandPacket {
    uint8_t type;             // Always PKT_COMMAND
    uint8_t commandCode;      // e.g., CMD_REQUEST_STATUS
    uint32_t commandId;       // Used to track responses
};

struct __attribute__((packed)) ResponsePacket {
    uint8_t type;             // Always PKT_RESPONSE
    uint8_t commandCode;      // Which command this answers
    uint32_t commandId;
    float value1;             // Generic payload (e.g., battery voltage)
    float value2;
};

#endif // FARMTRACE_PROTOCOL_H
