import mqtt from 'mqtt';

const MQTT_BROKER = 'ws://broker.emqx.io:8083/mqtt';
let client = null;
const listeners = new Set();

export const connectMQTT = () => {
  if (client) return;

  console.log('Connecting to Web MQTT...');
  client = mqtt.connect(MQTT_BROKER, {
    clientId: `farmtrace-web-${Math.random().toString(16).substring(2, 10)}`,
  });

  client.on('connect', () => {
    console.log('Web MQTT Connected');
    client.subscribe('farmtrace/+/telemetry');
  });

  client.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      listeners.forEach(listener => listener(data));
    } catch (e) {
      console.error('MQTT parsing error', e);
    }
  });

  client.on('error', (err) => {
    console.error('Web MQTT Error', err);
  });
};

export const subscribeToTelemetry = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const publishCommand = (deviceId, command) => {
  if (client && client.connected) {
    client.publish(`farmtrace/${deviceId}/commands`, JSON.stringify(command));
    return true;
  }
  return false;
};
