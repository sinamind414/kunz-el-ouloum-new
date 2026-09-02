const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const targetStr = `<div className="flex justify-between items-center relative z-10">
            <button className="bg-white text-[#ff8c42] font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              ابدأ الآن!
            </button>
            <div className="text-right">
               <h3 className="font-black text-2xl mb-1 text-white">مهمة 3</h3>
               <h3 className="font-black text-2xl text-white">دقائق +15 XP</h3>
               <p className="text-white/90 text-sm mt-2 font-bold flex items-center gap-1 justify-end">
                  « تركيب البروتين » 
               </p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl mr-3">
               <Target className="w-8 h-8 text-white" />
            </div>
         </div>`;

const replacementStr = `<div className="flex justify-between items-center relative z-10">
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

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/DashboardView.tsx', code);
console.log("Fixed action card");
