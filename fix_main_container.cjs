const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetContainer = `<div className={\`flex-1 flex w-full \${isFocusMode ? 'max-w-4xl' : 'max-w-5xl'} mx-auto\`}>`;
const replaceContainer = `<div className={\`flex-1 flex w-full \${isFocusMode ? 'max-w-4xl' : 'max-w-5xl'} mx-auto overflow-hidden relative\`}>`;
code = code.replace(targetContainer, replaceContainer);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed main container");
