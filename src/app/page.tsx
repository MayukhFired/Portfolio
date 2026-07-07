'use client';
import Hero from '@/components/Hero';
import LanyardSection from '@/components/LanyardSection';
import About from '@/components/About';
import Skills from '@/components/Skills';
import AIWorkflow from '@/components/AIWorkflow';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <LanyardSection />
      <About />
      <Skills />
      <AIWorkflow />
      <Projects />
      <Contact />
    </>
  );
}
