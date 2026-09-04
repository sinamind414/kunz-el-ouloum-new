import bcrypt from "bcryptjs";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const TEACHER_DB_FILE = process.env.KUNZ_TEACHER_DB_FILE || path.join(process.cwd(), "data", "teachers.json");

function readTeachers(): Array<{ email: string; passwordHash: string; name: string }> {
  try {
    if (!existsSync(TEACHER_DB_FILE)) return [];
    return JSON.parse(readFileSync(TEACHER_DB_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeTeachers(teachers: Array<{ email: string; passwordHash: string; name: string }>) {
  const dir = path.dirname(TEACHER_DB_FILE);
  if (!existsSync(dir)) {
    import("fs").then((fs) => fs.mkdirSync(dir, { recursive: true }));
  }
  writeFileSync(TEACHER_DB_FILE, JSON.stringify(teachers, null, 2), "utf-8");
}

export function createTeacher() {
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];
  const name = args[2] || email.split("@")[0];

  if (!email || !password) {
    console.error("Usage: npm run teacher <email> <password> [name]");
    process.exit(1);
  }

  const teachers = readTeachers();
  if (teachers.find((t) => t.email === email)) {
    console.log(`Teacher ${email} already exists.`);
    process.exit(0);
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  teachers.push({ email, passwordHash, name });
  writeTeachers(teachers);
  console.log(`Teacher created: ${name} <${email}>`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createTeacher();
}
