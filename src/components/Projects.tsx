'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

const SpotlightCards = dynamic(() => import('./projects/SpotlightCards'), { ssr: false });

export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="projects" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-25" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ls products/ --filter=featured
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Products &amp; <span className="text-cyan-400">Projects</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-violet-400" />
          <p className="text-gray-500 mt-5 text-sm max-w-xl mx-auto">
            Real products shipped to real customers. Each one is a lesson in craftsmanship.
          </p>
        </motion.div>

        {/* Cards */}
        <SpotlightCards />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 font-mono text-sm mb-4">
            {'// Got a project idea? Let\'s build it.'}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary px-8 py-3 text-sm font-semibold tracking-wide cursor-pointer"
          >
            Let&apos;s Build Together
          </button>
        </motion.div>

      </div>
    </section>
  );
}
