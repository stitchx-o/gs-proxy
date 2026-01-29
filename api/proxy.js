import fetch from 'node-fetch';

export default async function handler(req, res) {
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyLPfguVJQxcH34C9WYhWZcdwb8n47wsZDa2dL4JzvIrk3Nbl-T0U1zpo08whE8bTufpw/exec'; // ضع رابط GAS بعد نشره

  try {
    const response = await fetch(GAS_URL, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined, // إزالة host لأن GAS يرفضه أحيانًا
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const data = await response.text(); // نص كامل من GAS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send(data);

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

