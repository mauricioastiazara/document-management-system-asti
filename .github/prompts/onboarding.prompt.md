---
description: "Apresenta a arquitetura, os fluxos e a configuração do DMS para uma pessoa nova no projeto."
name: apresentar-projeto
argument-hint: "perfil ou experiência do novo desenvolvedor (opcional)"
agent: agent
---

# Apresentar o projeto a um novo desenvolvedor

Prepare uma apresentação de onboarding do Document Management System para uma pessoa que está começando a contribuir no projeto.

Antes de escrever, inspecione o código e a documentação atuais, incluindo:
- `.github/copilot-instructions.md`
- `README.md` e `docs/specs/`
- `backend/src/`, `backend/test/` e `backend/package.json`
- `frontend/src/`, `frontend/vite.config.js` e `frontend/package.json`

Baseie a apresentação no estado atual do repositório. Diferencie claramente o que está implementado do que está apenas previsto ou documentado. Se o README, a especificação e o código divergirem, aponte a divergência sem presumir qual deles está correto. Não invente funcionalidades, scripts, variáveis ou decisões.

Apresente o conteúdo em português, de forma direta e adequada a uma conversa de aproximadamente cinco minutos. Use esta estrutura:

1. **Visão geral:** o problema que o DMS resolve e suas funcionalidades principais.
2. **Tecnologias e estrutura:** papel do backend Express e do frontend React/Vite; localização das camadas e componentes.
3. **Fluxo principal:** descreva upload, armazenamento, listagem e download, indicando como frontend e backend se comunicam.
4. **API:** resuma os endpoints existentes, seus dados de entrada e saída, e os headers relevantes, conforme o código atual.
5. **Como executar e testar:** informe pré-requisitos e comandos reais para iniciar backend e frontend, executar testes e gerar build.
6. **Limitações e cuidados:** explique o que é volátil, como os arquivos são armazenados, e limitações de autenticação ou segurança observáveis no código.
7. **Primeiros arquivos para explorar:** sugira uma ordem de leitura com caminhos do repositório.
8. **Próximos passos:** encerre com algumas perguntas úteis para a pessoa confirmar que entendeu o sistema.

Inclua referências a arquivos e símbolos do workspace para fundamentar as explicações. Mantenha o foco em orientação técnica; não transforme a apresentação em material promocional.

Não altere nem crie arquivos do projeto durante a apresentação.```---
description: "Apresenta a arquitetura, os fluxos e a configuração do DMS para uma pessoa nova no projeto."
name: apresentar-projeto
argument-hint: "perfil ou experiência do novo desenvolvedor (opcional)"
agent: agent
---

# Apresentar o projeto a um novo desenvolvedor

Prepare uma apresentação de onboarding do Document Management System para uma pessoa que está começando a contribuir no projeto.

Antes de escrever, inspecione o código e a documentação atuais, incluindo:
- `.github/copilot-instructions.md`
- `README.md` e `docs/specs/`
- `backend/src/`, `backend/test/` e `backend/package.json`
- `frontend/src/`, `frontend/vite.config.js` e `frontend/package.json`

Baseie a apresentação no estado atual do repositório. Diferencie claramente o que está implementado do que está apenas previsto ou documentado. Se o README, a especificação e o código divergirem, aponte a divergência sem presumir qual deles está correto. Não invente funcionalidades, scripts, variáveis ou decisões.

Apresente o conteúdo em português, de forma direta e adequada a uma conversa de aproximadamente cinco minutos. Use esta estrutura:

1. **Visão geral:** o problema que o DMS resolve e suas funcionalidades principais.
2. **Tecnologias e estrutura:** papel do backend Express e do frontend React/Vite; localização das camadas e componentes.
3. **Fluxo principal:** descreva upload, armazenamento, listagem e download, indicando como frontend e backend se comunicam.
4. **API:** resuma os endpoints existentes, seus dados de entrada e saída, e os headers relevantes, conforme o código atual.
5. **Como executar e testar:** informe pré-requisitos e comandos reais para iniciar backend e frontend, executar testes e gerar build.
6. **Limitações e cuidados:** explique o que é volátil, como os arquivos são armazenados, e limitações de autenticação ou segurança observáveis no código.
7. **Primeiros arquivos para explorar:** sugira uma ordem de leitura com caminhos do repositório.
8. **Próximos passos:** encerre com algumas perguntas úteis para a pessoa confirmar que entendeu o sistema.

Inclua referências a arquivos e símbolos do workspace para fundamentar as explicações. Mantenha o foco em orientação técnica; não transforme a apresentação em material promocional.

Não altere nem crie arquivos do projeto durante a apresentação.```