const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

// Permitir apenas o domínio do frontend
app.use(cors({ origin: 'http://82.25.74.109:5173' }));

const UPLOADS_DIR = '/var/www/sigdmus-uploads';
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Endpoint de upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Servir arquivos publicamente
app.use('/uploads', express.static(UPLOADS_DIR));

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`)); 