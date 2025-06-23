# Backend - Sistema de Gestão de Frota

## Principais Tecnologias

- **Node.js** – Ambiente de execução JavaScript.
- **Express** – Framework para criação de APIs REST.
- **TypeScript** – Tipagem estática para maior segurança e organização do código.
- **pg-promise** – Integração com banco de dados PostgreSQL.
- **dotenv** – Gerenciamento de variáveis de ambiente.

## Estrutura do Projeto

```
backend/
  src/
    controller/   # Controllers das rotas (lógica de entrada)
    db/           # Configuração e conexão com o banco de dados
    interface/    # Tipos e interfaces TypeScript
    middleware/   # Middlewares globais e de autenticação
    routes/       # Definição das rotas da API
    service/      # Lógica de negócio e acesso a dados
    index.ts      # Ponto de entrada da aplicação
  doc/            # Documentação e coleções de testes de API
    integradorBruno.json   # Coleção para o Bruno API Client
    integradorPostman.json # Coleção para o Postman
  .editorconfig   # Padronização de código
  .env.example    # Exemplo de variáveis de ambiente
  package.json    # Dependências e scripts
  tsconfig.json   # Configuração do TypeScript
```

## Instalação e Execução

1. **Pré-requisitos:**  
   - Node.js 24.2.0  
   - npm 11.4.2  
   - PostgreSQL

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configuração do ambiente:**
   - Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário:
     ```sh
     cp .env.example .env
     ```

4. **Execução em modo desenvolvimento:**
   ```sh
   npm run dev
   ```

5. **Build para produção:**
   ```sh
   npm run build
   npm start
   ```

## Testes de API

As coleções de testes de API estão disponíveis na pasta `doc/`:
- `integradorBruno.json` (Bruno API Client)
- `integradorPostman.json` (Postman)

Recomendamos o uso do [Bruno API Client](https://www.usebruno.com/) por ser open source, rápido e leve, mas a coleção também pode ser importada no Postman.

## Padrão de Código

- O projeto usa um arquivo `.editorconfig` para padronizar indentação e finais de linha.
- Recomenda-se instalar a extensão [EditorConfig](https://editorconfig.org/#download) na sua IDE para garantir o padrão de código.

## Observações
- Mantenha o padrão de código definido no `.editorconfig`.
- Estruture novas funcionalidades seguindo a organização das pastas.
- Consulte a documentação e coleções na pasta `doc/` para facilitar o desenvolvimento e testes.
