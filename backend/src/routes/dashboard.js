const express = require('express');
const router = express.Router();

router.get('/summary', (req, res) => {
  res.json({ success: true, data: { activeShipments: 1, completed: 1, alerts: 2 } });
});

module.exports = router;
