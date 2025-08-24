"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CesiumGlobe from '../components/CesiumGlobe';
import SimpleAnimatedLogo from '../components/SimpleAnimatedLogo';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [enterSite, setEnterSite] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Predefined particle data to avoid hydration issues
  const particleData = [
    { left: 20, delay: 2, duration: 18 },
    { left: 45, delay: 7, duration: 22 },
    { left: 75, delay: 1, duration: 16 },
    { left: 15, delay: 9, duration: 20 },
    { left: 85, delay: 4, duration: 24 },
    { left: 35, delay: 11, duration: 17 },
    { left: 65, delay: 6, duration: 19 },
    { left: 90, delay: 3, duration: 21 },
    { left: 25, delay: 12, duration: 15 },
    { left: 55, delay: 8, duration: 23 },
    { left: 10, delay: 14, duration: 18 },
    { left: 80, delay: 5, duration: 20 },
    { left: 40, delay: 10, duration: 16 },
    { left: 70, delay: 2, duration: 22 },
    { left: 95, delay: 7, duration: 19 },
    { left: 5, delay: 13, duration: 17 },
    { left: 50, delay: 1, duration: 25 },
    { left: 30, delay: 9, duration: 18 },
    { left: 60, delay: 4, duration: 21 },
    { left: 88, delay: 11, duration: 16 },
    { left: 12, delay: 6, duration: 24 },
    { left: 77, delay: 3, duration: 20 },
    { left: 42, delay: 8, duration: 15 },
    { left: 67, delay: 12, duration: 23 },
    { left: 22, delay: 5, duration: 19 }
  ];

  useEffect(() => {
    let startTime = Date.now();
    const duration = 4000; // 4 seconds total loading time
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        setTimeout(() => setShowEnterButton(true), 500);
      } else {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, []);

  // Keyboard support for Enter key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && showEnterButton && !enterSite) {
        setEnterSite(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showEnterButton, enterSite]);

  // TerraCapsule Logo Component
  const TerraCapsuleLogo = () => (
    <div className="terra-logo">
      <div className="terra-logo-outer"></div>
      <div className="terra-logo-inner">
        <div className="terra-logo-shine"></div>
        
        {/* Enhanced Globe Design with geometric patterns */}
        <div className="absolute inset-2 rounded-full overflow-hidden">
          {/* Central Core */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-500/30 backdrop-blur-sm border border-cyan-400/50"
          />
          
          {/* Floating continents */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: 2,
              ease: "easeInOut"
            }}
            className="absolute top-3 left-4 w-2 h-1 bg-emerald-400 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: 1.5,
              ease: "easeInOut"
            }}
            className="absolute bottom-2 right-2 w-1 h-2 bg-cyan-400 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: 1,
              ease: "easeInOut"
            }}
            className="absolute bottom-4 left-3 w-1 h-1 bg-teal-400 rounded-full"
          />
        </div>
      </div>
      
      {/* Enhanced Orbital Ring with multiple elements */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-4 rounded-full border border-cyan-400/50"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-teal-400 rounded-full shadow-sm shadow-teal-400/50"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400/50"></div>
      </motion.div>
      
      {/* Additional outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-6 rounded-full border border-teal-400/20"
      >
        <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-teal-300 rounded-full opacity-60"></div>
        <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-cyan-300 rounded-full opacity-60"></div>
      </motion.div>
    </div>
  );

  // Loading Screen - Single Page, No Scrolling
  if (!enterSite) {
    return (
      <main className="loading-container flex items-center justify-center min-h-screen text-white relative overflow-hidden">
        {/* Animated background particles */}
        {isClient && (
          <div className="absolute inset-0 pointer-events-none">
            {particleData.map((particle, i) => (
              <div
                key={i}
                className="floating-particle"
                style={{
                  left: `${particle.left}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Centered Content - Single Page Layout */}
        <div className="z-10 flex flex-col items-center max-w-6xl px-8">
          <TerraCapsuleLogo />

          <div className="text-center space-y-8 mb-12">
            <h1 className="hero-title">
              TERRA
              <span className="title-highlight">CAPSULE</span>
            </h1>
            
            <div className="hero-subtitle-container">
              <p className="hero-subtitle">
                {progress < 100 ? (
                  <>
                    <span className="subtitle-emphasis">CRAFTING</span> YOUR ULTIMATE
                    <br />
                    <span className="subtitle-accent">TRAVEL EXPERIENCE</span>
                  </>
                ) : (
                  <>
                    <span className="subtitle-emphasis">YOUR GATEWAY</span> TO
                    <br />
                    <span className="subtitle-accent">EXTRAORDINARY DESTINATIONS</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Progress Section - Centered Below Title */}
          {!showEnterButton && (
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">JOURNEY INITIALIZATION</span>
                <span className="progress-percentage">{Math.round(progress)}<span className="percentage-symbol">%</span></span>
              </div>
              
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${Math.round(progress)}%` }}
                />
              </div>

              <p className="progress-status">
                {Math.round(progress) < 25 && "ESTABLISHING GLOBAL CONNECTIONS"}
                {Math.round(progress) >= 25 && Math.round(progress) < 50 && "LOADING IMMERSIVE EXPERIENCES"}
                {Math.round(progress) >= 50 && Math.round(progress) < 75 && "PREPARING INTERACTIVE INTERFACE"}
                {Math.round(progress) >= 75 && "FINALIZING YOUR ADVENTURE"}
              </p>
            </div>
          )}

          {/* Enter Section - Replace Progress Section When Complete */}
          {showEnterButton && (
            <div className="enter-section">
              <div className="enter-description">
                <p className="enter-text">
                  DISCOVER <span className="text-highlight">EXTRAORDINARY DESTINATIONS</span> THROUGH AN
                  <br />
                  <span className="text-emphasis">IMMERSIVE 3D EXPERIENCE</span>
                </p>
                <p className="enter-subtext">
                  YOUR ADVENTURE BEGINS HERE
                </p>
              </div>

              <button
                onClick={() => setEnterSite(true)}
                className="hero-enter-button"
              >
                <span className="button-text">ENTER TERRACAPSULE</span>
              </button>

              <div className="enter-instructions">
                PRESS ENTER OR CLICK ABOVE TO BEGIN YOUR JOURNEY
              </div>
            </div>
          )}
        </div>

        {/* Floating Elements - Only Show When Enter Button Appears */}
        {showEnterButton && (
          <>
            <div className="absolute top-20 left-20 opacity-30">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border border-cyan-400 rounded-full"
              />
            </div>
            <div className="absolute bottom-32 right-32 opacity-20">
              <motion.div
                animate={{ rotate: -360, scale: [1, 0.8, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border border-teal-400 rounded-full"
              />
            </div>
          </>
        )}
      </main>
    );
  }

  // Main Site After Loading
  return (
    <div className="main-site">
      {/* Full-Screen Immersive Globe Hero Section */}
      <section className="immersive-globe-section">
        {/* Floating Navigation - overlays on top with scroll adaptation */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 transition-all duration-300"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="nav-container">
            <div className="nav-logo">
              <div className="logo-icon">
                <SimpleAnimatedLogo />
              </div>
            </div>
            
            <div className="nav-menu">
              <a href="#destinations" className="nav-link">Destinations</a>
              <a href="#experiences" className="nav-link">Experiences</a>
              <a href="#events" className="nav-link">Events</a>
              <a href="#about" className="nav-link">About</a>
            </div>
            
            <div className="nav-actions">
              <button className="nav-button secondary">Sign In</button>
              <button className="nav-button primary">Get Started</button>
            </div>
          </div>
        </motion.nav>

        {/* Full-Screen Globe Container with enhanced depth */}
        <div className="globe-immersive-container">
          {/* Subtle animated particles for depth */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          <motion.div 
            className="globe-full-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
          >
            <CesiumGlobe className="w-full h-full" />
          </motion.div>
          
          {/* Minimal scroll indicator - tessarakt style */}
          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/40 text-xs pointer-events-none z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 4 }}
          >
            <motion.div 
              className="flex flex-col items-center space-y-3"
              animate={{ 
                y: [0, -6, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              <div className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              </div>
              <span className="text-[10px] font-light tracking-widest uppercase">Scroll</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Content Sections Below Globe */}
      <section className="content-sections">
        {/* Welcome Section */}
        <section id="welcome" className="content-section welcome-section">
          <div className="container mx-auto px-6 py-20">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Welcome to TerraCapsule
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Explore Earth like never before with our immersive 3D globe experience. 
                Discover countries, plan adventures, and unlock the wonders of our planet from space to street level.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Start Exploring
                </button>
                <button className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* More sections here... */}
      </section>
    </div>
  );
}
