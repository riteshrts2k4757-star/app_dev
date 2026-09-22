const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Auth register route' });
});

router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Auth login route', token: 'mock-jwt-token' });
});

router.get('/me', (req, res) => {
  res.json({ success: true, message: 'Auth me route', data: { user: 'mock' } });
});

module.exports = router;
