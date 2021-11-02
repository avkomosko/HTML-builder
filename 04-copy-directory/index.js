const fs = require('fs').promises;
const path = require('path');
const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

async function copyDirectory(source, copy) {
  try {
    await fs.mkdir(copy, true);
  } catch {
    await removeFiles();
  } finally {
    createDir();
    copyFiles();
  }

  async function createDir() {
    try {
      await fs.mkdir(copy, true);
    } catch (err) {
      return;
    }
  }

  async function removeFiles() {
    const fileCopies = await fs.readdir(copy, { withFileTypes: true });
    if (fileCopies.length > 0) {
      for (let file of fileCopies) {
        if (file.isFile()) {
          let fileCopyPath = path.join(copy, file.name);
          await fs.unlink(fileCopyPath);
        }
      }
    }
    await fs.rmdir(copy);
  }

  async function copyFiles() {
    try {
      const files = await fs.readdir(source, { withFileTypes: true });
      for (let file of files) {
        let isFile = file.isFile();
        if (isFile) {
          let filePath = path.join(source, file.name);
          let fileCopyPath = path.join(copy, file.name);
          await fs.copyFile(filePath, fileCopyPath);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}

copyDirectory(dirPath, dirCopyPath);

module.exports = copyDirectory;
