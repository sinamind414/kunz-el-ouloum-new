import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readFileSync, writeFileSync, existsSync } from "fs";

dotenv.config();

type Student = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
};

type ProductionEntry = {
  id: string;
  studentId: string;
  verbId: string;
  theme: string;
  stage: number;
  text: string;
  icm: number;
  criteriaSummary: { label: string; passed: boolean }[];
  errorTags: string[];
  durationSec?: number;
  createdAt: string;
};

type ActivityEntry = {
  id: string;
  studentId: string;
  type: 'quiz' | 'mission' | 'drill' | 'production';
  payload: Record<string, unknown>;
  createdAt: string;
};

type PasswordResetCode = {
  code: string;
  studentId: string;
  expiresAt: string;
  used: boolean;
};

type Teacher = {
  email: string;
  passwordHash: string;
  name: string;
};

const DB_FILE = process.env.KUNZ_DB_FILE || path.join(process.cwd(), "data", "students.json");
const TEACHER_DB_FILE = process.env.KUNZ_TEACHER_DB_FILE || path.join(process.cwd(), "data", "teachers.json");
// Sécurité : pas de secret par défaut. Le serveur refuse de démarrer sans JWT_SECRET explicite.
if (!process.env.JWT_SECRET) {
  console.error("REFUS DE DÉMARRAGE : JWT_SECRET manquant. Définissez-le dans .env (ex. openssl rand -hex 32).");
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

function readDb(): { students: Student[]; entries: ProductionEntry[]; activities: ActivityEntry[]; resetCodes: PasswordResetCode[] } {
  try {
    if (!existsSync(DB_FILE)) return { students: [], entries: [], activities: [], resetCodes: [] };
    return JSON.parse(readFileSync(DB_FILE, "utf-8"));
  } catch {
    return { students: [], entries: [], activities: [], resetCodes: [] };
  }
}

function writeDb(data: { students: Student[]; entries: ProductionEntry[]; activities: ActivityEntry[]; resetCodes: PasswordResetCode[] }) {
  const dir = path.dirname(DB_FILE);
  if (!existsSync(dir)) {
    import("fs").then((fs) => fs.mkdirSync(dir, { recursive: true }));
  }
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function readTeachers(): Teacher[] {
  try {
    if (!existsSync(TEACHER_DB_FILE)) return [];
    return JSON.parse(readFileSync(TEACHER_DB_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeTeachers(teachers: Teacher[]) {
  const dir = path.dirname(TEACHER_DB_FILE);
  if (!existsSync(dir)) {
    import("fs").then((fs) => fs.mkdirSync(dir, { recursive: true }));
  }
  writeFileSync(TEACHER_DB_FILE, JSON.stringify(teachers, null, 2), "utf-8");
}

function ensureTeacher() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const teachers = readTeachers();
  if (teachers.find((t) => t.email === email)) return;
  const hash = bcrypt.hashSync(password, 10);
  teachers.push({ email, passwordHash: hash, name: email.split("@")[0] });
  writeTeachers(teachers);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  app.use((_req: Request, res: Response, next: express.NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development", offlineMode: true });
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "missing_fields" });
      }
      const db = readDb();
      if (db.students.find((s) => s.email === email)) {
        return res.status(409).json({ error: "email_exists" });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const student: Student = {
        id: `stu_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        email,
        passwordHash,
        name,
        createdAt: new Date().toISOString(),
      };
      db.students.push(student);
      writeDb(db);
      const token = jwt.sign({ studentId: student.id, email: student.email }, JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({ token, student: { id: student.id, email: student.email, name: student.name } });
    } catch (e) {
      res.status(500).json({ error: "server_error" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const db = readDb();
      const student = db.students.find((s) => s.email === email);
      if (!student || !(await bcrypt.compare(password, student.passwordHash))) {
        return res.status(401).json({ error: "invalid_credentials" });
      }
      const token = jwt.sign({ studentId: student.id, email: student.email }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, student: { id: student.id, email: student.email, name: student.name } });
    } catch {
      res.status(500).json({ error: "server_error" });
    }
  });

  function authMiddleware(req: Request, res: Response, next: express.NextFunction) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "missing_token" });
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { studentId: string; email: string };
      (req as any).studentId = payload.studentId;
      next();
    } catch {
      return res.status(401).json({ error: "invalid_token" });
    }
  }

  app.get("/api/auth/me", authMiddleware, (req: Request, res: Response) => {
    const db = readDb();
    const student = db.students.find((s) => s.id === (req as any).studentId);
    if (!student) return res.status(404).json({ error: "not_found" });
    res.json({ student: { id: student.id, email: student.email, name: student.name } });
  });

  app.post("/api/student/sync", authMiddleware, (req: Request, res: Response) => {
    try {
      const studentId = (req as any).studentId;
      const body = req.body || {};
      const entries: ProductionEntry[] = body.entries || [];
      const events: ActivityEntry[] = body.events || [];
      if ((!Array.isArray(entries) || entries.length === 0) && (!Array.isArray(events) || events.length === 0)) {
        return res.status(400).json({ error: "invalid_payload" });
      }
      const db = readDb();
      let synced = 0;
      for (const entry of entries.slice(0, 100)) {
        const exists = db.entries.find((e) => e.id === entry.id && e.studentId === studentId);
        if (!exists) {
          db.entries.push({ ...entry, studentId });
          synced++;
        }
      }
      for (const ev of events.slice(0, 100)) {
        const exists = db.activities.find((e) => e.id === ev.id && e.studentId === studentId);
        if (!exists) {
          db.activities.push({ ...ev, studentId });
          synced++;
        }
      }
      writeDb(db);
      res.json({ ok: true, synced, total: db.entries.filter((e) => e.studentId === studentId).length, totalEvents: db.activities.filter((e) => e.studentId === studentId).length });
    } catch {
      res.status(500).json({ error: "server_error" });
    }
  });

  app.get("/api/student/entries", authMiddleware, (req: Request, res: Response) => {
    const db = readDb();
    const entries = db.entries
      .filter((e) => e.studentId === (req as any).studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ entries });
  });

  function teacherAuth(req: Request, res: Response, next: express.NextFunction) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "missing_token" });
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { email: string; role: "teacher" };
      (req as any).teacherEmail = payload.email;
      next();
    } catch {
      return res.status(401).json({ error: "invalid_token" });
    }
  }

  app.post("/api/teacher/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const teachers = readTeachers();
      const teacher = teachers.find((t) => t.email === email);
      if (!teacher || !(await bcrypt.compare(password, teacher.passwordHash))) {
        return res.status(401).json({ error: "invalid_credentials" });
      }
      const token = jwt.sign({ email: teacher.email, role: "teacher" }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, teacher: { email: teacher.email, name: teacher.name } });
    } catch {
      res.status(500).json({ error: "server_error" });
    }
  });

  app.get("/api/teacher/dashboard", teacherAuth, (req: Request, res: Response) => {
    const db = readDb();
    const students = db.students.map((student) => {
      const entries = db.entries.filter((e) => e.studentId === student.id);
      const activities = db.activities.filter((e) => e.studentId === student.id);
      const quizEvents = activities.filter((e) => e.type === 'quiz');
      const missionEvents = activities.filter((e) => e.type === 'mission');
      const avgQuizPercent = quizEvents.length ? Math.round(quizEvents.reduce((s, e) => s + (Number(e.payload?.percent) || 0), 0) / quizEvents.length) : null;
      const avgIcm = entries.length ? Math.round(entries.reduce((s, e) => s + e.icm, 0) / entries.length) : 0;
      const dominantErrors = entries.flatMap((e) => e.errorTags).reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
      const topErrors = Object.entries(dominantErrors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        productions: entries.length,
        avgIcm,
        dominantErrors: topErrors,
        lastProduction: entries.length ? entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt : null,
        activities,
        quizCount: quizEvents.length,
        missionCount: missionEvents.length,
        avgQuizPercent,
      };
    });
    res.json({ students });
  });

  app.get("/api/teacher/entries", teacherAuth, (req: Request, res: Response) => {
    const studentId = req.query.studentId as string | undefined;
    if (!studentId) return res.status(400).json({ error: "missing_student_id" });
    const db = readDb();
    const entries = db.entries
      .filter((e) => e.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ entries });
  });

  app.post("/api/teacher/reset-password", teacherAuth, (req: Request, res: Response) => {
    try {
      const { studentId } = req.body;
      if (!studentId) return res.status(400).json({ error: "missing_student_id" });
      const db = readDb();
      const student = db.students.find((s) => s.id === studentId);
      if (!student) return res.status(404).json({ error: "student_not_found" });
      const code = Math.random().toString(36).slice(2, 10).toUpperCase();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      db.resetCodes = db.resetCodes.filter((c) => c.studentId !== studentId);
      db.resetCodes.push({ code, studentId, expiresAt, used: false });
      writeDb(db);
      res.json({ code, expiresAt });
    } catch {
      res.status(500).json({ error: "server_error" });
    }
  });

  app.post("/api/student/reset-password", async (req: Request, res: Response) => {
    try {
      const { code, password } = req.body;
      if (!code || !password) return res.status(400).json({ error: "missing_fields" });
      const db = readDb();
      const resetCode = db.resetCodes.find((c) => c.code === code && !c.used);
      if (!resetCode) return res.status(400).json({ error: "invalid_or_used_code" });
      if (new Date(resetCode.expiresAt).getTime() < Date.now()) {
        db.resetCodes = db.resetCodes.filter((c) => c.code !== code);
        writeDb(db);
        return res.status(400).json({ error: "expired_code" });
      }
      const student = db.students.find((s) => s.id === resetCode.studentId);
      if (!student) return res.status(404).json({ error: "student_not_found" });
      student.passwordHash = await bcrypt.hash(password, 10);
      resetCode.used = true;
      writeDb(db);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "server_error" });
    }
  });

  app.post("/api/student/activity", authMiddleware, (req: Request, res: Response) => {
    try {
      const studentId = (req as any).studentId;
      const { type, payload } = req.body;
      if (!type || !payload) return res.status(400).json({ error: "missing_fields" });
      const db = readDb();
      db.activities.push({
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        studentId,
        type,
        payload,
        createdAt: new Date().toISOString(),
      });
      writeDb(db);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "server_error" });
    }
  });

  app.get("/api/teacher/export/csv", teacherAuth, (req: Request, res: Response) => {
    const db = readDb();
    const studentId = req.query.studentId as string | undefined;
    const rows: string[][] = [['student_id', 'name', 'email', 'productions', 'avg_icm', 'last_production', 'top_errors']];
    const students = studentId ? db.students.filter((s) => s.id === studentId) : db.students;
    for (const student of students) {
      const entries = db.entries.filter((e) => e.studentId === student.id);
      const avgIcm = entries.length ? Math.round(entries.reduce((s, e) => s + e.icm, 0) / entries.length) : 0;
      const dominantErrors = entries.flatMap((e) => e.errorTags).reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
      const topErrors = Object.entries(dominantErrors).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tag, count]) => `${tag}:${count}`).join('; ');
      rows.push([student.id, student.name, student.email, String(entries.length), String(avgIcm), student.createdAt, topErrors]);
    }
    const csv = rows.map((r) => r.join(';')).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="boussole-export-${studentId || 'all'}.csv"`);
    res.send('\uFEFF' + csv);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  ensureTeacher();

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[Kunz El Ouloum Server] Running on http://localhost:${PORT} (Offline Mode)`);
  });
}

startServer();
