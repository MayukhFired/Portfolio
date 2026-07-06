'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootLines = [
  '> Initializing system...',
  '> Loading assets...',
  '> Connecting to network...',
  '> Rendering portfolio...',
  '> Access granted. Welcome.',
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2200;
    const interval = 16;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const p = Math.min((step / steps) * 100, 100);
      setProgress(Math.floor(p));
      setLineIndex(Math.min(Math.floor((p / 100) * bootLines.length), bootLines.length - 1));

      if (p >= 100) {
        clearInterval(timer);
        setDone(true);
        setTimeout(onComplete, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: '#0a0a0f' }}
        >
          {/* Scanline */}
          <div className="scanline" />

          {/* Grid bg */}
          <div className="absolute inset-0 grid-bg opacity-30" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-8">
            
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.5)]"
            >
              <span className="font-mono text-2xl text-cyan-400 font-bold">&lt;/&gt;</span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-sm text-gray-500 tracking-[0.5em]"
            >
              DEV.PORTFOLIO
            </motion.div>

            {/* Boot lines */}
            <div className="w-full space-y-1 font-mono text-xs">
              {bootLines.slice(0, lineIndex + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === lineIndex ? 'text-cyan-400' : 'text-gray-700'}
                >
                  {line}
                  {i === lineIndex && (
                    <span className="inline-block w-2 h-3 bg-cyan-400 ml-1 animate-pulse align-middle" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between font-mono text-xs text-gray-600 mb-2">
                <span>LOADING</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-white/5 w-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.016 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
