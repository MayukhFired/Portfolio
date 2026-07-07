'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const skillGroups = [
  {
    category: 'Frontend',
    icon: '🖥',
    color: 'cyan',
    skills: [
      { name: 'React',       level: 92, icon: '⚛'  },
      { name: 'TypeScript',  level: 88, icon: 'TS'  },
      { name: 'JavaScript',  level: 90, icon: 'JS'  },
      { name: 'HTML / CSS',  level: 97, icon: '</>' },
    ],
  },
  {
    category: 'Database & Cloud',
    icon: '🗄',
    color: 'emerald',
    skills: [
      { name: 'Supabase', level: 88, icon: '⚡' },
      { name: 'SQL',      level: 85, icon: '🗄' },
    ],
  },
  {
    category: 'Systems Programming',
    icon: '⚙',
    color: 'violet',
    skills: [
      { name: 'C', level: 92, icon: 'C' },
    ],
  },
  {
    category: 'DevOps & Tools',
    icon: '🔧',
    color: 'amber',
    skills: [
      { name: 'Git',    level: 90, icon: '⎇' },
      { name: 'GitHub', level: 90, icon: '🐙' },
      { name: 'Docker', level: 80, icon: '🐳' },
    ],
  },
];

const colorMap: Record<string, { text: string; border: string; bg: string; bar: string; glow: string }> = {
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-400/30',
    bg: 'bg-cyan-400/5',
    bar: 'bg-cyan-400',
    glow: 'shadow-[0_0_8px_rgba(34,211,238,0.5)]',
  },
  violet: {
    text: 'text-violet-400',
    border: 'border-violet-400/30',
    bg: 'bg-violet-400/5',
    bar: 'bg-violet-400',
    glow: 'shadow-[0_0_8px_rgba(167,139,250,0.5)]',
  },
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/5',
    bar: 'bg-emerald-400',
    glow: 'shadow-[0_0_8px_rgba(52,211,153,0.5)]',
  },
  amber: {
    text: 'text-amber-400',
    border: 'border-amber-400/30',
    bg: 'bg-amber-400/5',
    bar: 'bg-amber-400',
    glow: 'shadow-[0_0_8px_rgba(251,191,36,0.5)]',
  },
};

function SkillBar({ name, level, color, icon, delay }: { name: string; level: number; color: string; icon: string; delay: number }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const c = colorMap[color];

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm ${c.text}`}>{icon}</span>
          <span className="text-gray-300 text-sm font-medium">{name}</span>
        </div>
        <span className={`font-mono text-xs ${c.text}`}>{level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${c.bar} rounded-full ${c.glow}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

const techBadges = [
  'C', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Supabase', 'SQL', 'Git', 'GitHub', 'Docker'
];

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section id="skills" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ls -la skills/
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Tech <span className="text-cyan-400">Stack</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-violet-400" />
        </motion.div>

        {/* Floating tech badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-24">
          {techBadges.map((badge, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="px-4 py-2 glass-effect border border-white/10 hover:border-cyan-400/50 text-gray-400 hover:text-cyan-400 font-mono text-xs cursor-default transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
            >
              {badge}
            </motion.div>
          ))}
        </div>

        {/* Skill groups grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillGroups.map((group, gi) => {
            const c = colorMap[group.color];
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: gi * 0.1 }}
                className={`glass-effect p-8 border ${c.border} ${c.bg} relative overflow-hidden group hover:${c.border.replace('/30', '/60')} transition-all duration-300`}
              >
                {/* Glow corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${c.bar} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300`} />

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">{group.icon}</span>
                  <h3 className={`font-semibold ${c.text}`}>{group.category}</h3>
                </div>

                <div className="space-y-5">
                  {group.skills.map((skill, si) => (
                    <SkillBar
                      key={skill.name}
                      {...skill}
                      color={group.color}
                      delay={gi * 0.15 + si * 0.08}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
