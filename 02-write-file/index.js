const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stdout = process.stdout;
const stdin = process.stdin;
const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({ input: stdin, output: stdout });

fs.writeFile(filePath, '', (err) => {
  if (err) {
    throw err;
  }
});

function handleLine(filePath, data) {
  if (data !== 'exit') {
    fs.appendFile(filePath, `${data}\n`, (err) => {
      if (err) {
        throw err;
      }
    });
  } else {
    handleExit();
  }
}

rl.question('Hello! Enter your data:', (data) => {
  handleLine(filePath, data);
});

rl.on('line', (data) => {
  handleLine(filePath, data);
});

function handleExit() {
  console.log('Have a nice day! Bye!');
  rl.close();
}

rl.on('SIGINT', handleExit);
