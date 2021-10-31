const fs = require('fs').promises;
const path = require('path');
const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.mkdir(dirCopyPath, true);
  } catch {
    await removeFiles();
  } finally {
    createDir();
    copyFiles();
  }

  async function createDir() {
    try {
      await fs.mkdir(dirCopyPath, true);
    } catch (err) {
      console.log('has been created dir', err.path);
    }
  }

  async function removeFiles() {
    const fileCopies = await fs.readdir(dirCopyPath, { withFileTypes: true });
    if (fileCopies.length > 0) {
      for (const file of fileCopies) {
        if (file.isFile()) {
          let fileCopyPath = path.join(dirCopyPath, file.name);
          await fs.unlink(fileCopyPath);
        }
      }
    }
    await fs.rmdir(dirCopyPath);
  }

  async function copyFiles() {
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      for (const file of files) {
        let isFile = file.isFile();
        if (isFile) {
          let filePath = path.join(dirPath, file.name);
          let fileCopyPath = path.join(dirCopyPath, file.name);
          await fs.copyFile(filePath, fileCopyPath);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}
copyDirectory();
