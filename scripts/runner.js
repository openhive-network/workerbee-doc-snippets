import fs from 'fs';

const jsFiles = fs.readdirSync('.').filter(file => file.endsWith('.js') && !file.endsWith('runner.js')).map(file => `./${file}`);

await import(jsFiles[0]);
