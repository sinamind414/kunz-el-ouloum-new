// src/data/v3Progress.ts — déverrouillage progressif V3.1 (8 J1 →10 après drill)
// Règle validée : recto 8 seul J1, verso (المفتاح1 + حفظ) estompé et débloqué après drill 12/12 trois fois.
// 100% localStorage, best-effort, jamais bloquant.
const KEY = 'kunz_v3:extension_unlocked';
const DRILL_SCORE_KEY = 'kunz_v3:drill_streak';

export function isExtensionUnlocked(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch { return false; }
}

export function unlockExtension(): void {
  try { localStorage.setItem(KEY, '1'); } catch {}
}

export function resetExtension(): void {
  try { localStorage.removeItem(KEY); localStorage.removeItem(DRILL_SCORE_KEY); } catch {}
}

/**
 * Appelé après chaque drill 60s (12 consignes). Si score 12/12, incrémente le streak.
 * Après 3 succès consécutifs → débloque le verso (10).
 * Retourne { unlocked, streak }
 */
export function recordDrillResult(score: number): { unlocked: boolean; streak: number } {
  try {
    const raw = localStorage.getItem(DRILL_SCORE_KEY);
    let streak = raw ? parseInt(raw, 10) : 0;
    streak = score === 12 ? streak + 1 : 0;
    localStorage.setItem(DRILL_SCORE_KEY, String(streak));
    if (streak >= 3) unlockExtension();
    return { unlocked: isExtensionUnlocked(), streak };
  } catch {
    return { unlocked: false, streak: 0 };
  }
}

export function getDrillStreak(): number {
  try { return parseInt(localStorage.getItem(DRILL_SCORE_KEY) || '0', 10); } catch { return 0; }
}
