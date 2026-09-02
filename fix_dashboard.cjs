const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Fix Stats Summary Card Order
const targetStatsStr = `<div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex flex-col items-center flex-1">
           <span className="font-bold text-[15px] text-[#1f1c0b]">Élève</span>
           <span className="text-[11px] font-bold text-[#006d37]">أكملت المنهجية — أنت غير صفر</span>
        </div>
        
        <div className="w-px h-10 bg-gray-100"></div>
        
        <div className="flex flex-col items-center flex-1">
           <span className="font-bold text-[18px] text-[#ff9a4a]">0</span>
           <div className="flex items-center gap-1 text-[#ff9a4a] font-bold text-[13px]">
              <Flame className="w-4 h-4" fill="currentColor" />
              <span>يوم</span>
           </div>
        </div>

        <div className="w-px h-10 bg-gray-100"></div>
        
        <div className="flex flex-col items-center flex-1">
           <span className="font-bold text-[18px] text-[#a0522d]">0</span>
           <div className="flex items-center gap-1 text-[#a0522d] font-bold text-[13px]">
              <Trophy className="w-4 h-4" fill="currentColor" />
              <span>XP</span>
           </div>
        </div>
      </div>`;

const replacementStatsStr = `<div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex flex-col items-center flex-1">
           <span className="font-bold text-[18px] text-[#a0522d]">0</span>
           <div className="flex items-center gap-1 text-[#a0522d] font-bold text-[13px]">
              <Trophy className="w-4 h-4" fill="currentColor" />
              <span>XP</span>
           </div>
        </div>

        <div className="w-px h-10 bg-gray-100"></div>
        
        <div className="flex flex-col items-center flex-1">
           <span className="font-bold text-[18px] text-[#ff9a4a]">0</span>
           <div className="flex items-center gap-1 text-[#ff9a4a] font-bold text-[13px]">
              <Flame className="w-4 h-4" fill="currentColor" />
              <span>يوم</span>
           </div>
        </div>

        <div className="w-px h-10 bg-gray-100"></div>
        
        <div className="flex flex-col items-center flex-1">
           <span className="font-bold text-[15px] text-[#0f172a]">Élève</span>
           <span className="text-[11px] font-bold text-[#006d37]">أكملت المنهجية — أنت غير صفر</span>
        </div>
      </div>`;

code = code.replace(targetStatsStr, replacementStatsStr);

// Fix Big Action Card layout
const targetActionStr = `<div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
               <div className="bg-white/20 p-3 rounded-2xl">
                  <Target className="w-8 h-8 text-white" />
               </div>
               <div className="text-right">
                  <h3 className="font-black text-2xl text-white">مهمة 3</h3>
                  <h3 className="font-black text-2xl text-white">دقائق +15 XP</h3>
                  <p className="text-white/90 text-[13px] mt-1 font-bold">
                     « تركيب البروتين » 
                  </p>
               </div>
            </div>
            <button className="bg-white text-[#ff8c42] font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-50 transition-colors text-sm">
              ابدأ الآن!
            </button>
         </div>`;

const replacementActionStr = `<div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
               <div className="bg-white/20 p-3 rounded-2xl">
                  <Target className="w-10 h-10 text-white" />
               </div>
               <div className="text-right">
                  <h3 className="font-black text-2xl text-white">مهمة 3</h3>
                  <h3 className="font-black text-2xl text-white">دقائق +15 XP</h3>
                  <p className="text-white/90 text-[13px] mt-1 font-bold">
                     « تركيب البروتين » 
                  </p>
               </div>
            </div>
            <button className="bg-white text-[#ff8c42] font-bold px-5 py-2.5 rounded-2xl shadow-md hover:bg-gray-50 transition-colors text-sm">
              ابدأ الآن!
            </button>
         </div>`;

code = code.replace(targetActionStr, replacementActionStr);

fs.writeFileSync('src/components/DashboardView.tsx', code);
console.log("Fixed dashboard layout elements");
