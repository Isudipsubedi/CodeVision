// run-go.js
const { exec } = require('child_process');

function runGoCode(code, callback) {
  const fs = require('fs');
  const tempFile = 'temp.go';

  fs.writeFileSync(tempFile, code);

  exec(`go run ${tempFile}`, (error, stdout, stderr) => {
    fs.unlinkSync(tempFile); // delete after execution
    if (error) {
      return callback(stderr || error.message);
    }
    callback(stdout);
  });
}

module.exports = runGoCode;
