import {
  VERB_CARDS_V2, getVerbCardV2, ERROR_TAXONOMY,
  Switch, StepId, Step3Mode,
} from '../data/methodologyEngine';

export interface StepLine {
  step: StepId;
  applicable: boolean;
  passed: boolean;
  errorTags: string[];
  remedyAr?: string;
}

export interface SwitchLine {
  truth: Switch;
  choice: Switch | null;
  choiceCorrect: boolean | null;
  violated: boolean;
  remedyAr?: string;
}

export interface ScoreReport {
  icm: number;
  criteriaResults: {
    criterionId: string; label: string; passed: boolean;
    feedback: string; probe: string; errorTag?: string;
  }[];
  detectedErrors: {
    tag: string; nameAr: string; descriptionAr: string;
    counterActionAr: string; step: StepId | 'switch'; sampleText?: string;
  }[];
  switchLine: SwitchLine;
  stepReport: StepLine[];
  nextPedagogicalStage: 1 | 2 | 3 | 4;
  pedagogicalDecisionAr: string;
}

export interface SwitchContext {
  switchChoice: Switch | null;
}

const CLOSED_FORBIDDEN_RE = /(لأنّ?|راجع إلى|بسبب|يفسر ذلك|نعلل|يدل على أن|car|parce que|s'explique)/i;
const STEP3_EVIDENCE: Record<Step3Mode, RegExp | null> = {
  explain:    /(لأنّ?|يعود ذلك|يرجع|بسبب|مما يؤدي|وبالتالي|يفسر ذلك|نتيجة ل)/i,
  confront:   /(بينما|في المقابل|في حين|مقابل|يقابله|كلاهما|أوجه التشابه|أوجه الاختلاف|alors que|tandis que)/i,
  hypothesis: /(نفترض|الفرضية|نقترح)/i,
  none:       null,
};
const DOUBT_RE      = /(ربما|قد يكون|لعل|احتمال|يمكن أن يكون|peut-être)/i;
const CONCLUSION_RE = /(الاستنتاج|نستنتج|الخلاصة|نخلص|يؤكد صحة|خاتمة|ومنه|conclusion)/i;
const TITLE_RE      = /(العنوان|عنوان\s*:)/i;
const REFERENCE_RE  = /(الوثيق|الوثائق|منحنى|جدول|الملاحظة|الشاهد|الشكل|الرسم|التجربة|document|graphe)/i;
const DOC_NUMBER_RE = /(?:الوثيقة|الوثيقتين|الوثيقتان|الوثائق|المنحنى|المنحنيين|الجدول|الجدولين|الشكل|الشكلين|الرسم|النموذج|التجربة|الملاحظة|الصورة|الفرضية)[\u0600-\u06FF]*\s*\d+(?:\s*(?:و|،|,)\s*\d+)*/g;

const NUMBER_RE = /(?<![A-Za-z=+\-\/\d.,])\d+(?:[.,]\d+)?(?![A-Za-z+\-\d])/g;
const UNIT_AFTER_RE  = /(غ\/ل|g\/l|%|دقيقة|دقائق|دق\b|min|ساعة|ساعات|ثانية|ثواني|s\b|وحدة اعتبارية|ua|°|درجة|ميكرومول|مول|نل|مل|لتر|مم|سم|نانومتر|كيلومتر|خلايا|بلورات|وحدات|يوم|أيام|أسبوع|شهر|سنة)/i;
const UNIT_BEFORE_RE = /(?:^|\s)(?:د|دقيقة|الدقيقة|ph)\s*=?\s*/i;

function bareNumbers(text: string): string[] {
  const t = text.replace(DOC_NUMBER_RE, ' ');
  const out: string[] = [];
  for (const m of t.matchAll(NUMBER_RE)) {
    const i = m.index ?? 0;
    const after  = t.slice(i + m[0].length, i + m[0].length + 14);
    const before = t.slice(Math.max(0, i - 8), i);
    if (!UNIT_AFTER_RE.test(after) && !UNIT_BEFORE_RE.test(before)) out.push(m[0]);
  }
  return out;
}

export function evaluateStudentProduction(
  verbId: string,
  userText: string,
  _draftText?: { verb: string; steps: string; finalSentence: string },
  currentStage: 1 | 2 | 3 | 4 = 3,
  switchContext?: SwitchContext
): ScoreReport {
  const card = getVerbCardV2(verbId) ?? VERB_CARDS_V2[0];
  const sw = card.switch;
  const writes = (s: StepId) => card.path.includes(s);
  const text = (userText || '').trim().toLowerCase();
  const detected = new Set<string>();

  const numbers = Array.from(text.replace(DOC_NUMBER_RE, ' ').matchAll(NUMBER_RE));
  const bare = bareNumbers(text);

  if (sw === 'closed' && CLOSED_FORBIDDEN_RE.test(text)) {
    detected.add('premature_interpretation');
  }
  if (sw === 'open') {
    const re = card.step3Evidence ?? STEP3_EVIDENCE[card.step3Mode];
    if (re && !re.test(text)) detected.add('unsupported_claim');
  }

  if (writes(2)) {
    if (bare.length > 0) detected.add('missing_unit');
    if (card.format !== 'diagram' && card.format !== 'compare' && !REFERENCE_RE.test(text)) {
      detected.add('missing_reference');
    }
    if (card.format === 'compare' && !STEP3_EVIDENCE.confront!.test(text)) {
      detected.add('comparison_without_criteria');
    }
  } else if (card.step3Mode === 'none' && numbers.length > 0) {
    detected.add('verb_confusion');
  }

  if (card.step3Mode === 'hypothesis' && DOUBT_RE.test(text)) {
    detected.add('conditional_hypothesis');
  }

  if (writes(4)) {
    const closingRe = card.format === 'diagram' ? TITLE_RE : CONCLUSION_RE;
    if (!closingRe.test(text)) detected.add('missing_conclusion');
  }

  const criteriaResults: ScoreReport['criteriaResults'] = [];
  let weightedPass = 0, weightedTotal = 0;

  for (const c of card.criteria) {
    let passed = false;
    let feedback = '';
    const compass = c.wording.compass;

    switch (c.id) {
      case 'an_c1': case 'ex_c1': case 'val_c1':
        passed = REFERENCE_RE.test(text) && text.length > 25;
        feedback = passed ? 'تم تحديد الوثيقة والسياق بنجاح.' : `تنبيه: « ${compass} » - لم يتم ذكر السند بوضوح.`;
        break;
      case 'comp_c1':
        passed = (/(كلاهما|أوجه التشابه|الطرف|بين\s.+\s?و)/.test(text) || REFERENCE_RE.test(text)) && text.length > 25;
        feedback = passed ? 'تمت تسمية طرفي المقارنة.' : `تنبيه: « ${compass} » - سمِّ الطرفين قبل المقارنة.`;
        break;
      case 'an_c2':
        passed = bare.length === 0;
        feedback = passed ? 'تم تفكيك المعطيات وإرفاق القيم بالوحدات القياسية.' : `تنبيه: « ${compass} » - كل رقم متبوعاً بوحدته (غ/ل، %، دقيقة).`;
        break;
      case 'an_c3':
        passed = !detected.has('premature_interpretation');
        feedback = passed ? 'ممتاز: التحليل وصفي وخالٍ من التعليل المسبق.' : `خطأ منهجي: « ${compass} » - تم رصد كلمات تعليل داخل التحليل!`;
        break;
      case 'an_c4': case 'ex_c4': case 'comp_c4': case 'ded_c1': case 'val_c3': case 'sch_c3':
        passed = !detected.has('missing_conclusion') && text.length > 50;
        feedback = passed ? 'تمت صياغة الجملة الختامية بنجاح.' : `تنبيه: « ${compass} » - غياب الجملة الختامية.`;
        break;
      case 'ex_c2': case 'hyp_c2':
        passed = text.length > 60;
        feedback = passed ? 'تم استحضار الآلية البيولوجية.' : `تنبيه: « ${compass} » - فصِّل الآلية الجزيئية/الخلوية.`;
        break;
      case 'ex_c3': case 'val_c2': case 'exp_m_c3':
        passed = !detected.has('unsupported_claim');
        feedback = passed ? 'تم الربط بسند صريح.' : `تنبيه: « ${compass} » - أين رابطك («لأنّ» / «يتوافق مع» / «بالربط»)؟`;
        break;
      case 'comp_c2': case 'comp_c3':
        passed = !detected.has('comparison_without_criteria');
        feedback = passed ? 'تم الربط المقارن بأدوات التقابل.' : `تنبيه: « ${compass} » - استخدم «بينما / في حين».`;
        break;
      case 'hyp_c3':
        passed = !detected.has('conditional_hypothesis');
        feedback = passed ? 'صياغة إخبارية جازمة.' : `خطأ منهجي: « ${compass} » - تجنب صيغ الشك.`;
        break;
      case 'ded_c2':
        passed = !detected.has('verb_confusion');
        feedback = passed ? 'استنتاج مجرّد بلا أرقام معادة.' : `تنبيه: « ${compass} » - الأرقام مكانها التحليل لا الاستنتاج.`;
        break;
      default:
        passed = text.length > 40;
        feedback = passed ? 'معيار مستوفى.' : `يرجى مراجعة المعيار: « ${compass} ».`;
    }

    const w = c.weight || 1;
    weightedTotal += w;
    if (passed) weightedPass += w;
    else if (c.errorTag) detected.add(c.errorTag);

    criteriaResults.push({ criterionId: c.id, label: c.wording.ar_label, passed, feedback, probe: c.wording.probe, errorTag: c.errorTag });
  }

  const icm = weightedTotal > 0 ? Math.round((weightedPass / weightedTotal) * 100) : 0;

  const remedyOf = (tags: string[]) => tags[0] ? ERROR_TAXONOMY[tags[0]]?.counterActionAr : undefined;

  const choice = switchContext?.switchChoice ?? null;
  const violated = detected.has(card.typicalErrorTag);
  const switchLine: SwitchLine = {
    truth: sw,
    choice,
    choiceCorrect: choice === null ? null : choice === sw,
    violated,
    remedyAr: violated ? ERROR_TAXONOMY[card.typicalErrorTag].counterActionAr
            : choice !== null && choice !== sw ? 'اسأل قبل الكتابة: هل الفعل يسمح بـ«لأنّ»؟' : undefined,
  };

  const stepReport: StepLine[] = ([1, 2, 3, 4] as StepId[]).map(step => {
    const applicable = step === 1 || writes(step);
    const tags = [...detected].filter(t => ERROR_TAXONOMY[t]?.step === step && t !== 'premature_interpretation');
    return { step, applicable, passed: applicable && tags.length === 0, errorTags: tags, remedyAr: remedyOf(tags) };
  });

  let nextPedagogicalStage: 1 | 2 | 3 | 4 = currentStage;
  let pedagogicalDecisionAr = '';
  if (icm < 60) {
    nextPedagogicalStage = 2;
    pedagogicalDecisionAr = 'مستوى ICM أقل من 60% — العودة إلى المرحلة 2 (الإكمال) لترسيخ الروابط المنهجية.';
  } else if (icm < 90) {
    nextPedagogicalStage = 3;
    pedagogicalDecisionAr = 'مستوى ICM بين 60% و 89% — المتابعة في المرحلة 3 مع التركيز على الخطوة الناقصة.';
  } else {
    nextPedagogicalStage = 4;
    pedagogicalDecisionAr = 'إتقان ممتاز (ICM ≥ 90%) — جاهز للمرحلة 4 (بكالوريا، بلا بطاقة).';
  }

  const detectedErrors = [...detected].map(tag => {
    const e = ERROR_TAXONOMY[tag];
    return e
      ? { tag, nameAr: e.nameAr, descriptionAr: e.descriptionAr, counterActionAr: e.counterActionAr, step: e.step }
      : { tag, nameAr: 'ملاحظة منهجية', descriptionAr: '', counterActionAr: 'راجع بطاقة الفعل.', step: 1 as StepId };
  });

  return { icm, criteriaResults, detectedErrors, switchLine, stepReport, nextPedagogicalStage, pedagogicalDecisionAr };
}
