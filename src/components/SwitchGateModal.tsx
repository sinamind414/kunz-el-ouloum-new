import React, { useState, useEffect, useRef } from 'react';
import { Clock, Check, X, HelpCircle } from 'lucide-react';

interface SwitchGateModalProps {
  verb: string;
  verbAr: string;
  onSwitch: (allowsBecause: boolean) => void;
  onSkip?: () => void;
}

const VERB_CLOSED = ['حلّل', 'صِف', 'اِستخرِج', 'لَخّص', 'اِقرأ منحنى'];
const VERB_OPEN = ['فسّر', 'اشرح', 'علّل', 'برّر', 'اقترح فرضية', 'انقُد', 'اِستنتِج'];

export default function SwitchGateModal({ verb, verbAr, onSwitch, onSkip }: SwitchGateModalProps) {
  const [show, setShow] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onSkip?.();
          setShow(false);
          return 0;
        }
        return prev - 1;
      };
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleChoice = (allowsBecause: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShow(false);
    onSwitch(allowsBecause);
  };

  if (!show) return null;

  const isClosed = VERB_CLOSED.includes(verbAr);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white dark:bg-[#161c18] rounded-3xl p-5 md:p-7 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#00401f] to-[#0a9a4f] text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
          🔑 <span className="block text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
            السؤال الوحيد قبل الكتابة
          </span>
        </h3>

        <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
          هل الفعل يسمح بـ«لأنّ»؟
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="font-bold mb-2">
            {isClosed ? '🚫 مغلق' : '✅ مفتوح'}
          </div>
          <div className="text-xs">
            {isClosed
              ? 'حَلِّل · صِف · اِستخرِج · لَخّص ← ١ ثم ٢ ثم ٤'
              : 'فَسِّر · اِشرح · عَلِّل · اِرْبِطْ ← ١ ثم ٢ ثم ٣ ثم ٤'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleChoice(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-bold"
          >
            <X className="w-4 h-4" />
            <span>لا</span>
          </button>

          <button
            onClick={() => handleChoice(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all font-bold"
          >
            <Check className="w-4 h-4" />
            <span>نعم</span>
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          ⏱ {countdown} ثانية {countdown === 1 ? '— سيتم التخطي للراحة' : ''}
        </div>
      </div>
    </div>
  );
}