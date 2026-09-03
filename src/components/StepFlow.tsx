import React from 'react';
import { BookOpen, FileText, Wind, CheckCircle2 } from 'lucide-react';
import { BOUSSOLE_STEPS, getStepData } from '../data/boussoleData';

interface StepFlowProps {
  currentStep: 1 | 2 | 3 | 4;
  verbOpen: boolean;
  errors: string[];
}

export default function StepFlow({ currentStep, verbOpen, errors }: StepFlowProps) {
  const stepColors = ['#1d4ed8', '#059669', '#d97706', '#7c3aed'];

  return (
    <div className="bg-white dark:bg-[#161c18] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-4" dir="rtl">
      <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          الخطوات الأربع
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold">
          اقرأْ · اجمعْ · اربطْ · اختم — تحرك بالمؤشر لتحديد الخطوة النشطة
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4">
        {BOUSSOLE_STEPS.map((step) => {
          const isActive = step.num === currentStep;
          const isError = errors.includes(step.errorTag);
          const stepColor = stepColors[step.num - 1];

          return (
            <div
              key={step.num}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'shadow-md'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                borderColor: isActive ? stepColor : '#e2e8f0',
                backgroundColor: isActive ? `${stepColor}15` : undefined
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isActive ? 'text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700'
                  }`}
                  style={{ backgroundColor: isActive ? stepColor : undefined }}
                >
                  {step.num}
                </span>
                {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white" style={{ color: stepColor }}>
                {step.ar}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {step.wordAr}
              </p>
              {isError && (
                <span className="text-[10px] text-red-500 font-bold mt-1 block">
                  ⚠️ {errors.find(e => e === step.errorTag) ? 'خطأ' : ''}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-2xl">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
          <Wind className="w-3 h-3" />
          <span>
            {currentStep === 3 && !verbOpen
              ? '🔑 المفتاح مغلق — تخطى الخطوة 3 (لا تكتب «لأنّ»)'
              : `الخطوة ${currentStep}: ${BOUSSOLE_STEPS.find(s => s.num === currentStep)?.ar}`}
          </span>
        </div>
      </div>
    </div>
  );
}