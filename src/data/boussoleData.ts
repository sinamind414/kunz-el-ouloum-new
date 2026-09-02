// ============================================================
// BOUSSOLE NSOE — بوصلة الإجابة (شمال · جنوب · غرب · شرق)
// Les 4 caps = les 4 stades du simulateur, racontés comme un voyage.
// Contenu 100 % aligné sur le livre officiel (manhadjiya vérifié).
// ============================================================

export type CapId = 'north' | 'south' | 'west' | 'east';

export interface BoussoleCap {
  id: CapId;
  num: number;
  ar: string;
  fr: string;
  word: string;
  color: string;
  colorSoft: string;
  icon: string;
  gestureAr: string;
  questionAr: string;
  stepsAr: string[];
  motorAr: string;
}

export const BOUSSOLE_CAPS: BoussoleCap[] = [
  {
    id: 'north',
    num: 1,
    ar: 'الشمال',
    fr: 'NORD',
    word: 'انْظُرْ',
    color: '#2563eb',
    colorSoft: '#dbeafe',
    icon: '✋',
    gestureAr: 'أرفع يدي نحو الأفق',
    questionAr: 'ماذا يُطلب منّي بالضبط؟',
    stepsAr: [
      'أقرأ التعليمة 3 مرات',
      'أحدد فعل الأداء (حلّل؟ فسّر؟)',
      'ألوّن الكلمات المفتاحية والمشكل',
    ],
    motorAr: '« من لا يعرف وجهته لا يصل »',
  },
  {
    id: 'south',
    num: 2,
    ar: 'الجنوب',
    fr: 'SUD',
    word: 'اجْمَعْ',
    color: '#059669',
    colorSoft: '#d1fae5',
    icon: '👇',
    gestureAr: 'أخفض يدي نحو الأرض',
    questionAr: 'ماذا أملك؟',
    stepsAr: [
      'كل وثيقة = معطى + وحدته',
      'أرقامنا دائماً بوحدتها (غ/ل، %, د)',
      'أكتب مكتسباتي من الدرس في سطرين',
    ],
    motorAr: '« السفينة لا تبحر بلا مؤن »',
  },
  {
    id: 'west',
    num: 3,
    ar: 'الغرب',
    fr: 'OUEST',
    word: 'اغُصْ',
    color: '#d97706',
    colorSoft: '#fef3c7',
    icon: '👈',
    gestureAr: 'أمدّ يدي وأمسح الأفق',
    questionAr: 'كيف أصل؟',
    stepsAr: [
      'أربط المعطى بالمكتسب (علاقة أو آلية)',
      'أستعمل: لأن، وبالتالي، بينما، في حين',
      'كل تأكيد يبدأ بـ «انطلاقاً من الوثيقة…»',
    ],
    motorAr: '« العبور يكون بالدليل لا بالظن »',
  },
  {
    id: 'east',
    num: 4,
    ar: 'الشرق',
    fr: 'EST',
    word: 'أَشْرِقْ',
    color: '#f59e0b',
    colorSoft: '#fef9c3',
    icon: '👉',
    gestureAr: 'أرفع يدي نحو الفجر',
    questionAr: 'ما خلاصتي؟ وهل تحققتُ؟',
    stepsAr: [
      'جملة ختامية تعيد صياغة المطلوب',
      'الفحص: وحدة ✓ فعل ✓ سند ✓ خاتمة ✓',
      'أقرأ جملتي الأخيرة بصوت خافت',
    ],
    motorAr: '« الخلاصة هي الفجر الذي يجيب عن الشمال »',
  },
];

export function capForStage(stage: number): CapId | null {
  if (stage >= 1 && stage <= 4) return BOUSSOLE_CAPS[stage - 1].id;
  return null;
}

export function getCap(capId: CapId): BoussoleCap {
  return BOUSSOLE_CAPS.find(c => c.id === capId)!;
}

export const VENT_CAP_MAP: Record<string, CapId> = {
  verb_confusion: 'north',
  missing_unit: 'south',
  comparison_without_criteria: 'south',
  missing_reference: 'west',
  premature_interpretation: 'west',
  conditional_hypothesis: 'west',
  unbalanced_comparison: 'west',
  missing_conclusion: 'east',
};

export function groupErrorsByCap(errorTags: string[]): { capId: CapId; tags: string[] }[] {
  const map: Record<CapId, string[]> = { north: [], south: [], west: [], east: [] };
  errorTags.forEach(tag => {
    const cap = VENT_CAP_MAP[tag];
    if (cap) map[cap].push(tag);
  });
  return BOUSSOLE_CAPS.map(c => ({ capId: c.id, tags: map[c.id] }));
}

export const BOUSSOLE_RITUAL = [
  { capId: 'north' as CapId, gesture: 'نظرة إلى الأفق' },
  { capId: 'south' as CapId, gesture: 'جمع من الأرض' },
  { capId: 'west' as CapId, gesture: 'مسح البحر' },
  { capId: 'east' as CapId, gesture: 'يد نحو الفجر' },
];

export const REGLE_D_OR_AR = '« لا خاتمةَ قبل حُجّة، ولا حُجّةَ قبل مُعطى، ولا مُعطى قبلَ فَهْمِ السؤال »';

export const BOUSSOLE_STAGES_META = [
  { num: 1, title: 'شمال · انْظُرْ', sub: 'النمذجة', desc: 'تحديد المطلوب ثم تلوين خطوات الخبير' },
  { num: 2, title: 'جنوب · اجْمَعْ', sub: 'الإكمال', desc: 'جمع المعطيات والوحدات في الشكل الجاهز' },
  { num: 3, title: 'غرب · اغُصْ', sub: 'إنتاج موجّه', desc: 'الاستدلال مع بوصلة مفتوحة (مساعدة متاحة)' },
  { num: 4, title: 'شرق · أَشْرِقْ', sub: 'محاكاة البكالوريا', desc: 'رحلة كاملة مؤقتة + خاتمة وفحص' },
];