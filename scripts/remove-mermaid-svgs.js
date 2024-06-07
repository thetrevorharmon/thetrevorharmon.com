const fs = require('fs');
const path = require('path');

function removeMermaidSvgs(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      return console.error(`Unable to scan directory: ${err}`);
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file);

      fs.stat(fullPath, (err, stat) => {
        if (err) {
          return console.error(`Unable to stat file: ${err}`);
        }

        if (stat.isDirectory()) {
          // Recursively search in subdirectories
          removeMermaidSvgs(fullPath);
        } else if (stat.isFile() && /^mermaid__[a-f0-9]+\.svg$/.test(file)) {
          // Remove the file if it matches the pattern
          console.log(`Removing file: ${fullPath}`);
          fs.unlink(fullPath, (err) => {
            if (err) {
              return console.error(`Unable to delete file: ${err}`);
            }
          });
        }
      });
    });
  });
}

// Start the process from the specified root directory
const rootDir = path.join(__dirname, '..', 'src', 'content', 'blog');

removeMermaidSvgs(rootDir);
