const express = require('express');
const app = express();
const port = 3000;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.log(`Test API listening at http://localhost:${port}`);
});
