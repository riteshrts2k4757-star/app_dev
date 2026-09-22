const express = require('express');
const router = express.Router();
const DriverLog = require('../models/DriverLog');

router.get('/:driverId', async (req, res) => {
  try {
    const logs = await DriverLog.find({ driverId: req.params.driverId }).sort({ startTime: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.post('/', async (req, res) => {
  try {
    const log = await DriverLog.create(req.body);
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
