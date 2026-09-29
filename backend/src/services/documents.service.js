const documentsRepository = require('../repositories/documents.repository');

function toPublicDocument(document) {
  const { storedName, ...publicDocument } = document;
  return publicDocument;
}

function createDocument(file, ownerId) {
  const document = documentsRepository.create({
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: ownerId,
    mimeType: file.mimetype,
    storedName: file.filename,
  });

  return toPublicDocument(document);
}

function listDocuments(ownerId) {
  return documentsRepository.findAllByOwner(ownerId).map(toPublicDocument);
}

function getDownloadDocument(id, ownerId) {
  const download = documentsRepository.findDownloadByIdAndOwner(id, ownerId);
  if (!download) {
    return null;
  }

  return {
    document: toPublicDocument(download.document),
    filePath: download.filePath,
  };
}

module.exports = { createDocument, listDocuments, getDownloadDocument };