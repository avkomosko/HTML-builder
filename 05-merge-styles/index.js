const fs = require('fs').promises;
const path = require('path');
const stylePath = path.join(__dirname, 'styles');
const dataArr = [];
const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleStyles() {
  try {
    const files = await fs.readdir(stylePath, { withFileTypes: true });
    for (const file of files) {
      let isFile = file.isFile();
      if (isFile) {
        let filePath = path.join(stylePath, file.name);
        let fileExt = path.extname(filePath);
        if (fileExt.slice(1) === 'css') {
          await readFile(filePath, 'utf-8');
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  const allData = await dataArr.join('');

  try {
    await fs.unlink(outputPath);
    
  } catch {
    appendFile(outputPath, allData);
   
  } finally {
    appendFile(outputPath, allData);
  }
  

  async function readFile(fileName) {
    try {
      const data = await fs.readFile(fileName, 'utf-8');
      dataArr.push(data);
    } catch (err) {
      throw err;
    }
  }

  async function appendFile(fileName, data) {
    try {
      await fs.appendFile(fileName, data, 'utf-8');
    } catch (err) {
      throw err;
    }
  }
}

bundleStyles();
