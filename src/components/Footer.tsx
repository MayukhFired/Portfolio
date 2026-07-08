'use client';
import { motion } from 'framer-motion';

const GithubIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/mayukhghosh', icon: <GithubIcon /> },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/mayukhghosh', icon: <LinkedinIcon /> },
  { name: 'Instagram', url: 'https://instagram.com/mayukhghosh', icon: <InstagramIcon /> },
  { name: 'Email', url: 'mailto:hello@mayukhghosh.dev', icon: <MailIcon /> },
];

const quickLinks = [
  { label: 'Home',     anchor: 'hero'        },
  { label: 'About',    anchor: 'about'       },
  { label: 'Skills',   anchor: 'skills'      },
  { label: 'AI\u00d7Dev',   anchor: 'ai-workflow' },
  { label: 'Products', anchor: 'projects'    },
  { label: 'Contact',  anchor: 'contact'     },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/8 py-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-25" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-2 mb-3 cursor-pointer group"
            >
              <div className="w-8 h-8 border-2 border-cyan-400 flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(34,211,238,0.4)] transition-shadow duration-300">
                <span className="font-mono text-[8px] text-cyan-400 font-bold">&lt;/&gt;</span>
              </div>
              <span className="font-mono text-sm text-cyan-400 tracking-widest">PORTFOLIO</span>
            </button>
            <p className="text-gray-500 text-sm leading-relaxed">
              Building the future, one line of code at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs text-gray-600 tracking-widest mb-4">QUICK LINKS</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.anchor)}
                  className="text-gray-500 hover:text-cyan-400 text-sm transition-colors duration-200 text-left cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-mono text-xs text-gray-600 tracking-widest mb-4">CONNECT</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 border border-white/10 hover:border-cyan-400 flex items-center justify-center text-gray-500 hover:text-cyan-400 transition-all duration-200 group relative"
                >
                  <span>{social.icon}</span>
                  <span className="absolute -bottom-6 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {social.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-gray-600">
            &copy; {currentYear} <span className="text-cyan-400">Mayukh Ghosh</span>. All rights reserved.
          </div>
          <div className="font-mono text-xs flex items-center gap-2 flex-wrap justify-center text-gray-600">
            <span>Built with</span>
            <span className="text-cyan-400">Next.js</span>
            <span>+</span>
            <span className="text-violet-400">Supabase</span>
            <span>+</span>
            <span className="text-emerald-400">Framer Motion</span>
          </div>
        </div>

        <div className="mt-8 text-center font-mono text-xs text-gray-800">
          <span className="text-violet-900">❯</span> EOF
        </div>
      </div>
    </footer>
  );
}
