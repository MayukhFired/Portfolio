'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoaded = sessionStorage.getItem('site-loaded');
      if (isLoaded) {
        setLoaded(true);
      }
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

      {/* Main layout container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex flex-col justify-between"
      >
        <Navbar />
        
        {/* Animated page transitions */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex-grow"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        
        <Footer />
      </motion.div>
    </>
  );
}
