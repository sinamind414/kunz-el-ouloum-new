// drillBank.ts — Phase 0 + Phase 1 (docs/AUDIT_APPROCHE_APP.md §6, ligne 3)
//
// Phase 1 : le drill « مصفاة التعليمات » tire 12 consignes sur une banque ≥ 50,
// à JOURNÉE FIXE (même tirage le même jour, nouveau tirage le lendemain) —
// anti-mémorisation (D3, MARQUE §11) : la règle est stable, les éléments tournent.
//
// Deux portes par consigne (fiche ك) :
//   Porte 1 — source : paper (ورقة) / memory (رأس) / dual (عمودان : وثيقة + معلومات)
//   Porte 2 — mode   : image (صورة = description) / film (فيلم = raisonné, lien causal)
//
// Règles d'écriture (auto-vérifiées au chargement en DEV + par le test vitest) :
//   - source est DÉRIVÉ par le moteur (detectSourceGate / isDualSource) : les mots-clés
//     document (وثيقة/شكل/جدول/منحنى/رسم/صورة/سند/بيان/مخطط) ⇒ paper ; + « معلومات » ⇒ dual ;
//     sinon memory. Les consignes mémoire NE CONTIENNENT AUCUN mot document.
//   - mode est DÉRIVÉ du verbe (switch de la carte v2) : closed ⇒ image, open ⇒ film.
//     D2 (MARQUE §11) : استنتج = film.

import { getVerbCardV2, detectSourceGate, isDualSource } from './methodologyEngine';

export type DrillSource = 'paper' | 'memory' | 'dual';
export type DrillMode = 'image' | 'film';

export interface DrillConsigne {
  /** Identifiant stable dans la banque. */
  id: string;
  /** Ordre d'affichage (stable dans un tirage). */
  seq: number;
  /** La consigne (impératif SVT BAC). */
  consigne: string;
  /** Carte v2 du verbe d'action (détermine le mode). */
  verbCardId: string;
  /** Porte 1 — intention éditoriale (doit coïncider avec le dérivé du moteur). */
  source: DrillSource;
  /** Porte 2 — dérivé du switch du verbe. */
  mode: DrillMode;
}

interface RawConsigne { id: string; consigne: string; verbCardId: string; source: DrillSource; }

/** source dérivé par le moteur — la règle produit. */
export function deriveSource(consigne: string): DrillSource {
  if (isDualSource(consigne)) return 'dual';
  return detectSourceGate(consigne);
}

/** mode dérivé du switch du verbe (closed ⇒ image / open ⇒ film). */
export function deriveMode(verbCardId: string): DrillMode {
  const card = getVerbCardV2(verbCardId);
  if (!card) throw new Error(`[drillBank] carte inconnue : ${verbCardId}`);
  return card.switch === 'open' ? 'film' : 'image';
}

const RAW: RawConsigne[] = [
  // ── ورقة + صورة (sند, description) ─────────────────────────────
  { id:'p01', consigne:'حلل منحنى الوثيقة 1', verbCardId:'verb_analyse_v1', source:'paper' },
  { id:'p02', consigne:'حلل الوثيقة ١', verbCardId:'verb_analyse_v1', source:'paper' },
  { id:'p03', consigne:'قارن بين المنحنيين', verbCardId:'verb_compare_v1', source:'paper' },
  { id:'p04', consigne:'قارن الجدول 1 مع الجدول 2', verbCardId:'verb_compare_v1', source:'paper' },
  { id:'p05', consigne:'استخرج من الجدول', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p06', consigne:'استخرج القيم من منحنى الوثيقة 2', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p07', consigne:'حدد من الشكل 2 العضية المعنية', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p08', consigne:'حدد من الوثيقة 3 العناصر الأساسية', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p09', consigne:'صف مظهر المستضد في الصورة 1', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p10', consigne:'صف الشكل 4 خطوة خطوة', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p11', consigne:'اذكر من الوثيقة 2 المراحل المرقمة', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p12', consigne:'لخص في رسم تخطيطي معطيات الوثيقة', verbCardId:'verb_schema_v1', source:'paper' },
  { id:'p13', consigne:'أنجز مخططا انطلاقا من الجدول 1', verbCardId:'verb_schema_v1', source:'paper' },
  { id:'p14', consigne:'عيّن من البيان 1 مرحلة الانقسام', verbCardId:'verb_list_v1', source:'paper' },
  { id:'p15', consigne:'صف شكل الخلية', verbCardId:'verb_list_v1', source:'paper' },

  // ── ورقة + فيلم (sند, raisonnement) ────────────────────────────
  { id:'pf01', consigne:'فسر منحنى الوثيقة 1', verbCardId:'verb_explain_v1', source:'paper' },
  { id:'pf02', consigne:'علل سبب الانخفاض في منحنى الوثيقة 2', verbCardId:'verb_explain_v1', source:'paper' },
  { id:'pf03', consigne:'وضّح العلاقة بين متغيرات الشكل 3', verbCardId:'verb_explain_v1', source:'paper' },
  { id:'pf04', consigne:'بيّن الآلية المفسرة لمنحنى الوثيقة 1', verbCardId:'verb_explain_multi_v1', source:'paper' },
  { id:'pf05', consigne:'استنتج العلاقة من منحنى الوثيقة', verbCardId:'verb_deduce_v1', source:'paper' },
  { id:'pf06', consigne:'استنتج من الوثيقتين 1 و2', verbCardId:'verb_deduce_v1', source:'paper' },
  { id:'pf07', consigne:'فسّر تذبذب منحني الوثيقة', verbCardId:'verb_explain_v1', source:'paper' },
  { id:'pf08', consigne:'وضّح دور الشكل 2 في الظاهرة', verbCardId:'verb_explain_v1', source:'paper' },
  { id:'pf09', consigne:'فسّر الشكل 3 بالاعتماد على معطياته', verbCardId:'verb_explain_v1', source:'paper' },
  { id:'pf10', consigne:'علّل استقرار منحنى الوثيقة بعد الدقيقة 20', verbCardId:'verb_explain_v1', source:'paper' },
  { id:'pf11', consigne:'وضّح ما تكشفه الوثيقة 2 حول الآلية', verbCardId:'verb_explain_multi_v1', source:'paper' },
  { id:'pf12', consigne:'فسر الوثيقة 1', verbCardId:'verb_explain_v1', source:'paper' },

  // ── عمودان (وثيقة + معلومات) ───────────────────────────────────
  { id:'d01', consigne:'فسر الوثيقة مستعينا بمعلوماتك', verbCardId:'verb_explain_v1', source:'dual' },
  { id:'d02', consigne:'استنتج العلاقة من الوثيقة ومعلوماتك', verbCardId:'verb_deduce_v1', source:'dual' },
  { id:'d03', consigne:'وضّح مستعينا بالوثيقة ومعلوماتك', verbCardId:'verb_explain_v1', source:'dual' },
  { id:'d04', consigne:'فسّر بالاعتماد على معلوماتك والشكل 3', verbCardId:'verb_explain_v1', source:'dual' },
  { id:'d05', consigne:'بيّن آلية الظاهرة بالاعتماد على معلوماتك ومنحنى الوثيقة', verbCardId:'verb_explain_multi_v1', source:'dual' },
  { id:'d06', consigne:'استنتج سبب النتيجة من الوثيقة ومعلوماتك', verbCardId:'verb_deduce_v1', source:'dual' },
  { id:'d07', consigne:'وضّح دور المنحنى 2 بالاستعانة بمعلوماتك', verbCardId:'verb_explain_v1', source:'dual' },
  { id:'d08', consigne:'قارن المنحنى 1 مع معلوماتك', verbCardId:'verb_compare_v1', source:'dual' },
  { id:'d09', consigne:'علل الظاهرة مستعينا بالوثيقة 1 ومعلوماتك', verbCardId:'verb_explain_v1', source:'dual' },
  { id:'d10', consigne:'وضّح التكامل بين الوثيقة 2 ومعلوماتك', verbCardId:'verb_explain_multi_v1', source:'dual' },

  // ── رأس + صورة (mémoire, description) ──────────────────────────
  { id:'m01', consigne:'عرّف الإنزيم', verbCardId:'verb_define_v1', source:'memory' },
  { id:'m02', consigne:'عرّف المناعة النوعية', verbCardId:'verb_define_v1', source:'memory' },
  { id:'m03', consigne:'اذكر مراحل الترجمة', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m04', consigne:'اذكر مراحل الانقسام الميئوزي', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m05', consigne:'عدّد أنواع الأجسام المضادة', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m06', consigne:'سمّ العضيات الغشائية', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m07', consigne:'صف دورة حياة الديدان المستديرة', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m08', consigne:'أعدد خصائص الاستجابة الخلطية', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m09', consigne:'حدد موقع الإنزيم في الخلية', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m10', consigne:'لخص مراحل تكوين المعقد المناعي', verbCardId:'verb_schema_v1', source:'memory' },
  { id:'m11', consigne:'رتّب مراحل الانقسام ترتيبا تصاعديا', verbCardId:'verb_list_v1', source:'memory' },
  { id:'m12', consigne:'حدد مصدر المعلومات', verbCardId:'verb_list_v1', source:'memory' },

  // ── رأس + فيلم (mémoire, raisonnement) ─────────────────────────
  { id:'mf01', consigne:'فسر لماذا ينعدم النشاط عند pH=6', verbCardId:'verb_explain_v1', source:'memory' },
  { id:'mf02', consigne:'علل تفوق الاستجابة الثانوية', verbCardId:'verb_explain_v1', source:'memory' },
  { id:'mf03', consigne:'وضّح سبب تخصصية الإنزيم', verbCardId:'verb_explain_v1', source:'memory' },
  { id:'mf04', consigne:'بيّن كيف يحدث التنشيط اللمفاوي', verbCardId:'verb_explain_multi_v1', source:'memory' },
  { id:'mf05', consigne:'اقترح فرضية تفسر توقف النمو', verbCardId:'verb_hypothesis_v1', source:'memory' },
  { id:'mf06', consigne:'صادق على صحة الفرضية F1', verbCardId:'verb_validate_v1', source:'memory' },
  { id:'mf07', consigne:'وضّح الآلية الجزيئية للتحسس', verbCardId:'verb_explain_v1', source:'memory' },
  { id:'mf08', consigne:'فسّر سبب تكيف الغشاء', verbCardId:'verb_explain_v1', source:'memory' },
  { id:'mf09', consigne:'استنتج سبب تفضيل الإنزيم لركيزته', verbCardId:'verb_deduce_v1', source:'memory' },
  { id:'mf10', consigne:'اقترح فرضية حول دور المستقبل', verbCardId:'verb_hypothesis_v1', source:'memory' },
  { id:'mf11', consigne:'صادق على الفرضية الأنسب', verbCardId:'verb_validate_v1', source:'memory' },
];

export const DRILL_BANK: DrillConsigne[] = RAW.map((r, i) => ({
  id: r.id,
  seq: i + 1,
  consigne: r.consigne,
  verbCardId: r.verbCardId,
  source: r.source,
  mode: deriveMode(r.verbCardId),
}));

// Auto-vérification au chargement (DEV) : l'intention éditoriale doit coïncider
// avec le dérivé du moteur — sinon la banque ment à la règle qu'elle fait entraîner.
if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
  for (const c of DRILL_BANK) {
    const d = deriveSource(c.consigne);
    if (d !== c.source) throw new Error(`[drillBank] ${c.id} « ${c.consigne} » : source édité=${c.source} dérivé=${d}`);
  }
}

// ── Tirage quotidien (déterministe par jour) ──────────────────────────────────
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number): () => number {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Les 12 consignes du jour : déterministes pour une date donnée (l'élève peut
 * retenter le même jour le même jeu), renouvelées chaque jour (anti-mémorisation).
 */
export function drawDailyConsignes(day: string, count = 12): DrillConsigne[] {
  const rnd = mulberry32(hashString(`kunz_drill:${day}`));
  const arr = [...DRILL_BANK];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count).sort((a, b) => a.seq - b.seq);
}

export interface DrillAnswer { source?: DrillSource; mode?: DrillMode; }

export interface DrillItemResult {
  c: DrillConsigne;
  okSource: boolean;
  okMode: boolean;
  correct: boolean;
}

export interface DrillGrade { score: number; results: DrillItemResult[]; }

/** Score 0-12 : une consigne est réussie si les DEUX portes sont correctes. */
export function gradeDrill(consignes: DrillConsigne[], answers: Record<string, DrillAnswer>): DrillGrade {
  const results: DrillItemResult[] = consignes.map((c) => {
    const a = answers[c.id] ?? {};
    const okSource = a.source === c.source;
    const okMode = a.mode === c.mode;
    return { c, okSource, okMode, correct: okSource && okMode };
  });
  return { score: results.filter(r => r.correct).length, results };
}

// ── Phase 0 — ouvrir les portes (auto-pace, avec feedback) ────────────────────
export interface Phase0Demo {
  bankId: string;
  /** Pourquoi — la règle en une phrase (affichée après la réponse). */
  whyAr: string;
}

export const PHASE0_DEMOS: Phase0Demo[] = [
  { bankId:'p01',  whyAr:'وثيقة ⇒ ورقة. « حلل » يصف ثم يستنتج دون تعليل ⇒ صورة.' },
  { bankId:'m01',  whyAr:'لا وثيقة ⇒ رأس. « عرّف » من الحفظ ⇒ صورة.' },
  { bankId:'pf01', whyAr:'وثيقة ⇒ ورقة. « فسر » يطلب السبب (لأنّ…) ⇒ فيلم.' },
  { bankId:'mf02', whyAr:'لا وثيقة ⇒ رأس. « علل » يطلب العلّة ⇒ فيلم.' },
  { bankId:'d04',  whyAr:'وثيقة + معلوماتك ⇒ عمودان. « فسّر » ⇒ فيلم.' },
  { bankId:'pf05', whyAr:'وثيقة ⇒ ورقة. « استنتج » = خلاصة مرتبطة بآليتها ⇒ فيلم (D2).' },
];

const PHASE0_KEY = 'kunz_v3:phase0_done';

export function isPhase0Done(): boolean {
  try { return localStorage.getItem(PHASE0_KEY) === '1'; } catch { return false; }
}
export function completePhase0(): void {
  try { localStorage.setItem(PHASE0_KEY, '1'); } catch {}
}
export function resetPhase0(): void {
  try { localStorage.removeItem(PHASE0_KEY); } catch {}
}
