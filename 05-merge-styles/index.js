const fs = require('fs').promises;
const path = require('path');

async function bundleStyles(stylesSourse, stylesOutput) {
  const stylePath = path.join(__dirname, stylesSourse);
  const dataArr = [];
  const outputPath = path.join(__dirname, 'project-dist', stylesOutput);

  try {
    const files = await fs.readdir(stylePath, { withFileTypes: true });
    for (let file of files) {
      let isFile = file.isFile();
      if (isFile) {
        let filePath = path.join(stylePath, file.name);
        let fileExt = path.extname(filePath);
        if (fileExt.slice(1) === 'css') {
          const data = await fs.readFile(filePath, 'utf-8');
          dataArr.push(data);
        }
      }
    }
    const allData = dataArr.join('\n');
    updateStyles(allData);
  } catch (err) {
    console.error(err);
  }

  async function updateStyles(data) {
    try {
      await fs.unlink(outputPath);
      appendFile(outputPath, data);
    } catch {
      appendFile(outputPath, data);
    }
  }

  async function appendFile(fileName, data) {
    await fs.appendFile(fileName, data, 'utf-8');
  }
}

bundleStyles('styles', 'bundle.css');
