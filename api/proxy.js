// Simple proxy that forwards JSON POST requests to a Google Apps Script endpoint
// Usage: set GAS_URL env var to your Apps Script web app URL (exec)

const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
// Default to your GAS exec URL you provided; can be overridden with GAS_URL env var
const GAS_URL = process.env.GAS_URL || 'https://script.google.com/macros/s/AKfycbw4SGmUbDmzpgAu6rWN1ZzSWade5ECqRItvfprsJmtqwVYNa-djwknCZ-wsyzI1EoqIsg/exec';

// Accept large JSON bodies (base64 image data)
app.use(bodyParser.json({ limit: '50mb' }));

// Enable simple CORS so browser can talk to this proxy
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.post('/api/proxy', async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.text();
    // try parse JSON
    try { return res.status(200).send(JSON.parse(data)); } catch (e) { return res.status(200).send(data); }
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ status: 'fail', error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy listening on ${PORT}, forwarding to ${GAS_URL}`));
