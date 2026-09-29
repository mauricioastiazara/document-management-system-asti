import { useRef, useState } from 'react';

export default function UploadComponent({ onUpload, isUploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile || isUploading) {
      return;
    }

    const wasUploaded = await onUpload(selectedFile);
    if (wasUploaded) {
      setSelectedFile(null);
      fileInput.current.value = '';
    }
  }

  return (
    <section className="upload-panel" aria-labelledby="upload-heading">
      <div className="upload-heading">
        <span className="step-index">01</span>
        <div>
          <p className="eyebrow">ADICIONAR</p>
          <h2 id="upload-heading">Novo arquivo</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="file-picker" htmlFor="document-file">
          <span className="upload-symbol" aria-hidden="true">+</span>
          <span className="picker-copy">
            <strong>{selectedFile ? selectedFile.name : 'Escolher arquivo'}</strong>
            <small>{selectedFile ? 'Pronto para enviar' : 'PDF, DOCX, XLSX, PPTX ou TXT'}</small>
          </span>
          <input
            ref={fileInput}
            id="document-file"
            name="file"
            type="file"
            accept=".pdf,.docx,.xlsx,.pptx,.txt"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          />
        </label>

        <button className="primary-button upload-button" type="submit" disabled={!selectedFile || isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar arquivo'}
        </button>
        <p className="upload-limit">Limite de 10 MiB por arquivo</p>
      </form>
    </section>
  );
}