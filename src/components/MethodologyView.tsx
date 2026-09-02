import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Search, Lightbulb, SplitSquareVertical, AlertCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface VerbData {
  id: string;
  verb: string;
  french: string;
  icon: React.ReactNode;
  color: string;
  definition: string;
  steps: string[];
  example: {
    context: string;
    question: string;
    answer: string;
  };
}

const METHODOLOGY_VERBS: VerbData[] = [
  {
    id: 'analyse',
    verb: 'حَلِّل',
    french: 'Analyser',
    icon: <Search className="w-6 h-6" />,
    color: 'from-[#3b82f6] to-[#2563eb]',
    definition: 'قراءة متأنية للوثيقة (منحنى، جدول، صورة...) واستخراج المعطيات لإيجاد علاقة بين المتغيرات دون إعطاء الأسباب (إلا في التحليل المقارن).',
    steps: [
      'تقديم الوثيقة: "تمثل الوثيقة [الظاهرة المدروسة] بدلالة [المتغير] حيث نلاحظ..."',
      'تفكيك وتقسيم المعطيات: تقسيم المنحنى إلى مجالات أو الجدول إلى خانات وذكر التغيرات (تزايد، تناقص، ثبات).',
      'إيجاد العلاقة: ربط المتغيرات (كلما زاد... زاد/نقص...).',
      'الاستنتاج: استخراج حقيقة علمية أو نتيجة جزئية كخلاصة للتحليل.'
    ],
    example: {
      context: 'منحنى يمثل تغيرات سرعة التفاعل الإنزيمي بدلالة تركيز مادة التفاعل (الركيزة).',
      question: 'حلل المنحنى.',
      answer: 'تمثل الوثيقة منحنى لتغيرات سرعة التفاعل بدلالة تركيز مادة التفاعل، حيث نلاحظ:\n- في التراكيز المنخفضة: تزايد سريع لسرعة التفاعل كلما زاد تركيز الركيزة (علاقة طردية).\n- في التراكيز العالية (أكبر من س): ثبات سرعة التفاعل عند سرعة أعظمية (Vmax) رغم زيادة التركيز.\nالاستنتاج: سرعة التفاعل الإنزيمي تتأثر بتركيز الركيزة وتصل إلى حد التشبع.'
    }
  },
  {
    id: 'interpret',
    verb: 'فَسِّر',
    french: 'Interpréter',
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'from-[#f59e0b] to-[#d97706]',
    definition: 'إعطاء معنى للنتائج الملاحظة بربطها بأسبابها العلمية. الإجابة عن سؤال "لماذا؟" و"كيف؟".',
    steps: [
      'ذكر الملاحظة أو النتيجة (ماذا حدث؟).',
      'ربط النتيجة بالسبب باستخدام عبارات الربط (وهذا راجع إلى، يعود ذلك إلى، يفسر هذا بـ...).',
      'تقديم التبرير العلمي الدقيق والمفصل (من المكتسبات المعرفية).'
    ],
    example: {
      context: 'تجربة قياس نشاط إنزيم في درجات حرارة مختلفة.',
      question: 'فسر تناقص وإلغاء نشاط الإنزيم في درجة حرارة 60°م.',
      answer: 'الملاحظة: انعدام نشاط الإنزيم عند 60°م.\nالتفسير: يرجع ذلك إلى أن الحرارة المرتفعة تؤدي إلى تخريب البنية الفراغية للإنزيم (كسر الروابط غير التكافؤية)، مما يؤدي إلى فقدان الموقع الفعال لشكله المميز، وبالتالي عدم تكامل الركيزة معه وعدم تشكل المعقد (إنزيم-مادة التفاعل).'
    }
  },
  {
    id: 'deduce',
    verb: 'اسْتَنْتِج',
    french: 'Déduire',
    icon: <SplitSquareVertical className="w-6 h-6" />,
    color: 'from-[#10b981] to-[#059669]',
    definition: 'الخروج بمعلومة جديدة أو حقيقة علمية أساسية كعصارة أو نتيجة نهائية بناءً على معطيات (تحليل أو تجربة) سابقة.',
    steps: [
      'التفكير في الهدف من التجربة أو الوثيقة.',
      'صياغة جملة دقيقة ومختصرة تعبر عن الحقيقة العلمية المستخلصة.',
      'تجنب إعادة ذكر الملاحظات أو التفاصيل في الاستنتاج.'
    ],
    example: {
      context: 'إضافة مادة مشعة (أحماض أمينية مشعة) وتتبع مسارها الخلوي، فتمركز الإشعاع في الشبكة الهيولية الفعالة.',
      question: 'ماذا تستنتج؟',
      answer: 'أستنتج أن مقر تركيب البروتين في الخلية حقيقية النواة هو الشبكة الهيولية المحببة (الفعالة).'
    }
  },
  {
    id: 'hypothesis',
    verb: 'اقْتَرِحْ فَرَضِيَّة',
    french: 'Proposer une hypothèse',
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'from-[#8b5cf6] to-[#7c3aed]',
    definition: 'تقديم تفسير أو حل مؤقت لمشكلة علمية مطروحة بناءً على الملاحظات والمكتسبات، يقبل الصحة أو الخطأ ويتم التحقق منه لاحقاً.',
    steps: [
      'تحديد المشكل العلمي بدقة.',
      'صياغة جملة إخبارية تتضمن حلاً منطقياً.',
      'استخدام عبارات تفيد الاحتمال (ربما، يعود سبب ذلك إلى، قد يكون...).',
      'يجب أن تكون الفرضية وجيهة (قابلة للاختبار ومنطقية ضمن السياق).'
    ],
    example: {
      context: 'عند إضافة مادة ألفا أمانيتين للخلايا، نلاحظ توقف تركيب البروتين وتناقص كمية ARNm.',
      question: 'اقترح فرضية تفسر آلية تأثير مادة ألفا أمانيتين.',
      answer: 'الفرضية المقترحة: يعود سبب توقف تركيب البروتين إلى أن مادة ألفا أمانيتين تثبط عمل إنزيم ARNm بوليميراز، مما يمنع عملية الاستنساخ وتركيب الـ ARNm.'
    }
  }
];

export default function MethodologyView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24" dir="rtl">
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-800">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">تدريب المسعى العلمي</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium mt-1">
              أتقن أفعال الأداء لفهم الأسئلة وضمان العلامة الكاملة في البكالوريا
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5">
        {METHODOLOGY_VERBS.map((verbItem, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={verbItem.id}
            className="bg-white dark:bg-[#1a201c] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            {/* Header (Clickable) */}
            <div 
              className="p-5 md:p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => toggleExpand(verbItem.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${verbItem.color} text-white shadow-sm`}>
                  {verbItem.icon}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {verbItem.verb}
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                      {verbItem.french}
                    </span>
                  </h2>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${expandedId === verbItem.id ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Expandable Content */}
            <AnimatePresence>
              {expandedId === verbItem.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 md:p-6 pt-0 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
                    
                    {/* Definition */}
                    <div className="mb-6 mt-4">
                      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">التعريف</h3>
                      <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed bg-white dark:bg-[#1f2622] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        {verbItem.definition}
                      </p>
                    </div>

                    {/* Steps */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">خطوات الإجابة المنهجية</h3>
                      <div className="space-y-2">
                        {verbItem.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 text-gradient bg-gradient-to-br ${verbItem.color} rounded-full text-white bg-clip-text fill-transparent`} />
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Example */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 md:p-5">
                      <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        مثال تطبيقي
                      </h3>
                      
                      <div className="space-y-3 text-sm md:text-base">
                        <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                          <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0">السياق:</span>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{verbItem.example.context}</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                          <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0">السؤال:</span>
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/50 dark:bg-emerald-900/30 px-2 rounded">{verbItem.example.question}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50">
                          <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">الإجابة المنهجية:</span>
                          <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed whitespace-pre-line">
                            {verbItem.example.answer}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
    </div>
  );
}
