const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const targetStreak = `<div className="w-20 h-20 bg-[#2ecc71] rounded-full flex items-center justify-center mb-4 shadow-sm">`;
const replaceStreak = `<div className="w-20 h-20 bg-gradient-to-tr from-[#10b981] to-[#34d399] rounded-full flex items-center justify-center mb-4 shadow-[0_8px_16px_rgba(16,185,129,0.25)] relative">
               <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>`;
code = code.replace(targetStreak, replaceStreak);

const targetChallenge = `<div className="w-20 h-20 bg-[#ff9a4a] rounded-full flex items-center justify-center mb-4 shadow-sm">`;
const replaceChallenge = `<div className="w-20 h-20 bg-gradient-to-tr from-[#f97316] to-[#fb923c] rounded-full flex items-center justify-center mb-4 shadow-[0_8px_16px_rgba(249,115,22,0.25)] relative">
               <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>`;
code = code.replace(targetChallenge, replaceChallenge);

const targetWarning = `<div className="w-20 h-20 bg-[#f97316] rounded-full flex items-center justify-center mb-4 shadow-sm">`;
const replaceWarning = `<div className="w-20 h-20 bg-gradient-to-tr from-[#ef4444] to-[#f87171] rounded-full flex items-center justify-center mb-4 shadow-[0_8px_16px_rgba(239,68,68,0.25)] relative">
               <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>`;
code = code.replace(targetWarning, replaceWarning);

const targetTimer = `<div className="w-20 h-20 bg-[#3b82f6] rounded-full flex items-center justify-center mb-4 shadow-sm relative overflow-hidden">
               <Hourglass className="w-10 h-10 text-white relative z-10" />
               {/* Decorative arc */}
               <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 rounded-full"></div>
            </div>`;
const replaceTimer = `<div className="w-20 h-20 bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] rounded-full flex items-center justify-center mb-4 shadow-[0_8px_16px_rgba(59,130,246,0.25)] relative overflow-hidden">
               <Hourglass className="w-10 h-10 text-white relative z-10" />
               <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 rounded-full"></div>
               <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            </div>`;
code = code.replace(targetTimer, replaceTimer);

const targetSurprise = `<div className="w-20 h-20 bg-[#d946ef] rounded-full flex items-center justify-center mb-4 shadow-sm relative">`;
const replaceSurprise = `<div className="w-20 h-20 bg-gradient-to-tr from-[#d946ef] to-[#e879f9] rounded-full flex items-center justify-center mb-4 shadow-[0_8px_16px_rgba(217,70,239,0.25)] relative">
               <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>`;
code = code.replace(targetSurprise, replaceSurprise);

const targetAchievement = `<div className="w-20 h-20 bg-[#eab308] rounded-full flex items-center justify-center mb-4 shadow-sm">`;
const replaceAchievement = `<div className="w-20 h-20 bg-gradient-to-tr from-[#eab308] to-[#facc15] rounded-full flex items-center justify-center mb-4 shadow-[0_8px_16px_rgba(234,179,8,0.25)] relative">
               <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>`;
code = code.replace(targetAchievement, replaceAchievement);

// Make the cards slightly taller/iOS-like
code = code.replace(/bg-white rounded-3xl p-5 shadow-\[0_4px_15px_rgba\(0,0,0,0\.03\)\] border border-gray-100 flex flex-col items-center text-center/g, 'bg-white rounded-[28px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center transition-transform hover:scale-[1.02] active:scale-[0.98]');

fs.writeFileSync('src/components/DashboardView.tsx', code);
console.log("Fixed card icons");
