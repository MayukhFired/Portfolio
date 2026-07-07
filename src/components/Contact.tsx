'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormState = 'idle' | 'sending' | 'success' | 'error';

const contactInfo = [
  { label: 'Email', value: 'hello@mayukhghosh.dev', icon: '📧', href: 'mailto:hello@mayukhghosh.dev' },
  { label: 'GitHub', value: '@mayukhghosh', icon: '⬡', href: 'https://github.com/mayukhghosh' },
  { label: 'Response', value: '< 24 hours', icon: '⚡', href: null },
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

          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="font-mono text-xs text-purple-400 opacity-70 mb-6">/* CONNECT */</div>

            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-effect p-4 border border-white/5 hover:border-cyan-400/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-cyan-400/30 flex items-center justify-center text-lg group-hover:border-cyan-400 transition-colors duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs font-mono">{info.label}</div>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <span className="text-white text-sm">{info.value}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Terminal block */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-effect p-4 border border-white/5 font-mono text-xs mt-8"
            >
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
            </motion.div>
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
