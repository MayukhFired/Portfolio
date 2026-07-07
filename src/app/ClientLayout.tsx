'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from '@/components/CustomCursor';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoaded = sessionStorage.getItem('site-loaded');
      if (isLoaded) setLoaded(true);
    }
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem('site-loaded', 'true');
    setLoaded(true);
  };

  return (
    <>
      <CustomCursor />

      <AnimatePresence mode="wait">
        {!loaded && (
          <LoadingScreen key="loader" onComplete={handleLoadComplete} />
        )}
      </AnimatePresence>

      <div className="scanline" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen flex flex-col justify-between"
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
