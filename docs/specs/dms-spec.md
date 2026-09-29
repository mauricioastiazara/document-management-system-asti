## Plan: Especificação DMS

Produzir somente `docs/specs/dms-spec.md`, usando `docs/specs/spec-template.md` como estrutura e alinhando requisitos, dados e APIs às instruções e ao seed existente. A seção de execução descreverá etapas futuras do produto, sem implementar ou alterar arquivos de backend/frontend nesta tarefa.

**Steps**
1. Criar `docs/specs/dms-spec.md` como expansão do template: objetivo, escopo e requisitos funcionais/não funcionais para upload, listagem por dono e download.
2. Especificar o modelo de dados em memória, distinguindo metadados expostos do identificador/nome interno do arquivo local; definir tamanhos, datas, dono e MIME type, e documentar volatilidade dos metadados após reinício.
3. Fechar contratos para `POST /upload`, `GET /documents` e `GET /documents/:id/download`: `multipart/form-data` com campo `file`, JSON de sucesso/erro, status HTTP, headers, isolamento por `X-User-Id`, nome seguro para download e efeitos de arquivo ausente.
4. Registrar decisões de Clean Architecture simples (`routes -> controllers -> services -> repositories`), Multer com `diskStorage` em `backend/storage`, proxy `/api` no frontend, limites iniciais propostos de 10 MiB e allowlist de PDF, DOCX, XLSX, PPTX e TXT, identificando esses limites como proposta ajustável. Explicitar que `X-User-Id` é provisório e não substitui autenticação.
5. Incluir no documento um plano futuro em etapas: persistência local/metadata em memória e upload; listagem/download e isolamento; integração frontend; testes automatizados e validação ponta a ponta. O plano descreve entregas e critérios, sem prescrever edições concretas de arquivos nesta tarefa.
6. Revisar o documento contra todas as seções do template, restrições do repositório e comportamento atual (somente `/health` implementado); confirmar que nenhum outro arquivo foi incluído no escopo.

**Relevant files**
- `docs/specs/spec-template.md` — esqueleto a completar e preservar.
- `docs/specs/dms-spec.md` — único artefato a criar nesta tarefa.
- `.github/copilot-instructions.md` — restrições arquiteturais, armazenamento e convenções.
- `backend/src/app.js`, `backend/test/app.test.js`, `frontend/vite.config.js` — contexto do seed: health check, teste smoke e proxy `/api`.

**Verification**
1. Conferir cobertura explícita de RFs, RNFs, dados, três contratos, decisões arquiteturais, riscos/assunções e etapas/aceitação.
2. Conferir coerência: metadados em memória; conteúdo de arquivo apenas em filesystem local via Multer diskStorage; nenhuma persistência ou serviço externo; rotas e fluxo de camadas consistentes com instruções.
3. Validar que o escopo desta tarefa altera somente `docs/specs/dms-spec.md`; não executar testes de aplicação, pois não haverá alterações executáveis.

**Decisions**
- Plano futuro do produto faz parte da especificação; implementação do backend/frontend fica fora da tarefa atual.
- Usar `X-User-Id` como identidade provisória, restringindo listagem/download pelo dono, com limitação de segurança documentada.
- Propor limite de 10 MiB por arquivo e tipos PDF/DOCX/XLSX/PPTX/TXT, marcados como valores iniciais sujeitos a aprovação posterior.
- Não adicionar autenticação real, versionamento, exclusão, busca/paginação, storage externo ou alterações de código nesta entrega.