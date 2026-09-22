const mqtt = require('mqtt');
const SensorRecord = require('../models/SensorRecord');

let client;

const connectMQTT = () => {
  const brokerUrl = process.env.MQTT_BROKER || 'mqtt://broker.emqx.io:1883';
  
  console.log(`Connecting to MQTT broker: ${brokerUrl}`);
  
  client = mqtt.connect(brokerUrl, {
    clientId: `farmtrace-backend-${Math.random().toString(16).substring(2, 10)}`,
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    client.subscribe('farmtrace/+/telemetry', (err) => {
      if (!err) {
        console.log('Subscribed to farmtrace/+/telemetry');
      } else {
        console.error('MQTT Subscription Error:', err);
      }
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`Received telemetry on ${topic}:`, data.sequence);

      // Extract deviceId from topic: farmtrace/{deviceId}/telemetry
      const parts = topic.split('/');
      const deviceId = parts[1];

      // Prepare record
      const record = new SensorRecord({
        deviceId: deviceId,
        containerId: data.containerId || 'UNKNOWN',
        shipmentId: data.shipmentId || 'UNKNOWN',
        sequence: data.sequence || Math.floor(Math.random() * 1000000),
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        temperature: data.temperature,
        humidity: data.humidity,
        mq6: data.mq6,
        battery: data.battery,
        solarVoltage: data.solarVoltage,
        mq3: data.mq3,
        mpu6050: data.mpu6050 ? (typeof data.mpu6050 === 'string' ? JSON.parse(data.mpu6050) : data.mpu6050) : {},
        hash: data.hash || 'MOCK_HASH_' + Date.now(),
        syncStatus: 'synced'
      });

      // We'll use upsert to avoid unique constraint sequence errors on duplicate MQTT messages
      await SensorRecord.updateOne(
        { deviceId: record.deviceId, sequence: record.sequence },
        { $setOnInsert: record },
        { upsert: true }
      );
      
    } catch (err) {
      console.error('Error processing MQTT message:', err);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT Error:', err);
  });
  
  client.on('offline', () => {
    console.log('MQTT Client Offline');
  });
};

const getClient = () => client;

module.exports = { connectMQTT, getClient };
