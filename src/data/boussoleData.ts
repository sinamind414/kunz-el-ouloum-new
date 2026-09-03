// ============================================================
// BOUSSOLE SVT v2 — بوصلة الإجابة · 4 خطوات + مفتاح واحد
// ============================================================

export interface BoussoleStep {
  num: 1 | 2 | 3 | 4;
  ar: string;
  wordAr: string;
  color: string;
  errorTag: string;
}

export const BOUSSOLE_STEPS: BoussoleStep[] = [
  {
    num: 1,
    ar: 'اقرأْ',
    wordAr: 'أحدد فعل الأداء والكلمات المفتاحية',
    color: '#1d4ed8',
    errorTag: 'verb_confusion'
  },
  {
    num: 2,
    ar: 'اجمعْ',
    wordAr: 'أربط المعطيات بالوحدات',
    color: '#059669',
    errorTag: 'missing_unit'
  },
  {
    num: 3,
    ar: 'اربطْ',
    wordAr: 'أقرأ الوثيقة ثم أستنتج',
    color: '#d97706',
    errorTag: 'missing_reference'
  },
  {
    num: 4,
    ar: 'اختمْ',
    wordAr: 'أعيد صياغة المطلوب كحقيقة علمية',
    color: '#7c3aed',
    errorTag: 'missing_conclusion'
  }
];

export function getStepData(step: number): BoussoleStep | undefined {
  return BOUSSOLE_STEPS.find(s => s.num === step);
}

export function getStepByTag(tag: string): BoussoleStep | undefined {
  return BOUSSOLE_STEPS.find(s => s.errorTag === tag);
}

export const ERROR_TAG_LABELS_AR: Record<string, string> = {
  missing_unit: 'غياب الوحدة القياسية',
  missing_reference: 'تأكيد دون سند',
  premature_interpretation: 'التفسير المبكر أثناء التحليل',
  conditional_hypothesis: 'فرضية بصيغة الشك',
  missing_conclusion: 'غياب الجملة الختامية',
  verb_confusion: 'الخلط بين أفعال الأداء',
  comparison_without_criteria: 'مقارنة بلا معايير',
  unbalanced_comparison: 'مقارنة غير متوازنة'
};

export const REGLE_D_OR_AR = '« لا خاتمةَ قبل حُجّة، ولا حُجّةَ قبل مُعطى، ولا مُعطى قبلَ فَهْمِ السؤال »';

export const PHRASE_TYPES = [
  {
    step: 2,
    ar: 'انطلاقًا من الوثيقة (…) نلاحظ أنّ …',
    hint: 'القيمة + الوحدة'
  },
  {
    step: 3,
    ar: 'وهذا <b>لأنّ</b> … <b>وبالتالي</b> …',
    hint: 'السبب + النتيجة'
  },
  {
    step: 4,
    ar: '<b>ومنه نستنتج أنّ</b> …',
    hint: 'إعادة صياغة المطلوب'
  }
];

export const TIME_RULES = {
  quart: 'الرُّبع الأول: اقرأ + اجمع',
  half: 'النِّصف: الربط (أو الكتابة إن كان مغلقًا)',
  quarter: 'الرُّبع الأخير: اختم + الفحص'
};