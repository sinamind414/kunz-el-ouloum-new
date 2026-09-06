// Phase 1 — auto-audit de la banque de drill : l'intention éditoriale doit
// coïncider avec le dérivé du moteur (source) et le switch du verbe (mode).
import { describe, expect, it } from 'vitest';
import {
  DRILL_BANK, deriveSource, deriveMode, drawDailyConsignes,
  gradeDrill, PHASE0_DEMOS,
} from '../drillBank';
import { getVerbCardV2 } from '../methodologyEngine';

describe('Phase 1 — banque du drill', () => {
  it('pool ≥ 50 consignes', () => {
    expect(DRILL_BANK.length).toBeGreaterThanOrEqual(50);
  });

  it('ids uniques et seq contigus', () => {
    const ids = new Set(DRILL_BANK.map(c => c.id));
    expect(ids.size).toBe(DRILL_BANK.length);
    expect(DRILL_BANK.map(c => c.seq)).toEqual(DRILL_BANK.map((_, i) => i + 1));
  });

  it('source éditoriale = source dérivée du moteur (règle produit)', () => {
    for (const c of DRILL_BANK) {
      expect(deriveSource(c.consigne), `${c.id} « ${c.consigne} »`).toBe(c.source);
    }
  });

  it('mode = switch du verbe (closed ⇒ image, open ⇒ film)', () => {
    for (const c of DRILL_BANK) {
      const card = getVerbCardV2(c.verbCardId);
      expect(card, c.id).toBeDefined();
      expect(c.mode, c.id).toBe(deriveMode(c.verbCardId));
      expect(c.mode, c.id).toBe(card!.switch === 'open' ? 'film' : 'image');
    }
  });

  it('les 4 types de la fiche + dual sont représentés', () => {
    const combos = new Set(DRILL_BANK.map(c => `${c.source}/${c.mode}`));
    for (const combo of ['paper/image', 'paper/film', 'dual/film', 'memory/image', 'memory/film']) {
      expect(combos.has(combo), combo).toBe(true);
    }
  });

  it('les 12 consignes historiques restent dans la banque (continuité D1)', () => {
    // NB : « فسر الوثيقة مستعينا بمكتسباتك » → « بمعلوماتك » : la règle dual du
    // moteur exige le mot exact « معلومات » — la consigne est conservée en sens.
    const legacy = [
      'حلل الوثيقة ١', 'عرّف الإنزيم', 'فسر الوثيقة مستعينا ب',
      'قارن بين المنحنيين', 'اذكر مراحل الترجمة', 'استخرج من الجدول',
      'استنتج العلاقة من الوثيقة ومعلوماتك', 'صف شكل الخلية',
      'كيف يحدث التنشيط', 'لخص في رسم تخطيطي',
      'وضّح مستعينا بالوثيقة', 'حدد مصدر المعلومات',
    ];
    for (const t of legacy) {
      expect(DRILL_BANK.some(c => c.consigne.includes(t)), t).toBe(true);
    }
  });

  it('estimation : aucun consigne mémoire ne contient de mot document', () => {
    const DOC = /(وثيق|شكل|جدول|منحن|رسم|صورة|سند|بيان|مخطط)/;
    for (const c of DRILL_BANK) {
      if (c.source === 'memory') expect(DOC.test(c.consigne), c.id).toBe(false);
    }
  });
});

describe('Phase 1 — tirage quotidien', () => {
  it('tire 12 consignes uniques', () => {
    const d = drawDailyConsignes('2026-09-06');
    expect(d).toHaveLength(12);
    expect(new Set(d.map(c => c.id)).size).toBe(12);
  });

  it('déterministe pour un jour donné', () => {
    const a = drawDailyConsignes('2026-09-06').map(c => c.id);
    const b = drawDailyConsignes('2026-09-06').map(c => c.id);
    expect(a).toEqual(b);
  });

  it('renouvelé d\'un jour à l\'autre (anti-mémorisation D3)', () => {
    const a = new Set(drawDailyConsignes('2026-09-06').map(c => c.id));
    const b = new Set(drawDailyConsignes('2026-09-07').map(c => c.id));
    const overlap = [...a].filter(id => b.has(id));
    expect(overlap.length).toBeLessThan(12);
  });

  it('respecte count et bornes de la banque', () => {
    expect(drawDailyConsignes('2026-09-06', 5)).toHaveLength(5);
    expect(drawDailyConsignes('2026-09-06', 100)).toHaveLength(DRILL_BANK.length);
  });
});

describe('Phase 1 — grading (deux portes)', () => {
  it('12/12 si les deux portes sont bonnes partout', () => {
    const d = drawDailyConsignes('2026-09-06');
    const answers = Object.fromEntries(d.map(c => [c.id, { source: c.source, mode: c.mode }]));
    expect(gradeDrill(d, answers).score).toBe(12);
  });

  it('une seule porte fausse = consigne manquée', () => {
    const d = drawDailyConsignes('2026-09-06');
    const c = d[0];
    const answers = Object.fromEntries(d.map(x => [x.id, { source: x.source, mode: x.mode }]));
    answers[c.id] = { source: c.source, mode: c.mode === 'film' ? 'image' : 'film' };
    const g = gradeDrill(d, answers);
    expect(g.score).toBe(11);
    expect(g.results[0].correct).toBe(false);
  });

  it('rien répondu = 0', () => {
    const d = drawDailyConsignes('2026-09-06');
    expect(gradeDrill(d, {}).score).toBe(0);
  });
});

describe('Phase 0 — démos', () => {
  it('6 démos, toutes rattachées à la banque', () => {
    expect(PHASE0_DEMOS).toHaveLength(6);
    const ids = new Set(DRILL_BANK.map(c => c.id));
    for (const d of PHASE0_DEMOS) {
      expect(ids.has(d.bankId), d.bankId).toBe(true);
      expect(d.whyAr.length).toBeGreaterThan(10);
    }
  });
});
