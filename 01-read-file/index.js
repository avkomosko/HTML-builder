const fs = require('fs');
const path = require('path');
const stdout = process.stdout;

function readFile(fileName) {
  const filePath = path.join(__dirname, fileName);
  const stream = fs.createReadStream(filePath, 'utf-8');
  let data = '';
  stream.on('data', (dataChunk) => (data += dataChunk));
  stream.on('end', () => stdout.write(data));
}
readFile('text.txt');