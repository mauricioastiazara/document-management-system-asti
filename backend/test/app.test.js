const { test } = require('node:test');
const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const app = require('../src/app');
const storageDirectory = path.resolve(__dirname, '../storage');

// Teste de fumaça do seed: garante que o app Express foi exportado.
// Novos testes serão adicionados durante os Steps 2, 6 e 7 com auxílio do Copilot.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('faz upload, lista e baixa documentos somente para o dono', async () => {
  const initialFiles = new Set(await fs.readdir(storageDirectory));
  const marker = `dms-test-${crypto.randomUUID()}`;
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const form = new FormData();
    form.append('file', new Blob([marker], { type: 'application/pdf' }), 'report.pdf');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'X-User-Id': 'alice' },
      body: form,
    });
    assert.strictEqual(uploadResponse.status, 201);
    const { document } = await uploadResponse.json();
    assert.strictEqual(document.originalName, 'report.pdf');
    assert.strictEqual(document.owner, 'alice');
    assert.strictEqual(document.size, Buffer.byteLength(marker));

    const listResponse = await fetch(`${baseUrl}/documents`, {
      headers: { 'X-User-Id': 'alice' },
    });
    assert.deepStrictEqual(await listResponse.json(), { documents: [document] });

    const otherUserList = await fetch(`${baseUrl}/documents`, {
      headers: { 'X-User-Id': 'bob' },
    });
    assert.deepStrictEqual(await otherUserList.json(), { documents: [] });

    const downloadResponse = await fetch(`${baseUrl}/documents/${document.id}/download`, {
      headers: { 'X-User-Id': 'alice' },
    });
    assert.strictEqual(downloadResponse.status, 200);
    assert.strictEqual(await downloadResponse.text(), marker);
    assert.match(downloadResponse.headers.get('content-disposition'), /filename="report\.pdf"/);

    const otherUserDownload = await fetch(`${baseUrl}/documents/${document.id}/download`, {
      headers: { 'X-User-Id': 'bob' },
    });
    assert.strictEqual(otherUserDownload.status, 404);

    const missingOwner = await fetch(`${baseUrl}/documents`);
    assert.strictEqual(missingOwner.status, 400);

    const unsupportedForm = new FormData();
    unsupportedForm.append('file', new Blob([marker], { type: 'application/octet-stream' }), 'script.exe');
    const unsupportedUpload = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'X-User-Id': 'alice' },
      body: unsupportedForm,
    });
    assert.strictEqual(unsupportedUpload.status, 415);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    const currentFiles = await fs.readdir(storageDirectory);

    for (const fileName of currentFiles) {
      if (initialFiles.has(fileName)) {
        continue;
      }

      const filePath = path.join(storageDirectory, fileName);
      if ((await fs.readFile(filePath, 'utf8')).includes(marker)) {
        await fs.unlink(filePath);
      }
    }
  }
});
