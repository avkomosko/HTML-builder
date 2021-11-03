const fs = require('fs').promises;
const path = require('path');

const copyDirectory = require('../04-copy-directory/index.js');
const bundleStyles = require('../05-merge-styles/index.js');
const stylePath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');
const outputStyles = path.join(__dirname, 'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(distPath, 'assets');

async function buildPage() {
  let htmlTemplate = '';
  let components = {};

  async function makeDir(path) {
    try {
      await fs.stat(path);
    } catch (err) {
      if (err.code === 'ENOENT') {
        try {
          await fs.mkdir(path, true);
        } catch (err) {
          if (err.code === 'EEXIST') {
            return;
          }
        }
      }
    }
  }

  async function clearDir(dirPath) {
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      for (let file of files) {
        if (file.isFile()) {
          let filePath = path.join(dirPath, file.name);
          await fs.unlink(filePath);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function readHtmltemp(filePath) {
    const data = await fs.readFile(filePath, 'utf-8');
    htmlTemplate += data;
  }

  async function getHtmlComponents(dirPath) {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        let filePath = path.join(dirPath, file.name);
        let fileExt = path.extname(filePath);
        let filename = path.basename(filePath, fileExt);
        if (fileExt === '.html') {
          let data = await fs.readFile(filePath, { encoding: 'utf-8' });
          components[filename] = data;
        }
      }
    }
  }
  
  async function createHtml() {
    await readHtmltemp(path.join(__dirname, 'template.html'));
    await getHtmlComponents(path.join(__dirname, 'components'));
    let items = Object.keys(components);
    for (let item of items) {
      if (htmlTemplate.includes(item)) {
        do {
          htmlTemplate = htmlTemplate.replace(`{{${item}}}`, components[item]);
        } while (htmlTemplate.indexOf(item) === -1);
      }
    }
  }

  async function writeHtml() {
    await createHtml();
    let fileName = path.join(distPath, 'index.html');
    try {
      await fs.stat(fileName);
      await fs.unlink(fileName);
    } catch (err) {
      await fs.appendFile(fileName, '', 'utf-8');
      return;
    } finally {
      await fs.appendFile(fileName, htmlTemplate, 'utf-8');
    }
  }
  
  try {
    await makeDir(distPath);
    bundleStyles(stylePath, outputStyles);
    writeHtml();
    await makeDir(assetsCopyPath);
    await clearDir(assetsCopyPath);
    const files = await fs.readdir(assetsPath, { withFileTypes: true });
    for (let file of files) {
      let filePath = path.join(assetsPath, file.name);
      let fileExt = path.extname(filePath);
      let filename = path.basename(filePath, fileExt);
      if (file.isFile()) {
        let fileCopyPath = path.join(assetsCopyPath, file.name);
        await fs.copyFile(filePath, fileCopyPath);
      } else {
        await makeDir(path.join(assetsCopyPath, filename));
        await copyDirectory(filePath, path.join(assetsCopyPath, filename));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

buildPage();
