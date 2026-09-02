const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetRoot = `<div className={\`h-[100dvh] w-full overflow-hidden transition-all duration-500 flex flex-col \${`;
const replaceRoot = `<div className={\`h-[100dvh] w-full overflow-hidden relative transition-all duration-500 flex flex-col \${`;
code = code.replace(targetRoot, replaceRoot);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed root relative");
