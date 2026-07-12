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
  logoUrl: string;
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
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg',
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
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg',
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
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
    color: 'amber',
    colorHex: '#f7df1e',
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
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
    color: 'cyan',
    colorHex: '#61dafb',
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
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
    color: 'violet',
    colorHex: '#3178c6',
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
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg',
    color: 'emerald',
    colorHex: '#3ecf8e',
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
    id: 'docker',
    label: 'Docker',
    icon: '🐳',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
    color: 'violet',
    colorHex: '#2496ed',
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

const REVEAL_TIMING = {
  firstNodeDelay: 0.3,
  stepDelay: 0.46,
  segmentLead: 0.18,
  segmentDuration: 0.22,
};

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
  width?: number;
}

export function CRTMonitor({ activeNode, powered, width = 440 }: MonitorProps) {
  const accent = activeNode?.colorHex ?? '#22d3ee';
  const scale = width / 440;
  const screenHeight = 264 * scale;
  const terminalHeight = 212 * scale;

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none" style={{ width }}>
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
          <div className="relative" style={{ height: screenHeight }}>

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
            <div className="relative z-20" style={{ height: terminalHeight }}>
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
  revealAt: number;
  isRevealed: boolean;
  isInteractive: boolean;
}

export function OrbitNode({ node, x, y, isActive, onActivate, revealAt, isRevealed, isInteractive }: NodeProps) {
  const R = 28; // node radius
  const imgSize = 30; // logo image size

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.38, delay: revealAt, type: 'spring', stiffness: 220, damping: 16 }}
    >
      {/* Pulse ring */}
      {isActive && (
        <motion.circle
          cx={x} cy={y} r={R + 6}
          fill="none"
          stroke={node.colorHex}
          strokeWidth={1.5}
          initial={{ r: R, opacity: 0.8 }}
          animate={{ r: R + 18, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {/* Background circle */}
      <circle
        cx={x} cy={y} r={R}
        fill={isActive ? `${node.colorHex}22` : 'rgba(8,11,18,0.9)'}
        stroke={node.colorHex}
        strokeWidth={isActive ? 2.5 : 1.5}
        style={{
          filter: isActive ? `drop-shadow(0 0 12px ${node.colorHex})` : `drop-shadow(0 0 4px ${node.colorHex}44)`,
          cursor: isInteractive ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          pointerEvents: isInteractive ? 'auto' : 'none',
        }}
        onMouseEnter={() => onActivate(node)}
        onMouseLeave={() => onActivate(null)}
        onClick={() => onActivate(isActive ? null : node)}
      />

      {/* Real logo via SVG <image> — clipped to circle */}
      <defs>
        <clipPath id={`clip-${node.id}`}>
          <circle cx={x} cy={y} r={R - 6} />
        </clipPath>
      </defs>
      <image
        href={node.logoUrl}
        x={x - imgSize / 2}
        y={y - imgSize / 2}
        width={imgSize}
        height={imgSize}
        clipPath={`url(#clip-${node.id})`}
        style={{ pointerEvents: 'none', opacity: isActive ? 1 : 0.85, transition: 'opacity 0.3s ease' }}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Label below */}
      <text
        x={x} y={y + R + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isActive ? node.colorHex : '#8892aa'}
        fontSize={9}
        fontFamily="JetBrains Mono, monospace"
        fontWeight={isActive ? 'bold' : 'normal'}
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
  const W = 960;
  const H = 560;
  const monitorWidth = 470;
  const cx = W / 2;
  const cy = H / 2;
  const rx = 400;
  const ry = 245;
  const [interactiveCount, setInteractiveCount] = useState(0);

  // Start at top (-90°) and go clockwise, 7 nodes evenly spaced
  const angleStep = 360 / journeyNodes.length;
  const startAngle = -90;

  const nodePositions = journeyNodes.map((node, i) => {
    const angle = startAngle + i * angleStep;
    const pt = ellipsePoint(cx, cy, rx, ry, angle);
    return { node, ...pt, angle };
  });

  const segmentPaths = nodePositions.slice(1).map(({ node, x, y }, index) => {
    const prev = nodePositions[index];
    return {
      id: `segment-${node.id}`,
      path: `M ${prev.x} ${prev.y} L ${x} ${y}`,
      revealAt: REVEAL_TIMING.firstNodeDelay + index * REVEAL_TIMING.stepDelay + REVEAL_TIMING.segmentLead,
    };
  });

  useEffect(() => {
    if (!inView) {
      setInteractiveCount(0);
      return;
    }

    // Nodes animate in sequentially (via `revealAt` delays). We only enable
    // pointer events after each node's delay has elapsed.
    const timeouts: number[] = [];
    for (let i = 0; i < journeyNodes.length; i++) {
      const revealAt = REVEAL_TIMING.firstNodeDelay + i * REVEAL_TIMING.stepDelay;
      const interactiveDelayMs = (revealAt + 0.18) * 1000; // buffer for spring settling
      timeouts.push(
        window.setTimeout(() => {
          setInteractiveCount((prev) => Math.max(prev, i + 1));
        }, interactiveDelayMs)
      );
    }

    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [inView]);

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
          animate={inView ? { pathLength: 1, opacity: 0.32 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.1, ease: 'easeInOut', delay: REVEAL_TIMING.firstNodeDelay + 0.08 }}
        />

        {/* ── Progressive journey segments ── */}
        {segmentPaths.map(({ id, path, revealAt }, index) => {
          const segmentNode = nodePositions[index + 1]?.node;
          const isActive = activeNode?.id === segmentNode?.id || activeNode?.id === nodePositions[index]?.node.id;
          return (
            <motion.path
              key={id}
              d={path}
              fill="none"
              stroke={isActive && segmentNode ? `${segmentNode.colorHex}bb` : 'rgba(255,255,255,0.14)'}
              strokeWidth={isActive ? 1.5 : 1}
              strokeDasharray={isActive ? '4 4' : '3 5'}
              style={{ transition: 'stroke 0.35s ease, stroke-width 0.35s ease' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: REVEAL_TIMING.segmentDuration, delay: revealAt, ease: 'easeOut' }}
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
            revealAt={REVEAL_TIMING.firstNodeDelay + i * REVEAL_TIMING.stepDelay}
            isRevealed={inView}
          isInteractive={interactiveCount > i}
          />
        ))}
      </svg>

      {/* ── Monitor sits in the center ── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: cx - monitorWidth / 2, top: cy - 190 }}
      >
        <CRTMonitor activeNode={activeNode} powered={inView} width={monitorWidth} />
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
  const [interactiveCount, setInteractiveCount] = useState(0);

  const segmentPaths = nodePositions.slice(1).map(({ node, x, y }, index) => {
    const prev = nodePositions[index];
    return {
      id: `msegment-${node.id}`,
      path: `M ${prev.x} ${prev.y} L ${x} ${y}`,
      revealAt: REVEAL_TIMING.firstNodeDelay + index * REVEAL_TIMING.stepDelay + REVEAL_TIMING.segmentLead,
    };
  });

  // Arc path for the left semi-ellipse
  const topPt = nodePositions[0];
  const botPt = nodePositions[nodePositions.length - 1];
  const arcPath = `M ${topPt.x} ${topPt.y} A ${arcRx} ${arcRy} 0 0 0 ${botPt.x} ${botPt.y}`;

  useEffect(() => {
    if (!inView) {
      setInteractiveCount(0);
      return;
    }

    const timeouts: number[] = [];
    for (let i = 0; i < journeyNodes.length; i++) {
      const revealAt = REVEAL_TIMING.firstNodeDelay + i * REVEAL_TIMING.stepDelay;
      const interactiveDelayMs = (revealAt + 0.18) * 1000;
      timeouts.push(
        window.setTimeout(() => {
          setInteractiveCount((prev) => Math.max(prev, i + 1));
        }, interactiveDelayMs)
      );
    }
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [inView]);

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
          animate={inView ? { pathLength: 1, opacity: 0.28 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut', delay: REVEAL_TIMING.firstNodeDelay + 0.08 }}
        />

        {/* Travelling dot on arc */}
        {inView && (
          <motion.circle r={3} fill="#a78bfa" style={{ filter: 'drop-shadow(0 0 5px #a78bfa)' }}>
            <animateMotion dur="6s" repeatCount="indefinite" path={arcPath} />
          </motion.circle>
        )}

        {/* Progressive journey segments */}
        {segmentPaths.map(({ id, path, revealAt }, index) => {
          const segmentNode = nodePositions[index + 1]?.node;
          const isActive = activeNode?.id === segmentNode?.id || activeNode?.id === nodePositions[index]?.node.id;
          return (
            <motion.path
              key={id}
              d={path}
              fill="none"
              stroke={isActive && segmentNode ? `${segmentNode.colorHex}bb` : 'rgba(255,255,255,0.14)'}
              strokeWidth={isActive ? 1.5 : 1}
              strokeDasharray={isActive ? '3 3' : '3 5'}
              style={{ transition: 'stroke 0.35s ease, stroke-width 0.35s ease' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: REVEAL_TIMING.segmentDuration, delay: revealAt, ease: 'easeOut' }}
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
            revealAt={REVEAL_TIMING.firstNodeDelay + i * REVEAL_TIMING.stepDelay}
            isRevealed={inView}
            isInteractive={interactiveCount > i}
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
