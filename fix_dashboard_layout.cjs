const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const targetWrapper = `<div className="space-y-4 pb-32 px-4 pt-6 bg-[#f8fbfa] min-h-screen" dir="rtl">`;
const replaceWrapper = `<div className="space-y-4 pb-24 px-4 pt-6 bg-[#f8fbfa] min-h-full" dir="rtl">`;
code = code.replace(targetWrapper, replaceWrapper);

fs.writeFileSync('src/components/DashboardView.tsx', code);
console.log("Fixed dashboard layout");
