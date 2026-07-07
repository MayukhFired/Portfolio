'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { label: 'Projects Shipped', value: '20+',   color: 'cyan'    },
  { label: 'Lines of Code',    value: '100K+', color: 'violet'  },
  { label: 'Happy Clients',    value: '15+',   color: 'emerald' },
  { label: 'Years Building',   value: '3+',    color: 'cyan'    },
];

const timeline = [
  {
    year: '2022',
    title: 'Started with C',
    desc: 'Mastered memory management, pointers, and systems programming. Built my foundation.',
    color: 'cyan',
  },
  {
    year: '2023',
    title: 'Web Pivot',
    desc: 'Dove into JavaScript, HTML/CSS, and web fundamentals. Built responsive frontends.',
    color: 'violet',
  },
  {
    year: '2024',
    title: 'Full-Stack Era',
    desc: 'React, TypeScript, Supabase, and SQL. Shipping products, open source, and freelancing.',
    color: 'emerald',
  },
  {
    year: '2025',
    title: 'Product Builder',
    desc: 'Building and selling my own software products with Docker, Git, and GitHub. Speed, quality, impact.',
    color: 'cyan',
  },
];

const colorMap: Record<string, string> = {
  cyan: 'text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]',
  violet: 'text-violet-400 border-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.3)]',
  emerald: 'text-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
};

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`glass-effect p-8 text-center border ${colorMap[stat.color]} relative overflow-hidden group hover:scale-105 transition-transform duration-300`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-current opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <div className={`text-3xl font-bold font-mono ${colorMap[stat.color].split(' ')[0]}`}>
        {stat.value}
      </div>
      <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
    </motion.div>
  );
}

export default function About() {
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true });
  const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true });

  return (
    <section id="about" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />

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

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Text side */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -40 }}
            animate={textInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="font-mono text-xs text-purple-400 mb-4 opacity-70">/* ABOUT ME */</div>
            <h3 className="text-2xl font-bold mb-6">
              I turn ideas into <span className="neon-text-cyan">reality</span>
            </h3>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                I&apos;m a freelance developer who builds fast, production-grade software. 
                From low-level systems in <span className="text-yellow-400 font-mono">C</span> to 
                full-stack web apps with <span className="text-cyan-400 font-mono">React</span> and <span className="text-purple-400 font-mono">TypeScript</span> — 
                I operate at every layer of the stack.
              </p>
              <p>
                My products are lean, performant, and built to last. I don&apos;t just write code — 
                I craft software that solves real problems and creates real value.
              </p>
              <p>
                When I&apos;m not building for clients, I&apos;m shipping my own products 
                and open-source tools. Every line of code I write is intentional.
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 space-y-3">
              {[
                { label: 'Location', value: 'Remote / Worldwide', icon: '📍' },
                { label: 'Specialty', value: 'Full-Stack & Systems', icon: '⚡' },
                { label: 'Response Time', value: '< 24 hours', icon: '🚀' },
              ].map((fact) => (
                <div key={fact.label} className="flex items-center gap-3 font-mono text-sm">
                  <span>{fact.icon}</span>
                  <span className="text-gray-600">{fact.label}:</span>
                  <span className="text-cyan-400">{fact.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline side */}
          <div>
            <div className="font-mono text-xs text-purple-400 mb-4 opacity-70">/* JOURNEY */</div>
            <div className="relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-violet-400 to-emerald-400 opacity-30" />
              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="relative pl-16 group"
                  >
                    {/* Dot */}
                    <div className={`absolute left-0 top-1 w-9 h-9 rounded-full glass-effect border flex items-center justify-center ${colorMap[item.color]}`}>
                      <span className="font-mono text-[10px] font-bold">{item.year.slice(2)}</span>
                    </div>
                    <div className="glass-effect p-5 border border-white/5 hover:border-cyan-400/30 transition-colors duration-300">
                      <div className={`font-mono text-xs mb-1 ${colorMap[item.color].split(' ')[0]}`}>
                        {item.year}
                      </div>
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
