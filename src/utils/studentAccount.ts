import { logActivityLocally, flushActivityQueue } from './activityLog';

export type ActivityKind = 'quiz' | 'mission' | 'drill' | 'production';

export function logQuizActivity(unitId: number, score: number, total: number, domain: string) {
  logActivityLocally({
    studentId: 'local',
    type: 'quiz',
    payload: { title: 'اختبار', score, total, percent: Math.round((score / total) * 100), unitId, domain },
  });
  flushActivityQueue();
}

export function logMissionActivity(unitId: number, score: number, total: number, domain: string) {
  logActivityLocally({
    studentId: 'local',
    type: 'mission',
    payload: { title: 'مهمة', score, total, percent: Math.round((score / total) * 100), unitId, domain },
  });
  flushActivityQueue();
}

export function logDrillActivity(verbId: string, score: number, total: number) {
  logActivityLocally({
    studentId: 'local',
    type: 'drill',
    payload: { title: 'تدريب المفتاح', score, total, percent: Math.round((score / total) * 100), domain: verbId },
  });
  flushActivityQueue();
}

export function logProductionActivity(theme: string, icm: number, durationSec?: number) {
  logActivityLocally({
    studentId: 'local',
    type: 'production',
    payload: { title: 'إنتاج منهجي', percent: icm, domain: theme, durationSec },
  });
  flushActivityQueue();
}
