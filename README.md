# Casa da Familia

## Como subir na Vercel

### 1. Banco de dados (Neon - gratuito)
1. Acesse https://neon.tech e crie uma conta gratuita
2. Crie um novo projeto
3. Copie a "Connection string" (comeca com `postgres://...`)

### 2. Deploy na Vercel
1. Suba o projeto no GitHub
2. Acesse https://vercel.com e importe o repositorio
3. Em "Environment Variables", adicione:
   - Nome: `DATABASE_URL`
   - Valor: a connection string do Neon
4. Clique em Deploy

O banco de dados sera criado automaticamente na primeira requisicao.

## Rodar local
Crie um arquivo `.env.local` com:
DATABASE_URL=sua_connection_string_aqui

Depois:
npm install
npm run dev
