const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const documents = new Map();
const storageDirectory = path.resolve(__dirname, '../../storage');

function create(documentData) {
  const document = { id: crypto.randomUUID(), ...documentData };
  documents.set(document.id, document);
  return document;
}

function findAllByOwner(ownerId) {
  return [...documents.values()].filter((document) => document.owner === ownerId);
}

function findByIdAndOwner(id, ownerId) {
  const document = documents.get(id);
  return document?.owner === ownerId ? document : null;
}

function getFilePath(document) {
  return path.join(storageDirectory, document.storedName);
}

function findDownloadByIdAndOwner(id, ownerId) {
  const document = findByIdAndOwner(id, ownerId);

  if (!document) {
    return null;
  }

  const filePath = getFilePath(document);
  return fs.existsSync(filePath) ? { document, filePath } : null;
}

module.exports = {
  create,
  findAllByOwner,
  findDownloadByIdAndOwner,
};