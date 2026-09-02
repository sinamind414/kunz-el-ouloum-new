const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '<div className="absolute top-1 right-2 bg-[#ff8c42] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">1</div>';
const replacementStr = '<div className="absolute top-0 right-0 bg-[#ff8c42] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">1</div>';

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed FAB badge position");
