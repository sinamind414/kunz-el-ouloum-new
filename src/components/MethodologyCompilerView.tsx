import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Sparkles, BookOpen, Layers, CheckCircle2, AlertTriangle, 
  Clock, ShieldAlert, ArrowLeft, ArrowRight, RotateCcw, 
  HelpCircle, Check, X, Award, ChevronDown, ChevronUp, Cpu, 
  Calendar, FileText, CheckSquare, Zap, Eye, Lightbulb, Compass, Key
} from 'lucide-react';
import { 
  VERB_CARDS, UNIVERSAL_GRAMMAR_RULES, TRAINING_EXERCISES, 
  ERROR_TAXONOMY, VerbCard, TrainingExercise, Switch, StepId, STEP_NAMES_AR 
} from '../data/methodologyEngine';
import { evaluateStudentProduction, ScoreReport, SwitchLine, StepLine } from '../utils/methodologyScorer';
import { logProduction, getProductionLogs, getVerbEvolution, VerbEvolutionStats, ProductionLogEntry, ERROR_TAG_LABELS_AR } from '../utils/methodologyLog';
import ProductionEvolutionPanel from './ProductionEvolutionPanel';
import StepFlow from './StepFlow';
import SwitchGateModal from './SwitchGateModal';
import ErrorMap from './ErrorMap';
import { BOUSSOLE_STEPS, REGLE_D_OR_AR, getStepData } from '../data/boussoleData';

interface MethodologyProps {
  onBackToHome?: () => void;
}

export default function MethodologyCompilerView({ onBackToHome }: MethodologyProps) {
  // Navigation Tabs: 'engine_rules' (Couche 0) | 'verbs_ref' (Fiches) | 'simulator' (4 Stades) | 'mastery_matrix' (Analytics & Erreurs)
  const [activeTab, setActiveTab] = useState<'simulator' | 'verbs_ref' | 'engine_rules' | 'mastery_matrix'>('simulator');

  // Selected Verb & Exercise for Training
  const [selectedVerbId, setSelectedVerbId] = useState<string>('verb_analyse_v1');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('ex_analyse_protein_01');
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);
  const [switchChoice, setSwitchChoice] = useState<Switch | null>(null);
  const [showSwitchGate, setShowSwitchGate] = useState(false);

  // Stage 1: Modelage State
  const [highlightedSteps, setHighlightedSteps] = useState<Record<number, boolean>>({});
  const [activeHighlighterColor, setActiveHighlighterColor] = useState<string>('blue');

  // Stage 2: Complétion State
  const [clozeAnswers, setClozeAnswers] = useState<Record<string, string>>({});
  const [clozeSubmitted, setClozeSubmitted] = useState<boolean>(false);

  // Stage 3 & 4: Production States
  const [studentText, setStudentText] = useState<string>('');
  const [selectedEvidenceForCriterion, setSelectedEvidenceForCriterion] = useState<Record<string, boolean>>({});
  const [isBoussoleOpen, setIsBoussoleOpen] = useState<boolean>(true);

  // Stage 4: 90 Seconds Draft & Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [draftVerb, setDraftVerb] = useState<string>('');
  const [draftSteps, setDraftSteps] = useState<string>('');
  const [draftFinalSentence, setDraftFinalSentence] = useState<string>('');
  const [isDraftCompleted, setIsDraftCompleted] = useState<boolean>(false);

  // Evaluation & Results
  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);

  // Expanded verb in verbs_ref
  const [expandedVerbCardId, setExpandedVerbCardId] = useState<string | null>('verb_analyse_v1');

  // Carnet de bord : historique des productions & diagnostic d'évolution
  const [evolutionVersion, setEvolutionVersion] = useState(0); // bump pour rafraîchir le diagnostic

  // Local storage stats & matrix
  const [matrixScores, setMatrixScores] = useState<Record<string, Record<string, number>>>({
    verb_analyse_v1: { protein_synthesis: 92, enzymology: 85, immunology: 68, neuro_comm: 84, regulations: 0, energy_transformations: 0, geodynamics: 0 },
    verb_explain_v1: { protein_synthesis: 71, enzymology: 88, immunology: 64, neuro_comm: 79, regulations: 0, energy_transformations: 0, geodynamics: 0 },
    verb_compare_v1: { protein_synthesis: 80, enzymology: 90, immunology: 87, neuro_comm: 62, regulations: 0, energy_transformations: 0, geodynamics: 0 },
    verb_hypothesis_v1: { protein_synthesis: 75, enzymology: 80, immunology: 70, neuro_comm: 65, regulations: 0, energy_transformations: 0, geodynamics: 0 }
  });

  const [weeklyErrorCounters, setWeeklyErrorCounters] = useState<Record<string, number>>({
    missing_unit: 4,
    premature_interpretation: 3,
    missing_reference: 2,
    missing_conclusion: 1
  });

  const currentVerb = VERB_CARDS.find(v => v.id === selectedVerbId) || VERB_CARDS[0];
  const currentExercise = TRAINING_EXERCISES.find(e => e.id === selectedExerciseId) || null;

  // Diagnostic d'évolution : statistiques par verbe depuis le carnet de bord
  const evolutionStats: VerbEvolutionStats[] = React.useMemo(
    () => VERB_CARDS.map(v => getVerbEvolution(v.id)).filter((s): s is VerbEvolutionStats => s !== null),
    [evolutionVersion]
  );
  const currentVerbStats = getVerbEvolution(selectedVerbId);

  // Timer Effect for Stage 4
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Handle stage change
const handleSelectStage = (stage: 1 | 2 | 3 | 4) => {
     if (!currentExercise) return;
     setCurrentStage(stage);
     setScoreReport(null);
     setSwitchChoice(null);
     if (stage === 3) {
       setShowSwitchGate(true);
     } else if (stage === 4) {
       setTimerSeconds(currentExercise.stage4.timeLimitSec);
       setIsTimerRunning(true);
       setIsDraftCompleted(false);
     } else {
       setIsTimerRunning(false);
     }
   };

  // Submit Stage 1
  const handleCheckStage1 = () => {
    if (!currentExercise) return;
    const totalSegments = currentExercise.stage1.segments.length;
    const count = Object.keys(highlightedSteps).length;
    if (count >= totalSegments) {
      const rep = evaluateStudentProduction(selectedVerbId, currentExercise.stage1.expertAnswer, undefined, 1, { switchChoice });
      setScoreReport(rep);
    }
  };

  // Submit Stage 2
  const handleCheckStage2 = () => {
    if (!currentExercise) return;
    setClozeSubmitted(true);
    let fullText = currentExercise.stage2.clozePrompt;
    currentExercise.stage2.blanks.forEach(b => {
      fullText = fullText.replace(`{{${b.id}}}`, clozeAnswers[b.id] || '');
    });
    const rep = evaluateStudentProduction(selectedVerbId, fullText, undefined, 2, { switchChoice });
    setScoreReport(rep);
    // Carnet de bord : archiver la production complétée (diagnostic d'évolution)
    logProduction({
      verbId: selectedVerbId,
      verbAr: currentVerb.verbAr,
      theme: currentExercise.theme,
      stage: 2,
      text: fullText,
      icm: rep.icm,
      criteriaSummary: rep.criteriaResults.map(c => ({ label: c.label, passed: c.passed })),
      errorTags: rep.detectedErrors.map(e => e.tag),
    });
    setEvolutionVersion(v => v + 1);

    // Lot 0011: stage 2 errors also update weekly error counters
    if (rep.detectedErrors.length > 0) {
      setWeeklyErrorCounters(prev => {
        const nextCounters = { ...prev };
        rep.detectedErrors.forEach(err => {
          nextCounters[err.tag] = (nextCounters[err.tag] || 0) + 1;
        });
        return nextCounters;
      });
    }
  };

  // Submit Stage 3 or 4
  const handleSubmitProduction = () => {
    if (!currentExercise) return;
    const draft = {
      verb: draftVerb,
      steps: draftSteps,
      finalSentence: draftFinalSentence
    };
    const rep = evaluateStudentProduction(selectedVerbId, studentText, draft, currentStage, { switchChoice });
    setScoreReport(rep);

    // Carnet de bord : archiver le brouillon complet de l'élève (texte + résumé)
    const fullDraft = `${studentText}${draftVerb || draftSteps || draftFinalSentence ? `\n— البطاقة: ${[draftVerb, draftSteps, draftFinalSentence].filter(Boolean).join(' · ')}` : ''}`.trim();
    logProduction({
      verbId: selectedVerbId,
      verbAr: currentVerb.verbAr,
      theme: currentExercise.theme,
      stage: currentStage === 4 ? 4 : 3,
      text: fullDraft,
      icm: rep.icm,
      criteriaSummary: rep.criteriaResults.map(c => ({ label: c.label, passed: c.passed })),
      errorTags: rep.detectedErrors.map(e => e.tag),
      durationSec: isTimerRunning ? timerSeconds : undefined,
    });
    setEvolutionVersion(v => v + 1);

    // Update matrix score & error counters
    if (currentExercise.theme) {
      setMatrixScores(prev => ({
        ...prev,
        [selectedVerbId]: {
          ...(prev[selectedVerbId] || {}),
          [currentExercise.theme]: rep.icm
        }
      }));
    }

    if (rep.detectedErrors.length > 0) {
      setWeeklyErrorCounters(prev => {
        const nextCounters = { ...prev };
        rep.detectedErrors.forEach(err => {
          nextCounters[err.tag] = (nextCounters[err.tag] || 0) + 1;
        });
        return nextCounters;
      });
    }
  };

  // Reprendre un brouillon archivé (diagnostic → simulateur)
  const handleResumeDraft = (entry: ProductionLogEntry) => {
    setSelectedVerbId(entry.verbId);
    const ex = TRAINING_EXERCISES.find(e => e.verbId === entry.verbId && e.theme === entry.theme)
      || TRAINING_EXERCISES.find(e => e.verbId === entry.verbId)
      || TRAINING_EXERCISES[0];
    setSelectedExerciseId(ex.id);
    setCurrentStage(entry.stage === 2 ? 2 : 4);
    // Restaurer le texte (retirer le résumé « البطاقة » stocké après la ligne)
    const restoredText = entry.text.split('\n— البطاقة:')[0];
    setStudentText(restoredText);
    const draftPart = entry.text.includes('— البطاقة:') ? entry.text.split('— البطاقة:')[1].split(' · ') : [];
    setDraftVerb(draftPart[0] || '');
    setDraftSteps(draftPart[1] || '');
    setDraftFinalSentence(draftPart[2] || '');
    setIsDraftCompleted(!!restoredText);
    setScoreReport(null);
    setActiveTab('simulator');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset exercise
  const handleResetExercise = () => {
    setStudentText('');
    setHighlightedSteps({});
    setClozeAnswers({});
    setClozeSubmitted(false);
    setScoreReport(null);
    setDraftVerb('');
    setDraftSteps('');
    setDraftFinalSentence('');
    setIsDraftCompleted(false);
    if (currentStage === 4 && currentExercise) {
      setTimerSeconds(currentExercise.stage4.timeLimitSec);
      setIsTimerRunning(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 md:p-6 pb-28 text-right font-sans" dir="rtl">
      
      {/* Header Banner: Le Compilateur SVT */}
      <header className="bg-gradient-to-r from-[#006d37] via-[#008744] to-[#10b981] text-white p-5 md:p-7 rounded-3xl shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>نظام التجميع البيداغوجي الموحد (Compilateur SVT)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">محرك المنهجية الخوارزمي للبكالوريا</h1>
            <p className="text-white/90 text-sm md:text-base mt-1 max-w-2xl font-medium">
              تحويل المنهجية من حفظ نظري إلى نظام آلي محكم: مدخلات متغيرة ➔ محرك ثابت ➔ مخرجات مطابقة لعلامة 20/20.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="text-center px-3 border-l border-white/20">
              <span className="block text-[11px] text-white/80 font-bold">مؤشر ICM الحالي</span>
              <span className="text-xl md:text-2xl font-black text-[#fed65b]">88%</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-[11px] text-white/80 font-bold">المرحلة النشطة</span>
              <span className="text-sm md:text-base font-black text-white">المستوى {currentStage} / 4</span>
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-4 border-t border-white/20 no-scrollbar">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-white text-[#006d37] shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>بوصلة NSOE</span>
          </button>

          <button
            onClick={() => setActiveTab('verbs_ref')}
            className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'verbs_ref'
                ? 'bg-white text-[#006d37] shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>فهرس الأفعال الـ 12 والنماذج</span>
          </button>

          <button
            onClick={() => setActiveTab('mastery_matrix')}
            className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'mastery_matrix'
                ? 'bg-white text-[#006d37] shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مصفوفة الإتقان وخريطة الرياح</span>
          </button>

          <button
            onClick={() => setActiveTab('engine_rules')}
            className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'engine_rules'
                ? 'bg-white text-[#006d37] shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>قواعد الإجابة الـ 4 (الطبقة 0)</span>
          </button>
        </div>
      </header>

      {/* TAB 1: 4-STAGE FADING SIMULATOR */}
      {activeTab === 'simulator' && (
        <section className="space-y-6">
          {/* Top Stage Progression Bar */}
          <div className="bg-white dark:bg-[#161c18] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-500 dark:text-gray-400">فعل الأداء:</span>
                <select
                  value={selectedVerbId}
                  onChange={(e) => {
                    setSelectedVerbId(e.target.value);
                    const matchingEx = TRAINING_EXERCISES.find(ex => ex.verbId === e.target.value);
                    if (matchingEx) setSelectedExerciseId(matchingEx.id);
                    handleResetExercise();
                  }}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-black text-gray-900 dark:text-white px-3 py-1.5 rounded-xl text-sm"
                >
                  {VERB_CARDS.map(v => (
                     <option key={v.id} value={v.id}>{v.verbAr}</option>
                  ))}
                </select>
              </div>

              {(() => {
                const verbExercises = TRAINING_EXERCISES.filter(ex => ex.verbId === selectedVerbId);
                if (verbExercises.length <= 1) return null;
                return (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-500 dark:text-gray-400">الوثيقة:</span>
                    <select
                      value={selectedExerciseId}
                      onChange={(e) => {
                        setSelectedExerciseId(e.target.value);
                        handleResetExercise();
                      }}
                      className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-black text-gray-900 dark:text-white px-3 py-1.5 rounded-xl text-sm"
                    >
                      {verbExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.themeAr} — {ex.supportTitle}</option>
                      ))}
                    </select>
                  </div>
                );
              })()}

              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                القاعدة: لا نسحب وسيلتي مساعدة في نفس الوقت
              </div>
            </div>

            {/* Indicateur d'évolution du verbe sélectionné */}
            {currentVerbStats && (
              <div className="flex flex-wrap items-center gap-2 pt-1 px-1">
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400">تطورك في هذا الفعل:</span>
                <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5">
                  {currentVerbStats.attempts} محاولات
                </span>
                <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5">
                  آخر علامة: {currentVerbStats.last}%
                </span>
                {currentVerbStats.delta !== null && (
                  <span className={`text-[10px] font-black rounded-full px-2 py-0.5 ${currentVerbStats.delta > 0 ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' : currentVerbStats.delta < 0 ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    {currentVerbStats.delta > 0 ? '▲ +' : currentVerbStats.delta < 0 ? '▼ ' : '＝ '}{currentVerbStats.delta}
                  </span>
                )}
                <span className="text-[9px] text-gray-400 dark:text-gray-600 font-bold">(محفوظ محلياً — شخّص تطورك في «مصفوفة الإتقان»)</span>
              </div>
            )}

            {/* 4 Stages Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              {[
                { num: 1, title: 'النمذجة (Modelage)', desc: 'تحديد خطوات الخبير بالألوان' },
                { num: 2, title: 'الإكمال (Complétion)', desc: 'ملء الفراغات مع روابط جاهزة' },
                { num: 3, title: 'إنتاج موجه (Guidée)', desc: 'كتابة مع البوصلة والإثبات' },
                { num: 4, title: 'محاكاة البكالوريا', desc: 'توقيت + مسودة 90ث + بدون مساعدة' }
              ].map(st => (
                <button
                  key={st.num}
                  onClick={() => handleSelectStage(st.num as any)}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    currentStage === st.num
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      currentStage === st.num ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {st.num}
                    </span>
                    {currentStage === st.num && (
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">نشط</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white">{st.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{st.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Switch Gate Modal — stage 3+ only */}
              {showSwitchGate && currentExercise && (
                <SwitchGateModal
                  verb={currentVerb.verbAr}
                  verbAr={currentVerb.verbAr}
                  onSwitch={(allowsBecause) => {
                    setSwitchChoice(allowsBecause ? 'open' : 'closed');
                    setShowSwitchGate(false);
                  }}
                  onSkip={() => {
                    setSwitchChoice(null);
                    setShowSwitchGate(false);
                  }}
                />
              )}

              {/* Current Exercise Subject Context */}
          {currentExercise ? (
          <div className="bg-white dark:bg-[#161c18] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#006d37] text-white px-2.5 py-1 rounded-lg text-xs font-black">
                  {currentExercise.themeAr}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {currentExercise.supportTitle}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-400">
                السند: {currentExercise.supportType === 'schema' ? 'مخطط' : currentExercise.supportType}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                <strong className="text-gray-900 dark:text-white">السياق العلمي: </strong>
                {currentExercise.context}
              </p>

              {currentExercise.dataSnippet && (
                <div className="bg-emerald-50/70 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs md:text-sm font-medium text-emerald-950 dark:text-emerald-200 whitespace-pre-line">
                  {currentExercise.dataSnippet}
                </div>
              )}

              {currentExercise.diagramUrl && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1b221e]">
                  <img
                    src={currentExercise.diagramUrl}
                    alt={currentExercise.supportTitle}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-black text-amber-800 dark:text-amber-400 block mb-0.5">التعليمة المستهدفة:</span>
                  <p className="text-sm md:text-base font-black text-gray-900 dark:text-white">
                    {currentExercise.question}
                  </p>
                </div>
                <div className="p-2 bg-amber-200/50 dark:bg-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-black shrink-0">
                  {currentVerb.verbAr}
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="bg-white dark:bg-[#161c18] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                اختر حلّل / فسّر / قارن للتدريب — أو راجع بطاقات الأفعال
              </p>
            </div>
          )}

          {/* STAGE 1: MODELAGE (النمذجة بالخطوات والألوان) */}
          {currentStage === 1 && currentExercise && (
            <div className="bg-white dark:bg-[#161c18] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>المرحلة 1: النمذجة (استكشاف خطوات الإجابة النموذجية)</span>
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    اقرأ إجابة الخبير، وانقر على الأجزاء لتحديد كل خطوة من خطوات هيكل الفعل.
                  </p>
                </div>
              </div>

              {/* Steps Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {currentExercise.stage1.segments.map((seg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                      highlightedSteps[seg.stepNumber] 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>الخطوة {seg.stepNumber}: {currentVerb.structureSteps[idx] || 'خطوة هيكلية'}</span>
                    {highlightedSteps[seg.stepNumber] ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"></span>
                    )}
                  </div>
                ))}
              </div>

              {/* Expert Answer with Clickable Segments */}
              <div className="p-5 bg-gray-50 dark:bg-[#121614] rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 leading-relaxed text-sm md:text-base">
                {currentExercise.stage1.segments.map((seg, idx) => {
                  const isMarked = highlightedSteps[seg.stepNumber];
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setHighlightedSteps(prev => ({ ...prev, [seg.stepNumber]: true }))}
                      className={`p-3 rounded-xl cursor-pointer border transition-all ${
                        isMarked 
                          ? `${seg.colorClass} border-transparent shadow-sm` 
                          : 'bg-white dark:bg-[#1b221e] border-gray-200 dark:border-gray-700 hover:border-emerald-400 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-1">
                        <span>الخطوة {seg.stepNumber} (انقر للتحديد)</span>
                        {isMarked && <span className="text-emerald-600 font-bold">تم التعرف عليها ✓</span>}
                      </div>
                      <p className="font-medium whitespace-pre-line">{seg.text}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setHighlightedSteps({ 1: true, 2: true, 3: true, 4: true })}
                  className="text-xs font-bold text-gray-500 hover:text-emerald-600"
                >
                  كشف جميع الخطوات
                </button>

                <button
                  onClick={() => handleSelectStage(2)}
                  className="px-5 py-2.5 bg-[#006d37] hover:bg-[#00562b] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm"
                >
                  <span>الانتقال للمرحلة 2 (الإكمال)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: CLOZE COMPLETION (الإكمال مع روابط جاهزة) */}
          {currentStage === 2 && currentExercise && (
            <div className="bg-white dark:bg-[#161c18] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-amber-600" />
                    <span>المرحلة 2: الإكمال (الشكل جاهز والمجهود على المضمون)</span>
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    الروابط المنهجية موجودة سلفاً، املأ الفراغات بالمعطيات العلمية والوحدات المطلوبة.
                  </p>
                </div>
              </div>

              {/* Interactive Cloze Inputs Form */}
              <div className="space-y-4">
                {currentExercise.stage2.blanks.map((b, idx) => (
                  <div key={b.id} className="p-4 bg-gray-50 dark:bg-[#121614] rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        الفراغ ({idx + 1}): {b.hint}
                      </span>
                      {clozeSubmitted && (
                        <span className="text-xs font-bold text-gray-500">
                          المتوقع: {b.expectedText}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={clozeAnswers[b.id] || ''}
                      onChange={(e) => setClozeAnswers({ ...clozeAnswers, [b.id]: e.target.value })}
                      placeholder={`اكتب هنا: ${b.hint}...`}
                      className="w-full bg-white dark:bg-[#1a221d] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleCheckStage2}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm"
                >
                  فحص الإجابة وحساب ICM
                </button>

                <button
                  onClick={() => handleSelectStage(3)}
                  className="px-5 py-2.5 bg-[#006d37] hover:bg-[#00562b] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm"
                >
                  <span>الانتقال للمرحلة 3 (الإنتاج الموجّه)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3 & 4: GUIDED & CONSTRAINED PRODUCTION */}
          {(currentStage === 3 || currentStage === 4) && currentExercise && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Main Writing Area (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Stage 4 Special Banner: 90s Draft + Timer */}
                {currentStage === 4 && (
                  <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-4 rounded-2xl shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 animate-pulse" />
                        <span className="font-black text-sm">محاكاة البكالوريا (توقيت رسمي)</span>
                      </div>
                      <div className="font-mono text-xl font-black bg-black/30 px-3 py-1 rounded-xl">
                        {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                      </div>
                    </div>

                    {/* Compulsory 90s Draft Accordion */}
                    <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/20 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span>مخطط المسودة الإلزامي (تقنية الـ 90 ثانية في البكالوريا)</span>
                        <span className={isDraftCompleted ? 'text-emerald-300 font-bold' : 'text-amber-200'}>
                          {isDraftCompleted ? '✓ مسودة مكتملة' : 'مطلوب للمحاكاة'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={draftVerb}
                          onChange={(e) => setDraftVerb(e.target.value)}
                          placeholder="الفعل المحدد (مثلاً: حَلل)"
                          className="bg-black/20 border border-white/20 rounded-lg p-2 text-white placeholder-white/60 text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={draftSteps}
                          onChange={(e) => setDraftSteps(e.target.value)}
                          placeholder="الـ 4 خطوات المتوقعة"
                          className="bg-black/20 border border-white/20 rounded-lg p-2 text-white placeholder-white/60 text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={draftFinalSentence}
                          onChange={(e) => {
                            setDraftFinalSentence(e.target.value);
                            if (draftVerb && draftSteps && e.target.value) setIsDraftCompleted(true);
                          }}
                          placeholder="الهدف من الجملة الختامية"
                          className="bg-black/20 border border-white/20 rounded-lg p-2 text-white placeholder-white/60 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Area */}
                <div className="bg-white dark:bg-[#161c18] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>محرر الإجابة النموذجية المكتوبة:</span>
                    </label>
                    <span className="text-xs font-bold text-gray-400">
                      {studentText.split(/\s+/).filter(Boolean).length} كلمة
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    value={studentText}
                    onChange={(e) => setStudentText(e.target.value)}
                    placeholder={`اكتب صياغتك المنهجية الكاملة هنا...\nمثال: تمثل الوثيقة... حيث نلاحظ في المجال الأول... الاستنتاج: ...`}
                    className="w-full bg-gray-50 dark:bg-[#121614] border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm md:text-base text-gray-900 dark:text-white font-medium leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none"
                  />

                   {/* Actions & Submit */}
                   <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                     <button
                       onClick={() => currentExercise && setStudentText(currentExercise.stage1.expertAnswer)}
                       className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-emerald-600"
                     >
                       إدراج نص تجريبي للاختبار
                     </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetExercise}
                        className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        title="إعادة تعيين"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSubmitProduction}
                        disabled={studentText.trim().length === 0}
                        className="px-6 py-2.5 bg-[#006d37] hover:bg-[#00562b] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-[#fed65b]" />
                        <span>تقييم الإجابة وحساب ICM</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar: Checklist-Boussole with Self-Proof (4 cols on lg) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-[#161c18] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h4 className="font-black text-sm text-gray-900 dark:text-white">البوصلة المنهجية</h4>
                        <span className="text-[11px] text-gray-400">توجيه قبلي وتأكيد بالإثبات</span>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                      {Object.values(selectedEvidenceForCriterion).filter(Boolean).length} / {currentVerb.criteria.length}
                    </span>
                  </div>

                  {/* Single Column Checklist (Constraint: Une seule colonne) */}
                  <div className="space-y-3">
                    {currentVerb.criteria.map((cr, idx) => {
                      const isChecked = selectedEvidenceForCriterion[cr.id];
                      return (
                        <div
                          key={cr.id}
                          onClick={() => {
                            setSelectedEvidenceForCriterion(prev => ({
                              ...prev,
                              [cr.id]: !prev[cr.id]
                            }));
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/80 text-emerald-900 dark:text-emerald-200 shadow-sm'
                              : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold">{cr.wording.compass}</p>
                              <div className="text-[11px] text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded">
                                <span className="text-emerald-600 font-bold">السؤال السابر: </span>
                                {cr.wording.probe}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

{/* Switch Gate Indicator */}
                    {currentStage >= 3 && (
                      <div className={`mt-3 p-3 rounded-xl border text-xs ${
                        switchChoice === 'open' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40' :
                        switchChoice === 'closed' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40' :
                        'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      }`}>
                        <div className="font-bold mb-1">🔑 المفتاح</div>
                        {switchChoice === null ? (
                          <span className="opacity-70">اختر ما إذا كان الفعل يسمح بـ«لأنّ»</span>
                        ) : (
                          <span>
                            الفعل: <span className="font-black">{switchChoice === 'open' ? 'مفتوح' : 'مغلق'}</span>
                            <span className="ml-1">
                              {switchChoice === 'open' ? '«لأنّ» مطلوبة' : 'لا «لأنّ»'}
                            </span>
                          </span>
                        )}
</div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EVALUATION REPORT & ICM CALCULATION RESULTS */}
          {scoreReport && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#161c18] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">تقرير التدقيق المنهجي</span>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    <span>مؤشر المطابقة المنهجية (ICM)</span>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-5 py-2.5 rounded-2xl text-center font-black ${
                    scoreReport.icm >= 90
                      ? 'bg-emerald-500 text-white'
                      : scoreReport.icm >= 60
                      ? 'bg-amber-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    <span className="text-2xl md:text-3xl block leading-none">{scoreReport.icm}%</span>
                    <span className="text-[10px] uppercase">معدل ICM</span>
                  </div>
                </div>
              </div>

              {/* Pedagogical Decision Engine Result */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-black text-sm text-emerald-900 dark:text-emerald-300">قرار محرك التوجيه البيداغوجي:</h4>
                  <p className="text-xs md:text-sm text-emerald-800 dark:text-emerald-400 font-medium mt-0.5">
                    {scoreReport.pedagogicalDecisionAr}
                  </p>
                  {scoreReport.nextPedagogicalStage !== currentStage && (
                    <button
                      onClick={() => handleSelectStage(scoreReport.nextPedagogicalStage)}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#006d37] hover:bg-[#00562b] text-white rounded-xl text-xs font-black shadow-sm"
                    >
                      الانتقال إلى المرحلة {scoreReport.nextPedagogicalStage} الآن
                    </button>
                  )}
                </div>
              </div>

              {/* 🔑 Ligne interrupteur */}
              {scoreReport.switchLine && (() => {
                const s = scoreReport.switchLine;
                const switchTone = (s: typeof s) =>
                  s.violated ? 'red'
                  : s.choiceCorrect === false ? 'amber'
                  : 'emerald';
                const TONE = {
                  red:     'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-200',
                  amber:   'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-200',
                  emerald: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200',
                  muted:   'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-400',
                } as const;
                const swAr = (s: 'open' | 'closed') => (s === 'open' ? 'مفتوح' : 'مغلق');
                return (
                  <div dir="rtl" className={`p-4 rounded-2xl border text-sm space-y-2 ${TONE[switchTone(s)]}`}>
                    <div className="flex items-center gap-2 font-bold">
                      <Key className="w-4 h-4" />
                      <span>المفتاح</span>
                      <span className="mx-1 text-gray-400">·</span>
                      <span>الفعل: <span className="font-black">{swAr(s.truth)}</span></span>
                      <span className="text-xs font-normal opacity-70">
                        {s.truth === 'open' ? '— «لأنّ» مطلوبة' : '— لا «لأنّ»'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap text-xs">
                      {s.choice !== null && (
                        <span>
                          اختيارك: <span className="font-black">{swAr(s.choice)}</span>{' '}
                          <span className="font-bold">{s.choiceCorrect ? '✓' : '✗'}</span>
                        </span>
                      )}
                      <span className="font-bold">
                        {s.violated ? `✗ ${ERROR_TAXONOMY[s.truth === 'closed' ? 'premature_interpretation' : 'unsupported_claim'].nameAr}`
                                    : '✓ احترمتَ الفعل'}
                      </span>
                    </div>
                    {s.remedyAr && (
                      <div className="pt-1 border-t border-current/10 font-bold">
                        الدواء: <span className="font-normal">{s.remedyAr}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Les 4 étapes */}
              <div dir="rtl" className="space-y-2">
                <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>الخطوات الأربع</span>
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {scoreReport.stepReport.map((sl: StepLine) => {
                    const tone = !sl.applicable ? 'muted' : sl.passed ? 'emerald' : 'red';
                    const isSwitchStep = sl.step === 3;
                    const truth = scoreReport.switchLine.truth;
                    return (
                      <div key={sl.step} className={`p-3 rounded-xl border text-center text-xs ${TONE[tone]}`}>
                        <div className="font-black text-lg leading-none">{sl.step}</div>
                        <div className="font-bold text-sm mt-1">{STEP_NAMES_AR[sl.step]}</div>
                        {isSwitchStep && (
                          <div className={`mt-1 inline-block px-1.5 rounded text-[10px] font-bold ${
                            truth === 'open' ? 'bg-emerald-200/60 dark:bg-emerald-900/60' : 'bg-gray-200/80 dark:bg-gray-700 line-through'
                          }`}>
                            «لأنّ»
                          </div>
                        )}
                        <div className="mt-1 font-bold text-[11px]">
                          {!sl.applicable ? 'لا تُكتب هنا' : sl.passed ? '✓' : '✗'}
                        </div>
                        {sl.errorTags.length > 0 && (
                          <div className="mt-1 space-y-0.5 text-[11px]">
                            {sl.errorTags.map(tag => (
                              <div key={tag} className="bg-red-200/60 dark:bg-red-900/60 px-1 rounded">
                                {ERROR_TAXONOMY[tag]?.nameAr ?? 'ملاحظة منهجية'}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {(() => {
                  const first = scoreReport.stepReport.find(s => s.applicable && !s.passed && s.remedyAr);
                  return first ? (
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border text-sm">
                      <span className="font-bold">ابدأ بالخطوة {first.step} ({STEP_NAMES_AR[first.step]}) : </span>
                      {first.remedyAr}
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Criteria hits list */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">تدقيق معايير السيكل الخاص بفعل ({currentVerb.verbAr}):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scoreReport.criteriaResults.map(res => (
                    <div
                      key={res.criterionId}
                      className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                        res.passed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                          : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          {res.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                          <span>{res.label}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400">{res.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Errors & Counter-actions */}
              {scoreReport.detectedErrors.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>الأخطاء المنهجية المرصودة وخطة التصحيح الفوري:</span>
                  </h4>
                  <div className="space-y-2">
                    {scoreReport.detectedErrors.map((err, idx) => (
                      <div key={idx} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/40 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-red-800 dark:text-red-300">
                          <span>{err.nameAr}</span>
                          <span className="text-[10px] bg-red-200/60 dark:bg-red-900/60 px-2 py-0.5 rounded font-mono">{err.tag}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{err.descriptionAr}</p>
                        <div className="pt-1 text-emerald-700 dark:text-emerald-400 font-bold">
                          <span>الإجراء العلاجي المطلوب: </span>
                          <span>{err.counterActionAr}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </section>
      )}

      {/* TAB 2: VERB CARDS DIRECTORY & ANNOTATED COUNTER-EXAMPLES */}
      {activeTab === 'verbs_ref' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">فهرس الأفعال الثمانية الموحدة</h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                فيشة معيارية لكل فعل تشمل: الهيكل الإلزامي، الروابط، المحظورات، ونموذج الخطأ المعلم.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {VERB_CARDS.map((verbCard) => {
              const isExpanded = expandedVerbCardId === verbCard.id;
              return (
                <div 
                  key={verbCard.id}
                  className="bg-white dark:bg-[#161c18] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                  <div 
                    onClick={() => setExpandedVerbCardId(isExpanded ? null : verbCard.id)}
                    className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                        {verbCard.verbAr.slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          {verbCard.verbAr}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{verbCard.goal}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVerbId(verbCard.id);
                          const ex = TRAINING_EXERCISES.find(item => item.verbId === verbCard.id);
                          if (ex) setSelectedExerciseId(ex.id);
                          setActiveTab('simulator');
                        }}
                        className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>تدريب المحاكي</span>
                      </button>

                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Verb Details */}
                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 space-y-5">
                      
                      {/* Structure Steps & Connectors */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-white dark:bg-[#1b221e] rounded-xl border border-gray-200 dark:border-gray-700/60 space-y-2">
                          <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <Layers className="w-4 h-4" />
                            <span>الهيكل الإلزامي (3 إلى 4 خطوات):</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                            {verbCard.structureSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-white dark:bg-[#1b221e] rounded-xl border border-gray-200 dark:border-gray-700/60 space-y-2">
                          <h4 className="font-bold text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>الروابط اللفظية الإلزامية:</span>
                          </h4>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {verbCard.requiredConnectors.map((conn, idx) => (
                              <span key={idx} className="bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100 dark:border-blue-900/50">
                                {conn}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Model Example vs Annotated Counter-Example */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* 100% Good Example */}
                        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>إجابة نموذجية ممتازة</span>
                            </span>
                            <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                              100% (20/20)
                            </span>
                          </div>
                          <p className="text-xs text-gray-800 dark:text-gray-200 font-medium whitespace-pre-line leading-relaxed">
                            {verbCard.goodExample.answer}
                          </p>
                        </div>

                        {/* Annotated Bad Counter-Example with circled error */}
                        <div className="p-4 bg-red-50/70 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-red-800 dark:text-red-300 flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span>مثال مضاد معلّم (Contre-exemple)</span>
                            </span>
                            <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                              {verbCard.badExample.scorePercent}% (خطأ شائع)
                            </span>
                          </div>
                          
                          <div className="p-2.5 bg-white dark:bg-[#1a1214] rounded-lg border border-red-200 dark:border-red-900/40 text-xs text-gray-800 dark:text-gray-200 font-medium">
                            <p className="leading-relaxed">{verbCard.badExample.answer}</p>
                            <div className="mt-2 pt-2 border-t border-red-100 dark:border-red-950 text-[11px] text-red-700 dark:text-red-400 font-bold">
                              <span>الخطأ القاتل: </span>
                              <span className="bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded border border-red-300 dark:border-red-700">{verbCard.badExample.circledError}</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-red-600 dark:text-red-400/90 font-medium">
                            {verbCard.badExample.flawDescription}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: MASTERY MATRIX & ERROR LOG */}
      {activeTab === 'mastery_matrix' && (
        <section className="space-y-6">
          
          {/* Matrix Header */}
          <div className="bg-white dark:bg-[#161c18] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">مصفوفة الإتقان (الأفعال × الوحدات)</h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                القاعدة: لا يُعتبر الفعل مؤتمتاً ومكتسباً حتى يحقق التلميذ ICM ≥ 90% في 3 وحدات مختلفة على الأقل.
              </p>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-right border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="p-3 font-black text-gray-700 dark:text-gray-300">فعل الأداء</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">تركيب البروتين</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">النشاط الإنزيمي</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">المناعة</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">الاتصال العصبي</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">التنظيم الهرموني</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">التحولات الطاقوية</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">الظواهر الجيولوجية</th>
                    <th className="p-3 font-bold text-gray-600 dark:text-gray-400 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {VERB_CARDS.slice(0, 4).map((verb) => {
                    const scores = matrixScores[verb.id] || {};
                    const isAutomated = Object.values(scores).filter((s: any) => Number(s) >= 85).length >= 3;
                    return (
                      <tr key={verb.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/5">
                        <td className="p-3 font-black text-gray-900 dark:text-white">{verb.verbAr}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            (scores.protein_synthesis || 0) >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {scores.protein_synthesis || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            (scores.enzymology || 0) >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {scores.enzymology || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            (scores.immunology || 0) >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          }`}>
                            {scores.immunology || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            (scores.neuro_comm || 0) >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {scores.neuro_comm || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            (scores.regulations || 0) >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {scores.regulations || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            (scores.energy_transformations || 0) >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {scores.energy_transformations || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            (scores.geodynamics || 0) >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {scores.geodynamics || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                            isAutomated 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {isAutomated ? 'مؤتمت' : 'قيد التدريب'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Error Typology Counters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#161c18] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>دفتر الأخطاء النوعية (الأسبوع الحالي)</span>
                </h3>
                <span className="text-xs font-bold text-gray-400">توجيه الجهد نحو الخلل السائد</span>
              </div>

              <div className="space-y-3">
                {Object.entries(weeklyErrorCounters).map(([tag, count]) => {
                  const errorDef = ERROR_TAXONOMY[tag];
                  if (!errorDef) return null;
                  return (
                    <div key={tag} className="p-3.5 bg-gray-50 dark:bg-[#121614] rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs md:text-sm text-gray-900 dark:text-white block">
                          {errorDef.nameAr}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{errorDef.example}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-lg font-black text-xs">
                          {count} تكرار
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spaced Review Schedule (J+1, J+3, J+7, J+16, J+30) */}
            <div className="bg-white dark:bg-[#161c18] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>جدول التكرار المتباعد للذاكرة (Active Recall)</span>
                </h3>
                <span className="text-xs font-bold text-emerald-600">5 دقائق استرجاع كتابي</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { day: 'J + 1', verb: 'حَلّل (Analyser)', status: 'جاهز للمراجعة', isDue: true },
                  { day: 'J + 3', verb: 'فَسّر (Expliquer)', status: 'متبقي يومان', isDue: false },
                  { day: 'J + 7', verb: 'قَارن (Comparer)', status: 'متبقي 4 أيام', isDue: false },
                  { day: 'J + 16', verb: 'اقْتَرح فرضيّة', status: 'متبقي 11 يوماً', isDue: false },
                  { day: 'J + 30', verb: 'صَادق على الفرضية', status: 'متبقي 24 يوماً', isDue: false }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-[#121614] rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                        {item.day}
                      </span>
                      <span className="font-bold text-xs md:text-sm text-gray-800 dark:text-gray-200">{item.verb}</span>
                    </div>
                    <span className={`text-xs font-bold ${item.isDue ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnostic d'évolution : brouillons archivés + progression dans le temps */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
            <ProductionEvolutionPanel
              stats={evolutionStats}
              onResume={handleResumeDraft}
              onRefresh={() => setEvolutionVersion(v => v + 1)}
            />
          </div>

        </section>
      )}

      {/* TAB 4: UNIVERSAL GRAMMAR RULES (Couche 0) */}
      {activeTab === 'engine_rules' && (
        <section className="space-y-6">
          <div className="bg-white dark:bg-[#161c18] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">الطبقة 0: قواعد الإجابة الموحدة (100% من الأسئلة)</h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                هذه القواعد الأربعة هي "نظام التشغيل" الذي تدور فوقه جميع أفعال الأداء، ويتعلمها الطالب مرة واحدة وتصلح لجميع مواضيع البكالوريا.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {UNIVERSAL_GRAMMAR_RULES.map(rule => (
                <div 
                  key={rule.ruleNumber}
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-[#121614] border border-gray-200 dark:border-gray-800 space-y-2 hover:border-emerald-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      {rule.ruleNumber}
                    </span>
                    <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      {rule.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-sm md:text-base text-gray-900 dark:text-white">{rule.titleAr}</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {rule.summaryAr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
