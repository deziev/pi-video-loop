const { exec } = require('child_process');

async function runLinuxCommand(cmd) {
  return await new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, _stderr) => {
      if (err) {
        reject(err);
      }
      resolve(stdout)
    });
  });
}

module.exports = runLinuxCommand;