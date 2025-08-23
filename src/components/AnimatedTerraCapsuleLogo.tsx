import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import for CesiumGlobe component
const CesiumGlobe = dynamic(() => import('./CesiumGlobe'), { ssr: false });

// Simple animated globe symbol
export default function AnimatedTerraCapsuleLogo() {
  const [phase, setPhase] = useState(0); // 0: text, 1: globe

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '400px' }}>
      <AnimatePresence mode="wait" initial={false}>
        {phase === 0 && (
          <motion.h1
            key="text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="font-extrabold text-4xl md:text-6xl uppercase text-center"
            style={{
              background: 'linear-gradient(90deg, #fff, #bae6fd, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(59,130,246,0.12)',
              letterSpacing: '0.08em',
              fontFamily: "'Orbitron', 'Arial Black', sans-serif",
              padding: '0 8px',
              textShadow: '0 0 20px #3b82f6, 0 0 45px #bae6fd, 0 0 70px #fff, 0 0 90px #3b82f6',
            }}
          >
            TERRACAPSULE
          </motion.h1>
        )}
        {phase === 1 && (
          <div className="w-full h-[400px] flex items-center justify-center">
            <CesiumGlobe className="w-full h-full" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
