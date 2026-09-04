import { evaluateStudentProduction } from '../src/utils/methodologyScorer';
import { VERB_CARDS, TRAINING_EXERCISES } from '../src/data/methodologyEngine';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ ${label}`);
  }
}

function hasError(rep: ReturnType<typeof evaluateStudentProduction>, tag: string) {
  return rep.detectedErrors.some((e) => e.tag === tag);
}

console.log('\n=== Boussole Methodology Tests ===\n');

// 1. Duel scoreur vs boussole 12/12
console.log('1) Duel 12/12');
const duelCases = [
  { verbId: 'verb_analyse_v1', text: 'تمثل الوثيقة 1 منحنى تطور نسبة الإشعاع في العضيات الخلوية بدلالة الزمن حيث نلاحظ ارتفاعاً في الشبكة الهيولية ليبلغ 80% عند د 5 ثم انتقالاً إلى جهاز غولجي. الاستنتاج: يتم تركيب البروتين في الشبكة الهيولية ثم ينتقل لجهاز غولجي.' },
  { verbId: 'verb_explain_v1', text: 'الملاحظة: يصل السيال العصبي إلى النهاية قبل المشبكية. يعود ذلك إلى أن Ca2+ يدخل إلى الخلية مما يسبب تحرير الأستيل كولين في الشق المشبكي. وبالتالي توليد كمون عمل بعد مشبكي.' },
  { verbId: 'verb_compare_v1', text: 'أوجه التشابه: كلاهما استجابة مناعية نوعية مكتسبة تعتمد على التكاثر اللمفاوي وامتلاك ذاكرة مناعية. بينما الاستجابة الخلطية تستخدم أجساماً مضادة، في حين تستخدم الاستجابة الخلوية الخلايا LTc. الخلاصة: تتكامل الاستجابتان لضمان القضاء الشامل.' },
  { verbId: 'verb_compare_v1', text: 'أوجه التشابه: كلاهما استجابة مناعية نوعية. أوجه الاختلاف: المدة 7-10 أيام أولية مقابل 2-3 أيام ثانوية، والشدة ضعيفة أولية مقابل قوية ثانوية. الخلاصة: الاستجابة الثانوية أسرع وأقوى.' },
];
duelCases.forEach((c, i) => {
  const rep = evaluateStudentProduction(c.verbId, c.text, undefined, 3);
  assert(rep.icm >= 75, `duel ${i + 1}: ICM=${rep.icm}% (expected ≥75)`);
});

// 2. Calibration 8 profils
console.log('\n2) Calibration 8 profils');
const profiles = [
  { verbId: 'verb_analyse_v1', text: 'تمثل الوثيقة 1 منحنى تطور نسبة الإشعاع في العضيات بدلالة الزمن حيث نلاحظ ارتفاعاً في الشبكة الهيولية ليبلغ 80% عند د 5 ثم انتقالاً إلى جهاز غولجي. الاستنتاج: يتم تركيب البروتين في الشبكة الهيولية ثم ينتقل لجهاز غولجي.', expected: 75 },
  { verbId: 'verb_analyse_v1', text: 'تمثل الوثيقة 1 منحنى تطور نسبة الإشعاع. نلاحظ ارتفاعاً في الشبكة الهيولية ليبلغ 80% عند د 5. الاستنتاج: يتم تركيب البروتين.', expected: 75 },
  { verbId: 'verb_analyse_v1', text: 'نلاحظ منحنى الإشعاع. الاستنتاج: يتم تركيب البروتين.', expected: 75 },
  { verbId: 'verb_analyse_v1', text: 'بسبب الارتفاع في الشبكة الهيولية.', expected: 0 },
  { verbId: 'verb_analyse_v1', text: 'تمثل الوثيقة 4 منحنى السكر في الدم بدلالة الزمن حيث نلاحظ ارتفاعاً إلى 1,6 g/L بعد 30 دقيقة. الاستنتاج: يضمن التنظيم الهرموني استقرار نسبة السكر.', expected: 100 },
  { verbId: 'verb_explain_v1', text: 'الملاحظة: يصل السيال العصبي إلى النهاية قبل المشبكية. يعود ذلك إلى أن Ca2+ يدخل إلى الخلية مما يسبب تحرير الأستيل كولين. وبالتالي توليد كمون عمل بعد مشبكي.', expected: 75 },
  { verbId: 'verb_compare_v1', text: 'أوجه التشابه والاختلاف بين الاستجابتين المناعيتين.', expected: 50 },
  { verbId: 'verb_analyse_v1', text: 'تمثل الوثيقة 1 منحنى تطور نسبة الإشعاع في العضيات بدلالة الزمن حيث نلاحظ تزايداً في الشبكة الهيولية ليبلغ 80% عند د 5 ثم انتقالاً إلى جهاز غولجي ليبلغ 60% عند د 20. الاستنتاج: يتم تركيب البروتين في الشبكة الهيولية ثم ينتقل لجهاز غولجي.', expected: 75 },
];
profiles.forEach((p, i) => {
  const rep = evaluateStudentProduction(p.verbId, p.text, undefined, 3);
  assert(rep.icm === p.expected, `profile ${i + 1}: ICM=${rep.icm}% (expected ${p.expected}%)`);
});

// 3. Règles de détection
console.log('\n3) Detection rules');
const criteriaRules = [
  { verbId: 'verb_analyse_v1', text: 'تحليل وصفي لأن الارتفاع يعود إلى زيادة النشاط.', expectedError: 'premature_interpretation' },
  { verbId: 'verb_analyse_v1', text: 'الوثيقة 1 منحنى الإشعاع في الشبكة الهيولية يبلغ 80 g/L عند د 5.', expectedError: 'missing_unit' },
  { verbId: 'verb_compare_v1', text: 'مقارنة بدون روابط.', expectedError: 'comparison_without_criteria' },
  { verbId: 'verb_hypothesis_v1', text: 'ربما يؤثر الدواء على الريبوزوم.', expectedError: 'conditional_hypothesis' },
  { verbId: 'verb_analyse_v1', text: 'تحليل بدون استنتاج.', expectedError: 'missing_conclusion' },
];
criteriaRules.forEach((rule, i) => {
  const rep = evaluateStudentProduction(rule.verbId, rule.text, undefined, 3);
  assert(hasError(rep, rule.expectedError), `rule ${i + 1}: error '${rule.expectedError}' detected`);
});

// 4. Anti-faux positifs
console.log('\n4) Anti-false-positives');
const antiFp = [
  { verbId: 'verb_analyse_v1', text: 'الوثيقة 1 منحنى الإشعاع في الشبكة الهيولية يبلغ 80% عند د 5. الاستنتاج: يتم تركيب البروتين.' },
];
antiFp.forEach((c, i) => {
  const rep = evaluateStudentProduction(c.verbId, c.text, undefined, 3);
  assert(!hasError(rep, 'missing_reference'), `anti-fp ${i + 1}: no missing_reference`);
});

// 5. Exercices existent
console.log('\n5) Training exercises');
assert(TRAINING_EXERCISES.length >= 4, `≥4 exercises (found ${TRAINING_EXERCISES.length})`);
TRAINING_EXERCISES.forEach((ex, i) => {
  assert(ex.stage1.segments.length >= 3, `exercise ${i + 1}: ≥3 segments`);
  assert(ex.stage2.blanks.length >= 3, `exercise ${i + 1}: ≥3 blanks`);
});

// 6. VERB_CARDS integrity
console.log('\n6) VERB_CARDS integrity');
assert(VERB_CARDS.length >= 4, `≥4 verbs (found ${VERB_CARDS.length})`);
VERB_CARDS.forEach((v, i) => {
  assert(v.criteria.length >= 2, `verb ${i + 1}: ≥2 criteria (found ${v.criteria.length})`);
  assert(v.verbAr.length > 0, `verb ${i + 1}: has Arabic label`);
});

console.log(`\n=== Résultats: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
