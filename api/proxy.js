import express from 'express';
import fetch from 'node-fetch';
import multer from 'multer';
import cors from 'cors';
import FormData from 'form-data';

const app = express();
const upload = multer();

app.use(cors());

app.post('/api/proxy', upload.any(), async (req, res) => {
  const form = new FormData();
  for (const key in req.body) {
    form.append(key, req.body[key]);
  }
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      form.append(file.fieldname, file.buffer, file.originalname);
    });
  }

  const url = 'https://script.google.com/macros/s/AKfycbwTb3XYdI8saKRdbXmGDImXhXzcoBbs1Do3PieTo4we8smYoPVQ2CkLpsEfnLMSdFO2QA/exec';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    const data = await response.text();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


export default app;
