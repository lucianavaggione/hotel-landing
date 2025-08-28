const fs = require("fs");
const path = require("path");

// Source and destination paths
const src = path.join(__dirname, "robots.txt");
const dest = path.join(__dirname, "dist", "robots.txt");

// Ensure dist folder exists
if (!fs.existsSync(path.dirname(dest))) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
}

// Copy robots.txt
fs.copyFileSync(src, dest);

console.log("robots.txt copied to dist/");
