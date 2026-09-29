const documentsService = require('../services/documents.service');

function requireOwner(req, res, next) {
  const ownerId = req.get('X-User-Id')?.trim();

  if (!ownerId) {
    return res.status(400).json({ error: 'O cabeçalho X-User-Id é obrigatório.' });
  }

  req.ownerId = ownerId;
  return next();
}

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Envie um arquivo no campo "file".' });
  }

  const document = documentsService.createDocument(req.file, req.ownerId);
  return res.status(201).json({ document });
}

function list(req, res) {
  const documents = documentsService.listDocuments(req.ownerId);
  return res.status(200).json({ documents });
}

function download(req, res, next) {
  const result = documentsService.getDownloadDocument(req.params.id, req.ownerId);

  if (!result) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(result.filePath, result.document.originalName, (error) => {
    if (error && !res.headersSent) {
      next(error);
    }
  });
}

module.exports = { requireOwner, upload, list, download };