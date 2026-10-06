# Ficha de Controle do Açúcar

PWA instalável para preenchimento da ficha de acompanhamento de controle glicêmico.

## Estrutura
- `docs/`: PWA (HTML, CSS, JS) — publicado via GitHub Pages
- `backend/`: API Node.js + Neon (PostgreSQL)

## Como usar

### Backend
1. Acesse [Neon](https://neon.tech), crie um projeto e copie a connection string.
2. Cole a string no arquivo `backend/.env`.
3. No terminal:
   cd backend
   npm install
   npm start

### Frontend
1. Abra o arquivo `docs/index.html` no navegador ou use um servidor local:
   cd docs
   npx serve -l 5000

## GitHub Pages
Configurado em Settings > Pages:
- Branch: `main`
- Folder: `/docs`
