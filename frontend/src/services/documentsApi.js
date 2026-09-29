const API_PREFIX = '/api';

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_PREFIX}${endpoint}`, options);
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
  }

  if (!response.ok) {
    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    throw new Error(payload?.error || `A solicitação falhou (${response.status}).`);
  }

  return response;
}

function ownerHeaders(ownerId) {
  return { 'X-User-Id': ownerId };
}

export async function getDocuments(ownerId) {
  const response = await request('/documents', { headers: ownerHeaders(ownerId) });
  const payload = await response.json();
  return payload.documents;
}

export async function uploadDocument(file, ownerId) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await request('/upload', {
    method: 'POST',
    headers: ownerHeaders(ownerId),
    body: formData,
  });
  const payload = await response.json();
  return payload.document;
}

export async function downloadDocument(id, ownerId) {
  const response = await request(`/documents/${encodeURIComponent(id)}/download`, {
    headers: ownerHeaders(ownerId),
  });
  return response.blob();
}