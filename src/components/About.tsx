'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import OrbitJourney from './OrbitJourney';

/* ── Stats ── */
const stats = [
  { label: 'Projects Shipped', value: '7+',   color: 'cyan'    },
  { label: 'Lines of Code',    value: '50K+', color: 'violet'  },
  { label: 'Happy Clients',    value: '5+',   color: 'emerald' },
  { label: 'Years Building',   value: '1+',   color: 'cyan'    },
];

const colorMap: Record<string, string> = {
  cyan:    'text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]',
  violet:  'text-violet-400 border-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.3)]',
  emerald: 'text-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
};

/* ── Stat Card with counter ── */
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

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
      <div className="absolute inset-0 bg-gradient-to-br from-current opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${colorMap[stat.color].split(' ')[1]} opacity-60`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${colorMap[stat.color].split(' ')[1]} opacity-60`} />
      <div className={`text-3xl font-bold font-mono ${colorMap[stat.color].split(' ')[0]}`}>
        {inView ? count : 0}{suffix}
      </div>
      <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
    </motion.div>
  );
}

/* ── Main Section ── */
export default function About() {
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true });

  return (
    <section id="about" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />

      {/* Ambient orbs */}
      <div className="absolute top-1/3 right-16 w-80 h-80 bg-violet-500 rounded-full opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-16 w-80 h-80 bg-cyan-400 rounded-full opacity-[0.04] blur-[120px] pointer-events-none" />

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

        {/* Orbit Journey — full width centered */}
        <OrbitJourney />

      </div>
    </section>
  );
}
