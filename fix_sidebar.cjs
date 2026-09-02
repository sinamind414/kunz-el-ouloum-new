const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetSidebar = `          <aside className="hidden md:flex shrink-0 w-64 bg-[#ffffff] dark:bg-[#141916] border-l border-[#e2dabf]/50 dark:border-[#2ecc71]/10 flex-col py-6 px-4 gap-2 select-none h-[calc(100vh-80px)] sticky top-20 right-0">`;
const replaceSidebar = `          <aside className="hidden md:flex shrink-0 w-64 bg-[#ffffff] dark:bg-[#141916] border-l border-[#e2dabf]/50 dark:border-[#2ecc71]/10 flex-col py-6 px-4 gap-2 select-none h-full overflow-y-auto">`;
code = code.replace(targetSidebar, replaceSidebar);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed sidebar");
