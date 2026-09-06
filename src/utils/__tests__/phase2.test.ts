// Phase 2 (audit §3.3) — le verdict auto ne couvre que la FORME (3 portes) ;
// et B (§3.8) — la cellule de matrice est un ratio glissant de binaires du scoreur.
import { describe, expect, it } from 'vitest';
import { evaluatePhase2, remediationTargets, PHASE2_FORM_THRESHOLD } from '../phase2';
import { verbSlidingRatio, ProductionLogEntry } from '../methodologyLog';

const base = { sourceGateOk: null as boolean | null, switchGateOk: null as boolean | null, icm: 100, typicalErrorViolated: false };

describe('Phase 2 — verdict « forme validée »', () => {
  it('tout passe → forme validée, et le message renvoie au fond (Phase 3)', () => {
    const v = evaluatePhase2({ ...base, sourceGateOk: true, switchGateOk: true, icm: 92 });
    expect(v.formeValidee).toBe(true);
    expect(v.gates.every(g => g.passed === true)).toBe(true);
    expect(v.messageAr).toContain('المرحلة 3');
  });

  it('ICM sous le seuil → forme non validée (même portes correctes)', () => {
    const v = evaluatePhase2({ ...base, sourceGateOk: true, switchGateOk: true, icm: PHASE2_FORM_THRESHOLD - 1 });
    expect(v.formeValidee).toBe(false);
    expect(v.gates.find(g => g.id === 'forme')!.passed).toBe(false);
  });

  it('ICM au seuil exact → forme validée', () => {
    const v = evaluatePhase2({ ...base, icm: PHASE2_FORM_THRESHOLD });
    expect(v.gates.find(g => g.id === 'forme')!.passed).toBe(true);
  });

  it("l'erreur typique du verbe bloque la forme même à ICM 100", () => {
    const v = evaluatePhase2({ ...base, icm: 100, typicalErrorViolated: true });
    expect(v.formeValidee).toBe(false);
    expect(v.messageAr).toContain('الخطأ النموذجي');
  });

  it('porte fausse → blocage ; porte non évaluée (null) → ne bloque pas', () => {
    expect(evaluatePhase2({ ...base, sourceGateOk: false }).formeValidee).toBe(false);
    expect(evaluatePhase2({ ...base, sourceGateOk: null, switchGateOk: null }).formeValidee).toBe(true);
    expect(evaluatePhase2({ ...base, switchGateOk: false }).formeValidee).toBe(false);
  });

  it('le message d\'échec nomme les portes en défaut', () => {
    const v = evaluatePhase2({ ...base, sourceGateOk: false, switchGateOk: false, icm: 40 });
    expect(v.formeValidee).toBe(false);
    expect(v.messageAr).toContain('الباب ١');
    expect(v.messageAr).toContain('الباب ٢');
    expect(v.messageAr).toContain('ICM');
  });
});

describe('Renvoi ciblé — remediationTargets (micro-2a)', () => {
  const mkLine = (step: 1 | 2 | 3 | 4, applicable: boolean, passed: boolean, remedyAr?: string) =>
    ({ step, applicable, passed, errorTags: passed ? [] : ['x'], remedyAr });

  it('expose uniquement les étapes applicables et en échec', () => {
    const targets = remediationTargets([
      mkLine(1, true, true),
      mkLine(2, true, false, 'répare 2'),
      mkLine(3, false, false), // non applicable → exclue
      mkLine(4, true, false),
    ]);
    expect(targets.map(t => t.step)).toEqual([2, 4]);
    expect(targets[0].remedyAr).toBe('répare 2');
  });

  it('aucun échec → vide', () => {
    expect(remediationTargets([mkLine(1, true, true), mkLine(4, true, true)])).toEqual([]);
  });
});

describe('B — ratio glissant de la matrice', () => {
  const mk = (verbId: string, icm: number, tags: string[] = [], i = 0): ProductionLogEntry => ({
    id: `${verbId}-${i}`, verbId, verbAr: 'x', theme: 't', stage: 3,
    dateISO: `2026-09-0${(i % 9) + 1}T00:00:00Z`, text: 't', icm,
    criteriaSummary: [], errorTags: tags,
  });

  it('pas de production → ratio null (l\'absence de donnée n\'est pas 0 %)', () => {
    expect(verbSlidingRatio('verb_analyse_v1', 10, [])).toEqual({ total: 0, clean: 0, ratio: null });
  });

  it('10 productions propres → 100 %', () => {
    const logs = Array.from({ length: 10 }, (_, i) => mk('verb_explain_v1', 95, [], i));
    expect(verbSlidingRatio('verb_explain_v1', 10, logs)).toEqual({ total: 10, clean: 10, ratio: 100 });
  });

  it("compte l'erreur TYPIQUE du verbe (explain = unsupported_claim)", () => {
    const logs = [
      mk('verb_explain_v1', 90, ['unsupported_claim'], 1),
      mk('verb_explain_v1', 92, [], 2),
      mk('verb_explain_v1', 88, ['missing_unit'], 3), // tag non typique → compte comme propre
      mk('verb_explain_v1', 95, [], 4),
    ];
    expect(verbSlidingRatio('verb_explain_v1', 10, logs)).toEqual({ total: 4, clean: 3, ratio: 75 });
  });

  it('fenêtre glissante : seules les N dernières comptent', () => {
    const logs = [
      mk('verb_deduce_v1', 50, ['unsupported_claim'], 1),
      mk('verb_deduce_v1', 50, ['unsupported_claim'], 2),
      mk('verb_deduce_v1', 95, [], 3),
      mk('verb_deduce_v1', 96, [], 4),
      mk('verb_deduce_v1', 97, [], 5),
    ];
    // fenêtre 3 → les 2 dernières sont propres
    expect(verbSlidingRatio('verb_deduce_v1', 3, logs)).toEqual({ total: 3, clean: 3, ratio: 100 });
  });

  it("filtre par verbe (les autres verbes ne comptent pas)", () => {
    const logs = [
      mk('verb_analyse_v1', 95, [], 1),
      mk('verb_explain_v1', 95, [], 2),
    ];
    expect(verbSlidingRatio('verb_analyse_v1', 10, logs).total).toBe(1);
    expect(verbSlidingRatio('verb_explain_v1', 10, logs).total).toBe(1);
  });
});
