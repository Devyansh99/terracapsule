'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";

/**
 * AnimatedTerraCapsuleLogo (updated)
 * - Improved text legibility (stroke + layered shadows + backdrop)
 * - Smaller symbol (less visual dominance)
 * - Retains pause-on-hover/focus, reduced-motion handling
 *
 * Tweak constants below to adjust pacing / sizes.
 */

const CYCLE_MS = 4500;
const ENTER_DUR = 0.9;
const EXIT_DUR = 0.7;

export default function AnimatedTerraCapsuleLogo() {
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;
    if (paused) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (!timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setPhase((p) => (p + 1) % 3);
      }, CYCLE_MS);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [paused, shouldReduce]);

  const handlePointerEnter = () => setPaused(true);
  const handlePointerLeave = () => setPaused(false);
  const handleFocus = () => setPaused(true);
  const handleBlur = () => setPaused(false);

  const textVariants: Variants = {
    hidden: (dir = 1) => ({
      opacity: 0,
      scale: 0.95,
      y: 18 * dir,
      rotateX: 10 * dir,
    }),
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: ENTER_DUR, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir = 1) => ({
      opacity: 0,
      scale: 0.9,
      x: -40 * dir,
      rotateY: 25 * dir,
      transition: { duration: EXIT_DUR, ease: [0.55, 0.055, 0.675, 0.19] },
    }),
  };

  const symbolVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6, y: 20, rotateY: -60 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      rotateY: 0, 
      transition: { duration: ENTER_DUR, ease: [0.68, -0.55, 0.265, 1.55] } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.7, 
      y: -20, 
      rotateX: 50, 
      transition: { duration: EXIT_DUR, ease: [0.55, 0.055, 0.675, 0.19] } 
    },
  };

  const GradientText = ({ children, className = "", style = {} }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundSize: "300% 100%", ...style }}
      animate={shouldReduce ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={shouldReduce ? {} : { duration: 4.5, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.span>
  );

  return (
    <div
      aria-label="TerraCapsule animated logo"
      role="img"
      tabIndex={0}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="flex items-center justify-center my-8 min-h-[48px] select-none relative"
      style={{
        // tweak these to change overall sizing
        ["--logo-size" as any]: "44px", // much smaller symbol size
        ["--headline-size" as any]: "1.1rem", // much smaller text size
      }}
    >
      {/* faint backdrop behind text to improve legibility on busy backgrounds */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "transparent",
        }}
      >
        {/* center subtle vignette */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(60vw, 950px)",
            height: "120px",
            filter: "blur(18px)",
            opacity: 0.06,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.9), rgba(0,0,0,0.35) 40%, transparent 70%)",
            borderRadius: 24,
          }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {/* PHASE 0: White uppercase text, smooth color transition */}
        {phase === 0 && (
          <motion.div
            key="text-main"
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex items-center justify-center"
          >
            <motion.h1
              className="font-extrabold leading-none"
              style={{
                fontSize: "var(--headline-size)",
                textTransform: "uppercase",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                backgroundImage: "linear-gradient(90deg, #fff, #e0e7ff, #bae6fd)",
                WebkitTextStroke: "1px rgba(0,0,0,0.18)",
                textShadow:
                  "0 1px 0 rgba(0,0,0,0.18), 0 0 8px rgba(59,130,246,0.12)",
                transform: "translateZ(0)",
                fontFamily: "'Orbitron', 'Arial Black', sans-serif",
                padding: "0 8px",
                letterSpacing: "0.08em",
              }}
              aria-hidden
              animate={
                shouldReduce
                  ? {}
                  : {
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      color: ["#fff", "#bae6fd", "#fff"],
                    }
              }
              transition={shouldReduce ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              TERRA CAPSULE
            </motion.h1>
          </motion.div>
        )}

        {/* PHASE 1: Symbol (minimal capsule with earth hint and single orbit) */}
        {phase === 1 && (
          <motion.div
            key="globe"
            variants={symbolVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex items-center justify-center"
            style={{ width: "var(--logo-size)", height: "var(--logo-size)" }}
          >
            {/* Globe: blue/green continents, animated rotation, shine */}
            <motion.div
              className="absolute"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "radial-gradient(circle at 60% 40%, #bae6fd 60%, #3b82f6 100%)",
                boxShadow: "0 2px 8px rgba(59,130,246,0.18), 0 8px 16px rgba(0,0,0,0.10)",
                position: "absolute",
                overflow: "hidden",
              }}
              animate={shouldReduce ? {} : { rotate: [0, 360] }}
              transition={shouldReduce ? {} : { duration: 12, ease: "linear", repeat: Infinity }}
              aria-hidden
            >
              {/* Continents (simple shapes) */}
              <motion.div
                style={{ position: "absolute", left: "22%", top: "38%", width: "28%", height: "18%", borderRadius: "50%", background: "#22c55e", opacity: 0.9 }}
                animate={shouldReduce ? {} : { x: [0, 2, -2, 0], y: [0, 2, -2, 0] }}
                transition={shouldReduce ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                style={{ position: "absolute", right: "18%", bottom: "28%", width: "22%", height: "16%", borderRadius: "50%", background: "#22c55e", opacity: 0.9 }}
                animate={shouldReduce ? {} : { x: [0, -2, 2, 0], y: [0, -2, 2, 0] }}
                transition={shouldReduce ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Shine effect */}
              <div
                style={{
                  position: "absolute",
                  left: "18%",
                  top: "10%",
                  width: "60%",
                  height: "30%",
                  borderRadius: "50%",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.01) 100%)",
                  filter: "blur(2px)",
                  opacity: 0.7,
                }}
              />
            </motion.div>
            {/* Single orbiting dot (glow) */}
            {!shouldReduce && (
              <motion.div
                aria-hidden
                className="absolute rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  left: "50%",
                  top: "0%",
                  transformOrigin: "center 28px",
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  boxShadow: "0 0 12px rgba(59,130,246,0.4)",
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
              />
            )}
          </motion.div>
        )}

        {/* PHASE 2: Return text (more legible rainbow) */}
        {phase === 2 && (
          <motion.div key="text-return" custom={-1} variants={textVariants} initial="hidden" animate="visible" exit="exit" className="relative">
            <motion.h1
              className="font-extrabold leading-none"
              style={{
                fontSize: "var(--headline-size)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                backgroundImage: "linear-gradient(45deg,#f59e0b,#ef4444,#8b5cf6,#06b6d4,#10b981)",
                backgroundSize: "600% 600%",
                WebkitTextStroke: "0.9px rgba(0,0,0,0.35)",
                textShadow:
                  "0 1px 0 rgba(0,0,0,0.45), 0 0 12px rgba(139,92,246,0.25), 0 0 28px rgba(6,182,212,0.18)",
                transform: "translateZ(0)",
                fontFamily: "'Orbitron', 'Arial Black', sans-serif",
                padding: "0 8px",
              }}
              aria-hidden
              animate={shouldReduce ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={shouldReduce ? {} : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span>TerraCapsule</span>

              {/* lightning accents, positioned further out to avoid covering letters */}
              {!shouldReduce &&
                [...Array(4)].map((_, i) => {
                  const left = 12 + i * 18;
                  const top = -30 + ((i % 2) * 60);
                  const delay = 0.18 * i;
                  return (
                    <motion.span
                      key={`bolt-${i}`}
                      className="absolute"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: 2,
                        height: 22,
                        borderRadius: 2,
                        transform: `rotate(${ -15 + i * 9 }deg)`,
                        background: "linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.0))",
                        filter: "drop-shadow(0 0 8px rgba(250,204,21,0.7))",
                        zIndex: 1,
                      }}
                      animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                      transition={{ duration: 0.85, repeat: Infinity, delay, repeatDelay: 1.6, ease: "easeInOut" }}
                    />
                  );
                })}
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="sr-only" aria-live="polite">
        {phase === 0 ? "TerraCapsule — brand text" : phase === 1 ? "TerraCapsule symbol" : "TerraCapsule — returning text"}
      </span>
    </div>
  );
}
