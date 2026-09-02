export interface MindMapNode {
  id: string;
  label: string;
  category: 'core' | 'process' | 'molecule' | 'organelle' | 'rule' | 'condition' | 'outcome';
  unitId: number;
  unitTitle: string;
  summary: string;
  bacTip: string;
  keywords: string[];
  level: number; // 0 = root, 1 = main branch, 2 = sub-branch, 3 = detail
  color?: string;
  radius?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface MindMapLink {
  source: string | MindMapNode;
  target: string | MindMapNode;
  relation: string; // e.g. "يتطلب", "ينتج", "يحدث في", "يرتبط بـ", "يحفز"
  type?: 'primary' | 'secondary' | 'inhibitory' | 'catalytic';
}

export interface MindMapData {
  unitId: number;
  unitTitle: string;
  domain: string;
  rootId: string;
  nodes: MindMapNode[];
  links: MindMapLink[];
}

export const MIND_MAPS_DATABASE: Record<number, MindMapData> = {
  // الوحدة 1: آليات تركيب البروتين
  1: {
    unitId: 1,
    unitTitle: "آليات تركيب البروتين",
    domain: "المجال الأول: التخصص الوظيفي للبروتينات",
    rootId: "node-u1-root",
    nodes: [
      {
        id: "node-u1-root",
        label: "تركيب البروتين",
        category: "core",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "الظاهرة الحيوية الأساسية التي تقوم فيها الخلية بالتعبير المورثي عن المعلومة الوراثية المحمولة في الـ ADN لإنتاج سلاسل ببتيدية متخصصة وظيفياً.",
        bacTip: "في البكالوريا، تذكر دائماً أن التعبير المورثي يمر بمرحلتين رئيسيتين متعاقبتين زمنياً ومكانياً: الاستنساخ في النواة والترجمة في الهيولى.",
        keywords: ["تعبير مورثي", "ADN", "ARNm", "بروتين", "استنساخ", "ترجمة"],
        level: 0,
        color: "#006d37",
        radius: 38
      },
      // فرع الاستنساخ
      {
        id: "node-u1-transcription",
        label: "الاستنساخ (Transcription)",
        category: "process",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "المرحلة الأولى من التعبير المورثي، تحدث في النواة عند حقيقيات النوى، يتم خلالها تحويل الرسالة الوراثية المشفرة في الـ ADN إلى جزيء وسيط هو ARNm.",
        bacTip: "ركز على اتجاه القراءة من 3' إلى 5' للسلسلة المستنسخة، واتجاه تركيب ARNm الجديد من 5' إلى 3'.",
        keywords: ["نواة", "ADN", "ARNm", "سلسلة مستنسخة", "سلسلة غير مستنسخة"],
        level: 1,
        color: "#0284c7",
        radius: 28
      },
      {
        id: "node-u1-nucleus",
        label: "النواة (مقر الاستنساخ)",
        category: "organelle",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "العضية الحاوية على المادة الوراثية (ADN)، حيث تحدث فيها عملية الاستنساخ ثم يهاجر ARNm عبر الثقوب النووية إلى الهيولى.",
        bacTip: "مقر الاستنساخ هو النواة عند حقيقيات النوى، أما عند بدائيات النوى فيحدث في الهيولى مباشرة لتزامن الاستنساخ والترجمة.",
        keywords: ["غلاف نووي", "ثقوب نووية", "عصارة نووية"],
        level: 2,
        color: "#0284c7",
        radius: 22
      },
      {
        id: "node-u1-rna-polymerase",
        label: "إنزيم ARN بوليميراز",
        category: "molecule",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "الإنزيم النوعي المسؤول عن فك الروابط الهيدروجينية بين سلسلتي الـ ADN وقراءة السلسلة المستنسخة وربط النيوكليوتيدات الريبية الحرة بالتكامل.",
        bacTip: "مادة ألفا-أمانيتين (α-amanitine) تثبط هذا الإنزيم نوعياً وتوقف الاستنساخ في التمارين التجريبية.",
        keywords: ["إنزيم", "بلمرة", "تكامل القواعد", "تثبيط"],
        level: 2,
        color: "#0284c7",
        radius: 24
      },
      {
        id: "node-u1-mrna",
        label: "الرسول الوراثي (ARNm)",
        category: "molecule",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "جزيء أحادي السلسلة ناتج عن الاستنساخ، ينقل الشفرة الوراثية من النواة إلى الهيولى. يتركب من ريبوز منقوص الأكسجين وقواعد (A, U, C, G) وفوسفات.",
        bacTip: "يتميز ARNm بالقاعدة الآزوتية المميزة اليوراسيل (U) بدلاً من الثايمين (T)، ووجود سكر الريبوز التام C5H10O5.",
        keywords: ["يوراسيل", "سكر ريبوز", "أحادي السلسلة", "كودونات"],
        level: 2,
        color: "#0ea5e9",
        radius: 24
      },
      {
        id: "node-u1-transcription-steps",
        label: "مراحل الاستنساخ",
        category: "process",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "ثلاث خطوات ديناميكية متسلسلة: الانطلاق (البداية)، الاستطالة (الامتداد)، والنهاية (انفصال الإنزيم وتحرير جزيء ARNm المتشكل).",
        bacTip: "في أسئلة الوصف أو النصوص العلمية، يجب ذكر الشروط والإنزيم والاتجاه في كل مرحلة بدقة.",
        keywords: ["انطلاق", "استطالة", "نهاية", "تحرير"],
        level: 3,
        color: "#38bdf8",
        radius: 20
      },

      // فرع تنشيط الأحماض الأمينية
      {
        id: "node-u1-activation",
        label: "تنشيط الأحماض الأمينية",
        category: "process",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "عملية كيميائية حيوية في الهيولى يتم فيها ربط كل حمض أميني بجزيء ARNt النوعي الخاص به برابطة طاقوية، تمهيداً للترجمة.",
        bacTip: "تتطلب عملية التنشيط 4 عناصر: حمض أميني، ARNt نوعي، إنزيم التنشيط Aminoacyl-tRNA Synthetase، وطاقة ATP.",
        keywords: ["Aminoacyl-tRNA", "طاقة ATP", "إنزيم نوعي", "ربط استري"],
        level: 1,
        color: "#d97706",
        radius: 27
      },
      {
        id: "node-u1-trna",
        label: "الناقل (ARNt)",
        category: "molecule",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "جزيء ريبي ناقل يتميز ببنية ورقة النفل ثلاثية الأبعاد، يحتوي موقعين نوعيين: موقع تثبيت الحمض الأميني (في النهاية 3' CCA) وموقع الرامزة المضادة.",
        bacTip: "الرامزة المضادة (Anti-codon) هي المحددة لتكامل ARNt مع رامزة ARNm في الريبوزوم.",
        keywords: ["ورقة النفل", "موقع التثبيت", "رامزة مضادة", "CCA"],
        level: 2,
        color: "#d97706",
        radius: 22
      },
      {
        id: "node-u1-activation-enzyme",
        label: "إنزيم التنشيط النوعي",
        category: "molecule",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "إنزيم يتميز بموقعي تثبيت نوعيين: موقع خاص بالحمض الأميني وموقع خاص بـ ARNt الموافق، ويعمل بوجود طاقة ATP المحلأة إلى AMP + PPi.",
        bacTip: "يمثل الإنزيم الدقة المزدوجة للترجمة: التعرف على الحمض الأميني والتعرف على ARNt الخاص به.",
        keywords: ["تكامل بنيوي", "نوعية مزدوجة", "ATP", "إماهة"],
        level: 2,
        color: "#f59e0b",
        radius: 22
      },

      // فرع الترجمة
      {
        id: "node-u1-translation",
        label: "الترجمة (Translation)",
        category: "process",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "تحويل الشفرة الوراثية المكتوبة بلغة نووية (تتابع نيوكليوتيدات ARNm) إلى لغة بروتينية (تتابع أحماض أمينية في السلسلة الببتيدية).",
        bacTip: "تجري الترجمة في الهيولى وتمر بثلاث مراحل: الانطلاق، الاستطالة، النهاية.",
        keywords: ["ريبوزوم", "لغة بروتينية", "كودونات", "رابطة ببتيدية"],
        level: 1,
        color: "#16a34a",
        radius: 28
      },
      {
        id: "node-u1-ribosome",
        label: "الريبوزوم (العضية المحركة)",
        category: "organelle",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "عضية خلوية مجهرية تتكون من تحت وحدتين: صغرى (تحوي موقع قراءة ARNm) وكبرى (تحوي موقعين تحفيزيين P و A لتشكل الروابط الببتيدية).",
        bacTip: "الموقع P (Peptidyl) مخصص لتثبيت معقد الانطلاق والسلسلة النامية، والموقع A (Aminoacyl) مخصص لاستقبال الحمض الأميني الجديد.",
        keywords: ["تحت وحدة صغرى", "تحت وحدة كبرى", "موقع P", "موقع A", "ARNr"],
        level: 2,
        color: "#16a34a",
        radius: 25
      },
      {
        id: "node-u1-genetic-code",
        label: "الشفرة الوراثية (Genetic Code)",
        category: "rule",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "نظام التوافق بين الرامزات الثلاثية للأحماض النووية والأحماض الأمينية (64 رامزة: 61 تشفر لـ 20 حمضاً أمينياً و 3 رامزات توقف).",
        bacTip: "رامزة الانطلاق هي دائماً AUG وتشفر للميثيونين (Met). رامزات التوقف (UAA, UAG, UGA) لا تشفر لأي حمض أميني.",
        keywords: ["AUG", "رامزة توقف", "ترادف الشفرة", "شمولية"],
        level: 2,
        color: "#10b981",
        radius: 22
      },
      {
        id: "node-u1-polysome",
        label: "البوليزوم (Polysome)",
        category: "organelle",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "تجمع عدة ريبوزومات على نفس جزيء ARNm، يسمح بتركيب كميات معتبرة ومكثفة من نفس السلسلة الببتيدية في زمن قياسي.",
        bacTip: "يحدد اتجاه حركة الريبوزومات على ARNm حسب طول السلاسل الببتيدية النامية (من الأقصر إلى الأطول = من 5' إلى 3').",
        keywords: ["قراءة متزامنة", "مردودية عالية", "سلاسل نامية"],
        level: 2,
        color: "#059669",
        radius: 22
      },
      {
        id: "node-u1-translation-steps",
        label: "مراحل الترجمة (انطلاق - استطالة - نهاية)",
        category: "process",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "تشكل معقد الانطلاق، ثم انتقال الريبوزوم خطوة بخطوة وإضافة الأحماض بروابط ببتيدية، وصولاً لرامزة التوقف وفصل الببتيد وميثيونين البداية.",
        bacTip: "يتم قص حمض الميثيونين الأول نوعياً بواسطة إنزيم خاص في نهاية الترجمة ليصبح البروتين ناضجاً.",
        keywords: ["معقد الانطلاق", "إزاحة الريبوزوم", "قص الميثيونين", "تحرر الببتيد"],
        level: 3,
        color: "#34d399",
        radius: 20
      },
      {
        id: "node-u1-protein-output",
        label: "السلسلة الببتيدية المتشكلة",
        category: "outcome",
        unitId: 1,
        unitTitle: "آليات تركيب البروتين",
        summary: "الناتج النهائي للتعبير المورثي، تهاجر إلى تجويف الشبكة الهيولية وجهاز غولجي لاكتساب بنيتها الفراغية الثلاثية الأبعاد والتخصص الوظيفي.",
        bacTip: "تكتسب السلسلة وظيفتها فقط بعد اكتساب بنية فراغية مستقرة ومحددة بدقة.",
        keywords: ["بنية أولية", "نضج البروتين", "جهاز غولجي", "وظيفة حيوية"],
        level: 1,
        color: "#8b5cf6",
        radius: 26
      }
    ],
    links: [
      { source: "node-u1-root", target: "node-u1-transcription", relation: "المرحلة الأولى", type: "primary" },
      { source: "node-u1-root", target: "node-u1-activation", relation: "المرحلة التحضيرية", type: "primary" },
      { source: "node-u1-root", target: "node-u1-translation", relation: "المرحلة الثانية", type: "primary" },
      { source: "node-u1-transcription", target: "node-u1-nucleus", relation: "يحدث داخل", type: "primary" },
      { source: "node-u1-transcription", target: "node-u1-rna-polymerase", relation: "يتم بواسطة", type: "catalytic" },
      { source: "node-u1-transcription", target: "node-u1-mrna", relation: "ينتج عنه", type: "primary" },
      { source: "node-u1-transcription", target: "node-u1-transcription-steps", relation: "يتكون من", type: "secondary" },
      { source: "node-u1-activation", target: "node-u1-trna", relation: "يربط الحمض بـ", type: "primary" },
      { source: "node-u1-activation", target: "node-u1-activation-enzyme", relation: "يحفزه", type: "catalytic" },
      { source: "node-u1-mrna", target: "node-u1-translation", relation: "يحمل القالب لـ", type: "primary" },
      { source: "node-u1-trna", target: "node-u1-translation", relation: "ينقل الأحماض لـ", type: "primary" },
      { source: "node-u1-translation", target: "node-u1-ribosome", relation: "يتم على مستوى", type: "primary" },
      { source: "node-u1-translation", target: "node-u1-genetic-code", relation: "يخضع لقواعد", type: "secondary" },
      { source: "node-u1-translation", target: "node-u1-polysome", relation: "يتكثف عبر", type: "secondary" },
      { source: "node-u1-translation", target: "node-u1-translation-steps", relation: "يمر عبر", type: "secondary" },
      { source: "node-u1-translation", target: "node-u1-protein-output", relation: "ينتج عنه مباشرة", type: "primary" }
    ]
  },

  // الوحدة 2: العلاقة بين بنية ووظيفة البروتين
  2: {
    unitId: 2,
    unitTitle: "العلاقة بين بنية ووظيفة البروتين",
    domain: "المجال الأول: التخصص الوظيفي للبروتينات",
    rootId: "node-u2-root",
    nodes: [
      {
        id: "node-u2-root",
        label: "بنية ووظيفة البروتين",
        category: "core",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "تتوقف الوظيفة الحيوية للبروتين على بنيته الفراغية المحددة وراثياً بنوع وعدد وترتيب الأحماض الأمينية والروابط الكيميائية الناشئة بين جذورها.",
        bacTip: "أي تغير في تتابع الأحماض الأمينية (طفرة) أو تفكك الروابط الكيميائية يؤدي إلى تغير أو فقدان البنية الفراغية وبالتالي فقدان التخصص الوظيفي.",
        keywords: ["بنية فراغية", "تخصص وظيفي", "أحماض أمينية", "روابط كيميائية", "خاصية حمقلية"],
        level: 0,
        color: "#006d37",
        radius: 38
      },
      {
        id: "node-u2-amino-acid-structure",
        label: "بنية الحمض الأميني العامة",
        category: "molecule",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "يتركب من كربون ألفا مركزي (Cα) متصل بـ: وظيفة أمينية (-NH2)، وظيفة كربوكسيلية حمضية (-COOH)، ذرة هيدروجين (-H)، وجذر متغير (R).",
        bacTip: "الجذر (R) هو المسؤول عن تنوع وتصنيف الأحماض الأمينية (حمضية، قاعدية، متعادلة كارهة أو محبة للماء، كبريتية).",
        keywords: ["Cα", "وظيفة أمينية", "وظيفة حمضية", "جذر R"],
        level: 1,
        color: "#3b82f6",
        radius: 27
      },
      {
        id: "node-u2-amphoteric",
        label: "السلوك الأمفوتيري (الحمقلي)",
        category: "rule",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "قدرة الحمض الأميني على السلوك كحمض (فقدان H+) في الأوساط القاعدية، أو السلوك كقاعدة (اكتساب H+) في الأوساط الحمضية.",
        bacTip: "المعادلة الذهبية: pH > pHi (شحنة سالبة -> مصعد +)، pH < pHi (شحنة موجبة -> مهبط -)، pH = pHi (شحنة معدومة -> لا هجرة).",
        keywords: ["خاصية حمقلية", "تأين", "شحنة إجمالية", "هجرة كهربائية"],
        level: 1,
        color: "#8b5cf6",
        radius: 28
      },
      {
        id: "node-u2-phi",
        label: "نقطة التعادل الكهربائي (pHi)",
        category: "condition",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "درجة حموضة الوسط التي تكون عندها الشحنة الإجمالية للحمض الأميني أو البروتين معدومة (Zwitterion)، فيتساوى عدد الشحنات الموجبة والسالبة.",
        bacTip: "عند pHi يترسب البروتين أو يبقى في منتصف شريط الهجرة الكهربائية لانعدام حركته في الحقل الكهربائي.",
        keywords: ["Zwitterion", "شحنة صفرية", "ترسيب", "استقرار كهربائي"],
        level: 2,
        color: "#a855f7",
        radius: 23
      },
      {
        id: "node-u2-structural-levels",
        label: "مستويات البنية الفراغية",
        category: "process",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "تتدرج البنية من البسيطة إلى المعقدة: أولية (خطية)، ثانوية (حلزون α أو صفائح β)، ثالثية (بنية ثلاثية الأبعاد مستقرة)، ورابعية (تجمع عدة تحت وحدات).",
        bacTip: "البنية الثالثية هي الحد الأدنى لاكتساب النشاط الوظيفي لأغلب البروتينات الفردية، وتتميز بوجود مناطق انعطاف.",
        keywords: ["بنية أولية", "بنية ثانوية", "بنية ثالثية", "بنية رابعية", "مناطق انعطاف"],
        level: 1,
        color: "#ec4899",
        radius: 28
      },
      {
        id: "node-u2-chemical-bonds",
        label: "الروابط الكيميائية الحافظة للبنية",
        category: "molecule",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "أربعة أصناف من الروابط تنشأ بين الجذور R المتقاربة فراغياً: روابط شاردية (بين -NH3+ و -COO-)، روابط كبريتية (بين Cys)، روابط هيدروجينية، وتجاذب الجذور الكارهة للماء.",
        bacTip: "الجسر الكبريتي (Pont disulfure) هو الرابطة التساهمية الوحيدة في البنية الثالثية وهو الأشد مقاومة للحرارة.",
        keywords: ["جسر كبريتي", "رابطة شاردية", "رابطة هيدروجينية", "كارهة للماء"],
        level: 2,
        color: "#f43f5e",
        radius: 25
      },
      {
        id: "node-u2-peptide-bond",
        label: "الرابطة الببتيدية (-CO-NH-)",
        category: "molecule",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "رابطة تساهمية قوية تربط الوظيفة الحمضية لحمض أميني بالوظيفة الأمينية للحمض الموالي مع تحرير جزيء ماء (H2O).",
        bacTip: "عدد الروابط الببتيدية في سلسلة = عدد الأحماض الأمينية - 1 = عدد جزيئات الماء المتحررة.",
        keywords: ["تكاثف", "تحرير ماء", "رابطة تساهمية", "سلسلة ببتيدية"],
        level: 2,
        color: "#3b82f6",
        radius: 22
      },
      {
        id: "node-u2-ph-temp-factors",
        label: "تأثير الـ pH والحرارة",
        category: "condition",
        unitId: 2,
        unitTitle: "العلاقة بين بنية ووظيفة البروتين",
        summary: "الحرارة المرتفعة تكسر الروابط الهيدروجينية والشاردية (تخريب غير عكوس). تغير الـ pH يغير الحالة الأيونية للجذور R مما يفكك الروابط الشاردية.",
        bacTip: "في التمارين، الحرارة المنخفضة تثبط البروتين عكوساً، بينما الحرارة المرتفعة والـ pH المتطرف يخربان الموقع الفعال نهائياً.",
        keywords: ["تخريب البروتين", "تفكك الروابط", "عكوسية", "الموقع الفعال"],
        level: 2,
        color: "#e11d48",
        radius: 23
      }
    ],
    links: [
      { source: "node-u2-root", target: "node-u2-amino-acid-structure", relation: "الوحدة الأساسية", type: "primary" },
      { source: "node-u2-root", target: "node-u2-amphoteric", relation: "الخاصية الكيميائية", type: "primary" },
      { source: "node-u2-root", target: "node-u2-structural-levels", relation: "المستويات الفراغية", type: "primary" },
      { source: "node-u2-amino-acid-structure", target: "node-u2-peptide-bond", relation: "يشكل روابط", type: "primary" },
      { source: "node-u2-amphoteric", target: "node-u2-phi", relation: "يتحدد وفق", type: "primary" },
      { source: "node-u2-structural-levels", target: "node-u2-chemical-bonds", relation: "تستقر بفضل", type: "primary" },
      { source: "node-u2-chemical-bonds", target: "node-u2-ph-temp-factors", relation: "تتأثر بـ", type: "secondary" },
      { source: "node-u2-amphoteric", target: "node-u2-ph-temp-factors", relation: "يرتبط بـ", type: "secondary" }
    ]
  },

  // الوحدة 3: دور البروتينات في الدفاع عن الذات (المناعة)
  3: {
    unitId: 3,
    unitTitle: "دور البروتينات في الدفاع عن الذات",
    domain: "المجال الأول: التخصص الوظيفي للبروتينات",
    rootId: "node-u3-root",
    nodes: [
      {
        id: "node-u3-root",
        label: "المناعة والدفاع عن الذات",
        category: "core",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "منظومة دفاعية خلوية وجزيئية تتدخل فيها بروتينات متخصصة للتمييز بين مكونات الذات والقضاء الانتقائي على عناصر اللاذات.",
        bacTip: "تعتمد المناعة النوعية على مسارين متكاملين: الخلطي (أجسام مضادة ضد المستضدات الحرة) والخلوي (خلايا LTc ضد الخلايا المصابة والسرطانية).",
        keywords: ["ذات ولاذات", "MHC", "استجابة خلطية", "استجابة خلوية", "أجسام مضادة", "تعاون مناعي"],
        level: 0,
        color: "#006d37",
        radius: 38
      },
      {
        id: "node-u3-self-non-self",
        label: "التمييز بين الذات واللاذات",
        category: "rule",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "قدرة الجهاز المناعي على التعرف على خلايا الجسم الخاصة عبر محددات سطحية غشائية وراثية ومهاجمة أي جسم غريب (مستضد).",
        bacTip: "الذات = مجموع الجزيئات المحددة وراثياً والخاصة بالفرد (CMH / زمر دموية)، اللاذات = كل جزيء غريب يثير استجابة مناعية.",
        keywords: ["مستضد", "محدد المستضد", "تسامح مناعي", "مولد الضد"],
        level: 1,
        color: "#0284c7",
        radius: 27
      },
      {
        id: "node-u3-mhc",
        label: "معقد التوافق النسيجي (CMH / HLA)",
        category: "molecule",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "بروتينات غشائية سكرية مشفرة بـ 4 مورثات متعددة الأليلات (A, B, C, DP, DQ, DR) بدون سيادة، مما يجعل لكل فرد هوية بيولوجية فريدة.",
        bacTip: "CMH-I يوجد على جميع الخلايا ذات النواة ويعرض ببتيد مستضدي لـ LT8 (CD8). CMH-II يوجد على الخلايا العارضة (CPA) ويعرض لـ LT4 (CD4).",
        keywords: ["CMH-I", "CMH-II", "تعدد الأليلات", "غياب السيادة", "ببتيد مستضدي"],
        level: 2,
        color: "#0284c7",
        radius: 25
      },
      {
        id: "node-u3-humoral",
        label: "الاستجابة المناعية الخلطية",
        category: "process",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "مسار مناعي نوعي يتم بانتقاء خلايا LB الحاملة لمستقبلات BCR، ثم تكاثرها وتمايزها إلى خلايا بلازمية مفرزة لأجسام مضادة سارية في السوائل.",
        bacTip: "تستهدف المستضدات السائلة، البكتيريا خارج خلوية، والسموم (التوكسينات).",
        keywords: ["لمفاويات LB", "خلايا بلازمية", "أجسام مضادة", "BCR", "معقد مناعي"],
        level: 1,
        color: "#f59e0b",
        radius: 28
      },
      {
        id: "node-u3-antibody",
        label: "الجسم المضاد (Immunoglobulin)",
        category: "molecule",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "بروتين سكري غلوبوليني بشكل حرف Y، يتكون من 4 سلاسل ببتيدية (سلسلتين ثقيلتين H وسلسلتين خفيفتين L) ترتبط بجسور كبريتية، ويحوي موقعين لتثبيت المستضد.",
        bacTip: "الموقع المتغير في الجسم المضاد يضمن النوعية التامة، والموقع الثابت يضمن التثبت على البالعات وتفعيل المتمم.",
        keywords: ["سلاسل H و L", "منطقة متغيرة", "منطقة ثابتة", "تكامل بنيوي"],
        level: 2,
        color: "#f59e0b",
        radius: 24
      },
      {
        id: "node-u3-cellular",
        label: "الاستجابة المناعية الخلوية",
        category: "process",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "مسار مناعي نوعي يستهدف الخلايا المصابة بفيروسات والخلايا السرطانية والطعم المرفوض بواسطة الخلايا اللمفاوية السامة LTc.",
        bacTip: "تتطلب تعرفاً مزدوجاً بواسطة TCR على [CMH-I + ببتيد مستضدي] بمساعدة مؤشر CD8.",
        keywords: ["لمفاويات LT8", "خلايا LTc", "TCR", "CD8", "صدمة حلولية"],
        level: 1,
        color: "#dc2626",
        radius: 28
      },
      {
        id: "node-u3-perforin",
        label: "البيرفورين والغرونزيم (آلية الإقصاء)",
        category: "molecule",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "بروتينات سامة تفرزها LTc عند التماس بالخلية المستهدفة، حيث يثقب البيرفورين الغشاء بتشكيل قنوات حلولية ويدخل الغرانزيم لتحفيز التحلل النووي.",
        bacTip: "البيرفورين = قنوات غشائية وصدمة حلولية. الغرانزيم = تنشيط إنزيمات الموت الخلوي المبرمج (Apoptosis).",
        keywords: ["قنوات حلولية", "دخول الماء والشوارد", "موت مبرمج", "إفراز حلولي"],
        level: 2,
        color: "#ef4444",
        radius: 24
      },
      {
        id: "node-u3-cooperation",
        label: "التعاون المناعي والإنترلوكين (IL-2)",
        category: "process",
        unitId: 3,
        unitTitle: "دور البروتينات في الدفاع عن الذات",
        summary: "تنشيط الخلايا المساعدة LT4 بعد تعرفها على المستضد المعروض مع CMH-II بواسطة TCR ومؤشر CD4، وإفرازها لـ IL-2 المحفز لتكاثر وتمايز LB و LT8.",
        bacTip: "الـ LT4 هي قاطرة ومفتاح الجهاز المناعي، واستهدافها بواسطة فيروس السيدا (VIH) يؤدي إلى انهيار تام للمناعة الخلطية والخلوية.",
        keywords: ["LT4 / LTh", "إنترلوكين 2", "تحفيز ذاتي", "CPA", "سيدا VIH"],
        level: 1,
        color: "#8b5cf6",
        radius: 27
      }
    ],
    links: [
      { source: "node-u3-root", target: "node-u3-self-non-self", relation: "القاعدة الأساسية", type: "primary" },
      { source: "node-u3-self-non-self", target: "node-u3-mhc", relation: "يتحدد بواسطة", type: "primary" },
      { source: "node-u3-root", target: "node-u3-humoral", relation: "المسار الخلطي", type: "primary" },
      { source: "node-u3-humoral", target: "node-u3-antibody", relation: "تنتج وتفرز", type: "primary" },
      { source: "node-u3-root", target: "node-u3-cellular", relation: "المسار الخلوي", type: "primary" },
      { source: "node-u3-cellular", target: "node-u3-perforin", relation: "تتدخل عبر", type: "primary" },
      { source: "node-u3-root", target: "node-u3-cooperation", relation: "ينسقه ويحفزه", type: "primary" },
      { source: "node-u3-cooperation", target: "node-u3-humoral", relation: "يحفز تكاثر وتمايز", type: "catalytic" },
      { source: "node-u3-cooperation", target: "node-u3-cellular", relation: "يحفز تكاثر وتمايز", type: "catalytic" }
    ]
  }
};
