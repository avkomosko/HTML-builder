const fs = require('fs').promises;
const path = require('path');
const stylePath = path.join(__dirname, 'styles');
const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleStyles(stylesSourse, stylesOutput) {
  const dataArr = [];
  try {
    const files = await fs.readdir(stylesSourse, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        let filePath = path.join(stylesSourse, file.name);
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
      await fs.unlink(stylesOutput);
      appendFile(stylesOutput, data);
    } catch {
      appendFile(stylesOutput, data);
    }
  }

  async function appendFile(fileName, data) {
    await fs.appendFile(fileName, data, 'utf-8');
  }
}

bundleStyles(stylePath, outputPath);

module.exports = bundleStyles;
