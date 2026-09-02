import React from 'react';
import { BOUSSOLE_CAPS, CapId } from '../data/boussoleData';

interface Props {
  activeCap: CapId | null;
  size?: number;
}

const CAP_ANGLE: Record<CapId, number> = { north: 0, south: 180, west: 270, east: 90 };

const CAP_POS: Record<CapId, { x: number; y: number; lx: number; ly: number }> = {
  north: { x: 110, y: 42, lx: 110, ly: 16 },
  south: { x: 110, y: 178, lx: 110, ly: 204 },
  west:  { x: 42,  y: 110, lx: 20,  ly: 114 },
  east:  { x: 178, y: 110, lx: 202, ly: 114 },
};

export default function CompassRose({ activeCap, size = 190 }: Props) {
  const angle = activeCap ? CAP_ANGLE[activeCap] : 0;

  return (
    <svg
      viewBox="0 0 220 220"
      width="100%"
      style={{ maxWidth: size }}
      role="img"
      aria-label="بوصلة الإجابة — شمال جنوب غرب شرق"
      className="select-none shrink-0"
    >
      <circle cx="110" cy="110" r="103" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="110" cy="110" r="86" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 6" />

      {BOUSSOLE_CAPS.map(cap => {
        const pos = CAP_POS[cap.id];
        const active = activeCap === cap.id;
        return (
          <g key={cap.id} style={{ transition: 'opacity .4s' }}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={19}
              fill="none"
              stroke={cap.color}
              strokeWidth={3}
              opacity={active ? 1 : 0}
              style={{ transition: 'opacity .5s' }}
            />
            <circle cx={pos.x} cy={pos.y} r={14} fill={cap.color} />
            <text x={pos.x} y={pos.y + 5} fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">
              {cap.num}
            </text>
            <text
              x={pos.lx}
              y={pos.ly + 4}
              fontSize="12"
              fontWeight="800"
              fill={cap.color}
              textAnchor="middle"
              fontFamily="Tahoma, sans-serif"
              opacity={active ? 1 : 0.75}
            >
              {cap.ar}
            </text>
          </g>
        );
      })}

      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: '110px 110px',
          transition: 'transform 900ms cubic-bezier(0.45, 0.05, 0.2, 1)',
        }}
      >
        <polygon points="110,26 102,64 110,92" fill="#1d4ed8" />
        <polygon points="110,26 118,64 110,92" fill="#dc2626" />
        <circle cx="110" cy="110" r="11" fill="#00401f" />
        <circle cx="110" cy="110" r="5" fill="#fed65b" />
      </g>

      <text x="110" y="222" fontSize="9" fontWeight="700" fill="#94a3b8" textAnchor="middle" fontFamily="Tahoma, sans-serif">
        دع البوصلة تطمئنك: عُدْ إلى الشمال إن ضللت
      </text>
    </svg>
  );
}