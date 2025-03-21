const fs = require("fs");
const path = require("path");

const listFiles = (dir, prefix = "") => {
  const files = fs.readdirSync(dir);
  files.forEach((file, index) => {
    const fullPath = path.join(dir, file);
    const isLast = index === files.length - 1;
    console.log(`${prefix}${isLast ? "└──" : "├──"} ${file}`);
    if (fs.statSync(fullPath).isDirectory()) {
      listFiles(fullPath, prefix + (isLast ? "    " : "│   "));
    }
  });
};

listFiles("./app/"); // Lancer depuis le dossier racine du projet
