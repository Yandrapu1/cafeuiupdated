const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /bg-\[\#F9F6F0\]/g, replacement: 'bg-theme-bg' },
  { regex: /text-\[\#110e0d\]\/60/g, replacement: 'text-theme-text-muted' },
  { regex: /text-\[\#110e0d\]\/70/g, replacement: 'text-theme-text-muted' },
  { regex: /text-\[\#110e0d\]/g, replacement: 'text-theme-text' },
  { regex: /bg-white(?!\/)/g, replacement: 'bg-theme-surface' }, // Ignore bg-white/50 etc
  { regex: /bg-white\/[0-9]+/g, replacement: 'bg-theme-surface' }, // Actually let's just make it surface.
  { regex: /bg-black\/5/g, replacement: 'bg-theme-surface' },
  { regex: /bg-black\/10/g, replacement: 'bg-theme-border' },
  { regex: /bg-black\/[0-9]+/g, replacement: 'bg-theme-border' }, // catch all faint blacks
  { regex: /border-black\/5/g, replacement: 'border-theme-border' },
  { regex: /border-black\/10/g, replacement: 'border-theme-border' },
  { regex: /border-black\/[0-9]+/g, replacement: 'border-theme-border' },
  { regex: /text-black\/40/g, replacement: 'text-theme-text-muted' },
  { regex: /text-black\/60/g, replacement: 'text-theme-text-muted' },
  { regex: /text-black\/70/g, replacement: 'text-theme-text-muted' },
  { regex: /bg-cafe-gold/g, replacement: 'bg-theme-accent' },
  { regex: /text-cafe-gold/g, replacement: 'text-theme-accent' },
  { regex: /border-cafe-gold/g, replacement: 'border-theme-accent' },
  { regex: /ring-cafe-gold/g, replacement: 'ring-theme-accent' },
  { regex: /bg-cafe-bg/g, replacement: 'bg-theme-bg' },
  { regex: /text-cafe-cream/g, replacement: 'text-theme-text' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log("Done replacing theme colors!");
