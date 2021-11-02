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

  try {
    await makeDir(distPath);
    bundleStyles(stylePath, outputStyles);
    await makeDir(assetsCopyPath);
    const files = await fs.readdir(assetsPath, { withFileTypes: true });
    for (let file of files) {
      let isFile = file.isFile();
      let filePath = path.join(assetsPath, file.name);
      let fileExt = path.extname(filePath);
      let filename = path.basename(filePath, fileExt);
      if (isFile) {
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
