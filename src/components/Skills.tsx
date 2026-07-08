'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

const BubbleCanvas = dynamic(() => import('./BubbleCanvas'), { ssr: false });

const TECHS = [
  { name: 'React',       slug: 'react',       color: '61DAFB', proficiency: 92 },
  { name: 'TypeScript',  slug: 'typescript',  color: '3178C6', proficiency: 88 },
  { name: 'JavaScript',  slug: 'javascript',  color: 'F7DF1E', proficiency: 90 },
  { name: 'HTML5',       slug: 'html5',       color: 'E34F26', proficiency: 97 },
  { name: 'CSS',         slug: 'css',         color: '1572B6', proficiency: 95 },
  { name: 'Supabase',    slug: 'supabase',    color: '3ECF8E', proficiency: 88 },
  { name: 'PostgreSQL',  slug: 'postgresql',  color: '4169E1', proficiency: 85 },
  { name: 'Git',         slug: 'git',         color: 'F05032', proficiency: 90 },
  { name: 'GitHub',      slug: 'github',      color: 'ffffff', proficiency: 90 },
  { name: 'Docker',      slug: 'docker',      color: '2496ED', proficiency: 80 },
  { name: 'C',           slug: 'c',           color: 'A8B9CC', proficiency: 92 },
];

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="skills"
      className="relative py-32 md:py-40 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ls -la skills/
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Tech <span className="text-cyan-400">Stack</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-violet-400" />
          <p className="mt-4 text-gray-400 text-sm font-mono opacity-60">
            click any bubble to launch it · it springs back home
          </p>
        </motion.div>

        {/* Canvas container — fixed height so the hex pack fits cleanly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            height: 'clamp(420px, 55vh, 620px)',
            background: 'rgba(8,11,18,0.5)',
            border: '1px solid rgba(34,211,238,0.08)',
            boxShadow: 'inset 0 0 80px rgba(34,211,238,0.02)',
          }}
        >
          <BubbleCanvas techs={TECHS} />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {TECHS.map((t) => {
            const r = parseInt(t.color.slice(0, 2), 16);
            const g = parseInt(t.color.slice(2, 4), 16);
            const b = parseInt(t.color.slice(4, 6), 16);
            return (
              <div
                key={t.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs backdrop-blur-sm"
                style={{
                  background: `rgba(${r},${g},${b},0.08)`,
                  border:     `1px solid rgba(${r},${g},${b},0.25)`,
                  color:      `#${t.color}`,
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: `#${t.color}` }}
                />
                {t.name}
                <span className="opacity-55">{t.proficiency}%</span>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
