const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change the main wrapper
const targetWrapper = `<div className={\`min-h-screen transition-all duration-500 flex flex-col \${
      isFocusMode 
        ? 'bg-gradient-to-b from-[#060a07] to-[#0e1411] text-gray-100' 
        : 'bg-[#f8f9fa] text-[#191c1d] pt-16 md:pt-20 dark:bg-[#0c0f0d] dark:text-gray-100'
    }\`}>`;

const replaceWrapper = `<div className={\`h-[100dvh] w-full overflow-hidden transition-all duration-500 flex flex-col \${
      isFocusMode 
        ? 'bg-gradient-to-b from-[#060a07] to-[#0e1411] text-gray-100' 
        : 'bg-[#f8fbfa] text-[#191c1d] dark:bg-[#0c0f0d] dark:text-gray-100'
    }\`}>`;
code = code.replace(targetWrapper, replaceWrapper);

// 2. Hide App header on 'home' tab and make it relative
const targetHeader = `{!isFocusMode && (
        <header className="bg-[#ffffff] dark:bg-[#141916] shadow-[0_2px_12px_rgba(0,109,55,0.06)] border-b border-[#e2dabf]/40 dark:border-[#2ecc71]/10 flex flex-row-reverse justify-between items-center px-4 md:px-8 h-16 md:h-20 w-full fixed top-0 z-40 select-none">`;

const replaceHeader = `{!isFocusMode && currentTab !== 'home' && (
        <header className="bg-[#ffffff] dark:bg-[#141916] shadow-[0_2px_12px_rgba(0,109,55,0.06)] border-b border-[#e2dabf]/40 dark:border-[#2ecc71]/10 flex flex-row-reverse justify-between items-center px-4 md:px-8 h-16 md:h-20 w-full shrink-0 z-40 select-none">`;
code = code.replace(targetHeader, replaceHeader);

// 3. Make main area flex-1 overflow-y-auto
const targetMain = `<main className={\`flex-1 px-4 py-6 md:py-8 overflow-x-hidden \${isFocusMode ? 'flex items-center justify-center min-h-screen py-12' : ''}\`}>`;
const replaceMain = `<main className={\`flex-1 overflow-y-auto overflow-x-hidden relative \${isFocusMode ? 'flex items-center justify-center' : ''}\`}>`;
code = code.replace(targetMain, replaceMain);

// 4. Make nav bottom not fixed
const targetNav = `<nav className="md:hidden bg-[#f8fbfa] shadow-[0_-5px_15px_rgba(0,0,0,0.05)] fixed bottom-0 left-0 right-0 h-[80px] z-40 flex items-center justify-around px-2 pb-2 rounded-t-[24px] select-none border-t border-[#e2e8f0]/50" dir="rtl">`;
const replaceNav = `<nav className="md:hidden bg-[#f8fbfa] shadow-[0_-5px_15px_rgba(0,0,0,0.05)] shrink-0 h-[80px] z-40 flex items-center justify-around px-2 pb-2 rounded-t-[24px] select-none border-t border-[#e2e8f0]/50" dir="rtl">`;
code = code.replace(targetNav, replaceNav);

// 5. Adjust FAB position since bottom is no longer window bottom if we use standard absolute, but we can keep it fixed or absolute to the App container. Fixed is fine for FAB.
const targetFab = `<button
          onClick={() => handleTabChange('chat')}
          className="md:hidden fixed bottom-[90px] right-4 z-50 bg-[#006d37] hover:bg-[#005a2d] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
        >`;
const replaceFab = `<button
          onClick={() => handleTabChange('chat')}
          className="md:hidden absolute bottom-[90px] right-4 z-50 bg-[#006d37] hover:bg-[#005a2d] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
        >`;
code = code.replace(targetFab, replaceFab);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed App layout");
