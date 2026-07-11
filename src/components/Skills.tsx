'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TECHS = [
  { name: 'C',          slug: 'c',          color: '#A8B9CC', ribbon: '#7a8fa3',  badge: 'hex'   },
  { name: 'React',      slug: 'react',      color: '#61DAFB', ribbon: '#0ea5c9',  badge: 'hex'   },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6', ribbon: '#1d4ed8',  badge: 'medal' },
  { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E', ribbon: '#ca8a04',  badge: 'medal' },
  { name: 'HTML5',      slug: 'html5',      color: '#E34F26', ribbon: '#b91c1c',  badge: 'medal' },
  { name: 'CSS',        slug: 'css',        color: '#1572B6', ribbon: '#1d4ed8',  badge: 'medal' },
  { name: 'Supabase',   slug: 'supabase',   color: '#3ECF8E', ribbon: '#059669',  badge: 'hex'   },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1', ribbon: '#3730a3',  badge: 'medal' },
  { name: 'Git',        slug: 'git',        color: '#F05032', ribbon: '#b91c1c',  badge: 'medal' },
  { name: 'GitHub',     slug: 'github',     color: '#e2e8f0', ribbon: '#64748b',  badge: 'medal' },
  { name: 'Docker',     slug: 'docker',     color: '#2496ED', ribbon: '#1d4ed8',  badge: 'hex'   },
];

interface Tech {
  name: string;
  slug: string;
  color: string;
  ribbon: string;
  badge: string;
}

// Shared outer dimensions so every badge occupies the same space in the grid
const BADGE_W = 130;
const BADGE_H = 175;

// ─── Medal Badge ─────────────────────────────────────────────────────────────
function MedalBadge({ tech, index }: { tech: Tech; index: number }) {
  const id   = `m-${tech.slug}`;
  const sa   = tech.ribbon;
  const sb   = tech.color;
  // medal centred horizontally in BADGE_W
  const cx   = BADGE_W / 2;       // 65
  const discY = 118;               // centre of disc
  const discR = 44;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.06, type: 'spring', stiffness: 160, damping: 18 }}
      whileHover={{ y: -10, scale: 1.07 }}
      className="flex flex-col items-center cursor-pointer select-none"
      style={{ width: BADGE_W }}
    >
      <svg
        width={BADGE_W} height={BADGE_H}
        viewBox={`0 0 ${BADGE_W} ${BADGE_H}`}
        fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id={`face-${id}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%"   stopColor={tech.color} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#060810"    stopOpacity="1"    />
          </radialGradient>
          <linearGradient id={`rim-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f8dd80" />
            <stop offset="30%"  stopColor="#c8960c" />
            <stop offset="65%"  stopColor="#f5d06e" />
            <stop offset="100%" stopColor="#9a6e0a" />
          </linearGradient>
          <linearGradient id={`dark-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1e2340" />
            <stop offset="100%" stopColor="#060810" />
          </linearGradient>
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor={tech.color} floodOpacity="0.55" />
          </filter>
          <clipPath id={`clip-${id}`}>
            <circle cx={cx} cy={discY} r={discR - 14} />
          </clipPath>
        </defs>

        {/* Ribbon — two colour stripes */}
        <rect x={cx - 14} y="0" width="13" height="56" fill={sa} rx="1.5" />
        <rect x={cx - 1}  y="0" width="15" height="56" fill={sb} rx="1.5" />
        {/* Edge highlights */}
        <rect x={cx - 14} y="0" width="1.5" height="56" fill="rgba(255,255,255,0.25)" />
        <rect x={cx + 13} y="0" width="1.5" height="56" fill="rgba(0,0,0,0.25)"       />
        {/* V-notch bottom */}
        <polygon points={`${cx-14},50 ${cx},66 ${cx+14},50 ${cx+14},56 ${cx},72 ${cx-14},56`} fill={sa} />
        <polygon points={`${cx},66    ${cx+14},50 ${cx+14},56 ${cx},72`}                      fill={sb} />

        {/* Gold clasp bar */}
        <rect x={cx - 40} y="23" width="80" height="14" rx="3" fill={`url(#rim-${id})`} />
        <rect x={cx - 40} y="23" width="80" height="4"  rx="3" fill="rgba(255,255,255,0.30)" />
        <rect x={cx - 40} y="33" width="80" height="2"         fill="rgba(0,0,0,0.25)"       />

        {/* Outer gold disc */}
        <circle cx={cx} cy={discY} r={discR}      fill={`url(#rim-${id})`} filter={`url(#glow-${id})`} />
        {/* Groove ring */}
        <circle cx={cx} cy={discY} r={discR - 4}  fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" />
        {/* Dark inner face */}
        <circle cx={cx} cy={discY} r={discR - 7}  fill={`url(#dark-${id})`} />
        {/* Color tint */}
        <circle cx={cx} cy={discY} r={discR - 7}  fill={`url(#face-${id})`} />
        {/* Inner ring */}
        <circle cx={cx} cy={discY} r={discR - 13} fill="none" stroke={`${tech.color}55`} strokeWidth="1.5" />

        {/* Tech icon — fills the inner circle face */}
        <image
          href={`https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace('#','')}`}
          x={cx - (discR - 15)} y={discY - (discR - 15)}
          width={(discR - 15) * 2} height={(discR - 15) * 2}
          clipPath={`url(#clip-${id})`}
        />

        {/* Gloss arcs */}
        <path d={`M ${cx-discR+4} ${discY-12} A ${discR-4} ${discR-4} 0 0 1 ${cx} ${discY-discR+4}`}
              stroke="rgba(255,255,255,0.22)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d={`M ${cx-discR-4} ${discY-14} A ${discR+4} ${discR+4} 0 0 1 ${cx+4} ${discY-discR-3}`}
              stroke="rgba(255,255,255,0.10)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>

      {/* Name */}
      <span
        className="font-mono text-[11px] font-semibold tracking-widest mt-2 text-center"
        style={{ color: tech.color, textShadow: `0 0 8px ${tech.color}99` }}
      >
        {tech.name.toUpperCase()}
      </span>
    </motion.div>
  );
}

// ─── Hex Emblem Badge ────────────────────────────────────────────────────────
function HexBadge({ tech, index }: { tech: Tech; index: number }) {
  const id  = `h-${tech.slug}`;
  const c   = tech.color;

  // SVG canvas — wide enough to show wings without clipping
  const VW = BADGE_W + 40;   // 170
  const VH = BADGE_H;        // 175

  // Hex centre
  const hx = VW / 2;         // 85
  const hy = VH / 2 - 10;    // 77.5  (slightly above centre to leave room for name)

  const hexR  = 44;           // outer hex radius
  const hexR2 = 34;           // inner hex (face) radius

  const hexPoints = (r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 30);
      return `${(hx + r * Math.cos(a)).toFixed(2)},${(hy + r * Math.sin(a)).toFixed(2)}`;
    }).join(' ');

  // Wing tip x positions (well inside VW)
  const wingTipL = 8;
  const wingTipR = VW - 8;
  // Wing attach points on hex side (left/right flat sides of pointy-top hex)
  const attachLx = hx - hexR - 2;
  const attachRx = hx + hexR + 2;
  const attachY1 = hy - 8;
  const attachY2 = hy + 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.06, type: 'spring', stiffness: 160, damping: 18 }}
      whileHover={{ y: -10, scale: 1.07 }}
      className="flex flex-col items-center cursor-pointer select-none"
      style={{ width: BADGE_W }}
    >
      <svg
        width={VW} height={VH}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', marginLeft: '-20px', marginRight: '-20px' }}
      >
        <defs>
          <linearGradient id={`hrim-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f8dd80" />
            <stop offset="35%"  stopColor="#c8960c" />
            <stop offset="70%"  stopColor="#f5d06e" />
            <stop offset="100%" stopColor="#9a6e0a" />
          </linearGradient>
          <linearGradient id={`hface-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#16324a" />
            <stop offset="100%" stopColor="#060d18" />
          </linearGradient>
          <radialGradient id={`htint-${id}`} cx="50%" cy="38%" r="58%">
            <stop offset="0%"   stopColor={c} stopOpacity="0.35" />
            <stop offset="100%" stopColor={c} stopOpacity="0"    />
          </radialGradient>
          <filter id={`hglow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="9" floodColor={c} floodOpacity="0.6" />
          </filter>
          <clipPath id={`hclip-${id}`}>
            <polygon points={hexPoints(hexR2 - 2)} />
          </clipPath>
        </defs>

        {/* ── Wings ── */}
        {/* Left wing: 3 stacked chevron bars fanning out */}
        {[0, 1, 2].map(n => {
          const spread = n * 9;
          const retract = n * 3;
          return (
            <polygon
              key={`lw-${n}`}
              points={[
                `${wingTipL + retract},${hy - 6 - spread}`,
                `${attachLx},${attachY1 - n * 2}`,
                `${attachLx},${attachY2 + n * 2}`,
                `${wingTipL + retract},${hy + 6 + spread}`,
              ].join(' ')}
              fill={`url(#hrim-${id})`}
              opacity={1 - n * 0.22}
            />
          );
        })}

        {/* Right wing: mirror */}
        {[0, 1, 2].map(n => {
          const spread = n * 9;
          const retract = n * 3;
          return (
            <polygon
              key={`rw-${n}`}
              points={[
                `${wingTipR - retract},${hy - 6 - spread}`,
                `${attachRx},${attachY1 - n * 2}`,
                `${attachRx},${attachY2 + n * 2}`,
                `${wingTipR - retract},${hy + 6 + spread}`,
              ].join(' ')}
              fill={`url(#hrim-${id})`}
              opacity={1 - n * 0.22}
            />
          );
        })}

        {/* Wing divider lines */}
        {[1, 2].map(n => (
          <line
            key={`ldiv-${n}`}
            x1={wingTipL + n * 3 + 2} y1={hy - n * 7}
            x2={attachLx}             y2={hy}
            stroke="rgba(0,0,0,0.35)" strokeWidth="1"
          />
        ))}
        {[1, 2].map(n => (
          <line
            key={`rdiv-${n}`}
            x1={wingTipR - n * 3 - 2} y1={hy - n * 7}
            x2={attachRx}             y2={hy}
            stroke="rgba(0,0,0,0.35)" strokeWidth="1"
          />
        ))}

        {/* ── Outer hex frame ── */}
        <polygon points={hexPoints(hexR)} fill={`url(#hrim-${id})`} filter={`url(#hglow-${id})`} />
        {/* Groove hex */}
        <polygon points={hexPoints(hexR - 5)} fill={`url(#hface-${id})`} />
        {/* Inner face */}
        <polygon points={hexPoints(hexR2)} fill={`url(#hface-${id})`} />
        <polygon points={hexPoints(hexR2)} fill={`url(#htint-${id})`} />
        {/* Inner border */}
        <polygon points={hexPoints(hexR2)} fill="none" stroke={`${c}65`} strokeWidth="1.5" />

        {/* ── Rank stripes (bottom third of hex) ── */}
        {[0, 1, 2].map(n => {
          const stripW = (hexR2 - 6 - n * 3) * 2;
          return (
            <rect
              key={`rs-${n}`}
              x={hx - stripW / 2}
              y={hy + hexR2 * 0.30 + n * 8}
              width={stripW}
              height="4.5"
              rx="1.5"
              fill={`url(#hrim-${id})`}
              opacity={0.9 - n * 0.18}
            />
          );
        })}

        {/* ── Tech icon (upper portion of hex face) ── */}
        {/* Icon sits in the top 55% of the inner hex, above the rank stripes */}
        <image
          href={`https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace('#','')}`}
          x={hx - 22} y={hy - hexR2 + 4}
          width="44" height="44"
          clipPath={`url(#hclip-${id})`}
        />

        {/* Gloss sheen */}
        <path
          d={`M ${hx - hexR2 + 5} ${hy - 8} L ${hx - 4} ${hy - hexR2 + 5} L ${hx + 12} ${hy - hexR2 + 5}`}
          stroke="rgba(255,255,255,0.20)" strokeWidth="3" strokeLinecap="round" fill="none"
        />
      </svg>

      {/* Name */}
      <span
        className="font-mono text-[11px] font-semibold tracking-widest mt-2 text-center"
        style={{ color: c, textShadow: `0 0 8px ${c}99` }}
      >
        {tech.name.toUpperCase()}
      </span>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="skills" className="relative py-32 md:py-40 scroll-mt-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
      <div className="absolute inset-0 line-grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ls -la skills/
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Tech <span className="text-cyan-400">Stack</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-violet-400" />
          <p className="mt-4 font-mono text-xs text-gray-600 tracking-widest">
            HONOURS EARNED IN THE FIELD
          </p>
        </motion.div>

        {inView && (
          <div className="flex flex-col items-center gap-14">
            {/* Row 1 — Hex emblem badges */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-8">
              {TECHS.filter(t => t.badge === 'hex').map((tech, i) => (
                <HexBadge key={tech.slug} tech={tech} index={i} />
              ))}
            </div>

            {/* Divider */}
            <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Row 2 — Medal badges */}
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-8">
              {TECHS.filter(t => t.badge === 'medal').map((tech, i) => (
                <MedalBadge key={tech.slug} tech={tech} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
