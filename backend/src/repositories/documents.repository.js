const crypto = require('node:crypto');
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

module.exports = { create, findAllByOwner, findByIdAndOwner, getFilePath };