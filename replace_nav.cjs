const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStart3 = code.indexOf('{!isFocusMode && currentTab !== \'chat\' && (\n        <button\n          onClick={() => handleTabChange(\'chat\')}');

if (targetStart3 !== -1) {
  const end = code.indexOf('</nav>\n      )}\n    </div>\n  );\n}');
  const newNav = `{!isFocusMode && currentTab !== 'chat' && (
        <button
          onClick={() => handleTabChange('chat')}
          className="md:hidden fixed bottom-[90px] right-4 z-50 bg-[#006d37] hover:bg-[#005a2d] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <MessageCircle className="w-7 h-7" />
            <div className="absolute top-1 right-2 bg-[#ff8c42] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">1</div>
          </div>
        </button>
      )}

      {!isFocusMode && (
        <nav className="md:hidden bg-[#f8fbfa] shadow-[0_-5px_15px_rgba(0,0,0,0.05)] fixed bottom-0 left-0 right-0 h-[80px] z-40 flex items-center justify-around px-2 pb-2 rounded-t-[24px] select-none border-t border-[#e2e8f0]/50" dir="rtl">
        
        {/* Home Button (مساري) */}
        <button
          onClick={() => handleTabChange('home')}
          className={\`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all w-[72px] h-[64px] cursor-pointer \${
            currentTab === 'home'
              ? 'bg-[#e5f6ed] text-[#006d37]'
              : 'text-[#64748b] hover:text-[#006d37]'
          }\`}
        >
          <Compass className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-bold">مساري</span>
          {currentTab === 'home' && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#006d37]"></div>}
        </button>

        {/* Lesson Button (الدروس) */}
        <button
          onClick={() => handleTabChange('lesson')}
          className={\`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all w-[72px] h-[64px] cursor-pointer \${
            currentTab === 'lesson'
              ? 'bg-[#e5f6ed] text-[#006d37]'
              : 'text-[#64748b] hover:text-[#006d37]'
          }\`}
        >
          <BookOpen className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-bold">الدروس</span>
          {currentTab === 'lesson' && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#006d37]"></div>}
        </button>

        {/* Methodology Button (أتدرب) */}
        <button
          onClick={() => handleTabChange('methodology')}
          className={\`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all w-[72px] h-[64px] cursor-pointer \${
            currentTab === 'methodology'
              ? 'bg-[#e5f6ed] text-[#006d37]'
              : 'text-[#64748b] hover:text-[#006d37]'
          }\`}
        >
          <Layers className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-bold">أتدرب</span>
          {currentTab === 'methodology' && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#006d37]"></div>}
        </button>

        {/* Stats Button (تقدمي) */}
        <button
          onClick={() => handleTabChange('stats')}
          className={\`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all w-[72px] h-[64px] cursor-pointer \${
            currentTab === 'stats'
              ? 'bg-[#e5f6ed] text-[#006d37]'
              : 'text-[#64748b] hover:text-[#006d37]'
          }\`}
        >
          <Trophy className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-bold">تقدمي</span>
          {currentTab === 'stats' && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#006d37]"></div>}
        </button>

      </nav>`;
  const before = code.substring(0, targetStart3);
  const after = code.substring(end + 6);
  fs.writeFileSync('src/App.tsx', before + newNav + after);
  console.log("Replaced using exact pattern");
} else {
  console.log("Not found");
}
