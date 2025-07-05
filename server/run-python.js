// js/server/run-python.js

const { exec } = require('child_process');
require('dotenv').config();

function runPython(code, callback) {
  exec(`python -c "${code.replace(/"/g, '\\"')}"`, (err, stdout, stderr) => {
    if (err) return callback(stderr || err.message);
    callback(stdout);
  });
}

module.exports = runPython;
