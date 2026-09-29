const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');

const router = express.Router();
const storageDirectory = path.resolve(__dirname, '../../storage');
const maximumFileSize = 10 * 1024 * 1024;
const allowedTypes = new Map([
  ['.pdf', 'application/pdf'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['.txt', 'text/plain'],
]);

fs.mkdirSync(storageDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, storageDirectory),
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: maximumFileSize, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.get(extension) !== file.mimetype) {
      const error = new Error('Tipo de arquivo não permitido.');
      error.status = 415;
      return callback(error);
    }

    return callback(null, true);
  },
});

function handleUpload(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'O arquivo excede o limite de 10 MiB.'
        : 'Não foi possível processar o upload.';
      return res.status(status).json({ error: message });
    }

    const status = error.status || 500;
    const message = status < 500 ? error.message : 'Erro interno do servidor.';
    return res.status(status).json({ error: message });
  });
}

router.post('/upload', documentsController.requireOwner, handleUpload, documentsController.upload);
router.get('/documents', documentsController.requireOwner, documentsController.list);
router.get('/documents/:id/download', documentsController.requireOwner, documentsController.download);

module.exports = router;