'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, STATUS_COLOR, type Project } from './shared';

// ─── Animated SVG illustrations per project ────────────────────────────────────
function ProjectIllustration({ id, color, isActive }: { id: number; color: string; isActive: boolean }) {
  const anim = isActive;

  if (id === 1) {
    // Quick Dash — delivery scooter + location pin + route dots
    return (
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
        {/* Route dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.circle
            key={i}
            cx={30 + i * 25}
            cy={85}
            r="3"
            fill={color}
            animate={anim ? { opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] } : { opacity: 0.3 }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
        {/* Route line */}
        <motion.path
          d="M 20 85 Q 80 85, 140 85"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 6"
          fill="none"
          opacity="0.3"
          animate={anim ? { strokeDashoffset: [0, -40] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Scooter body */}
        <motion.g
          animate={anim ? { x: [0, 8, 0] } : { x: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Body */}
          <rect x="55" y="40" width="40" height="28" rx="6" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
          {/* Box on back */}
          <rect x="42" y="38" width="18" height="22" rx="3" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
          <text x="51" y="52" textAnchor="middle" fontSize="8" fill={color}>📦</text>
          {/* Handle */}
          <path d="M 92 44 Q 98 38 102 44" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Front wheel */}
          <circle cx="90" cy="72" r="9" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="90" cy="72" r="3" fill={color} opacity="0.5" />
          {/* Back wheel */}
          <circle cx="55" cy="72" r="9" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="55" cy="72" r="3" fill={color} opacity="0.5" />
        </motion.g>
        {/* Location pin at destination */}
        <motion.g
          animate={anim ? { y: [-3, 3, -3] } : { y: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M 135 30 C 135 20, 145 20, 145 30 C 145 38, 140 42, 140 42 C 140 42, 135 38, 135 30 Z" fill={color} opacity="0.8" />
          <circle cx="140" cy="29" r="3" fill="rgba(7,9,18,0.8)" />
        </motion.g>
      </svg>
    );
  }

  if (id === 2) {
    // Samvidhan — open book + scales of justice + gavel
    return (
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
        {/* Open book */}
        <motion.g
          animate={anim ? { rotateY: [0, 5, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '80px 70px' }}
        >
          {/* Left page */}
          <path d="M 35 40 L 35 95 Q 80 90, 80 95 L 80 40 Q 80 38, 35 40 Z" fill={`${color}18`} stroke={color} strokeWidth="1.2" />
          {/* Right page */}
          <path d="M 125 40 L 125 95 Q 80 90, 80 95 L 80 40 Q 80 38, 125 40 Z" fill={`${color}18`} stroke={color} strokeWidth="1.2" />
          {/* Page lines left */}
          {[0, 1, 2, 3].map(i => (
            <motion.line
              key={`l-${i}`}
              x1="42" y1={52 + i * 10} x2="73" y2={52 + i * 10}
              stroke={color} strokeWidth="1" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={anim ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
            />
          ))}
          {/* Page lines right */}
          {[0, 1, 2, 3].map(i => (
            <motion.line
              key={`r-${i}`}
              x1="87" y1={52 + i * 10} x2="118" y2={52 + i * 10}
              stroke={color} strokeWidth="1" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={anim ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
            />
          ))}
        </motion.g>
        {/* Scales of justice on top */}
        <motion.g
          animate={anim ? { rotate: [-3, 3, -3] } : { rotate: 0 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '80px 25px' }}
        >
          {/* Pillar */}
          <line x1="80" y1="15" x2="80" y2="35" stroke={color} strokeWidth="2" />
          {/* Beam */}
          <line x1="60" y1="18" x2="100" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Left pan */}
          <path d="M 55 18 L 52 28 L 68 28 L 65 18" stroke={color} strokeWidth="1.2" fill={`${color}20`} />
          {/* Right pan */}
          <path d="M 95 18 L 92 28 L 108 28 L 105 18" stroke={color} strokeWidth="1.2" fill={`${color}20`} />
          {/* Top circle */}
          <circle cx="80" cy="14" r="3" fill={color} opacity="0.7" />
        </motion.g>
      </svg>
    );
  }

  if (id === 3) {
    // MCP Shield — shield with lock + scanning waves
    return (
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
        {/* Scanning waves */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={i}
            cx="80" cy="60" r={30 + i * 15}
            stroke={color}
            strokeWidth="1"
            fill="none"
            animate={anim ? { opacity: [0.4, 0, 0.4], scale: [1, 1.1, 1] } : { opacity: 0.1 }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
        {/* Shield shape */}
        <motion.path
          d="M 80 20 L 105 32 L 105 62 Q 105 88, 80 100 Q 55 88, 55 62 L 55 32 Z"
          fill={`${color}18`}
          stroke={color}
          strokeWidth="2"
          animate={anim ? { strokeDashoffset: [0, -10] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          strokeDasharray="6 4"
        />
        {/* Inner shield */}
        <path
          d="M 80 30 L 97 38 L 97 60 Q 97 78, 80 88 Q 63 78, 63 60 L 63 38 Z"
          fill={`${color}08`}
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Lock icon */}
        <motion.g
          animate={anim ? { y: [-2, 2, -2] } : { y: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Lock body */}
          <rect x="72" y="55" width="16" height="14" rx="3" fill={color} opacity="0.7" />
          {/* Lock shackle */}
          <path d="M 75 55 L 75 48 A 5 5 0 0 1 85 48 L 85 55" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          {/* Keyhole */}
          <circle cx="80" cy="61" r="2.5" fill="rgba(7,9,18,0.9)" />
          <rect x="79" y="62" width="2" height="4" rx="1" fill="rgba(7,9,18,0.9)" />
        </motion.g>
        {/* Checkmark that appears */}
        {anim && (
          <motion.path
            d="M 72 75 L 78 81 L 90 69"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        )}
      </svg>
    );
  }

  if (id === 4) {
    // Graph Creator — bar chart + line chart + data points
    return (
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => (
          <line key={`h-${i}`} x1="25" y1={30 + i * 22} x2="140" y2={30 + i * 22}
                stroke={color} strokeWidth="0.5" opacity="0.15" />
        ))}
        {/* Y axis */}
        <line x1="25" y1="25" x2="25" y2="100" stroke={color} strokeWidth="1.2" opacity="0.4" />
        {/* X axis */}
        <line x1="25" y1="100" x2="140" y2="100" stroke={color} strokeWidth="1.2" opacity="0.4" />
        {/* Animated bars */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const heights = [35, 55, 25, 65, 45, 50];
          const h = heights[i];
          return (
            <motion.rect
              key={i}
              x={32 + i * 18}
              y={100 - h}
              width="12"
              height={h}
              rx="2"
              fill={`${color}${40 + i * 8}`}
              initial={{ scaleY: 0 }}
              animate={anim ? { scaleY: [0, 1, 1] } : { scaleY: 1 }}
              transition={{ duration: 0.6, delay: anim ? i * 0.12 : 0 }}
              style={{ transformOrigin: `${38 + i * 18}px 100px` }}
            />
          );
        })}
        {/* Line chart overlay */}
        <motion.path
          d="M 38 65 L 56 45 L 74 75 L 92 35 L 110 55 L 128 50"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={anim ? { pathLength: 1 } : { pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />
        {/* Data points on line */}
        {[[38,65],[56,45],[74,75],[92,35],[110,55],[128,50]].map(([cx,cy], i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r="3.5"
            fill={color}
            initial={{ scale: 0 }}
            animate={anim ? { scale: 1 } : { scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
          />
        ))}
        {/* Floating plus icon */}
        <motion.g
          animate={anim ? { y: [-2, 2, -2] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="135" cy="28" r="8" fill={`${color}25`} stroke={color} strokeWidth="1" />
          <line x1="132" y1="28" x2="138" y2="28" stroke={color} strokeWidth="1.5" />
          <line x1="135" y1="25" x2="135" y2="31" stroke={color} strokeWidth="1.5" />
        </motion.g>
      </svg>
    );
  }

  if (id === 6) {
    // Offline SOS — radio waves + phone + SOS signal
    return (
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
        {/* Bluetooth/WiFi waves expanding */}
        {[0, 1, 2, 3].map(i => (
          <motion.circle
            key={i}
            cx="80" cy="55" r={20 + i * 14}
            stroke={color} strokeWidth="1.2" fill="none"
            animate={anim ? { opacity: [0.5, 0, 0.5], scale: [1, 1.05, 1] } : { opacity: 0.12 }}
            transition={{ duration: 1.8, delay: i * 0.35, repeat: Infinity }}
          />
        ))}
        {/* Phone shape (center) */}
        <motion.g
          animate={anim ? { rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatDelay: 2.5 }}
          style={{ transformOrigin: '80px 55px' }}
        >
          <rect x="68" y="35" width="24" height="42" rx="4" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
          <rect x="71" y="40" width="18" height="28" rx="2" fill="rgba(7,9,18,0.9)" />
          {/* SOS text on screen */}
          <text x="80" y="58" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill={color} fontWeight="bold">SOS</text>
          {/* Home button */}
          <circle cx="80" cy="72" r="2" stroke={color} strokeWidth="1" fill="none" />
        </motion.g>
        {/* Two smaller phones on sides */}
        <motion.rect
          x="30" y="48" width="14" height="24" rx="3"
          fill={`${color}15`} stroke={color} strokeWidth="1"
          animate={anim ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        />
        <motion.rect
          x="116" y="48" width="14" height="24" rx="3"
          fill={`${color}15`} stroke={color} strokeWidth="1"
          animate={anim ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.3 }}
          transition={{ duration: 2, delay: 1, repeat: Infinity }}
        />
        {/* Connection lines */}
        <motion.line
          x1="44" y1="60" x2="68" y2="55"
          stroke={color} strokeWidth="1" strokeDasharray="3 3"
          animate={anim ? { opacity: [0.3, 0.9, 0.3] } : { opacity: 0.2 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.line
          x1="116" y1="60" x2="92" y2="55"
          stroke={color} strokeWidth="1" strokeDasharray="3 3"
          animate={anim ? { opacity: [0.3, 0.9, 0.3] } : { opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
        />
        {/* Under construction badge */}
        <rect x="45" y="100" width="70" height="14" rx="3" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
        <text x="80" y="110" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill={color} opacity="0.7">🚧 UNDER CONSTRUCTION</text>
      </svg>
    );
  }

  if (id === 5) {
    // Banking Site — credit card + coins + chart
    return (
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
        {/* Bar chart in background */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.rect
            key={i}
            x={25 + i * 16}
            y={90 - (15 + i * 10)}
            width="10"
            height={15 + i * 10}
            rx="2"
            fill={`${color}${20 + i * 8}`}
            animate={anim ? { height: [15 + i * 10, 20 + i * 12, 15 + i * 10], y: [90 - (15 + i * 10), 90 - (20 + i * 12), 90 - (15 + i * 10)] } : {}}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Credit card */}
        <motion.g
          animate={anim ? { y: [-2, 3, -2], rotate: [-2, 2, -2] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '115px 50px' }}
        >
          <rect x="90" y="30" width="55" height="35" rx="5" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
          {/* Card stripe */}
          <rect x="90" y="42" width="55" height="7" fill={`${color}40`} />
          {/* Card chip */}
          <rect x="96" y="34" width="10" height="7" rx="1.5" fill={color} opacity="0.6" />
          {/* Card number dots */}
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx={100 + i * 5} cy="56" r="1.5" fill={color} opacity="0.4" />
          ))}
          <text x="125" y="57" fontSize="6" fontFamily="JetBrains Mono, monospace" fill={color} opacity="0.5">••••</text>
        </motion.g>
        {/* Dollar/Rupee sign */}
        <motion.text
          x="45" y="45"
          fontSize="22" fontWeight="bold" fontFamily="JetBrains Mono, monospace"
          fill={color} opacity="0.6"
          animate={anim ? { opacity: [0.4, 0.8, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ₹
        </motion.text>
        {/* Trend line */}
        <motion.path
          d="M 25 95 L 45 88 L 65 92 L 85 80 L 105 85"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"
          animate={anim ? { pathLength: [0, 1] } : { pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </svg>
    );
  }

  // Fallback
  return <span style={{ fontSize: 48 }}>{projects.find(p => p.id === id)?.icon}</span>;
}

function ProjectCard({
  project,
  index,
  activeIndex,
  setActiveIndex,
}: {
  project: Project;
  index: number;
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
}) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const sc       = STATUS_COLOR[project.status];
  const isDimmed = activeIndex !== null && activeIndex !== index;
  const isActive = activeIndex === index;
  const hasLive   = project.live !== '#' && project.live !== '';
  const hasGithub = project.github !== '#' && project.github !== '';
  const hasLinks  = hasLive || hasGithub;

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const spot = cardRef.current.querySelector('.card-spotlight') as HTMLDivElement | null;
      if (spot) {
        spot.style.background = `radial-gradient(400px circle at ${x}px ${y}px, ${project.color}18 0%, transparent 65%)`;
      }
    });
  }, [project.color]);

  return (
    <motion.div
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        scale:   isDimmed ? 0.97 : isActive ? 1.02 : 1,
        filter:  isDimmed ? 'grayscale(0.5) brightness(0.7)' : 'grayscale(0) brightness(1)',
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(null)}
        className="relative cursor-default flex flex-col"
        style={{
          borderRadius: 16,
          background: 'rgba(7,9,18,0.97)',
          border: `1px solid ${isActive ? project.color + '55' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: isActive
            ? `0 0 0 1px ${project.color}30, 0 12px 60px ${project.color}22`
            : '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Cursor spotlight */}
        <div className="card-spotlight absolute inset-0 pointer-events-none z-10" style={{ borderRadius: 16 }} />

        {/* ── Image / Preview area ───────────────────────────────── */}
        <div className="relative flex-shrink-0" style={{ height: 200, borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>

          {/* Browser chrome bar */}
          <div
            className="absolute top-0 left-0 right-0 z-20 flex items-center gap-1.5 px-3"
            style={{
              height: 28,
              background: 'rgba(4,6,14,0.97)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-red-500/70" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <span className="w-2 h-2 rounded-full bg-green-500/70" />
            <div
              className="ml-2 flex-1 flex items-center px-2 rounded"
              style={{ height: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="font-mono text-[8px] text-gray-600 truncate">
                {hasLive ? project.live.replace('https://', '') : 'github.com/' + project.github.replace('https://github.com/', '')}
              </span>
            </div>
          </div>

          {/* Animated illustration — sits below the chrome bar */}
          <div style={{ position: 'absolute', top: 28, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${project.color}10 0%, rgba(7,9,18,1) 80%)` }}>
            <ProjectIllustration id={project.id} color={project.color} isActive={isActive} />
          </div>

          {/* Bottom gradient overlay */}
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none z-10"
            style={{
              height: 70,
              background: 'linear-gradient(180deg, transparent 0%, rgba(7,9,18,0.85) 100%)',
            }}
          />

          {/* Status badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <span
              className="font-mono text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1.5 tracking-widest"
              style={{
                color: sc,
                background: 'rgba(4,6,14,0.88)',
                border: `1px solid ${sc}40`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {project.status === 'LIVE' && (
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sc }} />
              )}
              {project.status}
            </span>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-3 right-3 z-20">
            <span
              className="font-mono text-[8px] tracking-widest px-2 py-1 rounded"
              style={{
                color: project.color,
                background: 'rgba(4,6,14,0.88)',
                border: `1px solid ${project.color}30`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {project.category.toUpperCase()}
            </span>
          </div>

          {/* Top edge glow on active */}
          <div
            className="absolute top-0 left-0 right-0 h-px z-20 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${project.color}cc, transparent)`,
              opacity: isActive ? 1 : 0,
            }}
          />
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-5 gap-3">

          {/* Title */}
          <div>
            <h3 className="font-bold text-white text-base leading-tight mb-2">{project.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[9px] px-2 py-0.5 rounded"
                  style={{ color: project.color, background: `${project.color}12`, border: `1px solid ${project.color}25` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-xs leading-relaxed flex-1">{project.desc}</p>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${project.color}30, transparent)` }} />

          {/* ── Buttons ─────────────────────────────────────────── */}
          {hasLinks ? (
          <div className="flex gap-3">

            {/* GitHub — full width if no live URL */}
            {hasGithub && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-[11px] tracking-wide transition-all duration-200"
              style={{
                flex: hasLive ? '1' : '0 0 100%',
                color: project.color,
                border: `1px solid ${project.color}35`,
                background: `${project.color}08`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}20`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${project.color}65`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}08`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${project.color}35`;
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            )}

            {/* Live Site */}
            {hasLive && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-[11px] tracking-wide transition-all duration-200"
                style={{
                  flex: hasGithub ? '1' : '0 0 100%',
                  color: '#f0f4ff',
                  background: `${project.color}22`,
                  border: `1px solid ${project.color}45`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}38`;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 16px ${project.color}30`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}22`;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View in Browser
              </a>
            )}

          </div>
          ) : (
            /* No links — coming soon */
            <div className="flex items-center justify-center py-2.5 rounded-lg font-mono text-[11px] tracking-widest" style={{ color: `${project.color}88`, background: `${project.color}0a`, border: `1px dashed ${project.color}30` }}>
              🚧 Coming Soon
            </div>
          )}
        </div>

        {/* Bottom glow strip on active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
              style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function SpotlightCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p, i) => (
        <ProjectCard
          key={p.id}
          project={p}
          index={i}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}
    </div>
  );
}
