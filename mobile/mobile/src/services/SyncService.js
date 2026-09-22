import { getPendingRecords, markRecordsAsSynced, saveSensorRecordLocal } from './DatabaseService';
import { uploadBatchSensors, fetchNodeMcuData, fetchPendingCommands, sendNodeMcuCommand, ackCommand } from './api';
import Paho from 'paho-mqtt';
import { DeviceEventEmitter } from 'react-native';

const MQTT_BROKER = 'broker.emqx.io';
const MQTT_PORT = 8083; // WebSocket port
let mqttClient = null;

let state = {
  nodemcuWifi: false,
  nodemcuApi: false,
  internet: false,
  mqtt: false,
  backend: false,
};

const updateState = (key, value) => {
  if (state[key] !== value) {
    state[key] = value;
    DeviceEventEmitter.emit('SystemStateChange', state);
  }
};

const setupMQTT = () => {
  const clientId = `farmtrace-driver-${Math.random().toString(16).substring(2, 10)}`;
  mqttClient = new Paho.Client(MQTT_BROKER, MQTT_PORT, "/mqtt", clientId);

  mqttClient.onConnectionLost = (responseObject) => {
    updateState('mqtt', false);
    if (responseObject.errorCode !== 0) {
      console.log("MQTT Connection Lost:", responseObject.errorMessage);
      setTimeout(setupMQTT, 5000); // Reconnect
    }
  };

  mqttClient.connect({
    onSuccess: () => {
      console.log("MQTT Connected");
      updateState('mqtt', true);
      updateState('internet', true);
    },
    onFailure: (err) => {
      console.log("MQTT Connection Failed", err);
      updateState('mqtt', false);
      setTimeout(setupMQTT, 5000); // Reconnect
    },
    useSSL: true
  });
};

export const startSyncManager = () => {
  console.log("Sync Manager started (Phase 3 Hardware Integration)");
  setupMQTT();
  
  // High-frequency Local NodeMCU Poll (Every 2 seconds)
  setInterval(async () => {
    try {
      const data = await fetchNodeMcuData();
      updateState('nodemcuWifi', true);
      updateState('nodemcuApi', true);
      
      if (data) {
        DeviceEventEmitter.emit('RawNodeMcuData', data);
      }

      if (data && data.container) {
        const record = {
          deviceId: 'CONTAINER-001',
          sequence: data.container.sequence,
          temperature: data.container.temperature,
          humidity: data.container.humidity,
          mq6: data.container.mq6,
          battery: data.container.battery,
          solarVoltage: data.container.solar,
          mq3: data.driver.mq3,
          mpu6050: JSON.stringify(data.driver.motion),
          hash: 'SIMULATED_HASH_' + Date.now(),
          timestamp: new Date().toISOString()
        };
        
        // Save locally
        await saveSensorRecordLocal(record);
        
        // Emit to UI
        DeviceEventEmitter.emit('NewSensorData', record);

        // Publish to MQTT if connected
        if (state.mqtt && mqttClient) {
          const message = new Paho.Message(JSON.stringify(record));
          message.destinationName = `farmtrace/CONTAINER-001/telemetry`;
          mqttClient.send(message);
        }
      }
    } catch (e) {
      updateState('nodemcuApi', false);
      // Wait, if it fails, maybe we aren't on the wifi
      // updateState('nodemcuWifi', false); // Optional depending on native netinfo
    }
  }, 2000);

  // Internet Sync & Command Queue Loop (Every 5 seconds)
  setInterval(async () => {
    try {
      // 1. Sync Data UP to Backend (Queue flushing)
      const pending = await getPendingRecords();
      if (pending.length > 0) {
        if (state.mqtt && mqttClient) {
          // Alternatively, send via HTTP to backend
          const response = await uploadBatchSensors('CONTAINER-001', pending);
          if (response.success && response.accepted > 0) {
            updateState('backend', true);
            const syncedSequences = pending
              .filter(r => !response.failedSequences?.includes(r.sequence))
              .map(r => r.sequence);
            await markRecordsAsSynced(syncedSequences);
          }
        }
      }

      // 2. Fetch Commands DOWN from Backend
      const commandRes = await fetchPendingCommands('CONTAINER-001');
      if (commandRes.success && commandRes.data && commandRes.data.length > 0) {
        for (let cmd of commandRes.data) {
          try {
            const nrfRes = await sendNodeMcuCommand(cmd.command);
            await ackCommand(cmd.commandId, nrfRes);
          } catch (e) { }
        }
      }

    } catch (error) {
      updateState('backend', false);
      updateState('internet', false);
    }
  }, 5000);
};

export const getState = () => state;
