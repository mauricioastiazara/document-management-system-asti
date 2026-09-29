import DownloadButton from './DownloadButton.jsx';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Data indisponível' : dateFormatter.format(date);
}

export default function DocumentList({ documents, isLoading, ownerId, onDownloadError }) {
  if (isLoading) {
    return <p className="list-message" role="status">Carregando documentos...</p>;
  }

  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">—</span>
        <p>Nenhum documento neste acervo.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="document-table">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Data de envio</th>
            <th scope="col">Tamanho</th>
            <th scope="col"><span className="visually-hidden">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => {
            const extension = document.originalName.split('.').pop().toUpperCase();
            return (
              <tr key={document.id}>
                <td data-label="Nome">
                  <div className="document-name">
                    <span className="file-type" aria-label={`Arquivo ${extension}`}>{extension}</span>
                    <span className="file-name-text" title={document.originalName}>{document.originalName}</span>
                  </div>
                </td>
                <td data-label="Data de envio" className="metadata-cell">{formatDate(document.uploadedAt)}</td>
                <td data-label="Tamanho" className="metadata-cell">{formatFileSize(document.size)}</td>
                <td className="action-cell">
                  <DownloadButton
                    document={document}
                    ownerId={ownerId}
                    onError={onDownloadError}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}