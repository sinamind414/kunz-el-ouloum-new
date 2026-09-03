import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BOUSSOLE_STEPS, ERROR_TAG_LABELS_AR, getStepByTag } from '../data/boussoleData';

interface ErrorMapProps {
  errors: string[];
  studentText?: string;
}

export default function ErrorMap({ errors, studentText }: ErrorMapProps) {
  const [open, setOpen] = React.useState(true);

  const errorByStep = BOUSSOLE_STEPS.reduce((acc, step) => {
    const stepErrors = errors.filter(e => getStepByTag(e)?.num === step.num);
    if (stepErrors.length > 0) {
      acc[step.num] = stepErrors;
    }
    return acc;
  }, {} as Record<number, string[]>);

  return (
    <div className="bg-white dark:bg-[#161c18] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm" dir="rtl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${!open ? '' : 'rotate-180'}`} />
          <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
            خريطة الأخطاء
          </h3>
        </div>
        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          {errors.length} خطأ {errors.length !== 1 ? 'أخطاء' : ''}
        </span>
      </button>

      {open && (
        <div className="p-4">
          {errors.length === 0 ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">أمان ✅</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">لا توجد أخطاء منهجية</p>
            </div>
          ) : (
            <div className="space-y-3">
              {BOUSSOLE_STEPS.map(step => {
                const stepErrors = errorByStep[step.num];
                if (!stepErrors) return null;

                return (
                  <div key={step.num} className="border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.num}
                      </span>
                      <span className="font-bold text-xs text-gray-900 dark:text-white">{step.ar}</span>
                    </div>
                    {stepErrors.map(err => (
                      <div key={err} className="bg-red-50 dark:bg-red-950/20 rounded-lg p-2.5 mb-1">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-red-500 font-bold mt-0.5">⚠️</span>
                          <div className="text-xs text-red-800 dark:text-red-300">
                            <div className="font-bold mb-0.5">{ERROR_TAG_LABELS_AR[err] || err}</div>
                            <div className="text-red-700 dark:text-red-300/90 font-mono">
                              {getRemedy(step.num)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] text-gray-400 font-bold text-center">
              راجع الخطوات الأربع من النهاية للبداية للتحقق
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getRemedy(step: number): string {
  const remedies: Record<number, string> = {
    1: 'طوّق الفعل واكتب «المطلوب: …» قبل أيّ سطر',
    2: 'كل رقم بوحدته — راجع أرقامك واحدًا واحدًا',
    3: 'اسأل «هل الفعل يسمح بلأنّ؟» ثم أغلق الخطوة 3',
    4: '«ومنه نستنتج أنّ …» — لا تُسلّم ورقة بدونها'
  };
  return remedies[step] || '';
}