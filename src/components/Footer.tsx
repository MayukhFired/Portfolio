'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/mayukhghosh', icon: '⬡' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/mayukhghosh', icon: '◉' },
  { name: 'Twitter', url: 'https://twitter.com/mayukhghosh', icon: '◆' },
  { name: 'Email', url: 'mailto:hello@mayukhghosh.dev', icon: '◎' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 py-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 border-2 border-cyan-400 flex items-center justify-center">
                <span className="font-mono text-[8px] text-cyan-400 font-bold">&lt;/&gt;</span>
              </div>
              <span className="font-mono text-sm text-cyan-400 tracking-widest">PORTFOLIO</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Building the future, one line of code at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs text-gray-600 tracking-widest mb-3">QUICK LINKS</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Skills', href: '/skills' },
                { label: 'Products', href: '/projects' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-500 hover:text-cyan-400 text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-mono text-xs text-gray-600 tracking-widest mb-3">CONNECT</h3>
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
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="font-mono text-xs">
            © {currentYear} <span className="text-cyan-400">Mayukh Ghosh</span>. All rights reserved.
          </div>
          <div className="font-mono text-xs flex items-center gap-2">
            <span className="text-gray-700">Built with</span>
            <span className="text-cyan-400">Next.js</span>
            <span className="text-gray-700">+</span>
            <span className="text-purple-400">Supabase</span>
            <span className="text-gray-700">+</span>
            <span className="text-green-400">Framer Motion</span>
          </div>
        </div>

        {/* Terminal Easter Egg */}
        <div className="mt-8 text-center">
          <div className="font-mono text-xs text-gray-800 inline-block">
            <span className="text-purple-900">❯</span> EOF
          </div>
        </div>
      </div>
    </footer>
  );
}
