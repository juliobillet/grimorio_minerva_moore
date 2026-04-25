const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.GRIMORIO_PASSWORD || 'excelsior';

app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/auth', (req, res) => {
  const { password } = req.body || {};
  if (password === PASSWORD) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, message: 'Senha inválida.' });
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Grimório rodando em http://localhost:${PORT}`);
});
