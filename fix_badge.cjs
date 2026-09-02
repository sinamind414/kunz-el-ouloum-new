const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const targetStr = `<div className="flex items-center gap-1">
              <span>0</span>
              <span className="text-xs text-gray-500">XP</span>
            </div>
            <div className="w-px h-4 bg-[#e2dabf]"></div>
            <div className="flex items-center gap-1">
              <span>0</span>
              <Trophy className="w-4 h-4 text-[#d4af37]" fill="currentColor" />
            </div>
            <div className="w-px h-4 bg-[#e2dabf]"></div>
            <div className="flex items-center gap-1">
              <span>0</span>
              <Flame className="w-4 h-4 text-[#ff9a4a]" fill="currentColor" />
            </div>`;

const replacementStr = `<div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-[#ff9a4a]" fill="currentColor" />
              <span>0</span>
            </div>
            <div className="w-px h-4 bg-[#e2dabf]"></div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-[#d4af37]" fill="currentColor" />
              <span>0</span>
            </div>
            <div className="w-px h-4 bg-[#e2dabf]"></div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">XP</span>
              <span>0</span>
            </div>`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/DashboardView.tsx', code);
console.log("Fixed badge order");
