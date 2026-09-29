import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { getDocuments, uploadDocument } from './services/documentsApi.js';
import './App.css';

export default function App() {
  const [ownerId, setOwnerId] = useState(() => window.localStorage.getItem('dms.ownerId') || 'demo-user');
  const [ownerDraft, setOwnerDraft] = useState(ownerId);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isActive = true;
    setDocuments([]);
    setError('');
    setNotice('');
    setIsLoading(true);

    getDocuments(ownerId)
      .then((loadedDocuments) => {
        if (isActive) {
          setDocuments(loadedDocuments);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [ownerId]);

  function handleOwnerSubmit(event) {
    event.preventDefault();
    const nextOwnerId = ownerDraft.trim();

    if (!nextOwnerId) {
      setError('Informe uma identificação para acessar os documentos.');
      return;
    }

    window.localStorage.setItem('dms.ownerId', nextOwnerId);
    setOwnerId(nextOwnerId);
  }

  async function handleUpload(file) {
    setIsUploading(true);
    setError('');
    setNotice('');

    try {
      const uploadedDocument = await uploadDocument(file, ownerId);
      setDocuments((currentDocuments) => [
        uploadedDocument,
        ...currentDocuments.filter((document) => document.id !== uploadedDocument.id),
      ]);
      setNotice(`${uploadedDocument.originalName} foi enviado.`);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  function handleDownloadError(requestError) {
    setError(requestError.message);
    setNotice('');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="DMS, início">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span className="brand-name">DMS<span>ARQUIVOS</span></span>
        </a>

        <form className="owner-form" onSubmit={handleOwnerSubmit}>
          <label htmlFor="owner-id">Identificação</label>
          <input
            id="owner-id"
            name="ownerId"
            autoComplete="off"
            value={ownerDraft}
            onChange={(event) => setOwnerDraft(event.target.value)}
          />
          <button type="submit" className="owner-submit">Aplicar</button>
        </form>
      </header>

      <main id="inicio" className="main-layout">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">ESPAÇO DE TRABALHO <span> / </span> DOCUMENTOS</p>
            <h1 id="page-title">Acervo</h1>
            <p className="page-subtitle">Arquivos de <strong>{ownerId}</strong></p>
          </div>
          <div className="document-count" aria-live="polite">
            <span>{isLoading ? '—' : documents.length.toString().padStart(2, '0')}</span>
            <small>DOCUMENTOS</small>
          </div>
        </section>

        {error && <p className="feedback feedback-error" role="alert">{error}</p>}
        {notice && <p className="feedback feedback-success" role="status">{notice}</p>}

        <div className="content-grid">
          <UploadComponent onUpload={handleUpload} isUploading={isUploading} />

          <section className="documents-section" aria-labelledby="documents-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">BIBLIOTECA</p>
                <h2 id="documents-heading">Seus documentos</h2>
              </div>
              <span className="section-count">{documents.length} itens</span>
            </div>
            <DocumentList
              documents={documents}
              isLoading={isLoading}
              ownerId={ownerId}
              onDownloadError={handleDownloadError}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <span>ARMAZENAMENTO LOCAL</span>
        <span>DOCUMENT MANAGEMENT SYSTEM</span>
      </footer>
    </div>
  );
}
