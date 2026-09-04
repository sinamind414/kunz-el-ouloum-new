export type ActivityKind = 'quiz' | 'mission' | 'drill' | 'production';

export interface ActivityPayload {
  title?: string;
  score?: number;
  total?: number;
  percent?: number;
  unitId?: number | string;
  domain?: string;
  durationSec?: number;
}

export interface ActivityEntry {
  id: string;
  studentId: string;
  type: ActivityKind;
  payload: ActivityPayload;
  createdAt: string;
}

const QUEUE_KEY = 'boussole_activity_queue';

export function queueActivity(activity: ActivityEntry) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const queue: ActivityEntry[] = raw ? JSON.parse(raw) : [];
    queue.push(activity);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore storage errors
  }
}

export async function flushActivityQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return;
    const queue: ActivityEntry[] = JSON.parse(raw);
    if (!queue.length) return;
    const token = localStorage.getItem('boussole_token');
    if (!token) return;
    await fetch('/api/student/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ entries: [], events: queue }),
    });
    localStorage.removeItem(QUEUE_KEY);
  } catch {
    // keep queue for later
  }
}

export function logActivityLocally(activity: Omit<ActivityEntry, 'id' | 'createdAt'>) {
  queueActivity({
    ...activity,
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  });
}
