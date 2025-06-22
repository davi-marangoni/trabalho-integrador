# Frontend - Sistema de Gestão de Frota

## Principais Tecnologias

- **React 19** – Biblioteca principal para construção da interface.
- **Vite** – Ferramenta de build.
- **TypeScript** – Para tipagem e maior segurança do codigo.
- **React Bootstrap** – Componentes.
- **React Router DOM** – Gerenciamento de rotas.
- **React Tabulator** – Tabelas dinâmicas e interativas.
- **Recharts** – Gráficos e visualização de dados.
- **FontAwesome** – Ícones.

## Estrutura do Projeto

```
frontend/
  src/
    components/    # Componentes reutilizáveis (Sidebar, Layout, etc)
    contexts/      # Contextos globais (ex: autenticação)
    hooks/         # Hooks customizados
    pages/         # Páginas principais (Dashboard, Login, Veículos)
    services/      # Serviços de API
    styles/        # Arquivos CSS globais e específicos
    types/         # Tipos TypeScript
    App.tsx        # Definição de rotas
    main.tsx       # Ponto de entrada
  public/
  package.json
  tsconfig.json
  vite.config.ts
  .env.example
```

## Instalação e Execução

1. **Pré-requisitos:**  
   - Node.js 24.2.0
   - npm 11.4.2

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configuração do ambiente:**
   - Copie o arquivo `.env.example` para `.env`:
     ```sh
     cp .env.example .env
     ```
   - Ajuste a variável `VITE_API_URL` se necessário (por padrão aponta para `http://localhost:3000/api`).

4. **Rodando o projeto:**
   ```sh
   npm run dev
   # ou
   npm run start
   ```
   O frontend ficará disponível em [http://localhost:3001](http://localhost:3001).

## Padrão de Código

- O projeto usa um arquivo `.editorconfig` para padronizar indentação e finais de linha.
- Recomenda-se instalar a extensão [EditorConfig](https://editorconfig.org/#download) na sua IDE para garantir o padrão de código.

---