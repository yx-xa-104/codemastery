const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walkDir(file));
            }
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('./src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/bg-\[size:([^\]]+)\]/g, 'bg-size-[$1]')
        .replace(/bg-\[length:([^\]]+)\]/g, 'bg-size-[$1]')
        .replace(/bg-gradient-to-(r|br|t|b|l|tl|tr|bl)/g, 'bg-linear-to-$1')
        .replace(/\[color-scheme:dark\]/g, 'scheme-dark')
        .replace(/\bflex-grow\b/g, 'grow')
        .replace(/bg-\[position:([^\]]+)\]/g, 'bg-position-[$1]');
        
    // specific decimal to percent for colors (e.g. hover:bg-white/[0.04] -> hover:bg-white/4)
    newContent = newContent.replace(/((?:hover:|focus:|active:|group-hover:)?(?:bg|border|text)-[a-zA-Z0-9-]+)\/\[([0-9.]+)\]/g, (match, p1, numStr) => {
        const num = parseFloat(numStr);
        if (!isNaN(num) && num < 1 && num > 0) {
            return `${p1}/${Math.round(num * 100)}`;
        }
        return match;
    });

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedCount++;
    }
});
console.log('Fixed files: ' + changedCount);
