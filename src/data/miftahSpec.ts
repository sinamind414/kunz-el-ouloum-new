// src/data/miftahSpec.ts
// Spécification MIFTAH v3.1 — source unique du HTML, du moteur et des cartes React
// Pro : centralise la nomenclature, les couleurs, les gabarits et les erreurs coûteuses
// Marque : docs/MARQUE.md est le document de décision (noms, phrase-récit, placement).
//         Le garde-fou `npm run check:miftah` prouve la cohérence fiche ↔ spec ↔ carte.

export const MIFTAH_VERSION = '3.1' as const;
// Nom d'usage (UI, bouche de l'élève) — jamais autre chose
export const MIFTAH_NAME_AR = 'المفتاح';
// Nom officiel (documents légaux/CGU, argumentaire) — jamais abrégé
export const MIFTAH_NAME_OFFICIAL_AR = 'مفتاح المنهجية';
// Nom latin « MIFTAH » : réservé aux commentaires internes — interdit dans l'UI (docs/MARQUE.md §3)
export const MIFTAH_NAME_LATIN = 'MIFTAH';
export const MIFTAH_PLUS_AR = 'المفتاح+';
// Tagline descriptive (pas un nom)
export const MIFTAH_TAGLINE_AR = 'منهجية الإجابة في علوم الحياة والأرض · بكالوريا';
export const MIFTAH_BRAND_AR = 'كنز العلوم';

// Phrase-récit — UNE seule version, partout où la marque se présente (docs/MARQUE.md §2)
export const NARRATIVE_AR = 'كنز العلوم يُفتح بمفتاح المنهجية';
// Positionnement — la cible : l'élève qui connaît le cours mais perd les points
export const POSITIONING_AR = 'المقرر موجود عندك. المفتاح يحوّله إلى نقاط.';

export const MIFTAH_COLORS = {
  gold: '#c8962e', goldL: '#fbf3e2', goldD: '#8a6116',
  teal: '#0f6b6b', tealL: '#e5f3f3',
  red: '#b23a3a', redL: '#fdecec',
  ink: '#1f2328', mute: '#5b6470', line: '#e3e6ea',
} as const;

// Nomenclature — à utiliser partout (moteur, scorer, vues)
export const MIFTAH_NOMENCLATURE = {
  miftah: 'المفتاح',
  miftahPlus: 'المفتاح+',
  official: 'مفتاح المنهجية',
  sinn: 'السنّ',
  asnan: 'الأسنان',
  qafal: 'القفل',
  bawaba: 'البوابة',
  // Update 2026-09-06 (MARQUE §12) — TROIS portes, cascade :
  bawaba1: 'البوابة ١ — الوجود (قفل أم لا؟)',
  bawaba2: 'البوابة ٢ — المصدر (وثيقة أم مختلط؟)',
  bawaba3: 'البوابة ٣ — الحركة (📷 أم 🎬 أم 🔨؟)',
  s0: 'اِفهم',
  s1: 'تعرّف',
  s2: 'أدخل',
  s3: 'أدر',
  s4: 'افتح',
} as const;

// Phrase-mnémotechnique unique (MARQUE §12) — le geste physique de la clé
export const KEY_MNEMONIC_AR = 'تعرّف · أدخل · أدر · افتح — أربع حركات، لا أكثر، وينفتح القفل.';

// Les 3 mouvements de la porte 3 (MARQUE §12) — le 🔨 حدّاد est l'angle mort corrigé
export const MOVEMENTS = {
  photo: { id: 'photo' as const, labelAr: '📷 الصورة', verbsAr: 'حلل، صِف، استخرج، قارن', gearAr: 'وصف ثم استنتاج بسيط' },
  film: { id: 'film' as const, labelAr: '🎬 الفيلم', verbsAr: 'اشرح، فسر، اربط، بيّن آلية', gearAr: 'استنتاج يفسّر «لماذا»' },
  smith: { id: 'smith' as const, labelAr: '🔨 الحدّاد', verbsAr: 'اقترح، برر، ناقض، قدّم حلا', gearAr: 'تصنيع: منتج منطقي جديد (فرضية/اقتراح/توصية)' },
} as const;

export const STEP0 = {
  id: 0 as const,
  nameAr: 'اِفهم',
  lockAr: 'القفل', // la « dent 0 » n'est pas une dent : c'est le قفل que la clé (les 4 dents) ouvre
  templateAr: 'الهدف العام: …… (≤ 5 كلمات) — يُكتب أعلى المسودة بعد قراءة سياق التمرين',
  exampleAr: 'بغرض معرفة آلية عمل الأنسولين → الهدف العام: آلية عمل الأنسولين',
  checkAr: 'هل كتبت الهدف العام في سطر واحد قبل القراءة التفصيلية؟',
} as const;

// Les 4 dents — Update 2026-09-06 (MARQUE §12) : chaque dent nomme le GESTE d'une clé.
// Contenu pédagogique (actionAr/correctorAr) inchangé — seul le nom change.
export const ASNAN = [
  { id: 1 as const, nameAr: 'تعرّف', iconAr: '🔍', actionAr: 'أطوّق الفعل · أسطّر الكلمات المفتاحية · أرقّم إجابتي برقم السؤال', correctorAr: 'إجابة بلا رقم أو تحت رقم خاطئ = 0. الفعل الخاطئ = تفقد نقطة الفعل كاملة.' },
  { id: 2 as const, nameAr: 'أدخل', iconAr: '🔑', actionAr: 'أستخرج من الوثيقة أرقاما + وحدات + اتجاه التغيّر', correctorAr: 'نقطة الاستخراج للرقم مع وحدته. «يرتفع» وحدها = نصف نقطة. رقم بلا وحدة = خطأ.' },
  { id: 3 as const, nameAr: 'أدر', iconAr: '🔄', noteAr: 'إن سمح الفعل', actionAr: 'أربط المعطى بالسبب/الآلية من الدرس: «لأنّ…»', correctorAr: 'ربط بلا معطى = نصف النقطة. معطى بلا ربط والفعل يطلبه = نصف النقطة.' },
  { id: 4 as const, nameAr: 'افتح', iconAr: '🔓', actionAr: 'جملة واحدة تجيب حرفيا على الكلمات التي سطّرتُها في السنّ 1', correctorAr: 'خاتمة غائبة = نقطة ضائعة. خاتمة لا تحوي كلمات السؤال = لا تُقرأ.' },
] as const;

// Les 3 phrases prêtes (d)
export const READY_SENTENCES = {
  extract: 'نلاحظ من الوثيقة … أنّ [العنصر] [يرتفع / ينخفض / يبقى ثابتا] من … إلى … [الوحدة] عند / بين …',
  link: 'ويُفسَّر ذلك بأنّ … [الآلية من الدرس] … ممّا يدلّ على …',
  conclude: 'ومنه نستنتج أنّ [كلمات السؤال المسطّرة] …',
} as const;

// Verso : chaîne et synthèse (ز)
export const SYNTHESIS = {
  chain: ['القفل · اِفهم', 'جزء I · 1 2 3 4', 'جزء II · 1 2 3 4', 'جزء III · 1 2 3 4', 'التركيب = يُجيب «اِفهم»'],
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
  goal: '12/12 على ثلاثة أيام مختلفة',
  examples: [
    'حلل منحنى الوثيقة 1… (🚪 قفل · 📥 وثيقة · 📷)',
    'اذكر مراحل… (🚪 لا قفل · 🧠 الدُرج)',
    'فسّر بالاعتماد على معلوماتك والشكل 3… (🚪 قفل · 📥 مختلط · 🎬)',
    'اقترح فرضيتين انطلاقا من الوثيقة 1 ومعلوماتك… (🚪 قفل · 📥 مختلط · 🔨)',
  ],
} as const;

// Décision de déverrouillage — actée 2026-09-06 (docs/MARQUE.md §11 · D1)
// Drill 12/12 sur 3 JOURS DISTINCTS (un échec allonge l'intervalle, ne remet PAS le compteur à zéro)
//  → débloque : la Phase 2 (écriture guidée) + la badge « حامل المفتاح ».
// Le verso (المفتاح+) n'est publié qu'après : noyau stable sur 3 types de questions différents
//  (c'est le badge « أمين الكنز »).
// ✅ Implémenté dans v3Progress.ts : jours distincts (applyDrillResult), verso à 3 types
//    (recordTypeMastery), flag legacy grandfatheré — docs/MARQUE.md §11 D1.
export const UNLOCK_RULE = {
  drillGoalAr: '12/12 على ثلاثة أيام مختلفة',
  drillUnlocksAr: 'التدريب الموجَّه (المرحلة 2) + شارة «حامل المفتاح»',
  versoUnlocksAr: 'تثبيت النواة على ثلاثة أنواع مختلفة من الأسئلة',
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

// Fiche — partition recto/verso : les erreurs 1-3 (base) voyagent sur le recto avec
// tout le monde, 4-5 (formes avancées) restent sur le verso. Chaque chaîne doit
// contenir « — » (titre — explication) : c'est ce que fait le rendu en <b>.
export const RECTO_ERRORS = FIVE_COSTLY_ERRORS.slice(0, 3) as string[];
export const VERSO_ERRORS = FIVE_COSTLY_ERRORS.slice(3) as string[];

// Footer des deux faces — la même chaîne dans /miftah.html et MiftahCard (garde-fou check:miftah)
export const FOOTER_RECTO_AR = 'مفتاح المنهجية · كنز العلوم · الوجه الأول — المفتاح (10 عناصر) · يكفي وحده للأغلبية';
export const FOOTER_VERSO_AR = 'مفتاح المنهجية · كنز العلوم · الوجه الثاني — المفتاح+ · لا يحتاجه أحد في اليوم الأول';
