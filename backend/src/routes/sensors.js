const express = require('express');
const router = express.Router();
const SensorRecord = require('../models/SensorRecord');

router.post('/data', async (req, res) => {
  res.json({ success: true, message: 'Sensor data received' });
});

router.post('/batch', async (req, res) => {
  try {
    const { deviceId, records } = req.body;
    if (!deviceId || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, error: { message: 'Invalid payload' } });
    }

    let accepted = 0;
    let rejected = 0;
    let failedSequences = [];

    for (const record of records) {
      try {
        // Upsert to handle idempotency using unique constraint (deviceId + sequence)
        const existing = await SensorRecord.findOne({ deviceId, sequence: record.sequence });
        if (!existing) {
          await SensorRecord.create({
            deviceId,
            containerId: record.containerId,
            shipmentId: record.shipmentId,
            sequence: record.sequence,
            timestamp: record.timestamp,
            temperature: record.temperature,
            humidity: record.humidity,
            ethylene: record.ethylene,
            battery: record.battery,
            syncStatus: 'synced'
          });
          accepted++;
        } else {
          // Already exists
          accepted++;
        }
      } catch (err) {
        console.error(err);
        rejected++;
        failedSequences.push(record.sequence);
      }
    }

    res.json({
      success: true,
      accepted,
      rejected,
      failedSequences
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/:deviceId', async (req, res) => {
  try {
    const records = await SensorRecord.find({ deviceId: req.params.deviceId }).sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
