# Grimório Aromático — Minerva Moore

Site em Node.js + Express com temática de grimório antigo para registrar receitas aromáticas.

## Funcionalidades

- Capa com estilo verde/dourado e animação de abertura.
- Senha de acesso (`excelsior` por padrão).
- Índice dinâmico com as receitas cadastradas.
- Página de leitura de receita em “folha” amarelada.
- Formulário para registrar novas receitas com campos essenciais e anotações.
- Persistência local no navegador (`localStorage`).
- 4 receitas demonstrativas pré-carregadas (as que você enviou).
- Área para logotipo Minerva Moore em `public/assets/logo-minerva.png`.

## Rodando localmente

```bash
npm install
npm start
```

Abra: `http://localhost:3000`

## Senha

A senha padrão é `excelsior`.

Para trocar em produção:

```bash
GRIMORIO_PASSWORD="nova_senha" npm start
```

## Deploy sugerido (subdomínio)

Para `grimório.minervamoore.com.br` (ou `grimorio.minervamoore.com.br`), você pode usar:

- VPS com Nginx + Node.js (PM2)
- Render / Railway / Fly.io + apontamento DNS (CNAME/A)

### Exemplo de proxy Nginx

```nginx
server {
    listen 80;
    server_name grimorio.minervamoore.com.br;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Estrutura

- `server.js`: servidor Express e validação da senha.
- `public/index.html`: estrutura da interface do grimório.
- `public/styles.css`: visual (capa antiga, folhas, ornamentos).
- `public/app.js`: autenticação, índice dinâmico e cadastro de receitas.

