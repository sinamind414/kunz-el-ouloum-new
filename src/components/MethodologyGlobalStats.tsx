import React, { useMemo } from 'react';
import {
  PenLine, TrendingUp, TrendingDown, Award, BarChart2, AlertTriangle,
  Target, NotebookPen, CheckCircle2
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import {
  getProductionLogs, getAllVerbStats, ERROR_TAG_LABELS_AR
} from '../utils/methodologyLog';
import { VERB_CARDS } from '../data/methodologyEngine';

interface Props {
  onNavigate?: (tab: string) => void;
}

function fmtShort(iso: string): string {
  try {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  } catch {
    return iso.slice(5, 10);
  }
}

/**
 * Suivi global de la méthodologie d'écriture (carnet de bord local).
 * 100 % réel : toutes les productions écrites de l'élève, archivées localement
 * par le simulateur, sont agrégées ici — aucune donnée de démonstration.
 */
export default function MethodologyGlobalStats({ onNavigate }: Props) {
  const data = useMemo(() => {
    const logs = getProductionLogs();
    const stats = getAllVerbStats(VERB_CARDS.map(v => v.id));
    return { logs, stats };
  }, []);

  const { logs, stats } = data;
  const totalAttempts = logs.length;

  // --- KPI ---
  const avgIcm = totalAttempts ? Math.round(logs.reduce((a, l) => a + l.icm, 0) / totalAttempts) : 0;
  const practicedVerbs = stats.length;
  const mastered = stats.filter(s => s.masteredThemes >= 3).length;
  const improved = stats.filter(s => (s.delta ?? 0) > 0).length;
  const regressed = stats.filter(s => (s.delta ?? 0) < 0).length;

  // --- Courbe ICM au fil des essais (25 derniers) ---
  const timeline = logs.slice(-25).map((l, i) => ({
    idx: i + 1,
    'العلامة %': l.icm,
    verb: l.verbAr,
    date: fmtShort(l.dateISO),
  }));

  // --- Moyenne par verbe (avec essais) ---
  const perVerb = stats
    .map(s => ({ name: s.verbAr, 'المتوسط %': s.average, attempts: s.attempts }))
    .sort((a, b) => b['المتوسط %'] - a['المتوسط %'])
    .slice(0, 10);

  // --- Erreurs les plus récurrentes (le vrai diagnostic) ---
  const errCount: Record<string, number> = {};
  logs.forEach(l => l.errorTags.forEach(t => { errCount[t] = (errCount[t] || 0) + 1; }));
  const topErrors = Object.entries(errCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxErr = topErrors[0]?.count || 1;

  const tooltipStyle = {
    direction: 'rtl' as const,
    fontFamily: 'Noto Kufi Arabic',
    fontSize: 11,
    borderRadius: '12px',
    border: '1px solid #e2dabf',
  };

  // ---------- État vide honnête ----------
  if (totalAttempts === 0) {
    return (
      <section className="bg-[#ffffff] border border-[#e2dabf]/60 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-[#006d37]" />
          <h3 className="font-extrabold text-base text-[#1f1c0b]">منهجية الإجابة — تطورك الكتابي</h3>
          <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0 mr-auto">بثولك الحقيقية فقط</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-[#f8fbfa] border border-dashed border-[#006d37]/30 rounded-3xl">
          <NotebookPen className="w-10 h-10 text-[#006d37]/40 mb-3" />
          <p className="font-black text-base text-[#1f1c0b] mb-1.5">لم تكتب أي إجابة منهجية بعد</p>
          <p className="text-[11px] text-[#506072] font-semibold max-w-md leading-relaxed mb-4">
            كل بثول تكتبه في المحاكي (مرحلة 2، 3 أو 4) يُحفظ هنا مع علامته وأخطائه، ليتشكل منحنى تطورك في أفعال الأداء الـ 12. بدون بثول حقيقية نعرض لا شيء — بلا أرقام وهمية.
          </p>
          <button
            onClick={() => onNavigate?.('methodology')}
            className="flex items-center gap-2 bg-[#006d37] hover:bg-[#005027] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>ابدأ التدرب على منهجية الإجابة</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#ffffff] border border-[#e2dabf]/60 rounded-3xl p-5 shadow-sm space-y-5">
      {/* En-tête */}
      <div className="flex flex-wrap items-center gap-2">
        <PenLine className="w-5 h-5 text-[#006d37]" />
        <h3 className="font-extrabold text-base text-[#1f1c0b]">منهجية الإجابة — تطورك الكتابي</h3>
        <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0 mr-auto">
          من كرنيت البثول المحلي (100% حقيقي)
        </span>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="bg-[#f8fbfa] border border-emerald-100 rounded-2xl p-3 text-center">
          <div className="text-lg font-black text-[#006d37]">{totalAttempts}</div>
          <div className="text-[10px] font-bold text-gray-500">بثول مكتوبة</div>
        </div>
        <div className="bg-[#f2f7ff] border border-blue-100 rounded-2xl p-3 text-center">
          <div className="text-lg font-black text-[#1e40af]">{practicedVerbs}</div>
          <div className="text-[10px] font-bold text-gray-500">أفعال تم التدرب عليها</div>
        </div>
        <div className="bg-[#fff9ed] border border-amber-100 rounded-2xl p-3 text-center">
          <div className="text-lg font-black text-[#944a00]">{avgIcm}%</div>
          <div className="text-[10px] font-bold text-gray-500">متوسط العلامة (ICM)</div>
        </div>
        <div className="bg-[#f8fbfa] border border-emerald-100 rounded-2xl p-3 text-center">
          <div className="text-lg font-black text-amber-500">{mastered}</div>
          <div className="text-[10px] font-bold text-gray-500">أفعال مؤتمتة (≥90 في 3 وحدات)</div>
        </div>
      </div>

      {/* Bandeau de tendance */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-black">
        <span className="text-gray-500">اتجاهك العام :</span>
        {improved > 0 && (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
            <TrendingUp className="w-3.5 h-3.5" /> {improved} فعل في تحسن
          </span>
        )}
        {regressed > 0 && (
          <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-2.5 py-1">
            <TrendingDown className="w-3.5 h-3.5" /> {regressed} فعل في تراجع
          </span>
        )}
        {improved === 0 && regressed === 0 && (
          <span className="text-gray-400">أكمل كتابة محاولاتك لتظهر مقارنة المحاولة بالمحاولة السابقة</span>
        )}
      </div>

      {/* Courbe : ICM au fil des essais */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-[#1f1c0b] flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-[#006d37]" /> تطور علاماتك عبر المحاولات المتتالية
        </h4>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2dabf" strokeOpacity={0.3} />
              <XAxis dataKey="idx" stroke="#506072" fontSize={10} tickLine={false} />
              <YAxis stroke="#506072" fontSize={10} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'علامة المنهجية']}
                labelFormatter={(label: any, payload: any) => {
                  const p = payload?.[0]?.payload;
                  return p ? `محاولة #${label} — ${p.verb} (${p.date})` : `محاولة #${label}`;
                }}
                contentStyle={tooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="العلامة %"
                stroke="#006d37"
                strokeWidth={3}
                activeDot={{ r: 7 }}
                dot={{ stroke: '#fed65b', strokeWidth: 2, r: 4, fill: '#006d37' }}
              />
              <ReferenceLine
                y={90}
                stroke="#2ecc71"
                strokeDasharray="4 4"
                label={{ value: 'الهدف: 90%', fill: '#2ecc71', fontSize: 9, position: 'insideTopLeft' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grille : moyenne par verbe + erreurs récurrentes */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <h4 className="text-xs font-black text-[#1f1c0b] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#006d37]" /> متوسط علامتك لكل فعل أداء
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perVerb} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2dabf" strokeOpacity={0.3} />
                <XAxis type="number" domain={[0, 100]} stroke="#506072" fontSize={10} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="name" stroke="#506072" fontSize={10} width={110} tickLine={false} orientation="right" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, 'المتوسط']} />
                <Bar dataKey="المتوسط %" radius={[0, 6, 6, 0]} maxBarSize={16}>
                  {perVerb.map((d, i) => (
                    <Cell key={i} fill={d['المتوسط %'] >= 90 ? '#2ecc71' : d['المتوسط %'] >= 60 ? '#006d37' : '#ff9a4a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-black text-[#1f1c0b] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> أخطاؤك الأكثر تكراراً (يجب معالجتها)
          </h4>
          <div className="space-y-2.5 pt-1">
            {topErrors.map(e => (
              <div key={e.tag} className="bg-[#fff9ed] border border-[#fed65b]/40 rounded-xl px-3 py-2.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-black text-[#944a00]">
                    {ERROR_TAG_LABELS_AR[e.tag] || e.tag}
                  </span>
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                    × {e.count}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-amber-100/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-amber-400 to-orange-500 rounded-full"
                    style={{ width: `${Math.round((e.count / maxErr) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {topErrors.length === 0 && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-3 text-[11px] font-black">
                <CheckCircle2 className="w-4 h-4" />
                لا أخطاء منهجية مكتشفة في بثولك — القواعد الأربع الكبرى محترمة!
              </div>
            )}
            <button
              onClick={() => onNavigate?.('methodology')}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#f8fbfa] text-[#006d37] border border-[#e2dabf] rounded-xl text-[11px] font-black px-3 py-2.5 transition-all cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>واصل التدرب على منهجية الإجابة</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
