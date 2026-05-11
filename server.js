import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');

// Debug: check if dist exists
console.log(`dist directory exists: ${fs.existsSync(distDir)}`);
console.log(`dist/index.html exists: ${fs.existsSync(path.join(distDir, 'index.html'))}`);
if (fs.existsSync(distDir)) {
  console.log(`dist contents: ${fs.readdirSync(distDir).join(', ')}`);
}

// Serve static files from dist
app.use(express.static(distDir));

// SPA fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
