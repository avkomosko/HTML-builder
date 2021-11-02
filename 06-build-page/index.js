const fs = require('fs').promises;
const path = require('path');

const copyDirectory = require('../04-copy-directory/index.js');
const bundleStyles = require('../05-merge-styles/index.js');
const stylePath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');
const outputStyles = path.join(__dirname, 'project-dist', 'style.css');

async function buildPage() {
  try {
    await fs.mkdir(distPath, true);
    bundleStyles(stylePath, outputStyles);
  } catch (err) {
    console.error(err);
  }
}

buildPage();
