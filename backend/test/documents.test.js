const { test } = require('node:test');
const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const app = require('../src/app');

const storageDirectory = path.resolve(__dirname, '../storage');
const maximumFileSize = 10 * 1024 * 1024;

async function withServer(run) {
  const markers = [];
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  function createMarker() {
    const marker = `dms-isolated-test-${crypto.randomUUID()}`;
    markers.push(Buffer.from(marker));
    return marker;
  }

  try {
    await run({ baseUrl, createMarker });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });

    for (const fileName of await fs.readdir(storageDirectory)) {
      const filePath = path.join(storageDirectory, fileName);
      const contents = await fs.readFile(filePath);

      if (markers.some((marker) => contents.includes(marker))) {
        await fs.unlink(filePath);
      }
    }
  }
}

function createForm(fieldName, fileName, contents, mimeType) {
  const form = new FormData();
  form.append(fieldName, new Blob([contents], { type: mimeType }), fileName);
  return form;
}

function postUpload(baseUrl, ownerId, form) {
  return fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: ownerId ? { 'X-User-Id': ownerId } : {},
    body: form,
  });
}

test('health check responde e as rotas exigem identificação do dono', async () => {
  await withServer(async ({ baseUrl, createMarker }) => {
    const healthResponse = await fetch(`${baseUrl}/health`);
    assert.strictEqual(healthResponse.status, 200);
    assert.deepStrictEqual(await healthResponse.json(), { status: 'ok' });

    const listResponse = await fetch(`${baseUrl}/documents`);
    assert.strictEqual(listResponse.status, 400);

    const downloadResponse = await fetch(`${baseUrl}/documents/missing-id/download`);
    assert.strictEqual(downloadResponse.status, 400);

    const marker = createMarker();
    const uploadResponse = await postUpload(
      baseUrl,
      '',
      createForm('file', 'missing-owner.txt', marker, 'text/plain'),
    );
    assert.strictEqual(uploadResponse.status, 400);
    assert.match((await uploadResponse.json()).error, /X-User-Id/);
  });
});

test('upload sem arquivo ou com nome de campo multipart inesperado retorna 400', async () => {
  await withServer(async ({ baseUrl, createMarker }) => {
    const emptyUpload = await postUpload(baseUrl, 'empty-file-user', new FormData());
    assert.strictEqual(emptyUpload.status, 400);
    assert.match((await emptyUpload.json()).error, /campo "file"/);

    const marker = createMarker();
    const unexpectedField = await postUpload(
      baseUrl,
      'unexpected-field-user',
      createForm('attachment', 'document.txt', marker, 'text/plain'),
    );
    assert.strictEqual(unexpectedField.status, 400);
  });
});

test('upload maior que 10 MiB retorna 413', async () => {
  await withServer(async ({ baseUrl, createMarker }) => {
    const marker = createMarker();
    const contents = Buffer.concat([
      Buffer.from(marker),
      Buffer.alloc(maximumFileSize + 1 - Buffer.byteLength(marker), 0x61),
    ]);
    const response = await postUpload(
      baseUrl,
      'large-file-user',
      createForm('file', 'large.txt', contents, 'text/plain'),
    );

    assert.strictEqual(response.status, 413);
    assert.match((await response.json()).error, /10 MiB/);
  });
});

test('upload com extensão e MIME type incompatíveis retorna 415', async () => {
  await withServer(async ({ baseUrl, createMarker }) => {
    const marker = createMarker();
    const response = await postUpload(
      baseUrl,
      'invalid-type-user',
      createForm('file', 'document.txt', marker, 'application/octet-stream'),
    );

    assert.strictEqual(response.status, 415);
    assert.match((await response.json()).error, /Tipo de arquivo não permitido/);
  });
});

test('download de documento inexistente ou sem arquivo local retorna 404', async () => {
  await withServer(async ({ baseUrl, createMarker }) => {
    const ownerId = `missing-file-user-${crypto.randomUUID()}`;
    const missingDocument = await fetch(`${baseUrl}/documents/not-a-document/download`, {
      headers: { 'X-User-Id': ownerId },
    });
    assert.strictEqual(missingDocument.status, 404);

    const marker = createMarker();
    const uploadResponse = await postUpload(
      baseUrl,
      ownerId,
      createForm('file', 'temporary.txt', marker, 'text/plain'),
    );
    assert.strictEqual(uploadResponse.status, 201);
    const { document } = await uploadResponse.json();

    const files = await fs.readdir(storageDirectory);
    let storedFileName;

    for (const fileName of files) {
      const contents = await fs.readFile(path.join(storageDirectory, fileName));
      if (contents.includes(Buffer.from(marker))) {
        storedFileName = fileName;
        break;
      }
    }

    assert.ok(storedFileName, 'o arquivo de teste deve ter sido salvo');
    await fs.unlink(path.join(storageDirectory, storedFileName));

    const missingFile = await fetch(`${baseUrl}/documents/${document.id}/download`, {
      headers: { 'X-User-Id': ownerId },
    });
    assert.strictEqual(missingFile.status, 404);
  });
});