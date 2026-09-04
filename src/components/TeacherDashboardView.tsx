import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchTeacherDashboard, fetchTeacherEntries, setApiToken, getApiToken } from '../utils/api';

interface Props {
  onBack: () => void;
}

type StudentAgg = {
  id: string;
  name: string;
  email: string;
  productions: number;
  avgIcm: number;
  dominantErrors: Array<{ tag: string; count: number }>;
  lastProduction: string | null;
};

type Entry = {
  id: string;
  verbId: string;
  theme: string;
  stage: number;
  text: string;
  icm: number;
  errorTags: string[];
  createdAt: string;
};

export default function TeacherDashboardView({ onBack }: Props) {
  const [students, setStudents] = useState<StudentAgg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getApiToken();
    if (!token) {
      setError('جلسة المعلم غير موجودة. تأكد من تسجيل الدخول.');
      setLoading(false);
      return;
    }
    fetchTeacherDashboard()
      .then((data) => setStudents(data.students))
      .catch(() => setError('تعذر تحميل لوحة المتابعة.'))
      .finally(() => setLoading(false));
  }, []);

  const openStudent = async (studentId: string) => {
    setSelectedStudentId(studentId);
    try {
      const data = await fetchTeacherEntries(studentId);
      setEntries(data.entries);
    } catch {
      setEntries([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          رجوع
        </button>
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (selectedStudentId) {
    const student = students.find((s) => s.id === selectedStudentId);
    return (
      <div className="p-4 md:p-6 space-y-4">
        <button onClick={() => { setSelectedStudentId(null); setEntries([]); }} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
          <ArrowLeft className="w-4 h-4" />
          رجوع للقائمة
        </button>
        <div className="bg-white dark:bg-[#141916] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="font-black text-base text-gray-900 dark:text-white mb-1">{student?.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{student?.email}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-gray-50 dark:bg-[#1b221e] p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-bold">الproductions</div>
              <div className="text-xl font-black text-gray-900 dark:text-white">{student?.productions}</div>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-[#1b221e] p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-bold"> moyenne ICM</div>
              <div className="text-xl font-black text-gray-900 dark:text-white">{student?.avgIcm ?? 0}%</div>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-[#1b221e] p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-bold">آخر نشاط</div>
              <div className="text-sm font-black text-gray-900 dark:text-white">
                {student?.lastProduction ? new Date(student.lastProduction).toLocaleString('ar-DZ') : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#141916] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <h4 className="font-black text-sm text-gray-900 dark:text-white mb-3">Productions récentes</h4>
          <div className="space-y-2">
            {entries.length === 0 && <p className="text-xs text-gray-500">لا توجد إنتاجات بعد.</p>}
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-gray-100 dark:border-gray-800 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 dark:text-white">ICM {entry.icm}%</span>
                  <span className="text-[10px] text-gray-500">{new Date(entry.createdAt).toLocaleString('ar-DZ')}</span>
                </div>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 line-clamp-3">{entry.text}</p>
                {entry.errorTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.errorTags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
        <ArrowLeft className="w-4 h-4" />
        رجوع
      </button>
      <div className="bg-white dark:bg-[#141916] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
        <h3 className="font-black text-base text-gray-900 dark:text-white mb-1">لوحة المتابعة</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">ملخص كل تلميذ مسجل في التطبيق.</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {students.length === 0 && <p className="text-xs text-gray-500">لا تلاميذ مسجلين بعد.</p>}
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => openStudent(student.id)}
            className="w-full text-right bg-white dark:bg-[#141916] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:border-emerald-500/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-gray-900 dark:text-white">{student.name}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">{student.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 font-bold">ICM moyen</div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{student.avgIcm}%</div>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 font-bold">Productions</div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{student.productions}</div>
                </div>
              </div>
            </div>
            {student.dominantErrors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {student.dominantErrors.map((err) => (
                  <span key={err.tag} className="text-[10px] bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
                    {err.tag} ({err.count})
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
