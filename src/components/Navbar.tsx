'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '#hero',        label: 'Home',     code: '01' },
  { href: '#about',       label: 'About',    code: '02' },
  { href: '#skills',      label: 'Skills',   code: '03' },
  { href: '#ai-workflow', label: 'AI\u00d7Dev',   code: '04' },
  { href: '#projects',    label: 'Products', code: '05' },
  { href: '#contact',     label: 'Contact',  code: '06' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const scrolledRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 50;
        if (next !== scrolledRef.current) {
          scrolledRef.current = next;
          setScrolled(next);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.replace('#', '')))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow] duration-300 ${
          scrolled
            ? 'glass-effect shadow-[0_0_30px_rgba(34,211,238,0.08)]'
            : 'bg-transparent'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <motion.button
              onClick={() => scrollTo('#hero')}
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-10 h-10 border-2 border-cyan-400 flex items-center justify-center overflow-hidden group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300">
                <span className="font-mono text-[10px] text-cyan-400 font-bold leading-none">&lt;/&gt;</span>
                <div className="absolute inset-0 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-10" />
              </div>
              <span className="font-mono text-sm text-cyan-400 tracking-widest hidden sm:block">DEV.PORTFOLIO</span>
            </motion.button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group cursor-pointer ${
                      isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    <span className="font-mono text-xs text-violet-400 mr-1 opacity-60">{link.code}.</span>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      />
                    )}
                    <div className="absolute inset-0 border border-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </motion.button>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={() => scrollTo('#contact')}
                className="btn-primary text-sm px-5 py-2 font-semibold tracking-wide cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hire Me
              </motion.button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden relative w-8 h-6 flex flex-col justify-between cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span className="block h-0.5 bg-cyan-400 w-full"
                animate={menuOpen ? { rotate: 45, y: 11 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }} />
              <motion.span className="block h-0.5 bg-cyan-400 w-full"
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }} />
              <motion.span className="block h-0.5 bg-cyan-400 w-full"
                animate={menuOpen ? { rotate: -45, y: -11 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 glass-effect border-t border-cyan-400/20 md:hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => scrollTo(link.href)}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 border border-transparent hover:border-cyan-400/30 cursor-pointer ${
                      isActive ? 'bg-cyan-400/10 text-cyan-400' : 'hover:bg-cyan-400/5'
                    }`}
                  >
                    <span className="font-mono text-xs text-violet-400">{link.code}.</span>
                    <span className={`text-sm transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300'}`}>
                      {link.label}
                    </span>
                  </motion.button>
                );
              })}
              <button
                onClick={() => scrollTo('#contact')}
                className="btn-primary mt-2 text-sm px-5 py-2 font-semibold tracking-wide cursor-pointer"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
