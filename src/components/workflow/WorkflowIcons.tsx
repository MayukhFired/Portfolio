'use client';

import { motion } from 'framer-motion';

// ─── Shared helpers ────────────────────────────────────────────────────────────
const ease = [0.25, 0.1, 0.25, 1] as const;

// ══════════════════════════════════════════════════════════════════════════════
// 1. BULB  — off by default, `lit` prop triggers the glow-on animation
// ══════════════════════════════════════════════════════════════════════════════
export function BulbIcon({ lit }: { lit: boolean }) {
  return (
    <svg width="72" height="88" viewBox="0 0 72 88" fill="none">
      {/* Outer glow bloom — only when lit */}
      {lit && (
        <motion.circle
          cx="36" cy="34" r="30"
          fill="rgba(255,220,60,0.13)"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.18, 0.28] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Glass bulb body */}
      <motion.ellipse
        cx="36" cy="32" rx="20" ry="22"
        fill={lit ? 'rgba(255,230,80,0.22)' : 'rgba(30,35,55,0.9)'}
        stroke={lit ? '#f5d060' : '#3a4060'}
        strokeWidth="2"
        animate={{ fill: lit ? 'rgba(255,230,80,0.22)' : 'rgba(30,35,55,0.9)' }}
        transition={{ duration: 0.6 }}
      />

      {/* Filament glow */}
      <motion.path
        d="M 30 38 Q 36 28 42 38"
        stroke={lit ? '#ffe066' : '#2a2f45'}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ stroke: lit ? '#ffe066' : '#2a2f45' }}
        transition={{ duration: 0.5, delay: 0.15 }}
      />
      <motion.path
        d="M 33 33 Q 36 26 39 33"
        stroke={lit ? '#fff0a0' : '#2a2f45'}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        animate={{ stroke: lit ? '#fff0a0' : '#2a2f45' }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Shine flare top-left */}
      {lit && (
        <motion.ellipse
          cx="28" cy="22" rx="5" ry="3"
          fill="rgba(255,255,255,0.28)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ transform: 'rotate(-30deg)', transformOrigin: '28px 22px' }}
        />
      )}

      {/* Light rays */}
      {lit && [0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <motion.line
          key={deg}
          x1={36 + Math.cos((deg * Math.PI) / 180) * 24}
          y1={32 + Math.sin((deg * Math.PI) / 180) * 24}
          x2={36 + Math.cos((deg * Math.PI) / 180) * 32}
          y2={32 + Math.sin((deg * Math.PI) / 180) * 32}
          stroke="#ffe066"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: [0, 0.7, 0.4], pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25 + i * 0.04 }}
        />
      ))}

      {/* Base collar */}
      <rect x="28" y="52" width="16" height="4" rx="1" fill={lit ? '#c8960c' : '#2a2f45'} />
      <rect x="29" y="56" width="14" height="3" rx="1" fill={lit ? '#a0720a' : '#222638'} />
      <rect x="30" y="59" width="12" height="3" rx="1" fill={lit ? '#c8960c' : '#2a2f45'} />

      {/* Screw threads */}
      {[0, 1, 2].map(n => (
        <rect key={n} x="30" y={62 + n * 3} width="12" height="1.5" rx="0.5"
              fill={lit ? '#f5d060' : '#3a4060'} opacity="0.6" />
      ))}

      {/* Wire connector at very bottom */}
      <line x1="36" y1="71" x2="36" y2="80"
            stroke={lit ? '#ffe066' : '#3a4060'} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. PEN + NOTEBOOK  — pen writes lines when `active`
// ══════════════════════════════════════════════════════════════════════════════
export function PenNotebookIcon({ active }: { active: boolean }) {
  const lines = [
    { x1: 22, x2: 54, y: 32 },
    { x1: 22, x2: 48, y: 39 },
    { x1: 22, x2: 52, y: 46 },
    { x1: 22, x2: 44, y: 53 },
  ];

  return (
    <svg width="72" height="80" viewBox="0 0 72 80" fill="none">
      {/* Notebook cover */}
      <rect x="12" y="14" width="48" height="58" rx="4"
            fill="#1a2035" stroke="#3a4a6a" strokeWidth="1.5" />
      {/* Spine */}
      <rect x="12" y="14" width="8" height="58" rx="2"
            fill="#243050" stroke="#3a4a6a" strokeWidth="1" />
      {/* Binding dots */}
      {[24, 36, 48, 60].map(y => (
        <circle key={y} cx="16" cy={y} r="2" fill="#4a5a8a" />
      ))}
      {/* Page lines — animate pathLength */}
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1} y1={l.y} x2={l.x2} y2={l.y}
          stroke="#22d3ee"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: active ? i * 0.3 : 0, ease }}
        />
      ))}

      {/* Pen — slides in from top-right when active */}
      <motion.g
        initial={{ x: 12, y: -10, rotate: -35 }}
        animate={active ? { x: 0, y: 0, rotate: -35 } : { x: 12, y: -10, rotate: -35 }}
        transition={{ duration: 0.5, ease }}
        style={{ transformOrigin: '58px 20px' }}
      >
        {/* Pen body */}
        <rect x="50" y="10" width="7" height="30" rx="2" fill="#a78bfa" />
        <rect x="50" y="10" width="7" height="8"  rx="2" fill="#7c3aed" />
        {/* Pen tip */}
        <polygon points="50,40 57,40 53.5,50" fill="#c4b5fd" />
        {/* Clip */}
        <rect x="55" y="12" width="2" height="22" rx="1" fill="#6d28d9" />
      </motion.g>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. MONITOR + CODE  — lines type in when `active`
// ══════════════════════════════════════════════════════════════════════════════
export function MonitorCodeIcon({ active }: { active: boolean }) {
  const codeLines = [
    { color: '#a78bfa', w: 28, x: 18 },
    { color: '#22d3ee', w: 22, x: 18 },
    { color: '#34d399', w: 32, x: 22 },
    { color: '#22d3ee', w: 18, x: 22 },
    { color: '#a78bfa', w: 26, x: 18 },
  ];

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* Monitor bezel */}
      <rect x="6" y="8" width="68" height="48" rx="4"
            fill="#0d1120" stroke="#2a3560" strokeWidth="2" />
      {/* Screen */}
      <rect x="10" y="12" width="60" height="40" rx="2" fill="#080b18" />
      {/* Screen glow */}
      {active && (
        <motion.rect x="10" y="12" width="60" height="40" rx="2"
          fill="rgba(34,211,238,0.04)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {/* Code lines */}
      {codeLines.map((l, i) => (
        <motion.rect
          key={i}
          x={l.x} y={20 + i * 7} width={l.w} height="3.5" rx="1.5"
          fill={l.color}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={active ? { scaleX: 1, opacity: 0.75 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.35, delay: active ? 0.1 + i * 0.18 : 0, ease }}
          style={{ transformOrigin: `${l.x}px ${20 + i * 7}px` }}
        />
      ))}
      {/* Cursor blink */}
      {active && (
        <motion.rect
          x={18 + codeLines[4].w + 2} y={51} width="2" height="5" rx="0.5"
          fill="#22d3ee"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      )}
      {/* Stand */}
      <rect x="34" y="56" width="12" height="8" rx="1" fill="#1a2040" />
      <rect x="26" y="63" width="28" height="4" rx="2" fill="#1a2040" stroke="#2a3560" strokeWidth="1" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. MAGNIFIER + MONITOR  — glass sweeps over code when `active`
// ══════════════════════════════════════════════════════════════════════════════
export function MagnifierIcon({ active }: { active: boolean }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* Mini monitor */}
      <rect x="4" y="18" width="56" height="38" rx="3"
            fill="#0d1120" stroke="#2a3560" strokeWidth="1.5" />
      <rect x="8" y="22" width="48" height="30" rx="2" fill="#080b18" />
      {/* Code lines on monitor */}
      {[0,1,2,3].map(i => (
        <rect key={i} x={12} y={27 + i * 6} width={22 + (i % 2) * 10} height="3" rx="1"
              fill={i % 2 === 0 ? '#22d3ee' : '#a78bfa'} opacity="0.5" />
      ))}
      {/* Stand */}
      <rect x="26" y="56" width="8" height="6" rx="1" fill="#1a2040" />
      <rect x="20" y="61" width="20" height="3" rx="1.5" fill="#1a2040" stroke="#2a3560" strokeWidth="1" />

      {/* Magnifying glass — sweeps left→right when active */}
      <motion.g
        initial={{ x: 0 }}
        animate={active ? { x: [0, 20, 0] } : { x: 0 }}
        transition={{ duration: 2, delay: 0.3, repeat: active ? Infinity : 0, repeatDelay: 0.8, ease: 'easeInOut' }}
      >
        {/* Lens */}
        <circle cx="52" cy="32" r="14"
                fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        {/* Lens tint */}
        <circle cx="52" cy="32" r="11" fill="rgba(34,211,238,0.05)" />
        {/* Lens gloss */}
        <path d="M 45 26 A 8 8 0 0 1 56 24"
              stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Handle */}
        <line x1="62" y1="42" x2="72" y2="54"
              stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        {/* Handle grip */}
        <line x1="64" y1="45" x2="70" y2="51"
              stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Highlight line inside lens */}
        {active && (
          <motion.line
            x1="46" y1="30" x2="58" y2="30"
            stroke="#ffe066" strokeWidth="1.5" strokeLinecap="round"
            opacity="0.6"
            animate={{ y1: [28, 36, 28], y2: [28, 36, 28] } as never}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.g>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. ROCKET  — launches upward when `active`
// ══════════════════════════════════════════════════════════════════════════════
export function RocketIcon({ active }: { active: boolean }) {
  return (
    <svg width="72" height="88" viewBox="0 0 72 88" fill="none">
      {/* Launch pad */}
      <rect x="22" y="74" width="28" height="4" rx="2" fill="#2a3560" />
      <rect x="18" y="77" width="36" height="3" rx="1.5" fill="#1a2040" />

      {/* Exhaust flame trail */}
      {active && (
        <motion.g
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [-4, 4, -4] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          <ellipse cx="36" cy="72" rx="6" ry="10"
                   fill="rgba(251,191,36,0.6)" />
          <ellipse cx="36" cy="72" rx="3.5" ry="7"
                   fill="rgba(239,68,68,0.7)" />
          <ellipse cx="36" cy="70" rx="2" ry="4"
                   fill="rgba(255,255,255,0.5)" />
        </motion.g>
      )}

      {/* Rocket body — moves up when active */}
      <motion.g
        initial={{ y: 0 }}
        animate={active ? { y: [-8, -18, -8] } : { y: 0 }}
        transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* Body */}
        <path d="M 36 8 C 28 16 24 32 24 48 L 48 48 C 48 32 44 16 36 8 Z"
              fill="#1a3a6a" stroke="#3a6aaa" strokeWidth="1.5" />
        {/* Nose cone */}
        <path d="M 36 8 C 32 14 30 20 29 26 L 43 26 C 42 20 40 14 36 8 Z"
              fill="#22d3ee" opacity="0.9" />
        {/* Window */}
        <circle cx="36" cy="35" r="6" fill="#0d1a30" stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx="36" cy="35" r="4" fill="rgba(34,211,238,0.15)" />
        <circle cx="34" cy="33" r="1.5" fill="rgba(255,255,255,0.4)" />
        {/* Left fin */}
        <path d="M 24 48 L 16 60 L 24 56 Z" fill="#1a3a6a" stroke="#3a6aaa" strokeWidth="1" />
        {/* Right fin */}
        <path d="M 48 48 L 56 60 L 48 56 Z" fill="#1a3a6a" stroke="#3a6aaa" strokeWidth="1" />
        {/* Side stripes */}
        <line x1="27" y1="38" x2="27" y2="46" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" />
        <line x1="45" y1="38" x2="45" y2="46" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" />
      </motion.g>

      {/* Star particles on launch */}
      {active && [
        { x: 20, y: 55, delay: 0 },
        { x: 52, y: 50, delay: 0.2 },
        { x: 15, y: 44, delay: 0.4 },
        { x: 57, y: 60, delay: 0.1 },
      ].map((s, i) => (
        <motion.circle key={i} cx={s.x} cy={s.y} r="2"
          fill="#22d3ee"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0], x: [(Math.random()-0.5)*20], y: [0, -20] } as never}
          transition={{ duration: 1, delay: s.delay, repeat: Infinity, repeatDelay: 0.6 }}
        />
      ))}
    </svg>
  );
}
