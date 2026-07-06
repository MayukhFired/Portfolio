'use client';
import { useState, useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const projects = [
  {
    id: 1,
    title: 'NeoAuth',
    category: 'SaaS Product',
    desc: 'A drop-in authentication system with JWT, OAuth2, and magic links. Built with React and Supabase. Handles 10K+ users.',
    tags: ['React', 'Supabase', 'SQL'],
    color: 'cyan',
    status: 'LIVE',
    stats: { users: '10K+', uptime: '99.9%', latency: '<50ms' },
    icon: '🔐',
  },
  {
    id: 2,
    title: 'CoreDB',
    category: 'Open Source Tool',
    desc: 'A blazing-fast embedded key-value store written in C. Zero dependencies, single header, 10M+ read ops/second. Used in production systems worldwide.',
    tags: ['C', 'SQL', 'Git'],
    color: 'yellow',
    status: 'OPEN SOURCE',
    stats: { stars: '1.2K', speed: '10M ops/s', size: '<50KB' },
    icon: '⚡',
  },
  {
    id: 3,
    title: 'FlowCMS',
    category: 'Freelance Product',
    desc: 'Headless CMS with real-time collaboration, version history, and a query builder. Built with React and Supabase.',
    tags: ['React', 'Supabase', 'TypeScript'],
    color: 'purple',
    status: 'LIVE',
    stats: { clients: '5 clients', storage: 'Unlimited', sync: 'Real-time' },
    icon: '📝',
  },
  {
    id: 4,
    title: 'PulseAPI',
    category: 'API Service',
    desc: 'API monitoring service. Live dashboards, alert webhooks, and uptime tracking, packed into a lightweight container.',
    tags: ['JS', 'SQL', 'Docker'],
    color: 'green',
    status: 'BETA',
    stats: { endpoints: '∞ monitors', alerts: 'Instant', logs: '90 days' },
    icon: '📡',
  },
  {
    id: 5,
    title: 'ShipKit',
    category: 'Boilerplate',
    desc: 'Production-ready React starter with authentication, database integrations, and full TypeScript setup. Launch in hours.',
    tags: ['React', 'Supabase', 'TypeScript'],
    color: 'cyan',
    status: 'LIVE',
    stats: { downloads: '500+', setup: '< 5 min', features: '20+' },
    icon: '🚀',
  },
  {
    id: 6,
    title: 'NetScan',
    category: 'CLI Tool',
    desc: 'High-speed network scanner and packet analyzer written in C. Multithreaded scanning at line speed.',
    tags: ['C', 'Git', 'Docker'],
    color: 'purple',
    status: 'OPEN SOURCE',
    stats: { speed: 'Line-rate', threads: 'Multi-threaded', protos: '10+ protocols' },
    icon: '🔍',
  },
];

const colorConfig: Record<string, {
  text: string; border: string; badge: string; glow: string; gradient: string;
}> = {
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-400/30',
    badge: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]',
    gradient: 'from-cyan-400/10',
  },
  purple: {
    text: 'text-purple-400',
    border: 'border-purple-400/30',
    badge: 'bg-purple-400/10 text-purple-400 border border-purple-400/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(123,47,255,0.15)]',
    gradient: 'from-purple-400/10',
  },
  green: {
    text: 'text-green-400',
    border: 'border-green-400/30',
    badge: 'bg-green-400/10 text-green-400 border border-green-400/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]',
    gradient: 'from-green-400/10',
  },
  yellow: {
    text: 'text-yellow-400',
    border: 'border-yellow-400/30',
    badge: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,220,0,0.15)]',
    gradient: 'from-yellow-400/10',
  },
};

const statusColors: Record<string, string> = {
  LIVE: 'text-green-400 bg-green-400/10 border-green-400/30',
  BETA: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'OPEN SOURCE': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
};

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const c = colorConfig[project.color];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 8;
    setRotate({ x: rotateX, y: rotateY });
  };

  const resetRotate = () => {
    setRotate({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={resetRotate}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
        }}
        className={`group glass-effect border ${c.border} p-6 h-full relative overflow-hidden cursor-default transition-all duration-300 ${c.glow}`}
      >
        {/* Background gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 border ${c.border} flex items-center justify-center text-xl`}>
                {project.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{project.title}</h3>
                <p className={`font-mono text-xs ${c.text} opacity-70`}>{project.category}</p>
              </div>
            </div>
            <span className={`font-mono text-xs px-2 py-1 border ${statusColors[project.status]} flex items-center gap-1`}>
              {project.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
              {project.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.desc}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-white/5">
            {Object.entries(project.stats).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className={`font-mono text-xs font-bold ${c.text}`}>{val}</div>
                <div className="text-gray-600 text-xs capitalize">{key}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className={`font-mono text-xs px-2 py-1 ${c.badge}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-4 flex gap-3">
            <button className={`flex-1 py-2 font-mono text-xs border ${c.border} ${c.text} hover:bg-white/5 transition-colors duration-200`}>
              View Details →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const router = useRouter();
  return (
    <section id="projects" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest mb-3 opacity-70">
            &gt; ls products/ --filter=featured
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Products & <span className="text-cyan-400">Projects</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-purple-500" />
          <p className="text-gray-500 mt-6 text-sm max-w-xl mx-auto">
            Real products shipped to real customers. Each one is a lesson in craftsmanship.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 font-mono text-sm mb-4">// Want something custom built?</p>
          <button
            onClick={() => router.push('/contact')}
            className="btn-primary px-8 py-3 text-sm font-semibold tracking-wide cursor-pointer"
          >
            Let&apos;s Build Together
          </button>
        </motion.div>
      </div>
    </section>
  );
}
