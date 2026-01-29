export default async function handler(req, res) {
  // إعداد هيدرز CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // دعم preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // مثال: إعادة توجيه الطلب إلى Google Apps Script
    const fetch = (await import('node-fetch')).default;
    const FormData = (await import('form-data')).default;

    // تحويل الـ body إلى FormData جديد (إذا كان فيه ملفات)
    const form = new FormData();
    if (req.body && typeof req.body === 'object') {
      Object.entries(req.body).forEach(([key, value]) => {
        form.append(key, value);
      });
    }

    // إذا كنت تستخدم multer أو أي مكتبة رفع ملفات، أضف الملفات هنا
    // مثال: form.append('design', req.file.buffer, req.file.originalname);

    const response = await fetch('https://script.google.com/macros/s/AKfycbwTb3XYdI8saKRdbXmGDImXhXzcoBbs1Do3PieTo4we8smYoPVQ2CkLpsEfnLMSdFO2QA/exec', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.text();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
