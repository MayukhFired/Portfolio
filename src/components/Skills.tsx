 'use client';

 import { motion } from 'framer-motion';
 import { useInView } from 'react-intersection-observer';
 import dynamic from 'next/dynamic';

 const BubbleCanvas = dynamic(() => import('./BubbleCanvas'), { ssr: false });
 const ShapeGrid = dynamic(() => import('./ShapeGrid'), { ssr: false });

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
      ref={ref}
      className="relative scroll-mt-24"
      style={{ minHeight: '100vh' }}
    >
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30 z-10" />

      {/* ── Background layers ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.1 }}
        className="absolute inset-0"
      >
        <ShapeGrid
          direction="diagonal"
          speed={0.45}
          borderColor="rgba(56, 189, 248, 0.33)"
          squareSize={40}
          hoverFillColor="#020617"
          shape="hexagon"
          hoverTrailAmount={0.55}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="absolute inset-0"
      >
        <BubbleCanvas techs={TECHS} />
      </motion.div>

      {/* ── Header — floats above the canvas ── */}
      <div className="relative z-10 pt-32 pb-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ls -la skills/
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Tech <span className="text-cyan-400">Stack</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-violet-400" />
          <p className="mt-4 text-gray-400 text-sm font-mono opacity-60">
            bubble fill = proficiency level
          </p>
        </motion.div>
      </div>

      {/* Legend strip removed (pills rendered via BubbleCanvas only) */}
    </section>
  );
}
