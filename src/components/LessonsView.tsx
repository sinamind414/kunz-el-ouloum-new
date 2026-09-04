// LessonsView.tsx
// Liste des leçons HTML du programme (23 fichiers · unités 1-11) + lecture via HtmlLessonViewer.
// Ordre canonique : OFFICIAL_PROGRAM_SEQUENCE (unitLessonSequences) — la même source que le Focus Engine.
import { useState } from 'react';
import { BookOpen, ChevronLeft } from 'lucide-react';
import HtmlLessonViewer from './HtmlLessonViewer';
import { LESSON_LIBRARY } from '../lessonData';
import { INITIAL_UNITS } from '../data';
import { getUnitLessonSequence } from '../data/unitLessonSequences';
import { getNextHtmlLessonKey } from '../data/htmlLessonProgression';

// Les clés HTML sont celles qui ont un fichier dans public/lessons (les autres sont des leçons actives TS).
const hasHtmlFile = (key: string): boolean => key === 'lecon_transcription' || key.startsWith('phase');

const lessonTitleAr = (key: string): string => {
  const l = LESSON_LIBRARY.find((x) => x.key === key);
  return l ? String(l.titleAr) : key;
};

export default function LessonsView() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number>(1);

  const unitLessons = getUnitLessonSequence(selectedUnit).filter(hasHtmlFile);

  // Leçon suivante dans l'ordre canonique global de l'unité, sinon première de l'unité d'après
  const goNext = (currentKey: string) => {
    const inUnit = getUnitLessonSequence(selectedUnit).filter(hasHtmlFile);
    const idx = inUnit.indexOf(currentKey);
    if (idx >= 0 && idx < inUnit.length - 1) {
      const nextKey = inUnit[idx + 1];
      setSelectedLesson(nextKey);
      return { nextKey };
    }
    const nextUnit = INITIAL_UNITS.find((u) => u.id > selectedUnit);
    if (nextUnit) {
      setSelectedUnit(nextUnit.id);
      const firstKey = getUnitLessonSequence(nextUnit.id).filter(hasHtmlFile)[0];
      if (firstKey) {
        setSelectedLesson(firstKey);
        return { nextKey: firstKey };
      }
    }
    return null;
  };

  if (selectedLesson) {
    const nextInUnit = (() => {
      const inUnit = getUnitLessonSequence(selectedUnit).filter(hasHtmlFile);
      const idx = inUnit.indexOf(selectedLesson);
      return idx >= 0 && idx < inUnit.length - 1 ? inUnit[idx + 1] : undefined;
    })();
    return (
      <HtmlLessonViewer
        lessonKey={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onNext={nextInUnit ? () => setSelectedLesson(nextInUnit) : undefined}
        nextTitleAr={nextInUnit ? lessonTitleAr(nextInUnit) : undefined}
      />
    );
  }

  return (
    <div dir="rtl" className="space-y-5">
      <div className="bg-gradient-to-l from-[#006d37] via-[#008744] to-[#10b981] text-white p-5 md:p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>دروس السنة الثالثة ثانوي — علوم الطبيعة والحياة</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black">📚 قائمة الدروس</h1>
        <p className="text-white/90 text-sm mt-1 font-medium">
          23 درساً مفصّلاً مطابقاً للمنهاج الرسمي · اختر الوحدة ثم الدرس
        </p>
      </div>

      {/* Sélecteur d'unité */}
      <div className="flex flex-wrap gap-2">
        {INITIAL_UNITS.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUnit(u.id)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition-all border ${
              selectedUnit === u.id
                ? 'bg-[#006d37] text-white border-[#006d37] shadow-md'
                : 'bg-white dark:bg-[#161c18] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:border-emerald-400'
            }`}
          >
            {u.id}. {u.title}
          </button>
        ))}
      </div>

      {/* Leçons de l'unité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {unitLessons.length === 0 && (
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 col-span-2 text-center py-6">
            لا توجد دروس HTML في هذه الوحدة بعد.
          </p>
        )}
        {unitLessons.map((key, i) => (
          <button
            key={key}
            onClick={() => setSelectedLesson(key)}
            className="group p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161c18] hover:border-emerald-400 hover:shadow-md transition-all text-right flex items-center gap-3"
          >
            <span className="shrink-0 w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006d37] dark:text-emerald-300 font-black flex items-center justify-center text-sm">
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">
              {lessonTitleAr(key)}
            </span>
            <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
