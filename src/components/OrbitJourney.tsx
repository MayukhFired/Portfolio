'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
export interface JourneyNode {
  id: string;
  label: string;
  icon: string;
  color: string;
  colorHex: string;
  era: string;
  lines: string[];
}

export const journeyNodes: JourneyNode[] = [
  {
    id: 'c',
    label: 'C',
    icon: 'C',
    color: 'cyan',
    colorHex: '#22d3ee',
    era: 'Foundation',
    lines: [
      '> ./journey --chapter=foundation',
      '',
      '  Era     : The Beginning',
      '  Lang    : C',
      '  Focus   : Memory, Pointers, Systems',
      '  Built   : OS utilities, data structures,',
      '            custom allocators.',
      '',
      '  "Learning C taught me how computers',
      '   actually think."',
      '',
      '  Status  : MASTERED ✓',
    ],
  },
  {
    id: 'html',
    label: 'HTML/CSS',
    icon: '</>',
    color: 'amber',
    colorHex: '#fbbf24',
    era: 'Web Entry',
    lines: [
      '> ./journey --chapter=web-entry',
      '',
      '  Era     : First Web Steps',
      '  Lang    : HTML · CSS',
      '  Focus   : Markup, layouts, responsive design',
      '  Built   : Static sites, landing pages,',
      '            pixel-perfect UIs.',
      '',
      '  "The web clicked when I understood',
      '   the box model."',
      '',
      '  Status  : MASTERED ✓',
    ],
  },
  {
    id: 'js',
    label: 'JavaScript',
    icon: 'JS',
    color: 'amber',
    colorHex: '#fbbf24',
    era: 'Dynamic Web',
    lines: [
      '> ./journey --chapter=dynamic-web',
      '',
      '  Era     : Making Things Move',
      '  Lang    : JavaScript',
      '  Focus   : DOM, events, async, APIs',
      '  Built   : Interactive UIs, fetch wrappers,',
      '            vanilla SPA experiments.',
      '',
      '  "JS was chaotic and I loved it."',
      '',
      '  Status  : MASTERED ✓',
    ],
  },
  {
    id: 'react',
    label: 'React',
    icon: '⚛',
    color: 'cyan',
    colorHex: '#22d3ee',
    era: 'Component Era',
    lines: [
      '> ./journey --chapter=components',
      '',
      '  Era     : Thinking in Components',
      '  Lang    : React · JSX',
      '  Focus   : State, hooks, composition',
      '  Built   : SPAs, dashboards,',
      '            reusable component libs.',
      '',
      '  "React changed how I architect UIs',
      '   forever."',
      '',
      '  Status  : EXPERT ✓',
    ],
  },
  {
    id: 'ts',
    label: 'TypeScript',
    icon: 'TS',
    color: 'violet',
    colorHex: '#a78bfa',
    era: 'Type Safety',
    lines: [
      '> ./journey --chapter=type-safety',
      '',
      '  Era     : Writing Serious Code',
      '  Lang    : TypeScript',
      '  Focus   : Types, interfaces, generics',
      '  Built   : Type-safe APIs, shared schemas,',
      '            zero-runtime-error codebases.',
      '',
      '  "TypeScript is the diff between',
      '   good code and great code."',
      '',
      '  Status  : EXPERT ✓',
    ],
  },
  {
    id: 'supabase',
    label: 'Supabase',
    icon: '⚡',
    color: 'emerald',
    colorHex: '#34d399',
    era: 'Full-Stack',
    lines: [
      '> ./journey --chapter=full-stack',
      '',
      '  Era     : Full-Stack Unlocked',
      '  Stack   : Supabase · PostgreSQL · RLS',
      '  Focus   : Auth, realtime, storage, RPC',
      '  Built   : SaaS products, client backends,',
      '            real-time collaboration tools.',
      '',
      '  "Supabase lets me ship backends',
      '   in hours, not days."',
      '',
      '  Status  : EXPERT ✓',
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    icon: '🐳',
    color: 'violet',
    colorHex: '#a78bfa',
    era: 'Ship It',
    lines: [
      '> ./journey --chapter=ship-it',
      '',
      '  Era     : Owning the Full Lifecycle',
      '  Tools   : Docker · Git · GitHub Actions',
      '  Focus   : CI/CD, containers, deployment',
      '  Built   : Dockerized apps, automated',
      '            pipelines, production deploys.',
      '',
      '  "Shipping is a feature."',
      '',
      '  Status  : ACTIVE ✓',
    ],
  },
];

const defaultLines = [
  '> cat about.txt',
  '',
  '  Mayukh Ghosh',
  '  Freelance Developer',
  '',
  '  Full-stack & systems builder.',
  '  React · TypeScript · C · Supabase',
  '',
  '  Hover a node to explore',
  '  my journey →',
];

/* ══════════════════════════════════════════
   TERMINAL DISPLAY
══════════════════════════════════════════ */
interface TerminalProps {
  activeNode: JourneyNode | null;
  colorHex?: string;
}

export function TerminalDisplay({ activeNode, colorHex }: TerminalProps) {
  const lines = activeNode?.lines ?? defaultLines;
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleLines([]);
    let i = 0;
    const currentLines = activeNode?.lines ?? defaultLines;
    const interval = setInterval(() => {
      if (i < currentLines.length) {
        setVisibleLines((prev) => [...prev, currentLines[i] ?? '']);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [activeNode]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [visibleLines]);

  const accent = colorHex ?? '#22d3ee';

  return (
    <div
      ref={termRef}
      className="w-full h-full overflow-hidden font-mono text-[11px] leading-relaxed p-3 flex flex-col gap-0"
      style={{ color: '#a0ffb0', scrollbarWidth: 'none' }}
    >
      {visibleLines.map((line, i) => {
        const safeLine = line ?? '';
        const isCmd = safeLine.startsWith('>');
        const isBlank = safeLine === '';
        return (
          <motion.div
            key={`${activeNode?.id ?? 'default'}-${i}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={isBlank ? 'h-2' : ''}
            style={{
              color: isCmd ? accent : safeLine.startsWith('  Status') ? '#34d399' : safeLine.startsWith('  "') ? '#8892aa' : '#a0ffb0',
              whiteSpace: 'pre',
            }}
          >
            {safeLine}
          </motion.div>
        );
      })}
      {/* blinking cursor */}
      {visibleLines.length === lines.length && (
        <motion.span
          className="inline-block w-2 h-3 mt-1"
          style={{ background: accent, verticalAlign: 'middle' }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </div>
  );
}


/* ══════════════════════════════════════════
   CRT MONITOR SHELL (desktop)
══════════════════════════════════════════ */
interface MonitorProps {
  activeNode: JourneyNode | null;
  powered: boolean;
}

export function CRTMonitor({ activeNode, powered }: MonitorProps) {
  const accent = activeNode?.colorHex ?? '#22d3ee';

  return (
    <div className="relative flex flex-col items-center select-none" style={{ width: 320 }}>
      {/* Outer bezel */}
      <div
        className="relative rounded-2xl p-[10px] w-full"
        style={{
          background: 'linear-gradient(145deg, #1c1c2e, #12121f, #0d0d1a)',
          boxShadow: `0 0 40px ${accent}18, 0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)`,
          border: '2px solid rgba(255,255,255,0.06)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Screen */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#000', boxShadow: 'inset 0 0 24px rgba(0,0,0,0.9)' }}>
          <div className="relative" style={{ height: 260 }}>

            {/* Power-on flash */}
            {powered && (
              <motion.div
                className="absolute inset-0 bg-white z-20 pointer-events-none"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Screen bg */}
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: powered
                  ? `radial-gradient(ellipse at 50% 40%, ${accent}08 0%, rgba(0,8,20,0.98) 70%)`
                  : '#000',
              }}
            />

            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.2) 2px,rgba(0,0,0,0.2) 4px)',
                mixBlendMode: 'multiply',
              }}
            />

            {/* Flicker */}
            {powered && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                style={{ background: `${accent}04` }}
                animate={{ opacity: [1, 0.6, 1, 0.8, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            )}

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-10 rounded-xl"
              style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)' }}
            />

            {/* Reflection */}
            <div
              className="absolute top-0 left-0 w-2/3 h-1/3 pointer-events-none z-10"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)', borderRadius: '0 0 100% 0' }}
            />

            {/* Title bar */}
            <div
              className="relative z-20 flex items-center gap-2 px-3 py-2 border-b"
              style={{ borderColor: `${accent}18`, background: `${accent}06` }}
            >
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              <span className="font-mono text-[9px] tracking-widest ml-1" style={{ color: `${accent}80` }}>
                {activeNode ? `journey.sh --node=${activeNode.id}` : 'terminal — bash'}
              </span>
            </div>

            {/* Terminal */}
            <div className="relative z-20" style={{ height: 214 }}>
              {powered
                ? <TerminalDisplay activeNode={activeNode} colorHex={accent} />
                : <div className="w-full h-full flex items-center justify-center font-mono text-xs" style={{ color: '#1a1a2e' }}>█</div>
              }
            </div>
          </div>
        </div>

        {/* Chin */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1">
          <span className="font-mono text-[8px] tracking-[0.3em] opacity-25" style={{ color: accent }}>
            MG-TERMINAL v1.0
          </span>
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: accent }}
            animate={powered
              ? { opacity: [1, 0.3, 1], boxShadow: [`0 0 6px ${accent}`, `0 0 2px ${accent}`, `0 0 6px ${accent}`] }
              : { opacity: 0.15 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Stand neck */}
      <div className="flex justify-center">
        <div className="w-7 h-5" style={{ background: 'linear-gradient(to bottom, #1c1c2e, #0d0d1a)', borderLeft: '2px solid rgba(255,255,255,0.03)', borderRight: '2px solid rgba(255,255,255,0.03)' }} />
      </div>
      {/* Stand base */}
      <div className="h-2 rounded-full" style={{ width: '55%', background: 'linear-gradient(to right, #0d0d1a, #1c1c2e, #0d0d1a)', boxShadow: '0 3px 14px rgba(0,0,0,0.6)' }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   ORBIT NODE (single node button)
══════════════════════════════════════════ */
interface NodeProps {
  node: JourneyNode;
  x: number;
  y: number;
  isActive: boolean;
  onActivate: (node: JourneyNode | null) => void;
  delay: number;
  inView: boolean;
}

export function OrbitNode({ node, x, y, isActive, onActivate, delay, inView }: NodeProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.4, delay, type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Pulse ring */}
      {isActive && (
        <motion.circle
          cx={x} cy={y} r={28}
          fill="none"
          stroke={node.colorHex}
          strokeWidth={1.5}
          initial={{ r: 22, opacity: 0.8 }}
          animate={{ r: 38, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {/* Outer glow circle */}
      <motion.circle
        cx={x} cy={y} r={22}
        fill={isActive ? `${node.colorHex}22` : 'rgba(15,18,32,0.85)'}
        stroke={node.colorHex}
        strokeWidth={isActive ? 2 : 1.5}
        style={{ filter: isActive ? `drop-shadow(0 0 10px ${node.colorHex})` : 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
        onMouseEnter={() => onActivate(node)}
        onMouseLeave={() => onActivate(null)}
        onClick={() => onActivate(isActive ? null : node)}
      />

      {/* Icon text */}
      <text
        x={x} y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={node.colorHex}
        fontSize={node.icon.length > 2 ? 9 : 11}
        fontFamily="JetBrains Mono, monospace"
        fontWeight="bold"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {node.icon}
      </text>

      {/* Label below node */}
      <text
        x={x} y={y + 34}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isActive ? node.colorHex : '#8892aa'}
        fontSize={8}
        fontFamily="JetBrains Mono, monospace"
        style={{ pointerEvents: 'none', userSelect: 'none', transition: 'fill 0.3s ease' }}
      >
        {node.label}
      </text>
    </motion.g>
  );
}


/* ══════════════════════════════════════════
   DESKTOP ORBIT  (SVG ellipse + nodes)
══════════════════════════════════════════ */

// Compute evenly-spaced points on an ellipse
function ellipsePoint(cx: number, cy: number, rx: number, ry: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) };
}

interface DesktopOrbitProps {
  activeNode: JourneyNode | null;
  onActivate: (node: JourneyNode | null) => void;
  inView: boolean;
}

export function DesktopOrbit({ activeNode, onActivate, inView }: DesktopOrbitProps) {
  // SVG canvas
  const W = 720;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  const rx = 290;
  const ry = 195;

  // Start at top (-90°) and go clockwise, 7 nodes evenly spaced
  const angleStep = 360 / journeyNodes.length;
  const startAngle = -90;

  const nodePositions = journeyNodes.map((node, i) => {
    const angle = startAngle + i * angleStep;
    const pt = ellipsePoint(cx, cy, rx, ry, angle);
    return { node, ...pt, angle };
  });

  // SVG ellipse path string for the travelling dot
  const ellipsePath = `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx - 0.001} ${cy - ry}`;

  return (
    <div className="relative" style={{ width: W, height: H }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradient for orbit path */}
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#34d399" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Orbit ellipse path ── */}
        <motion.ellipse
          cx={cx} cy={cy} rx={rx} ry={ry}
          fill="none"
          stroke="url(#orbitGradient)"
          strokeWidth={1}
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />

        {/* ── Travelling glow dot ── */}
        {inView && (
          <motion.circle
            r={4}
            fill="#22d3ee"
            style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
          >
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={ellipsePath}
            />
          </motion.circle>
        )}

        {/* ── Connector lines from nodes to center ── */}
        {nodePositions.map(({ node, x, y }) => {
          const isActive = activeNode?.id === node.id;
          return (
            <motion.line
              key={`line-${node.id}`}
              x1={x} y1={y}
              x2={cx} y2={cy}
              stroke={isActive ? node.colorHex : 'rgba(255,255,255,0.04)'}
              strokeWidth={isActive ? 1.5 : 0.5}
              strokeDasharray={isActive ? '4 3' : '2 6'}
              style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8 }}
            />
          );
        })}

        {/* ── Nodes ── */}
        {nodePositions.map(({ node, x, y }, i) => (
          <OrbitNode
            key={node.id}
            node={node}
            x={x}
            y={y}
            isActive={activeNode?.id === node.id}
            onActivate={onActivate}
            delay={0.4 + i * 0.1}
            inView={inView}
          />
        ))}
      </svg>

      {/* ── Monitor sits in the center ── */}
      <div
        className="absolute"
        style={{ left: cx - 160, top: cy - 165 }}
      >
        <CRTMonitor activeNode={activeNode} powered={inView} />
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════
   SMARTPHONE SHELL (mobile)
══════════════════════════════════════════ */
interface PhoneProps {
  activeNode: JourneyNode | null;
  powered: boolean;
}

export function SmartPhone({ activeNode, powered }: PhoneProps) {
  const accent = activeNode?.colorHex ?? '#22d3ee';

  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: 140,
        height: 260,
        borderRadius: 22,
        background: 'linear-gradient(160deg, #1c1c2e, #0d0d1a)',
        border: '2px solid rgba(255,255,255,0.07)',
        boxShadow: `0 0 30px ${accent}18, 0 20px 50px rgba(0,0,0,0.7)`,
        transition: 'box-shadow 0.4s ease',
        padding: 6,
      }}
    >
      {/* Camera dot notch */}
      <div className="flex justify-center mb-1">
        <div className="w-2 h-2 rounded-full" style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>

      {/* Screen */}
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: 14, background: '#000', height: 210 }}
      >
        {/* Power-on flash */}
        {powered && (
          <motion.div
            className="absolute inset-0 bg-white z-20 pointer-events-none"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}

        {/* Screen glow */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: powered
              ? `radial-gradient(ellipse at 50% 40%, ${accent}0a 0%, rgba(0,8,20,0.98) 70%)`
              : '#000',
          }}
        />

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-xl"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)' }}
        />

        {/* Title bar */}
        <div
          className="relative z-20 flex items-center justify-between px-2 py-1 border-b"
          style={{ borderColor: `${accent}18`, background: `${accent}06` }}
        >
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          </div>
          <span className="font-mono text-[7px]" style={{ color: `${accent}60` }}>term</span>
        </div>

        {/* Terminal */}
        <div className="relative z-20" style={{ height: 175 }}>
          {powered
            ? <TerminalDisplay activeNode={activeNode} colorHex={accent} />
            : null
          }
        </div>
      </div>

      {/* Home bar */}
      <div className="flex justify-center mt-1.5">
        <div className="h-1 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
      </div>

      {/* Power LED */}
      <motion.div
        className="absolute"
        style={{ right: 6, top: '50%', width: 3, height: 3, borderRadius: '50%', background: accent, transform: 'translateY(-50%)' }}
        animate={powered
          ? { opacity: [1, 0.3, 1], boxShadow: [`0 0 4px ${accent}`, `0 0 1px ${accent}`, `0 0 4px ${accent}`] }
          : { opacity: 0.15 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   MOBILE ORBIT  (vertical arc left side)
══════════════════════════════════════════ */
interface MobileOrbitProps {
  activeNode: JourneyNode | null;
  onActivate: (node: JourneyNode | null) => void;
  inView: boolean;
}

export function MobileOrbit({ activeNode, onActivate, inView }: MobileOrbitProps) {
  const W = 340;
  const H = 520;
  // Phone center
  const phoneX = W - 80;
  const phoneY = H / 2;
  // Arc on the left side — semi-ellipse
  const arcCx = phoneX - 10;
  const arcCy = phoneY;
  const arcRx = 130;
  const arcRy = 210;

  // 7 nodes spread on LEFT half of ellipse (from top to bottom, angles -90 to +90 going left)
  const nodeAngles = journeyNodes.map((_, i) => {
    const t = i / (journeyNodes.length - 1);
    return -90 + t * 180; // -90° (top) → +90° (bottom)
  });

  const nodePositions = journeyNodes.map((node, i) => {
    const rad = (nodeAngles[i] * Math.PI) / 180;
    // Mirror to left: subtract rx instead of add
    const x = arcCx - arcRx * Math.cos(rad);
    const y = arcCy + arcRy * Math.sin(rad);
    return { node, x, y };
  });

  // Arc path for the left semi-ellipse
  const topPt = nodePositions[0];
  const botPt = nodePositions[nodePositions.length - 1];
  const arcPath = `M ${topPt.x} ${topPt.y} A ${arcRx} ${arcRy} 0 0 0 ${botPt.x} ${botPt.y}`;

  return (
    <div className="relative" style={{ width: W, height: H }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="arcGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Arc path */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke="url(#arcGradientMobile)"
          strokeWidth={1}
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {/* Travelling dot on arc */}
        {inView && (
          <motion.circle r={3} fill="#a78bfa" style={{ filter: 'drop-shadow(0 0 5px #a78bfa)' }}>
            <animateMotion dur="6s" repeatCount="indefinite" path={arcPath} />
          </motion.circle>
        )}

        {/* Connector lines */}
        {nodePositions.map(({ node, x, y }) => {
          const isActive = activeNode?.id === node.id;
          return (
            <motion.line
              key={`mline-${node.id}`}
              x1={x} y1={y}
              x2={phoneX - 70} y2={phoneY}
              stroke={isActive ? node.colorHex : 'rgba(255,255,255,0.04)'}
              strokeWidth={isActive ? 1.5 : 0.5}
              strokeDasharray={isActive ? '3 3' : '2 5'}
              style={{ transition: 'all 0.3s ease' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8 }}
            />
          );
        })}

        {/* Nodes */}
        {nodePositions.map(({ node, x, y }, i) => (
          <OrbitNode
            key={node.id}
            node={node}
            x={x}
            y={y}
            isActive={activeNode?.id === node.id}
            onActivate={onActivate}
            delay={0.3 + i * 0.08}
            inView={inView}
          />
        ))}
      </svg>

      {/* Phone centered right */}
      <div
        className="absolute"
        style={{ left: phoneX - 70, top: phoneY - 130 }}
      >
        <SmartPhone activeNode={activeNode} powered={inView} />
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════
   MAIN EXPORT — OrbitJourney
   Switches between DesktopOrbit / MobileOrbit
   based on screen width
══════════════════════════════════════════ */
export default function OrbitJourney() {
  const [activeNode, setActiveNode] = useState<JourneyNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleActivate = (node: JourneyNode | null) => setActiveNode(node);

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* Journey label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-purple-400 opacity-70 mb-4 self-start"
      >
        {'/* JOURNEY */'}
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="font-mono text-[10px] text-gray-600 mb-6 tracking-widest"
      >
        {isMobile ? '— TAP A NODE TO EXPLORE —' : '— HOVER A NODE TO EXPLORE —'}
      </motion.p>

      {/* Responsive orbit */}
      <div className="overflow-hidden w-full flex justify-center">
        {isMobile ? (
          <MobileOrbit
            activeNode={activeNode}
            onActivate={handleActivate}
            inView={inView}
          />
        ) : (
          <DesktopOrbit
            activeNode={activeNode}
            onActivate={handleActivate}
            inView={inView}
          />
        )}
      </div>

      {/* Active node badge */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-4 font-mono text-xs px-4 py-2 glass-effect border"
            style={{ borderColor: `${activeNode.colorHex}40`, color: activeNode.colorHex }}
          >
            {'>'} {activeNode.era} — {activeNode.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
