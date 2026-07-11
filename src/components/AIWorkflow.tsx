'use client';
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CardSwap, { Card } from './CardSwap';
import {
  BulbIcon,
  PenNotebookIcon,
  MonitorCodeIcon,
  MagnifierIcon,
  RocketIcon,
} from './workflow/WorkflowIcons';

// ─── Workflow steps data ──────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'ideate',
    step: '01',
    label: 'Ideate',
    color: '#22d3ee',
    side: 'left' as const,
    detail:
      'AI brainstorms product ideas, user stories, and architecture tradeoffs with me. Nothing starts without a clear problem statement.',
  },
  {
    id: 'architect',
    step: '02',
    label: 'Architect',
    color: '#a78bfa',
    side: 'right' as const,
    detail:
      'I design the system. AI validates the approach, flags blind spots, generates boilerplate and scaffolding.',
  },
  {
    id: 'build',
    step: '03',
    label: 'Build',
    color: '#34d399',
    side: 'left' as const,
    detail:
      'Agentic AI writes full feature implementations. I review, steer, and make the final calls on every decision.',
  },
  {
    id: 'review',
    step: '04',
    label: 'Review',
    color: '#22d3ee',
    side: 'right' as const,
    detail:
      'AI code-reviews my own code — catches bugs, security issues, and performance bottlenecks before they ship.',
  },
  {
    id: 'ship',
    step: '05',
    label: 'Ship',
    color: '#a78bfa',
    side: 'left' as const,
    detail:
      'What used to take a week ships in a day. Clients get more, faster, without any loss of quality.',
  },
] as const;

// ─── Step icon dispatcher ─────────────────────────────────────────────────────
function StepIcon({ id, active }: { id: string; active: boolean }) {
  switch (id) {
    case 'ideate':    return <BulbIcon        lit={active}    />;
    case 'architect': return <PenNotebookIcon active={active} />;
    case 'build':     return <MonitorCodeIcon active={active} />;
    case 'review':    return <MagnifierIcon   active={active} />;
    case 'ship':      return <RocketIcon      active={active} />;
    default:          return null;
  }
}

// ─── The zigzag wire SVG ──────────────────────────────────────────────────────
// We render this absolutely behind the steps.
// Node positions are passed in from the parent once layout is measured.
interface WireProps {
  nodes: { x: number; y: number }[];
  progress: number; // 0-1, drives how far the light has travelled
  color: string;
}

function ZigzagWire({ nodes, progress, color }: WireProps) {
  if (nodes.length < 2) return null;

  // Build a smooth path through all nodes using cubic bezier curves
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }

  // Measure total path length via a hidden SVG path element
  const [pathLen, setPathLen] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLen(pathRef.current.getTotalLength());
    }
  }, [nodes]);

  const drawn = pathLen * progress;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 0,
      }}
    >
      <defs>
        {/* Glowing filter for the lit wire */}
        <filter id="wire-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dim unlit wire (full path, always visible) */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" strokeLinecap="round" />

      {/* Lit wire — grows with scroll */}
      {pathLen > 0 && (
        <>
          {/* Glow layer */}
          <path
            d={d} fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${drawn} ${pathLen}`}
            opacity="0.35"
            filter="url(#wire-glow)"
          />
          {/* Sharp line layer */}
          <path
            d={d} fill="none"
            stroke={color} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={`${drawn} ${pathLen}`}
            opacity="0.9"
          />
          {/* Travelling bright tip */}
          {progress > 0 && progress < 1 && pathRef.current && (
            <TravellingTip path={pathRef.current} progress={progress} pathLen={pathLen} color={color} />
          )}
        </>
      )}

      {/* Hidden path to measure length */}
      <path ref={pathRef} d={d} fill="none" stroke="none" />
    </svg>
  );
}

function TravellingTip({
  path, progress, pathLen, color,
}: {
  path: SVGPathElement;
  progress: number;
  pathLen: number;
  color: string;
}) {
  const pt = path.getPointAtLength(pathLen * progress);
  return (
    <>
      <circle cx={pt.x} cy={pt.y} r="7" fill={color} opacity="0.25" />
      <circle cx={pt.x} cy={pt.y} r="4" fill={color} opacity="0.6" />
      <circle cx={pt.x} cy={pt.y} r="2" fill="#ffffff"  opacity="0.95" />
    </>
  );
}

// ─── Individual step card ─────────────────────────────────────────────────────
function StepCard({
  step, index, active, nodeRef,
}: {
  step: typeof STEPS[number];
  index: number;
  active: boolean;
  nodeRef: (el: HTMLDivElement | null) => void;
}) {
  const isLeft = step.side === 'left';

  return (
    <div
      className="relative flex w-full items-center"
      style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end', zIndex: 1 }}
    >
      {/* Text block — opposite side from icon */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="absolute max-w-[220px]"
            style={{ [isLeft ? 'right' : 'left']: '52%' }}
          >
            <p
              className="font-mono text-[10px] tracking-widest mb-1"
              style={{ color: step.color, opacity: 0.7 }}
            >
              STEP {step.step}
            </p>
            <h3 className="font-bold text-white text-lg mb-2">{step.label}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{step.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon node — this is the ref point for the wire */}
      <motion.div
        ref={nodeRef}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 180, damping: 20 }}
        className="relative flex items-center justify-center rounded-2xl"
        style={{
          width: 110, height: 110,
          background: active
            ? `radial-gradient(circle, ${step.color}22 0%, rgba(8,11,20,0.9) 70%)`
            : 'rgba(10,13,24,0.8)',
          border: `1.5px solid ${active ? step.color + '60' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: active ? `0 0 30px ${step.color}30, inset 0 0 20px ${step.color}10` : 'none',
          transition: 'all 0.5s ease',
          zIndex: 2,
        }}
      >
        <StepIcon id={step.id} active={active} />

        {/* Step number badge */}
        <span
          className="absolute bottom-2 right-2 font-mono text-[9px] font-bold"
          style={{ color: step.color, opacity: 0.6 }}
        >
          {step.step}
        </span>

        {/* Active pulse ring */}
        {active && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ border: `1px solid ${step.color}` }}
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
}

// ─── AI Tools data ────────────────────────────────────────────────────────────
const AI_TOOLS = [
  {
    name: 'Kiro',
    role: 'AI Coding Agent',
    tag: 'CODING',
    color: '#22d3ee',
    icon: '◈',
    desc: 'My primary coding co-pilot. Writes full feature implementations, fixes bugs, and navigates the entire codebase autonomously.',
  },
  {
    name: 'Google Antigravity',
    role: 'Debugger',
    tag: 'DEBUG',
    color: '#f87171',
    icon: '⬡',
    desc: 'Tracks down hard-to-reproduce bugs and runtime errors fast. Makes debugging feel less like archaeology.',
  },
  {
    name: 'Cursor',
    role: 'IDE & File Handling',
    tag: 'EDITOR',
    color: '#34d399',
    icon: '▶',
    desc: 'The editor I live in. Handles file navigation, inline edits, and tab-completions without breaking my flow.',
  },
  {
    name: 'Claude',
    role: 'Reasoning & Logic',
    tag: 'REASONING',
    color: '#a78bfa',
    icon: '◆',
    desc: 'Goes deep where other models stop. Complex architectural decisions, multi-step logic, and edge-case analysis.',
  },
  {
    name: 'Gemini',
    role: 'Planning',
    tag: 'PLANNING',
    color: '#fbbf24',
    icon: '◉',
    desc: 'Maps out project timelines, breaks down features into tasks, and keeps the bigger picture in focus.',
  },
  {
    name: 'Netlify',
    role: 'Deployment',
    tag: 'DEPLOY',
    color: '#38bdf8',
    icon: '▲',
    desc: 'One push and it ships. Handles CI/CD, previews, and production deploys with zero configuration headaches.',
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
export default function AIWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fire once when the pipeline comes into view
  const { ref: pipelineRef, inView: pipelineInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  // Wire fill: 0 → 1 over DURATION ms, starts when section enters view
  const DURATION = 3000; // ms — total wire travel time
  const [wireFill, setWireFill] = useState(0);

  useEffect(() => {
    if (!pipelineInView) return;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      setWireFill(progress);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pipelineInView]);

  // Which steps are "active" — light reaches step i when progress crosses its threshold
  const activeSteps = STEPS.map((_, i) => wireFill >= i / (STEPS.length - 1) - 0.04);

  // Measure node centre positions for the wire path
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const pts = nodeRefs.current.map(el => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width  / 2 - containerRect.left,
          y: r.top  + r.height / 2 - containerRect.top,
        };
      });
      setNodes(pts);
    }

    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 300);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, []);

  // Header in-view
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      id="ai-workflow"
      className="relative py-32 md:py-40 scroll-mt-24 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-40" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0  w-96 h-96 bg-violet-500 rounded-full opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-400  rounded-full opacity-[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-effect border border-violet-400/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            <span className="text-violet-400 tracking-widest">AI-AUGMENTED WORKFLOW</span>
          </div>
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ps aux | grep ai_tools
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            I Build With <span className="text-violet-400">AI</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-violet-400 to-cyan-400" />
          <p className="text-gray-400 mt-6 max-w-xl mx-auto text-sm leading-relaxed">
            AI isn&apos;t a crutch — it&apos;s a{' '}
            <span className="text-cyan-400 font-semibold">force multiplier</span>.
            I leverage it at every stage to deliver more, faster, with higher quality.
          </p>
        </motion.div>

        {/* ── Zigzag workflow pipeline ─────────────────────────────── */}
        <div
          ref={(el) => {
            // attach both refs
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            pipelineRef(el);
          }}
          className="relative"
          style={{ minHeight: STEPS.length * 180 }}
        >
          {/* SVG wire layer */}
          <ZigzagWire nodes={nodes} progress={wireFill} color="#22d3ee" />

          {/* Step cards */}
          <div className="flex flex-col gap-16">
            {STEPS.map((step, i) => (
              <StepCard
                key={step.id}
                step={step}
                index={i}
                active={activeSteps[i]}
                nodeRef={el => { nodeRefs.current[i] = el; }}
              />
            ))}
          </div>
        </div>

        {/* ── AI toolkit — CardSwap ────────────────────────────────── */}
        <div className="mt-40">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs text-gray-500 tracking-widest text-center mb-20"
          >
            {'/* MY AI TOOLKIT */'}
          </motion.p>

          {/* Two-column: left = label copy, right = CardSwap stack */}
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Left — heading + blurb */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-sm"
            >
              <p className="font-mono text-cyan-400 text-xs tracking-widest mb-3 opacity-70">
                &gt; cat tools.json
              </p>
              <h3 className="text-2xl font-bold text-white mb-4">
                The Stack Behind<br />
                <span className="text-violet-400">Every Build</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Six tools. Each one earns its place. Together they cover the full
                loop — from idea to deployed product.
              </p>
              <div className="flex flex-col gap-2">
                {AI_TOOLS.map(t => (
                  <div key={t.name} className="flex items-center gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
                    />
                    <span className="font-mono text-[11px] text-gray-400 tracking-wider">
                      {t.name.toUpperCase()}
                      <span className="text-gray-600 ml-2">— {t.role}</span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — CardSwap */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1 flex justify-center"
              style={{ height: '420px', position: 'relative', minWidth: 340 }}
            >
              <CardSwap
                width={300}
                height={200}
                cardDistance={50}
                verticalDistance={60}
                delay={500}
                pauseOnHover={true}
                skewAmount={4}
                easing="linear"
              >
                {AI_TOOLS.map(tool => (
                  <Card
                    key={tool.name}
                    style={{
                      background: 'rgba(8,11,20,0.95)',
                      border: `1px solid ${tool.color}35`,
                      boxShadow: `0 0 30px ${tool.color}18, inset 0 0 40px ${tool.color}06`,
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 36, height: 36,
                          borderRadius: 8,
                          border: `1px solid ${tool.color}40`,
                          background: `${tool.color}12`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, color: tool.color,
                        }}>
                          {tool.icon}
                        </div>
                        <div>
                          <p style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 14, margin: 0 }}>
                            {tool.name}
                          </p>
                          <p style={{ color: tool.color, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', opacity: 0.75, margin: 0 }}>
                            {tool.role}
                          </p>
                        </div>
                      </div>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 9,
                        color: tool.color,
                        background: `${tool.color}14`,
                        border: `1px solid ${tool.color}35`,
                        padding: '2px 8px',
                        borderRadius: 4,
                        letterSpacing: '0.1em',
                      }}>
                        {tool.tag}
                      </span>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: `linear-gradient(90deg, ${tool.color}40, transparent)` }} />

                    {/* Description */}
                    <p style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                      {tool.desc}
                    </p>

                    {/* Bottom corner accents */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14,
                      borderTop: `1.5px solid ${tool.color}60`, borderLeft: `1.5px solid ${tool.color}60` }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14,
                      borderBottom: `1.5px solid ${tool.color}60`, borderRight: `1.5px solid ${tool.color}60` }} />
                  </Card>
                ))}
              </CardSwap>
            </motion.div>

          </div>
        </div>

        {/* ── Quote ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 text-center"
        >
          <div className="inline-block glass-effect border border-white/10 px-8 py-5 relative">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400/40" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400/40" />
            <p className="text-gray-400 text-sm italic max-w-lg">
              &quot;I don&apos;t fight the future. I use it. AI handles the repetitive —
              I handle the{' '}
              <span className="text-cyan-400 not-italic font-semibold">creative and strategic</span>.&quot;
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
