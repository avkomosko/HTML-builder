const fs = require('fs').promises;
const path = require('path');

const stylePath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');
const outputStyles = path.join(__dirname, 'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(distPath, 'assets');

async function buildPage() {
  let htmlTemplate = '';
  let components = {};

  try {
    makeDir(distPath);
    bundleStyles(stylePath, outputStyles);
    writeHtml();
    clearDir(assetsCopyPath);
    makeDir(assetsCopyPath);
    copyDirectory(assetsPath, assetsCopyPath);
  } catch (err) {
    console.error(err);
  }

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
    await fs.rm(dirPath, { recursive: true, force: true });
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
    let filePath = path.join(distPath, 'index.html');
    try {
      await fs.stat(filePath);
      await fs.unlink(filePath);
    } catch (err) {
      await fs.appendFile(filePath, '', 'utf-8');
      return;
    } finally {
      await fs.appendFile(filePath, htmlTemplate, 'utf-8');
    }
  }

  async function copyDirectory(source, copy) {
    try {
      await fs.mkdir(copy, true);
    } catch {
      await removeFiles(copy);
    } finally {
      makeDir(copy);
      copyFiles();
    }

    async function removeFiles(removePath) {
      await fs.rm(removePath, { recursive: true, force: true });
    }

    async function copyFiles() {
      try {
        const files = await fs.readdir(source, { withFileTypes: true });
        for (let file of files) {
          let filePath = path.join(source, file.name);
          let fileCopyPath = path.join(copy, file.name);
          if (file.isFile()) {
            await fs.copyFile(filePath, fileCopyPath);
          } else {
            await makeDir(path.join(copy, file.name));
            copyDirectory(filePath, path.join(copy, file.name));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

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
}

buildPage();
