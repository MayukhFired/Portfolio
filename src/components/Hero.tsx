'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

const roles = [
  'Full-Stack Developer',
  'React Developer',
  'Systems Programmer',
  'Freelance Creator',
];

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((w) => (w + 1) % words.length);
    }

    setDisplay(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return display;
}

function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      {text}
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-cyan-400 opacity-70"
            style={{ clipPath: 'inset(20% 0 60% 0)', transform: 'translate(-4px, 2px)' }}
            aria-hidden
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-violet-400 opacity-70"
            style={{ clipPath: 'inset(60% 0 10% 0)', transform: 'translate(4px, -2px)' }}
            aria-hidden
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

export default function Hero() {
  const role = useTypewriter(roles);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle Background */}
      <ParticleCanvas />

      {/* Radial glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400 rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500 rounded-full opacity-5 blur-[100px]" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-20 left-6 w-16 h-16 border-t-2 border-l-2 border-cyan-400 opacity-40" />
      <div className="absolute top-20 right-6 w-16 h-16 border-t-2 border-r-2 border-cyan-400 opacity-40" />
      <div className="absolute bottom-20 left-6 w-16 h-16 border-b-2 border-l-2 border-cyan-400 opacity-40" />
      <div className="absolute bottom-20 right-6 w-16 h-16 border-b-2 border-r-2 border-cyan-400 opacity-40" />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center gap-8">

        {/* 1. Status pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 glass-effect border border-green-400/30 rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#00ff88]" />
          <span className="font-mono text-green-400 text-xs tracking-widest">AVAILABLE FOR WORK</span>
        </motion.div>

        {/* 2. Terminal hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-mono text-cyan-400 text-xs sm:text-sm tracking-[0.3em] opacity-70"
        >
          &gt; INITIALIZING PORTFOLIO...
        </motion.p>

        {/* 3. Name */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col items-center gap-3"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold leading-none tracking-tight">
            <GlitchText text="MAYUKH GHOSH" />
          </h1>
          {/* Gradient underline */}
          <div className="h-1 w-28 bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400" />
        </motion.div>

        {/* 4. Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="font-mono text-lg sm:text-2xl md:text-3xl h-10 sm:h-12 flex items-center justify-center gap-1"
        >
          <span className="text-gray-500">I am a&nbsp;</span>
          <span className="text-cyan-400" style={{ textShadow: '0 0 10px rgba(0,245,255,0.5)' }}>
            {role}
          </span>
          <span className="inline-block w-0.5 h-6 bg-cyan-400 animate-pulse" />
        </motion.div>

        {/* 5. Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed"
        >
          Building high-performance applications with{' '}
          <span className="text-cyan-400">React</span>,{' '}
          <span className="text-violet-400">TypeScript</span>,{' '}
          <span className="text-emerald-400">Supabase</span> and{' '}
          <span className="text-yellow-400">C</span>.
          I craft products that feel alive — fast, beautiful, and built to scale.
        </motion.p>

        {/* 6. CTA buttons — both same height, same font, same padding */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex items-center justify-center gap-5 flex-wrap mt-8"
        >
          <motion.button
            onClick={() => scrollTo('projects')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary px-8 py-3 text-sm font-semibold tracking-wide cursor-pointer"
          >
            View Products
          </motion.button>
          <motion.button
            onClick={() => scrollTo('contact')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 text-sm font-semibold tracking-wide border-2 border-violet-400 text-violet-400 transition-all duration-300 hover:bg-violet-400/10 hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] cursor-pointer"
          >
            Contact Me
          </motion.button>
        </motion.div>

        {/* 7. AI badge — smaller, sits below buttons as a subtle link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
          transition={{ duration: 0.6, delay: 0.95 }}
        >
          <button
            onClick={() => scrollTo('ai-workflow')}
            className="group inline-flex items-center gap-2 px-3 py-1.5 glass-effect border border-violet-400/30 hover:border-violet-400/70 transition-all duration-300 hover:shadow-[0_0_16px_rgba(167,139,250,0.2)] cursor-pointer"
          >
            <span className="text-xs">🤖</span>
            <span className="font-mono text-[11px] text-violet-400 tracking-wider">
              AI-POWERED DEVELOPMENT
            </span>
            <span className="font-mono text-[11px] text-gray-600 group-hover:text-violet-400 transition-colors">
              →
            </span>
          </button>
        </motion.div>

        {/* 8. Terminal success line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-mono text-[11px] text-gray-700 mt-6"
        >
          <span className="text-violet-600">❯</span>
          <span className="text-cyan-800"> npm run build</span>
          <span className="text-emerald-700"> — compiled successfully in 342ms</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-gray-600 tracking-[0.3em]">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-cyan-400/60 to-transparent" />
      </motion.div>
    </section>
  );
}
