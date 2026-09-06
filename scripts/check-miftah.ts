// scripts/check-miftah.ts
// Garde-fou MARQUE — prouve la cohérence fiche ↔ spec ↔ carte React ↔ vue compilateur.
// Référence : docs/MARQUE.md (document de décision). Exécution : npm run check:miftah
//
// Ce que le script protège :
//   §3 nom verrouillé      : « المفتاح » (usage) / « مفتاح المنهجية » (officiel),
//                            variantes latines et « مفتاح الكنز » bannies de l'UI
//   §4 règle de placement  : les deux noms jamais ensemble hors en-tête de la fiche
//   §10 bugs corrigés      : السنّ 0 → القفل, erreurs 1-3 sur le recto, garde-fou A4
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p: string) => readFileSync(path.join(root, p), 'utf8');

const html = read('public/miftah.html');
const card = read('src/components/MiftahCard.tsx');
const spec = read('src/data/miftahSpec.ts');
const compiler = read('src/components/MethodologyCompilerView.tsx');

// Découpe la fiche : recto = avant la balise de commentaire « الوجه الثاني »
const versoIdx = html.indexOf('الوجه الثاني');
if (versoIdx <= 0) {
  console.error('✗ impossible de découper le recto/verso de public/miftah.html');
  process.exit(1);
}
const recto = html.slice(0, versoIdx);
const verso = html.slice(versoIdx);

let failures = 0;
const ok = (label: string) => console.log(`  ✓ ${label}`);
const fail = (label: string) => {
  failures++;
  console.error(`  ✗ ${label}`);
};
const must = (hay: string, needle: string, label: string) => (hay.includes(needle) ? ok(label) : fail(label));
const mustNot = (hay: string, needle: string, label: string) =>
  hay.includes(needle) ? fail(label) : ok(label);

console.log('Garde-fou MARQUE — référence : docs/MARQUE.md');

console.log('\n§ Spec — source unique (miftahSpec.ts)');
must(spec, "MIFTAH_NAME_OFFICIAL_AR = 'مفتاح المنهجية'", 'nom officiel figé');
must(spec, "MIFTAH_NAME_AR = 'المفتاح'", "nom d'usage figé");
must(spec, "NARRATIVE_AR = 'كنز العلوم يُفتح بمفتاح المنهجية'", 'phrase-récit figée');
must(spec, "POSITIONING_AR = 'المقرر موجود عندك. المفتاح يحوّله إلى نقاط.'", 'positionnement figé');
must(spec, "qafal: 'القفل'", 'nomenclature : القفل');
must(spec, 'FOOTER_RECTO_AR', 'constante footer recto');
must(spec, 'FOOTER_VERSO_AR', 'constante footer verso');
must(spec, 'RECTO_ERRORS = FIVE_COSTLY_ERRORS.slice(0, 3)', 'partition recto/verso des erreurs');
must(spec, "chain: ['القفل · اِفهم'", 'chaîne de synthèse : nœud القفل');
const errorsBlock = spec.match(/FIVE_COSTLY_ERRORS = \[([\s\S]*?)\] as const;/);
if (errorsBlock) {
  const items = (errorsBlock[1].match(/'[^']+'/g) ?? []).map(s => s.slice(1, -1));
  if (items.length === 5 && items.every(x => x.includes(' — '))) ok('5 erreurs, chacune « titre — explication » (rendu <b> OK)');
  else fail(`liste des 5 erreurs invalide (${items.length} items)`);
} else {
  fail('FIVE_COSTLY_ERRORS introuvable dans la spec');
}

console.log('\n§ Fiche — recto (public/miftah.html)');
must(recto, '<title>المفتاح · مفتاح المنهجية', 'title : usage + officiel');
must(recto, '<meta name="description" content="مفتاح المنهجية', 'meta description : officiel');
must(recto, '<h1>🔑 المفتاح</h1>', 'h1 : nom d’usage seul');
must(recto, '<div class="official">مفتاح المنهجية</div>', 'sous-titre discret : officiel');
must(recto, '<b>كنز العلوم</b>', 'marquage de la marque dans le header');
must(recto, 'مفتاح المنهجية · كنز العلوم · الوجه الأول', 'footer recto : officiel + marque');
must(recto, 'إجابة بلا رقم سؤال', 'erreur 1 sur le recto');
must(recto, 'رقم بلا وحدة', 'erreur 2 sur le recto');
must(recto, 'خاتمة غائبة', 'erreur 3 sur le recto');
mustNot(recto, 'شجرة نسب بحكم واحد', 'erreur 4 absente du recto');
mustNot(recto, 'السنّ 0', '« السنّ 0 » banni');
mustNot(recto, 'مفتاح الكنز', 'variante « مفتاح الكنز » bannie');
mustNot(html, 'MIFTAH', 'latin « MIFTAH » banni de la fiche');

console.log('\n§ Fiche — verso');
must(verso, '<b>كنز العلوم</b>', 'marquage de la marque dans le header');
must(verso, 'القفل — اِفهم', 'h3 : « القفل — اِفهم »');
must(verso, 'القفل · اِفهم', 'chaîne : nœud « القفل · اِفهم »');
must(verso, 'مفتاح المنهجية · كنز العلوم · الوجه الثاني', 'footer verso : officiel + marque');
must(verso, 'شجرة نسب بحكم واحد', 'erreur 4 sur le verso');
must(verso, 'دون «ومنه»', 'erreur 5 sur le verso');
must(verso, 'start="4"', 'numérotation continue (start=4)');
mustNot(verso, 'السنّ 0', '« السنّ 0 » banni');

console.log('\n§ Fiche — garde-fou A4 (le recto tient sur une page)');
must(html, '@page{size:A4', 'print : format A4');
must(html, 'page-break-before:always', 'verso : saut de page forcé');
must(html, 'font-size:10.4px', 'print : corps resserré (10.4 px)');
must(html, 'line-height:1.58', 'print : interlignage resserré');
must(html, 'width:168px;height:58px', 'print : SVG clé dimensionné pour l’A4');

console.log('\n§ Carte React (MiftahCard.tsx) — parité avec la fiche');
mustNot(card, '>MIFTAH', 'latin « MIFTAH » banni de la carte');
mustNot(card, 'MIFTAH v', 'latin « MIFTAH v…» banni des footers');
mustNot(card, 'MIFTAH+', 'latin « MIFTAH+ » banni');
mustNot(card, 'مفتاح الكنز', 'variante « مفتاح الكنز » bannie');
mustNot(card, 'السنّ 0', '« السنّ 0 » banni');
must(card, '{MIFTAH_NAME_AR}', 'h1 rendu depuis la constante');
must(card, '{MIFTAH_NAME_OFFICIAL_AR}', 'sous-titre rendu depuis la constante');
must(card, '<footer>{FOOTER_RECTO_AR}</footer>', 'footer recto rendu depuis la constante');
must(card, '{FOOTER_VERSO_AR}', 'footer verso rendu depuis la constante');
must(card, 'RECTO_ERRORS.map', 'erreurs 1-3 rendues depuis la spec');
must(card, 'VERSO_ERRORS.map', 'erreurs 4-5 rendues depuis la spec');
must(card, 'القفل — اِفهم', 'h3 : « القفل — اِفهم »');
must(card, 'font-size:10.4px', 'print : parité du resserré A4');

console.log('\n§ Vue compilateur (MethodologyCompilerView.tsx)');
mustNot(compiler, 'مفتاح الكنز', 'variante « مفتاح الكنز » bannie');
mustNot(compiler, '(MIFTAH)', 'latin « (MIFTAH) » banni des onglets');
must(compiler, '{MIFTAH_NAME_OFFICIAL_AR} v{MIFTAH_VERSION}', 'h1 : nom officiel (la marque se présente)');

console.log('\n§ Version — cohérence spec ↔ fiche');
const m = spec.match(/MIFTAH_VERSION = '([\d.]+)'/);
if (m) {
  const v = m[1];
  must(html, `v${v}`, `fiche : version v${v} (header)`);
  must(card, 'MIFTAH_VERSION', 'carte : version importée de la spec');
} else {
  fail('MIFTAH_VERSION introuvable dans la spec');
}

if (failures > 0) {
  console.error(`\n✗ ${failures} échec(s) — réaligner fiche/spec/carte sur docs/MARQUE.md`);
  process.exit(1);
}
console.log('\n✓ Garde-fou MARQUE OK — fiche, spec, carte et vue compilateur alignés');
