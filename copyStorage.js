const fs = require("fs");
const path = require("path");

// Create dist/storage directory if it doesn't exist
const storageDir = path.join(__dirname, "dist", "storage");
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Copy mockIncidents.json and mockUsers.json
["mockIncidents.json", "mockUsers.json"].forEach((file) => {
  const sourcePath = path.join(__dirname, "src", "storage", file);
  const destPath = path.join(__dirname, "dist", "storage", file);

  fs.copyFileSync(sourcePath, destPath);
  console.log(`✅ Copied ${file} to dist/storage`);
});
