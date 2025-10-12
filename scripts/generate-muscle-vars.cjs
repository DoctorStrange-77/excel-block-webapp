const fs = require('fs');
const path = require('path');

const trainingPath = path.join(__dirname, '..', 'src', 'types', 'training.ts');
const cssPath = path.join(__dirname, '..', 'src', 'index.css');

const training = fs.readFileSync(trainingPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const colorRegex = /color:\s*"([a-z0-9-]+)"/g;
let match;
const slugs = new Set();
while ((match = colorRegex.exec(training))) {
  slugs.add(match[1]);
}

const varRegex = /--([a-z0-9-]+)\s*:/g;
const existing = new Set();
while ((match = varRegex.exec(css))) {
  existing.add(match[1]);
}

const missing = Array.from(slugs).filter((s) => !existing.has(s));
if (missing.length === 0) {
  console.log('No missing muscle variables found.');
  process.exit(0);
}

function heuristic(slug) {
  const s = slug.toLowerCase();
  // legs
  if (/(femor|quadri|glute|polpacc|gastrocnemio|soleo|tibial|perone|accosciata|lunges|spinta-anca|hip-hinge|quadricipiti)/.test(s)) return '28 45% 30%';
  if (/(abduttori|adduttori|piccolo-gluteo|medio-gluteo|grande-gluteo)/.test(s)) return '28 45% 30%';
  // chest / push
  if (/(pettor|spinta|press)/.test(s)) return '215 60% 45%';
  // back / pull
  if (/(dorso|trazion|trazione|tirate|gran-dorsale|erettori|centro-schiena|trapezio|tirate-oly)/.test(s)) return '195 55% 36%';
  // shoulders
  if (/(deltoid|deltoidi|spalle|cuffia|rotatori)/.test(s)) return '260 50% 44%';
  // arms
  if (/(bicip|tricip|brach|avambracci|flessori|brachioradiale|brachiale)/.test(s)) return '12 60% 46%';
  // core
  if (/(core|obliqu|trasverso|quadrato|multifidi)/.test(s)) return '145 35% 30%';
  // prehab / mobility
  if (/(mobilita|prehab|prehab|mobilit|prehab)/.test(s)) return '210 8% 22%';
  // scapular / traps
  if (/(trapezio|romboidi|retrattori|protrattori|serrato|depressori|elevator)/.test(s)) return '210 30% 36%';
  // default
  return '0 0% 15%';
}

let newCss = css;

const additions = missing.map((s) => `    --${s}: ${heuristic(s)};`).join('\n');

// Try to append inside the first :root block found
const rootIdx = newCss.indexOf(':root');
if (rootIdx !== -1) {
  const braceOpen = newCss.indexOf('{', rootIdx);
  if (braceOpen !== -1) {
    // find matching closing brace
    let depth = 1;
    let i = braceOpen + 1;
    for (; i < newCss.length; i++) {
      if (newCss[i] === '{') depth++;
      else if (newCss[i] === '}') depth--;
      if (depth === 0) break;
    }
    const insertAt = i; // position of closing brace
    const before = newCss.slice(0, insertAt);
    const after = newCss.slice(insertAt);
    const block = `\n    /* Auto-generated muscle variables (fallbacks) */\n${additions}\n`;
    newCss = before + block + after;
  } else {
    newCss += `\n/* Auto-generated muscle variables (fallbacks) */\n:root {\n${additions}\n}\n`;
  }
} else {
  newCss += `\n/* Auto-generated muscle variables (fallbacks) */\n:root {\n${additions}\n}\n`;
}

fs.writeFileSync(cssPath, newCss, 'utf8');
console.log(`Added ${missing.length} missing variables to ${cssPath}`);
console.log(missing.join('\n'));
