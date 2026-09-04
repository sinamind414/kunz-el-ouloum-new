import { VERB_CARDS, ERROR_TAXONOMY, VerbCriteriaItem } from '../data/methodologyEngine';
import { SwitchState, SWITCH_CLOSED_VERBS, SWITCH_OPEN_VERBS } from '../data/boussoleData';

export interface ScoreReport {
  icm: number;
  criteriaResults: {
    criterionId: string;
    label: string;
    passed: boolean;
    feedback: string;
    probe: string;
    errorTag?: string;
  }[];
  detectedErrors: {
    tag: string;
    nameAr: string;
    descriptionAr: string;
    counterActionAr: string;
    sampleText?: string;
  }[];
  nextPedagogicalStage: 1 | 2 | 3 | 4;
  pedagogicalDecisionAr: string;
}

export interface SwitchContext {
  switchChoice: SwitchState | null;
  switchTruth: SwitchState;
}

export function evaluateStudentProduction(
  verbId: string,
  userText: string,
  draftText?: { verb: string; steps: string; finalSentence: string },
  currentStage: 1 | 2 | 3 | 4 = 3,
  switchContext?: SwitchContext
): ScoreReport {
  const verbCard = VERB_CARDS.find(v => v.id === verbId) || VERB_CARDS[0];
  const criteria = verbCard.criteria;
  
  const textLower = (userText || '').trim().toLowerCase();
  const criteriaResults: ScoreReport['criteriaResults'] = [];
  const detectedErrorsMap = new Set<string>();

  let passedCount = 0;

  // 1. Détection des erreurs typées globales
  // Vérification de l'interdit pour l'analyse (premature_interpretation)
  if (verbCard.id === 'verb_analyse_v1') {
    const causalRegex = /(لأن|راجع إلى|بسبب|يفسر ذلك|نعلل|car|parce que|s'explique)/i;
    if (causalRegex.test(textLower)) {
      detectedErrorsMap.add('premature_interpretation');
    }
  }

  // Vérification de l'absence d'unités si des nombres sont présents (missing_unit)
  const numbersPresent = /\d+/.test(textLower);
  const unitsPresent = /(غ\/ل|g\/l|%|دقيقة|min|ثانية|s|وحدة اعتبارية|ua|°|درجة|ميكرومول)/i.test(textLower);
  if (numbersPresent && !unitsPresent && verbCard.id === 'verb_analyse_v1') {
    detectedErrorsMap.add('missing_unit');
  }

  // Vérification des hypothèses conditionnelles (conditional_hypothesis)
  if (verbCard.id === 'verb_hypothesis_v1') {
    const doubtRegex = /(ربما|قد يكون|لعل|احتمال|peut-être)/i;
    if (doubtRegex.test(textLower)) {
      detectedErrorsMap.add('conditional_hypothesis');
    }
  }

  // Vérification de la structure de comparaison (comparison_without_criteria)
  if (verbCard.id === 'verb_compare_v1') {
    const contrastRegex = /(بينما|في المقابل|في حين|أوجه التشابه|أوجه الاختلاف|alors que|tandis que)/i;
    if (!contrastRegex.test(textLower)) {
      detectedErrorsMap.add('comparison_without_criteria');
    }
  }

  // Vérification de la présence de la conclusion (missing_conclusion)
  const conclusionRegex = /(الاستنتاج|نستنتج|الخلاصة|نخلص|يؤكد صحة|خاتمة|conclusion)/i;
  if (!conclusionRegex.test(textLower)) {
    detectedErrorsMap.add('missing_conclusion');
  }

  // 2. Évaluation des critères spécifiques du verbe
  criteria.forEach((criterion) => {
    let passed = false;
    let feedback = '';

    if (criterion.id === 'an_c1' || criterion.id === 'ex_c1' || criterion.id === 'comp_c1' || criterion.id === 'val_c1') {
      // Présentation / Référent
      const refKeywords = /(تمثل الوثيقة|منحنى|جدول|الوثيقة|الملاحظة|الشاهد|نلاحظ|document|graphe)/i;
      passed = refKeywords.test(textLower) && textLower.length > 25;
      feedback = passed 
        ? 'تم تحديد الوثيقة والسياق بنجاح.' 
        : `تنبيه: « ${criterion.wording.compass} » - لم يتم ذكر السند بوضوح.`;
    } 
    else if (criterion.id === 'an_c2') {
      // Découpage et unités
      passed = numbersPresent && unitsPresent;
      feedback = passed 
        ? 'تم تفكيك المعطيات وإرفاق القيم بالوحدات القياسية.' 
        : `تنبيه: « ${criterion.wording.compass} » - تأكد من كتابة كل رقم متبوعاً بوحدته (غ/ل، %، دقيقة).`;
    }
    else if (criterion.id === 'an_c3') {
      // Pas de causalité prématurée
      passed = !detectedErrorsMap.has('premature_interpretation');
      feedback = passed 
        ? 'ممتاز: التحليل وصفي موضوعي وخالٍ من التعليل المسبق.' 
        : `خطأ منهجي: « ${criterion.wording.compass} » - تم رصد كلمات تعليل وسببية داخل التحليل!`;
    }
    else if (criterion.id === 'an_c4' || criterion.id === 'ex_c4' || criterion.id === 'comp_c4' || criterion.id === 'ded_c1' || criterion.id === 'sch_c3' || criterion.id === 'val_c3') {
      // Conclusion / Phrase-bilan
      passed = !detectedErrorsMap.has('missing_conclusion') && textLower.length > 50;
      feedback = passed 
        ? 'تمت صياغة الجملة الختامية (الاستنتاج/الخلاصة) بنجاح.' 
        : `تنبيه: « ${criterion.wording.compass} » - غياب الجملة الختامية الحاسمة.`;
    }
    else if (criterion.id === 'ex_c2' || criterion.id === 'hyp_c2') {
      // Mécanisme biologique
      passed = textLower.length > 60;
      feedback = passed 
        ? 'تم استحضار المعارف والآلية البيولوجية ذات الصلة.' 
        : `تنبيه: « ${criterion.wording.compass} » - التفسير يحتاج إلى تفصيل الآلية الجزيئية/الخلوية.`;
    }
    else if (criterion.id === 'ex_c3') {
      // Connecteur causal obligatoire
      const causalRegex = /(يعود ذلك إلى|يرجع هذا لـ|بسبب|مما يؤدي|يفسر ذلك بـ)/i;
      passed = causalRegex.test(textLower);
      feedback = passed 
        ? 'تم استخدام الرابط السببي الإلزامي بكفاءة.' 
        : `تنبيه: « ${criterion.wording.compass} » - أين هو الرابط السببي "يعود ذلك إلى" في جملتك؟`;
    }
    else if (criterion.id === 'comp_c3') {
      // Connecteur opposition
      passed = !detectedErrorsMap.has('comparison_without_criteria');
      feedback = passed 
        ? 'تم الربط المقارن بأدوات التقابل (بينما / في المقابل).' 
        : `تنبيه: « ${criterion.wording.compass} » - استخدم روابط التقابل لتفادي السرد المنفصل.`;
    }
    else if (criterion.id === 'hyp_c3') {
      // Assertion franche
      passed = !detectedErrorsMap.has('conditional_hypothesis');
      feedback = passed 
        ? 'صياغة إخبارية جازمة خالية من الشك والتردد.' 
        : `خطأ منهجي: « ${criterion.wording.compass} » - تجنب صيغ الشك (ربما/لعل) في الفرضية.`;
    }
    else {
      // Fallback
      passed = textLower.length > 40;
      feedback = passed ? 'معيار مستوفى.' : `يرجى مراجعة المعيار: « ${criterion.wording.compass} ».`;
    }

    if (passed) {
      passedCount += 1;
    } else if (criterion.errorTag) {
      detectedErrorsMap.add(criterion.errorTag);
    }

    criteriaResults.push({
      criterionId: criterion.id,
      label: criterion.wording.ar_label,
      passed,
      feedback,
      probe: criterion.wording.probe,
      errorTag: criterion.errorTag
    });
  });

  const totalCriteria = criteria.length;
  const icm = Math.round((passedCount / totalCriteria) * 100);

  // 3. Décision pédagogique adaptative selon l'algorithme du document
  let nextPedagogicalStage: 1 | 2 | 3 | 4 = currentStage;
  let pedagogicalDecisionAr = '';

  if (icm < 60) {
    nextPedagogicalStage = 2;
    pedagogicalDecisionAr = 'مستوى ICM أقل من 60% — التوجيه البيداغوجي: العودة إلى المرحلة 2 (الإكمال والتدريب الموجه) لترسيخ الروابط المنهجية.';
  } else if (icm < 90) {
    nextPedagogicalStage = 3;
    pedagogicalDecisionAr = 'مستوى ICM بين 60% و 89% — التوجيه البيداغوجي: المتابعة في المرحلة 3 (الإنتاج الموجه) مع التركيز على المعيار الناقص.';
  } else {
    nextPedagogicalStage = 4;
    pedagogicalDecisionAr = 'إتقان ممتاز (ICM ≥ 90%) — التوجيه البيداغوجي: جاهز للمرحلة 4 (محاكاة البكالوريا تحت ضغط الوقت مع مسودة الـ 90 ثانية).';
  }

  // Format detected errors
  const detectedErrors = Array.from(detectedErrorsMap).map(tag => {
    const errorInfo = ERROR_TAXONOMY[tag] || {
      code: tag,
      nameAr: 'ملاحظة منهجية',
      nameFr: 'Remarque méthodologique',
      descriptionAr: 'يجب ضبط الصياغة وفق معايير السليم.',
      example: '',
      counterActionAr: 'راجع خطوات الفيشة المنهجية للفعل.'
    };
    return {
      tag: errorInfo.code,
      nameAr: errorInfo.nameAr,
      descriptionAr: errorInfo.descriptionAr,
      counterActionAr: errorInfo.counterActionAr
    };
  });

  return {
    icm,
    criteriaResults,
    detectedErrors,
    nextPedagogicalStage,
    pedagogicalDecisionAr
  };
}
