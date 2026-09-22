const express = require('express');
const router = express.Router();
const DeviceCommand = require('../models/DeviceCommand');

// POST /api/commands - Dashboard queues a command for a device
router.post('/', async (req, res) => {
  try {
    const { deviceId, command, parameters } = req.body;
    const cmd = await DeviceCommand.create({
      commandId: Date.now().toString(),
      deviceId,
      command,
      parameters
    });
    res.json({ success: true, data: cmd });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/commands/pending - Phone polls this to get commands to send to NodeMCU
router.get('/pending/:deviceId', async (req, res) => {
  try {
    const commands = await DeviceCommand.find({ 
      deviceId: req.params.deviceId, 
      status: 'pending' 
    }).sort({ createdAt: 1 });
    
    // Mark them as sent
    for (let c of commands) {
      c.status = 'sent';
      c.sentAt = new Date();
      await c.save();
    }
    
    res.json({ success: true, data: commands });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/commands/:commandId/ack - Phone pushes response back
router.post('/:commandId/ack', async (req, res) => {
  try {
    const { response, status } = req.body;
    const cmd = await DeviceCommand.findOne({ commandId: req.params.commandId });
    if (!cmd) return res.status(404).json({ success: false });

    cmd.status = status || 'acknowledged';
    cmd.response = response;
    cmd.acknowledgedAt = new Date();
    await cmd.save();

    res.json({ success: true, data: cmd });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/commands/:commandId - Dashboard checks status
router.get('/:commandId', async (req, res) => {
  try {
    const cmd = await DeviceCommand.findOne({ commandId: req.params.commandId });
    res.json({ success: true, data: cmd });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
