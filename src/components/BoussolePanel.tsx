import React from 'react';
import { Compass, Anchor, Wind, ChevronDown, ChevronUp } from 'lucide-react';
import CompassRose from './CompassRose';
import { BOUSSOLE_CAPS, REGLE_D_OR_AR, BoussoleCap, groupErrorsByCap, ERROR_TAG_LABELS_AR, CapId } from '../data/boussoleData';

interface Props {
  activeStage: 1 | 2 | 3 | 4;
  detectedErrors?: string[];
}

const GRADE_STYLE: Record<string, { ring: string; text: string; bg: string }> = {
  none:      { ring: 'border-gray-300 dark:border-gray-700', text: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/60' },
  deckhand:  { ring: 'border-slate-400/60', text: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-50 dark:bg-slate-800/60' },
  sailor:    { ring: 'border-cyan-500/50', text: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
  captain:   { ring: 'border-emerald-600/50', text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  admiral:   { ring: 'border-amber-500/60', text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40' },
};

function CapCard({ cap, active, done }: { cap: BoussoleCap; active: boolean; done: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 space-y-1.5 transition-all duration-300 ${
        active
          ? 'bg-white dark:bg-[#161c18] shadow-md scale-[1.02]'
          : 'bg-gray-50/70 dark:bg-gray-900/40 opacity-75'
      }`}
      style={{ borderColor: active ? cap.color : '#e5e7eb' }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
          active ? 'text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`} style={{ backgroundColor: active ? cap.color : undefined }}>
          {cap.num}
        </span>
        {active && (
          <span className="text-[10px] text-white px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: cap.color }}>كاب الآن</span>
        )}
      </div>
      <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white">{cap.ar} · {cap.word}</h4>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{cap.desc}</p>
    </div>
  );
}

export default function BoussolePanel({ activeStage, detectedErrors = [] }: Props) {
  const activeCapId: CapId = activeStage;
  const activeCap = BOUSSOLE_CAPS.find(c => c.id === activeCapId) || null;
  const errorGroups = groupErrorsByCap(detectedErrors);
  
  const errorCount = detectedErrors.length;
  const correctCount = BOUSSOLE_CAPS.length - errorGroups.filter(g => g.tags.length > 0).length;

  return (
    <div className="bg-white dark:bg-[#161c18] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-4">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00401f] to-[#0a9a4f] text-white flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0 text-right">
            <h3 className="font-black text-sm md:text-base text-gray-900 dark:text-white">
              بوصلة الإجابة NSOE
            </h3>
            <p className="text-[10px] md:text-[11px] text-gray-500 dark:text-gray-400 font-bold truncate">
              شمال · جنوب · غرب · شرق
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-300">
          {correctCount}/{BOUSSOLE_CAPS.length} كاب
        </span>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3.5">
        <CompassRose activeCap={activeCapId} />
      </div>
      
      <div className="px-4 py-3.5 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[11px] font-bold text-[#944a00] dark:text-amber-300 text-center flex-1">
          {REGLE_D_OR_AR}
        </p>
        <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 shrink-0">
          <Wind className="w-3 h-3" /> رياح معاكسة؟ عد إلى البوصلة
        </span>
      </div>
    </div>
  );
}