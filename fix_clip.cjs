const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const targetStr = '<div className="absolute top-0 right-0 w-full h-full bg-white/10 rounded-full clip-half"></div>';
const replacementStr = '<div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 rounded-full"></div>';

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/DashboardView.tsx', code);
console.log("Fixed clip-half");
