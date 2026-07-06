'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const aiTools = [
  {
    name: 'Kiro',
    role: 'AI Dev Agent',
    desc: 'Full agentic coding — architecture, implementation, debugging. My primary co-pilot for every project.',
    icon: '◈',
    color: 'cyan',
    tag: 'PRIMARY',
  },
  {
    name: 'Claude',
    role: 'Reasoning & Design',
    desc: 'Deep reasoning on architecture decisions, code reviews, edge case analysis, and writing.',
    icon: '◆',
    color: 'purple',
    tag: 'DAILY',
  },
  {
    name: 'Cursor',
    role: 'AI Code Editor',
    desc: 'Tab-completion and inline edits inside the editor. Keeps me in flow without context switches.',
    icon: '▶',
    color: 'green',
    tag: 'EDITOR',
  },
  {
    name: 'v0 / Vercel',
    role: 'UI Generation',
    desc: 'Rapid UI prototyping. Generate component scaffolds, then refine and customize.',
    icon: '▲',
    color: 'cyan',
    tag: 'UI',
  },
  {
    name: 'ChatGPT',
    role: 'Research & Ideation',
    desc: 'Quick lookups, brainstorming product ideas, summarizing docs, and exploring approaches fast.',
    icon: '◉',
    color: 'purple',
    tag: 'RESEARCH',
  },
  {
    name: 'GitHub Copilot',
    role: 'Inline Completions',
    desc: 'Real-time code suggestions directly in the editor. Great for boilerplate and repetitive patterns.',
    icon: '⬡',
    color: 'green',
    tag: 'ASSIST',
  },
];

const workflow = [
  {
    step: '01',
    label: 'Ideate',
    detail: 'AI brainstorms product ideas, user stories, and architecture tradeoffs with me.',
    color: 'cyan',
    icon: '💡',
  },
  {
    step: '02',
    label: 'Architect',
    detail: 'I design the system. AI validates the approach, flags blind spots, generates boilerplate.',
    color: 'purple',
    icon: '🏗',
  },
  {
    step: '03',
    label: 'Build',
    detail: 'Agentic AI writes full feature implementations. I review, steer, and make final calls.',
    color: 'green',
    icon: '⚡',
  },
  {
    step: '04',
    label: 'Review',
    detail: 'AI code-reviews my own code — catches bugs, security issues, and perf bottlenecks.',
    color: 'cyan',
    icon: '🔍',
  },
  {
    step: '05',
    label: 'Ship',
    detail: 'What used to take a week ships in a day. Clients get more, faster, without quality loss.',
    color: 'purple',
    icon: '🚀',
  },
];

const speedStats = [
  { label: 'Faster Delivery', value: '5×', sub: 'vs traditional dev', color: 'cyan' },
  { label: 'Code Quality', value: '↑', sub: 'AI reviews every PR', color: 'green' },
  { label: 'Bugs Caught', value: '~80%', sub: 'before they ship', color: 'purple' },
  { label: 'Ideas → MVP', value: '<48h', sub: 'for most projects', color: 'cyan' },
];

const colorMap: Record<string, { text: string; border: string; badge: string; glow: string; dot: string }> = {
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-400/30',
    badge: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30',
    glow: 'hover:shadow-[0_0_25px_rgba(0,245,255,0.15)] hover:border-cyan-400/60',
    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(0,245,255,0.8)]',
  },
  purple: {
    text: 'text-purple-400',
    border: 'border-purple-400/30',
    badge: 'bg-purple-400/10 text-purple-400 border border-purple-400/30',
    glow: 'hover:shadow-[0_0_25px_rgba(123,47,255,0.15)] hover:border-purple-400/60',
    dot: 'bg-purple-400 shadow-[0_0_8px_rgba(123,47,255,0.8)]',
  },
  green: {
    text: 'text-green-400',
    border: 'border-green-400/30',
    badge: 'bg-green-400/10 text-green-400 border border-green-400/30',
    glow: 'hover:shadow-[0_0_25px_rgba(0,255,136,0.15)] hover:border-green-400/60',
    dot: 'bg-green-400 shadow-[0_0_8px_rgba(0,255,136,0.8)]',
  },
};

function ToolCard({ tool, index }: { tool: typeof aiTools[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const c = colorMap[tool.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`glass-effect border ${c.border} p-5 relative overflow-hidden group transition-all duration-300 ${c.glow} cursor-default`}
    >
      {/* Animated corner sweep on hover */}
      <motion.div
        className={`absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{
          background: `radial-gradient(circle at top left, ${tool.color === 'cyan' ? 'rgba(0,245,255,0.06)' : tool.color === 'purple' ? 'rgba(123,47,255,0.06)' : 'rgba(0,255,136,0.06)'} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 border ${c.border} flex items-center justify-center ${c.text} text-lg group-hover:scale-110 transition-transform duration-300`}>
              {tool.icon}
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{tool.name}</h4>
              <p className={`font-mono text-xs ${c.text} opacity-70`}>{tool.role}</p>
            </div>
          </div>
          <span className={`font-mono text-[10px] px-2 py-0.5 ${c.badge}`}>{tool.tag}</span>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed">{tool.desc}</p>
      </div>

      {/* Pulse dot */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full ${c.dot}`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AIWorkflow() {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section id="ai-workflow" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      {/* Top border beam */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40" />

      {/* Glowing background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-purple-500 rounded-full opacity-[0.04] blur-[100px]" />
        <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-cyan-400 rounded-full opacity-[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-effect border border-purple-400/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(123,47,255,0.8)]" />
            <span className="text-purple-400 tracking-widest">AI-AUGMENTED WORKFLOW</span>
          </div>

          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ps aux | grep ai_tools
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            I Build With <span className="text-purple-400">AI</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-purple-500 to-cyan-400" />
          <p className="text-gray-400 mt-6 mb-2 max-w-2xl mx-auto leading-relaxed">
            AI isn&apos;t a crutch — it&apos;s a <span className="text-cyan-400 font-semibold">force multiplier</span>.
            I leverage AI at every stage of the dev cycle to deliver more, faster, and with higher quality.
            The result: clients get{' '}
            <span className="text-purple-400 font-semibold">enterprise-grade output</span> at freelancer speed.
          </p>
        </motion.div>

        {/* Speed stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {speedStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-effect p-5 text-center border ${colorMap[stat.color].border} relative overflow-hidden group hover:scale-105 transition-transform duration-300`}
            >
              <div className={`text-3xl font-bold font-mono mb-1 ${colorMap[stat.color].text}`}>
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              <div className="text-gray-600 text-xs mt-1 font-mono">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Workflow pipeline */}
        <div className="mb-28">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs text-gray-500 tracking-widest text-center mb-10"
          >
            /* HOW I WORK */
          </motion.h3>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-cyan-400/20 via-purple-500/40 to-cyan-400/20" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {workflow.map((step, i) => {
                const c = colorMap[step.color];
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="flex flex-col items-center text-center group"
                  >
                    {/* Icon circle */}
                    <div className={`relative w-20 h-20 border-2 ${c.border} glass-effect flex flex-col items-center justify-center mb-4 group-hover:${c.border.replace('/30', '/70')} transition-colors duration-300 group-hover:scale-110 transform transition-transform`}>
                      <span className="text-2xl mb-1">{step.icon}</span>
                      <span className={`font-mono text-[10px] ${c.text} opacity-60`}>{step.step}</span>
                      {/* Corner accent */}
                      <div className={`absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 ${c.border.replace('/30', '')}`} />
                      <div className={`absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 ${c.border.replace('/30', '')}`} />
                    </div>

                    <h4 className={`font-bold text-sm mb-2 ${c.text}`}>{step.label}</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">{step.detail}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Tools grid */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs text-gray-500 tracking-widest text-center mb-10"
          >
            /* MY AI TOOLKIT */
          </motion.h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="inline-block glass-effect border border-white/10 px-8 py-5 relative">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400/40" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400/40" />
            <p className="text-gray-400 text-sm italic max-w-lg">
              &quot;I don&apos;t fight the future. I use it. AI handles the repetitive —
              I handle the <span className="text-cyan-400 not-italic font-semibold">creative and strategic</span>.&quot;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
