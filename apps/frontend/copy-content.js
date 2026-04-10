import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../../content');
const targetDir = path.join(__dirname, './content');

console.log(`Copying content from ${sourceDir} to ${targetDir}`);

if (fs.existsSync(sourceDir)) {
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.cpSync(sourceDir, targetDir, { recursive: true });
    console.log('Content copied successfully!');
} else {
    console.log('Source content directory not found. Skipping.');
}
