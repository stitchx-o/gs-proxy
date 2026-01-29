import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// رابط Google Apps Script الخاص بك
const GAS_URL = 'https://script.google.com/macros/s/YOUR_GAS_DEPLOYMENT_ID/usercodeapp';

// endpoint الـ proxy
app.post('/api/proxy', async (req, res) => {
    try {
        const { product, name, phone, images } = req.body;

        if (!product || !name || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // إرسال البيانات والصور إلى Google Apps Script
        const payload = {
            product,
            name,
            phone,
            images: images || {}
        };

        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        res.json({ success: true, gasResponse: result });
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
});

// health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
