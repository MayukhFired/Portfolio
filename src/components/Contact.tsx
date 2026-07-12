'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltedCard from './TiltedCard';

type FormState = 'idle' | 'sending' | 'success' | 'error';

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

const contactInfo = [
  { label: 'Email', value: 'hello@mayukhghosh.dev', icon: <MailIcon />, href: 'mailto:hello@mayukhghosh.dev' },
  { label: 'GitHub', value: '@mayukhghosh', icon: <GithubIcon />, href: 'https://github.com/mayukhghosh' },
  { label: 'LinkedIn', value: 'LinkedIn / Mayukh Ghosh', icon: <LinkedinIcon />, href: 'https://linkedin.com/in/mayukhghosh' },
  { label: 'Instagram', value: 'Instagram / @mayukhghosh', icon: <InstagramIcon />, href: 'https://instagram.com/mayukhghosh' },
];

export default function Contact() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setFormState('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setFormState('error');
    }

    setTimeout(() => setFormState('idle'), 4000);
  };

  const inputClass = (field: string) =>
    `w-full bg-transparent border px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-600 outline-none transition-all duration-300 ${
      focused === field
        ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.2)]'
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <section id="contact" className="relative py-40 md:py-48 scroll-mt-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Glow blobs */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400 rounded-full opacity-3 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-violet-500 rounded-full opacity-3 blur-[100px] pointer-events-none" />

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
            &gt; init connection...
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Get In <span className="text-cyan-400">Touch</span>
          </h2>
          <div className="h-0.5 w-24 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-violet-400" />
          <p className="text-gray-500 mt-6 text-sm max-w-xl mx-auto">
            Have a project in mind? Let&apos;s build something great together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-16 items-start">

          {/* Left: Photo + Terminal stacked */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 flex flex-col items-center gap-6"
          >
            <TiltedCard
              imageSrc="/avatar-mayukh.jpg"
              altText="Mayukh Ghosh"
              captionText="Mayukh Ghosh"
              containerHeight="420px"
              containerWidth="100%"
              imageHeight="400px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.08}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div style={{
                  width: '300px',
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  borderRadius: '15px',
                  background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)',
                }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: 0 }}>
                    Mayukh Ghosh
                  </p>
                  <p style={{ color: '#22d3ee', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', marginTop: '4px' }}>
                    Software Developer
                  </p>
                </div>
              }
            />

            {/* Terminal block */}
            <div className="w-full glass-effect p-4 border border-white/5 font-mono text-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600 ml-2">terminal</span>
              </div>
              <div className="space-y-1 text-gray-500">
                <p><span className="text-purple-400">$</span> send-message --to &quot;me&quot;</p>
                <p><span className="text-cyan-400">✓</span> Connection established</p>
                <p><span className="text-cyan-400">✓</span> Encryption: TLS 1.3</p>
                <p><span className="text-green-400">●</span> Ready to receive...</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-effect p-8 border border-white/10 space-y-5 relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

              <div className="font-mono text-xs text-gray-600 mb-6">
                <span className="text-cyan-400">POST</span> /api/contact HTTP/1.1
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono text-xs text-gray-500 block mb-2">name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    placeholder="John Doe"
                    required
                    className={inputClass('name')}
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-gray-500 block mb-2">email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="john@example.com"
                    required
                    className={inputClass('email')}
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-gray-500 block mb-2">subject *</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onFocus={() => setFocused('subject')}
                  onBlur={() => setFocused(null)}
                  required
                  className={`${inputClass('subject')} cursor-pointer`}
                >
                  <option value="" className="bg-[#14141f]">Select a subject</option>
                  <option value="freelance" className="bg-[#14141f]">Freelance Project</option>
                  <option value="product" className="bg-[#14141f]">Buy a Product</option>
                  <option value="collab" className="bg-[#14141f]">Collaboration</option>
                  <option value="other" className="bg-[#14141f]">Other</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-xs text-gray-500 block mb-2">message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                  className={`${inputClass('message')} resize-none`}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={formState === 'sending'}
                whileHover={{ scale: formState === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: formState === 'idle' ? 0.98 : 1 }}
                className={`w-full py-3 font-semibold text-sm transition-all duration-300 relative overflow-hidden ${
                  formState === 'success'
                    ? 'bg-green-400/10 border-2 border-green-400 text-green-400'
                    : formState === 'error'
                    ? 'bg-red-400/10 border-2 border-red-400 text-red-400'
                    : 'btn-primary'
                }`}
              >
                <AnimatePresence mode="wait">
                  {formState === 'idle' && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Send Message →
                    </motion.span>
                  )}
                  {formState === 'sending' && (
                    <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Transmitting...
                    </motion.span>
                  )}
                  {formState === 'success' && (
                    <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      ✓ Message Sent!
                    </motion.span>
                  )}
                  {formState === 'error' && (
                    <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      ✗ Failed — Try Again
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
