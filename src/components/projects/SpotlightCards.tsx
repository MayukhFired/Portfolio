'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, STATUS_COLOR, type Project } from './shared';

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
  const hasLive  = project.live !== '#' && project.live !== '';

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

          {/* Screenshot or placeholder — sits below the chrome bar */}
          <div style={{ position: 'absolute', top: 28, left: 0, right: 0, bottom: 0 }}>
            {project.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  background: `linear-gradient(135deg, ${project.color}14 0%, rgba(7,9,18,1) 70%)`,
                }}
              >
                <span style={{ fontSize: 44 }}>{project.icon}</span>
                <span className="font-mono text-[10px] tracking-widest" style={{ color: `${project.color}55` }}>
                  PREVIEW COMING SOON
                </span>
              </div>
            )}
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
          <div className="flex gap-3">

            {/* GitHub — flex-1 always */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-[11px] tracking-wide transition-all duration-200"
              style={{
                flex: hasLive ? '1' : '0 0 100%',   // full width if no live URL
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

            {/* Live Site — only rendered when hasLive */}
            {hasLive && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-[11px] tracking-wide transition-all duration-200"
                style={{
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
