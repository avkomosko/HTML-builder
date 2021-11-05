const fs = require('fs').promises;
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

async function listDirectory() {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        let filePath = path.join(dirPath, file.name);
        let fileExt = path.extname(filePath);
        let filename = path.basename(filePath, fileExt);
        let stat = await fs.stat(filePath);
        console.log(`${filename} - ${fileExt.slice(1)} - ${stat.size}b`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listDirectory();
