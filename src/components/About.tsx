'use client';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';

/* ── Stats ── */
const stats = [
  { label: 'Projects Shipped', value: '7+',   color: 'cyan'    },
  { label: 'Lines of Code',    value: '50K+', color: 'violet'  },
  { label: 'Happy Clients',    value: '5+',   color: 'emerald' },
  { label: 'Years Building',   value: '1+',   color: 'cyan'    },
];

/* ── Timeline (no year labels) ── */
const timeline = [
  {
    title: 'Started with C',
    desc: 'Mastered memory management, pointers, and systems programming. Built my foundation.',
    color: 'cyan',
    icon: '⚙',
  },
  {
    title: 'Web Pivot',
    desc: 'Dove into JavaScript, HTML/CSS, and web fundamentals. Built responsive frontends.',
    color: 'violet',
    icon: '🌐',
  },
  {
    title: 'Full-Stack Era',
    desc: 'React, TypeScript, Supabase, and SQL. Shipping products, open source, and freelancing.',
    color: 'emerald',
    icon: '⚡',
  },
  {
    title: 'Product Builder',
    desc: 'Building and selling my own software products with Docker, Git, and GitHub. Speed, quality, impact.',
    color: 'cyan',
    icon: '🚀',
  },
];

/* ── Terminal lines ── */
const terminalSequence = [
  { type: 'prompt', text: 'mayukh@portfolio:~$', cmd: 'cat about.txt' },
  { type: 'output', text: '// Freelance developer.' },
  { type: 'output', text: '// Full-stack & systems builder.' },
  { type: 'output', text: '// React · TypeScript · C · Supabase' },
  { type: 'output', text: '// Lean code. Real products. Real value.' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: 'mayukh@portfolio:~$', cmd: 'whoami --verbose' },
  { type: 'output', text: '📍 Remote / Worldwide' },
  { type: 'output', text: '⚡ Full-Stack & Systems' },
  { type: 'output', text: '🚀 Response: < 24 hours' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: 'mayukh@portfolio:~$', cmd: '' }, // final blinking cursor
];

/* ── Color map ── */
const colorMap: Record<string, string> = {
  cyan:    'text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]',
  violet:  'text-violet-400 border-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.3)]',
  emerald: 'text-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
};

/* ════════════════════════════════
   Stat Card
════════════════════════════════ */
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Parse numeric part for counter
  const numericMatch = stat.value.match(/\d+/);
  const numeric = numericMatch ? parseInt(numericMatch[0]) : 0;
  const suffix = stat.value.replace(/\d+/, '');

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const increment = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numeric) {
        setCount(numeric);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numeric]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`glass-effect p-8 text-center border ${colorMap[stat.color]} relative overflow-hidden group hover:scale-105 transition-transform duration-300`}
    >
      {/* Hover sweep */}
      <div className="absolute inset-0 bg-gradient-to-br from-current opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      {/* Animated corner accents */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${colorMap[stat.color].split(' ')[1]} opacity-60`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${colorMap[stat.color].split(' ')[1]} opacity-60`} />

      <div className={`text-3xl font-bold font-mono ${colorMap[stat.color].split(' ')[0]}`}>
        {inView ? count : 0}{suffix}
      </div>
      <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
    </motion.div>
  );
}

/* ════════════════════════════════
   CRT Monitor + Terminal
════════════════════════════════ */
function CRTMonitor() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [powered, setPowered] = useState(false);
  const [lines, setLines] = useState<{ id: number; type: string; text: string; cmd?: string; done: boolean }[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [phase, setPhase] = useState<'cmd' | 'output'>('output');
  const terminalRef = useRef<HTMLDivElement>(null);

  // Power on when in view
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setPowered(true), 400);
      return () => clearTimeout(t);
    }
  }, [inView]);

  // Drive the typing sequence
  useEffect(() => {
    if (!powered) return;
    if (currentLine >= terminalSequence.length) return;

    const item = terminalSequence[currentLine];

    // Blank lines — add instantly
    if (item.type === 'blank') {
      setLines((prev) => [...prev, { id: currentLine, type: 'blank', text: '', done: true }]);
      const t = setTimeout(() => setCurrentLine((l) => l + 1), 100);
      return () => clearTimeout(t);
    }

    // Last prompt with no cmd — just show blinking cursor, stop
    if (item.type === 'prompt' && !item.cmd) {
      setLines((prev) => [...prev, { id: currentLine, type: 'prompt', text: item.text, cmd: '', done: true }]);
      return;
    }

    // Prompt lines — type out the command part
    if (item.type === 'prompt') {
      if (phase === 'output') {
        // First show the full prompt text instantly, then type cmd
        setLines((prev) => {
          const existing = prev.find((l) => l.id === currentLine);
          if (!existing) {
            return [...prev, { id: currentLine, type: 'prompt', text: item.text, cmd: '', done: false }];
          }
          return prev;
        });
        setPhase('cmd');
        setCurrentChar(0);
        return;
      }
      // Typing the cmd character by character
      const cmd = item.cmd ?? '';
      if (currentChar < cmd.length) {
        const t = setTimeout(() => {
          setLines((prev) =>
            prev.map((l) =>
              l.id === currentLine ? { ...l, cmd: cmd.slice(0, currentChar + 1) } : l
            )
          );
          setCurrentChar((c) => c + 1);
        }, 60);
        return () => clearTimeout(t);
      } else {
        // cmd fully typed — move to next line
        setLines((prev) =>
          prev.map((l) => (l.id === currentLine ? { ...l, done: true } : l))
        );
        const t = setTimeout(() => {
          setCurrentLine((l) => l + 1);
          setPhase('output');
          setCurrentChar(0);
        }, 180);
        return () => clearTimeout(t);
      }
    }

    // Output lines — appear with a short delay
    if (item.type === 'output') {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, { id: currentLine, type: 'output', text: item.text, done: true }]);
        setCurrentLine((l) => l + 1);
      }, 80);
      return () => clearTimeout(t);
    }
  }, [powered, currentLine, currentChar, phase]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const isLastPrompt =
    currentLine >= terminalSequence.length ||
    (terminalSequence[currentLine]?.type === 'prompt' && !terminalSequence[currentLine]?.cmd);

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      {/* ── Monitor shell ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full"
      >
        {/* Outer bezel */}
        <div
          className="relative rounded-2xl p-3 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #1a1a2e, #12121f, #0d0d1a)',
            boxShadow: '0 0 40px rgba(34,211,238,0.08), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            border: '2px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Inner screen bezel */}
          <div
            className="rounded-xl overflow-hidden relative"
            style={{
              background: '#000',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
            }}
          >
            {/* Screen content */}
            <div
              className="relative overflow-hidden"
              style={{ minHeight: '340px' }}
            >
              {/* ── CRT power-on flash ── */}
              {powered && (
                <motion.div
                  className="absolute inset-0 bg-white z-20 pointer-events-none"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}

              {/* ── Screen glow background ── */}
              <div
                className="absolute inset-0"
                style={{
                  background: powered
                    ? 'radial-gradient(ellipse at 50% 40%, rgba(34,211,238,0.04) 0%, rgba(0,8,20,0.98) 70%)'
                    : '#000',
                  transition: 'background 0.4s ease',
                }}
              />

              {/* ── Scanlines overlay ── */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
                  mixBlendMode: 'multiply',
                }}
              />

              {/* ── CRT flicker ── */}
              {powered && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10 bg-cyan-400/[0.015]"
                  animate={{ opacity: [1, 0.7, 1, 0.85, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {/* ── RGB fringe / vignette ── */}
              <div
                className="absolute inset-0 pointer-events-none z-10 rounded-xl"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)',
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)',
                }}
              />

              {/* ── Screen reflection ── */}
              <div
                className="absolute top-0 left-0 w-2/3 h-1/3 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)',
                  borderRadius: '0 0 100% 0',
                }}
              />

              {/* ── Title bar ── */}
              <div
                className="relative z-20 flex items-center gap-2 px-4 py-2.5 border-b"
                style={{ borderColor: 'rgba(34,211,238,0.12)', background: 'rgba(34,211,238,0.03)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-[10px] text-cyan-400/50 ml-2 tracking-widest">
                  terminal — bash
                </span>
              </div>

              {/* ── Terminal content ── */}
              <div
                ref={terminalRef}
                className="relative z-20 p-4 font-mono text-xs leading-relaxed overflow-y-auto"
                style={{
                  minHeight: '290px',
                  maxHeight: '290px',
                  color: '#a0ffb0',
                  scrollbarWidth: 'none',
                }}
              >
                {!powered && (
                  <div className="text-gray-800 select-none">█</div>
                )}

                {powered && lines.map((line) => {
                  if (line.type === 'blank') {
                    return <div key={line.id} className="h-2" />;
                  }
                  if (line.type === 'prompt') {
                    return (
                      <div key={line.id} className="flex items-center gap-1 flex-wrap">
                        <span style={{ color: '#a78bfa' }}>mayukh</span>
                        <span style={{ color: '#4a5168' }}>@</span>
                        <span style={{ color: '#22d3ee' }}>portfolio</span>
                        <span style={{ color: '#4a5168' }}>:~$</span>
                        <span style={{ color: '#f0f4ff' }}>&nbsp;{line.cmd}</span>
                        {/* Blinking cursor on last active prompt */}
                        {!line.done && (
                          <motion.span
                            className="inline-block w-2 h-3 ml-0.5"
                            style={{ background: '#22d3ee', verticalAlign: 'middle' }}
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}
                      </div>
                    );
                  }
                  if (line.type === 'output') {
                    const isComment = line.text.startsWith('//');
                    const isInfo = line.text.match(/^[📍⚡🚀]/u);
                    return (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          color: isComment ? '#34d399' : isInfo ? '#a0ffb0' : '#8892aa',
                          paddingLeft: '0.5rem',
                        }}
                      >
                        {line.text}
                      </motion.div>
                    );
                  }
                  return null;
                })}

                {/* Idle blinking cursor at the end */}
                {powered && isLastPrompt && (
                  <div className="flex items-center gap-1 mt-1">
                    <span style={{ color: '#a78bfa' }}>mayukh</span>
                    <span style={{ color: '#4a5168' }}>@</span>
                    <span style={{ color: '#22d3ee' }}>portfolio</span>
                    <span style={{ color: '#4a5168' }}>:~$</span>
                    <motion.span
                      className="inline-block w-2 h-3 ml-1"
                      style={{ background: '#22d3ee', verticalAlign: 'middle' }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Monitor chin / logo ── */}
          <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
            <span
              className="font-mono text-[9px] tracking-[0.3em] opacity-30"
              style={{ color: '#22d3ee' }}
            >
              MG-TERMINAL v1.0
            </span>
            {/* Power LED */}
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#22d3ee' }}
              animate={powered ? { opacity: [1, 0.4, 1], boxShadow: ['0 0 6px #22d3ee', '0 0 2px #22d3ee', '0 0 6px #22d3ee'] } : { opacity: 0.15 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* ── Monitor stand neck ── */}
        <div className="flex justify-center">
          <div
            className="w-8 h-6"
            style={{
              background: 'linear-gradient(to bottom, #1a1a2e, #12121f)',
              clipPath: 'trapezoid',
              borderLeft: '2px solid rgba(255,255,255,0.04)',
              borderRight: '2px solid rgba(255,255,255,0.04)',
            }}
          />
        </div>
        {/* Stand base */}
        <div className="flex justify-center">
          <div
            className="h-2 rounded-full"
            style={{
              width: '60%',
              background: 'linear-gradient(to right, #0d0d1a, #1a1a2e, #0d0d1a)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════
   Main About Section
════════════════════════════════ */
export default function About() {
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true });
  const { ref: timelineRef, inView: timelineInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-violet-500 rounded-full opacity-[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-cyan-400 rounded-full opacity-[0.03] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; cat about.txt
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            About <span className="text-cyan-400">Me</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-violet-400" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── LEFT: CRT Monitor ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-mono text-xs text-purple-400 mb-6 opacity-70">/* ABOUT ME */</div>
            <CRTMonitor />
          </motion.div>

          {/* ── RIGHT: Timeline ── */}
          <div ref={timelineRef}>
            <div className="font-mono text-xs text-purple-400 mb-6 opacity-70">/* JOURNEY */</div>
            <div className="relative">

              {/* Animated vertical line */}
              <motion.div
                className="absolute left-[18px] top-0 w-px"
                style={{
                  background: 'linear-gradient(to bottom, #22d3ee, #a78bfa, #34d399)',
                  opacity: 0.4,
                }}
                initial={{ height: 0 }}
                animate={timelineInView ? { height: '100%' } : { height: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
              />

              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="relative pl-16 group"
                  >
                    {/* Dot with pulse ring */}
                    <div className="absolute left-0 top-1">
                      {/* Pulse ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-full border ${colorMap[item.color].split(' ')[1]}`}
                        initial={{ scale: 1, opacity: 0 }}
                        whileInView={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0] }}
                        viewport={{ once: false }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatDelay: 3 }}
                      />
                      {/* Dot */}
                      <div className={`relative w-9 h-9 rounded-full glass-effect border flex items-center justify-center ${colorMap[item.color]}`}>
                        <span className="text-sm">{item.icon}</span>
                      </div>
                    </div>

                    {/* Card */}
                    <div className="glass-effect p-5 border border-white/5 hover:border-cyan-400/30 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.05)] relative overflow-hidden">
                      {/* Hover corner accent */}
                      <div className="absolute top-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-500" />
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
