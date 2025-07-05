require('dotenv').config(); // Load .env values
const express = require('express');
const bodyParser = require('body-parser');
const runPython = require('./server/run-python');
const runGo = require('./server/run-go');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // serve index.html

app.post('/run/python', (req, res) => {
  runPython(req.body.code, (output) => {
    res.send({ output });
  });
});

app.post('/run/go', (req, res) => {
  runGo(req.body.code, (output) => {
    res.send({ output });
  });
});

app.listen(3000, () => {
  console.log('🚀 Server listening on http://localhost:3000');
});
