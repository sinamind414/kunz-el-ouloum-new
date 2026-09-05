// src/data/miftahSpec.ts
// Spécification MIFTAH v3.1 — source unique du HTML, du moteur et des cartes React
// Pro : centralise la nomenclature, les couleurs, les gabarits et les erreurs coûteuses

export const MIFTAH_VERSION = '3.1' as const;
export const MIFTAH_NAME_AR = 'المِفْتَاح';
export const MIFTAH_NAME_LATIN = 'MIFTAH';
export const MIFTAH_PLUS_AR = 'المِفْتَاح+';
export const MIFTAH_TAGLINE_AR = 'مفتاح الكنز — منهجية الإجابة في علوم الحياة والأرض · بكالوريا';
export const MIFTAH_BRAND_AR = 'كنز العلوم';

export const MIFTAH_COLORS = {
  gold: '#c8962e', goldL: '#fbf3e2', goldD: '#8a6116',
  teal: '#0f6b6b', tealL: '#e5f3f3',
  red: '#b23a3a', redL: '#fdecec',
  ink: '#1f2328', mute: '#5b6470', line: '#e3e6ea',
} as const;

// Nomenclature — à utiliser partout (moteur, scorer, vues)
export const MIFTAH_NOMENCLATURE = {
  miftah: 'المِفْتَاح',
  miftahPlus: 'المِفْتَاح+',
  sinn: 'السنّ',
  asnan: 'الأسنان',
  bawaba: 'البوابة',
  bawaba1: 'البوابة 1 — ورقة أم رأس؟',
  bawaba2: 'البوابة 2 — صورة أم فيلم؟',
  s0: 'اِفهم',
  s1: 'اِقْرَأْ',
  s2: 'اِجْمَعْ',
  s3: 'اِرْبِطْ',
  s4: 'اِخْتِمْ',
} as const;

export const STEP0 = {
  id: 0 as const,
  nameAr: 'اِفهم',
  templateAr: 'الهدف العام: …… (≤ 5 كلمات) — يُكتب أعلى المسودة بعد قراءة سياق التمرين',
  exampleAr: 'بغرض معرفة آلية عمل الأنسولين → الهدف العام: آلية عمل الأنسولين',
  checkAr: 'هل كتبت الهدف العام في سطر واحد قبل القراءة التفصيلية؟',
} as const;

// Les 4 dents — aligné avec le tableau أ du recto
export const ASNAN = [
  { id: 1 as const, nameAr: 'اِقْرَأْ', actionAr: 'أطوّق الفعل · أسطّر الكلمات المفتاحية · أرقّم إجابتي برقم السؤال', correctorAr: 'إجابة بلا رقم أو تحت رقم خاطئ = 0. الفعل الخاطئ = تفقد نقطة الفعل كاملة.' },
  { id: 2 as const, nameAr: 'اِجْمَعْ', actionAr: 'أستخرج من الوثيقة أرقاما + وحدات + اتجاه التغيّر', correctorAr: 'نقطة الاستخراج للرقم مع وحدته. «يرتفع» وحدها = نصف نقطة. رقم بلا وحدة = خطأ.' },
  { id: 3 as const, nameAr: 'اِرْبِطْ', noteAr: 'إن سمح الفعل', actionAr: 'أربط المعطى بالسبب/الآلية من الدرس: «لأنّ…»', correctorAr: 'ربط بلا معطى = نصف النقطة. معطى بلا ربط والفعل يطلبه = نصف النقطة.' },
  { id: 4 as const, nameAr: 'اِخْتِمْ', actionAr: 'جملة واحدة تجيب حرفيا على الكلمات التي سطّرتُها في السنّ 1', correctorAr: 'خاتمة غائبة = نقطة ضائعة. خاتمة لا تحوي كلمات السؤال = لا تُقرأ.' },
] as const;

// Les 3 phrases prêtes (d)
export const READY_SENTENCES = {
  extract: 'نلاحظ من الوثيقة … أنّ [العنصر] [يرتفع / ينخفض / يبقى ثابتا] من … إلى … [الوحدة] عند / بين …',
  link: 'ويُفسَّر ذلك بأنّ … [الآلية من الدرس] … ممّا يدلّ على …',
  conclude: 'ومنه نستنتج أنّ [كلمات السؤال المسطّرة] …',
} as const;

// Verso : chaîne et synthèse (ز)
export const SYNTHESIS = {
  chain: ['اِفهم 0', 'جزء I · 1 2 3 4', 'جزء II · 1 2 3 4', 'جزء III · 1 2 3 4', 'التركيب = يُجيب «اِفهم»'],
  templateAr: 'من الجزء I نعلم أنّ … ، ومن الجزء II أنّ … ، ومن الجزء III أنّ … ؛ ومنه [الإجابة على سطر «الهدف العام»].',
  correctorAr: 'تركيب بلا «ومنه» = نصف النقطة. معلومة من الدرس لم تظهر في الأجزاء = لا يُحتسب.',
} as const;

// ح : صيغتان خاصتان
export const SPECIAL_FORMS = {
  calcul: {
    labelAr: 'الحساب',
    cueAr: 'احسب…',
    teethAr: '2 = القانون بالحروف · 3 = التعويض خطوة خطوة · 4 = النتيجة بوحدتها',
    exampleAr: 'Chargaff : %A = %T …',
    correctorAr: 'القانون بالحروف = نقطة مستقلة حتى لو أخطأتَ في الحساب. نتيجة بلا خطوات = نصف النقطة. بلا وحدة = خصم.',
  },
  pedigree: {
    labelAr: 'شجرة النسب',
    cueAr: 'حدّد نمط الوراثة',
    teethAr: '2 = حدثان حاسمان: ① أبوان سليمان ← طفل مصاب (السيادة) ② بنت مصابة من أب سليم / ابن سليم من أم مصابة (الموقع) · 3 = لماذا يستبعد · 4 = الحكمان (متنحٍّ/سائد + جسمي/مرتبط بـ X) ثم الأنماط',
    correctorAr: 'نمط بلا الحكم الثاني = نصف النقطة دائما. بلا حدث حاسم للموقع: «على الأرجح جسمي لأنّ …» + مبرر = كاملة.',
  },
} as const;

// ط : عام vs خاص
export const CONCLUSION_CHECK = {
  questionAr: 'هل جملتي صحيحة لو غيّرنا اسم الجزيئة / الكائن؟',
  genericAr: 'عام («الإنزيم نوعي تجاه مادة التفاعل»)',
  specificAr: 'خاص («الغليكوكيناز نوعي تجاه الغلوكوز»)',
  ruleAr: 'إن طُلب الهدف العام → العام أولا، الخاص بين قوسين. إن طُلبت الوثيقة بعينها → العكس.',
  correctorAr: 'خاص مكان عام = «لم يعمّم» = نصف النقطة. عام مكان خاص = «لم يستعمل الوثيقة» = نصف النقطة.',
} as const;

// ي : جملة النجاة
export const RESCUE_SENTENCE = {
  describeInsteadOfExplain: 'وتفسير ذلك أنّ …… ثم الآلية. لا شطب.',
  explainInsteadOfDescribe: 'لا حيلة سوى الشطب — لهذا تُفحص البوابة قبل الكتابة.',
} as const;

// ك : شحذ
export const DRILL = {
  count: 12,
  secondsPer: 2,
  totalSec: 60,
  goal: '12/12 ثلاث مرات متتالية',
  examples: [
    'اذكر من الوثيقة 2 العناصر… (ورقة/صورة)',
    'اذكر مراحل… (رأس)',
    'فسّر بالاعتماد على معلوماتك والشكل 3… (ورقة بعمودين/فيلم)',
    'عرّف… (رأس)',
  ],
} as const;

// 📊 ما أحمله حسب مستواي
export const LEVELS = [
  { labelAr: 'متعثّر', cardAr: 'المفتاح كاملا (أ → هـ)', countAr: '10' },
  { labelAr: 'متوسط', cardAr: 'المفتاح + و، ز، ط', countAr: '≈ 13' },
  { labelAr: 'يستهدف الامتياز', cardAr: 'المفتاح+ كاملا — لكن لا شيء يُستدعى في آن واحد', countAr: '≈ 17' },
] as const;

// 📝 خمسة أخطاء تكلّف أكثر من الجهل
export const FIVE_COSTLY_ERRORS = [
  'إجابة بلا رقم سؤال — أكثر النقاط ضياعا عبثا.',
  'رقم بلا وحدة — يُعدّ خطأ لا نسيانا.',
  'خاتمة غائبة — الاستنتاج له نقطته المستقلة في كل سؤال «فيلم».',
  'شجرة نسب بحكم واحد — نصف النقطة مضمون الضياع.',
  'تركيب يعيد الأجزاء دون «ومنه» — الجملة الأغلى في الورقة.',
] as const;
