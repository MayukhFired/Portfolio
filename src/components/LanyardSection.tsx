'use client';
import { motion } from 'framer-motion';
import Lanyard from './Lanyard';
import Particles from './Particles';

export default function LanyardSection() {
  return (
    <section className="relative py-20 overflow-hidden border-t border-cyan-400/10">
      {/* Interactive WebGL Particles Background */}
      <Particles
        particleColors={['#00f5ff', '#a855f7', '#22c55e']}
        particleCount={80}
        particleSpread={10}
        speed={0.12}
        particleBaseSize={80}
        moveParticlesOnHover={true}
        particleHoverFactor={1.2}
        alphaParticles={true}
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
      />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-400 rounded-full opacity-5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
        {/* Left Column: 3D Lanyard Card */}
        <div className="h-[450px] sm:h-[550px] md:h-[650px] flex items-center justify-center relative order-2 md:order-1">
          <Lanyard 
            position={[0, 0, 16]} 
            gravity={[0, -45, 0]} 
            frontImage="/lanyard-profile.png"
            backImage="/lanyard-profile.png"
            imageFit="cover"
          />
        </div>

        {/* Right Column: Academic & Personal details */}
        <div className="flex flex-col gap-8 order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-2"
          >
            <span className="font-mono text-xs text-purple-400 tracking-widest">// ACADEMIC CREDENTIALS</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Student <span className="text-cyan-400">Identity</span>
            </h2>
            <div className="h-0.5 w-16 bg-cyan-400 mt-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect p-8 rounded-3xl border border-cyan-400/20 flex flex-col gap-6 shadow-[0_0_40px_rgba(0,245,255,0.05)]"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-gray-500">// INSTITUTION</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-100">JIS UNIVERSITY</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-gray-500">// PROGRAM</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-100">B.Tech 2nd year student</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-gray-500">// SPECIALIZATION</span>
              <span className="text-xl sm:text-2xl font-bold text-cyan-400">CSE (AI & ML)</span>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-base leading-relaxed"
          >
            Combining modern full-stack web architectures with machine learning pipelines. Drag, pull, and release the 3D credentials badge to interact with the real-time physics simulation.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
