import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, LogOut, User, ChevronDown } from 'lucide-react';
import { fetchMe, setApiToken, getApiToken } from '../utils/api';

interface Props {
  onOpenTeacher: () => void;
}

export default function StudentAccountBar({ onOpenTeacher }: Props) {
  const [student, setStudent] = useState<{ name: string; email: string } | null>(null);
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = getApiToken();
    if (!token) return;
    fetchMe()
      .then((data) => setStudent(data.student))
      .catch(() => setApiToken(null));
  }, []);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const handleLogout = () => {
    setApiToken(null);
    setStudent(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white dark:bg-[#141916] border border-gray-200 dark:border-gray-700 rounded-full pl-1 pr-3 py-1 shadow-sm"
      >
        <div className="w-8 h-8 rounded-full bg-[#006d37] text-white flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-[11px] font-black text-gray-900 dark:text-white leading-none">
            {student?.name || 'ضيف'}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-0.5">
            {student?.email || 'بدون حساب'}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#141916] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50"
          >
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              {online ? (
                <Wifi className="w-4 h-4 text-emerald-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-600" />
              )}
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                {online ? 'متزامن ✓' : 'وضع Hors-ligne — سيُرسل لاحقاً'}
              </span>
            </div>
            <button
              onClick={onOpenTeacher}
              className="w-full text-right px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              دخول المعلمين
            </button>
            {student && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                تسجيل الخروج
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
