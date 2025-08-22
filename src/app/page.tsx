"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleEarthGlobe from "../components/GoogleEarthGlobe";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [enterSite, setEnterSite] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowEnterButton(true), 500);
          return 100;
        }
        return old + 1;
      });
    }, 50); // Faster progress to match bar animation
    
    return () => clearInterval(interval);
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

  const handleLocationClick = (location: string) => {
    console.log(`Exploring ${location}...`);
    // Future: Navigate to location details page
  };

  // TerraCapsule Logo Component
  const TerraCapsuleLogo = () => (
    <div className="terra-logo">
      <div className="terra-logo-outer"></div>
      <div className="terra-logo-inner">
        <div className="terra-logo-shine"></div>
        
        {/* Enhanced Globe Design with geometric patterns */}
        <div className="absolute inset-2 rounded-full overflow-hidden">
          {/* Central Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full shadow-lg shadow-emerald-400/50"></div>
          
          {/* Geometric Land Masses */}
          <div className="absolute top-2 left-3 w-5 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-md opacity-90 transform rotate-12 shadow-sm"></div>
          <div className="absolute top-5 right-2 w-4 h-5 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg opacity-85 transform -rotate-6 shadow-sm"></div>
          <div className="absolute bottom-3 left-4 w-6 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full opacity-90 shadow-sm"></div>
          <div className="absolute bottom-4 right-4 w-3 h-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md opacity-80 transform rotate-45 shadow-sm"></div>
          
          {/* Additional smaller landmasses */}
          <div className="absolute top-7 left-6 w-2 h-2 bg-emerald-400 rounded-full opacity-70"></div>
          <div className="absolute bottom-6 left-2 w-2 h-3 bg-green-500 rounded-sm opacity-75"></div>
          <div className="absolute top-6 right-6 w-1 h-2 bg-teal-400 rounded-full opacity-80"></div>
          
          {/* Orbital Grid Pattern */}
          <div className="absolute inset-0 rounded-full border border-cyan-300/20"></div>
          <div className="absolute inset-2 rounded-full border border-cyan-400/15"></div>
          <div className="absolute inset-4 rounded-full border border-teal-300/20"></div>
          
          {/* Latitude lines */}
          <div className="absolute top-1/4 left-1 right-1 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
          <div className="absolute top-3/4 left-1 right-1 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent"></div>
          
          {/* Longitude curves */}
          <div className="absolute top-1 bottom-1 left-1/3 w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent"></div>
          <div className="absolute top-1 bottom-1 left-2/3 w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent"></div>
          
          {/* Energy pulses */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
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

  // Loading Screen with Enter Button after 100%
  if (!enterSite) {
    return (
      <main className="loading-container flex items-center justify-center min-h-screen text-white flex-col relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="z-10 flex flex-col items-center">
          <TerraCapsuleLogo />

          <div className="text-center space-y-8 max-w-6xl px-8">
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

          {/* Progress Section - Hide when complete */}
          {!showEnterButton && (
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">JOURNEY INITIALIZATION</span>
                <span className="progress-percentage">{Math.floor(progress)}<span className="percentage-symbol">%</span></span>
              </div>
              
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="progress-status">
                {progress < 25 && "ESTABLISHING GLOBAL CONNECTIONS"}
                {progress >= 25 && progress < 50 && "LOADING IMMERSIVE EXPERIENCES"}
                {progress >= 50 && progress < 75 && "PREPARING INTERACTIVE INTERFACE"}
                {progress >= 75 && "FINALIZING YOUR ADVENTURE"}
              </p>
            </div>
          )}

          {/* Enter Section - Show after loading complete */}
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

        {/* Floating Elements */}
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

  // Main Site
  return (
    <div className="main-site">
      {/* Navigation Header */}
      <nav className="site-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <TerraCapsuleLogo />
            </div>
            <span className="logo-text">TERRACAPSULE</span>
          </div>
          
          <div className="nav-menu">
            <a href="#destinations" className="nav-link">Destinations</a>
            <a href="#experiences" className="nav-link">Experiences</a>
            <a href="#events" className="nav-link">Events</a>
            <a href="#about" className="nav-link">About</a>
          </div>
          
          <div className="nav-actions">
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
            <button className="nav-button secondary">Sign In</button>
            <button className="nav-button primary">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Google Earth Globe */}
      <section className="hero-section-main">
        <div className="hero-container">
          {/* Main Globe Section - First thing users see */}
          <div className="globe-hero-section">
            <motion.div 
              className="globe-main-container"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <GoogleEarthGlobe />
              
              <motion.div 
                className="globe-welcome-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2 }}
              >
                <h1 className="globe-title">Welcome to TerraCapsule</h1>
                <p className="globe-subtitle">Your interactive journey begins here</p>
                <motion.div 
                  className="scroll-indicator"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span>Scroll to explore</span>
                  <div className="scroll-arrow">↓</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Explore in 3D Section - Appears on scroll */}
      <motion.section 
        className="explore-3d-section"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="section-container">
          <div className="explore-content-3d">
            <motion.div 
              className="explore-text-content"
              initial={{ opacity: 0, x: -100, rotateY: -20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.h1 
                className="explore-main-title"
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Explore the World in
                </motion.span>
                <motion.span 
                  className="title-accent-3d"
                  initial={{ opacity: 0, scale: 0.8, rotateZ: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1 }}
                > 3D</motion.span>
              </motion.h1>
              
              <motion.p 
                className="explore-subtitle"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                Discover extraordinary destinations, upcoming events, and hidden gems 
                through our immersive interactive experience.
              </motion.p>
              
              <motion.div 
                className="hero-stats-3d"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                {[
                  { number: "500+", label: "Destinations" },
                  { number: "1000+", label: "Events" },
                  { number: "50+", label: "Countries" }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="stat-item-3d"
                    initial={{ opacity: 0, scale: 0.5, rotateY: -45 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.7 + index * 0.2 }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: 10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <span className="stat-number-3d">{stat.number}</span>
                    <span className="stat-label-3d">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="explore-actions"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 2.2 }}
              >
                {[
                  { icon: "🌍", text: "Earth View", active: true },
                  { icon: "📍", text: "Events", active: false },
                  { icon: "✈️", text: "Flights", active: false }
                ].map((control, index) => (
                  <motion.button 
                    key={control.text}
                    className={`action-btn-3d ${control.active ? 'active' : ''}`}
                    initial={{ opacity: 0, x: -20, rotateZ: -10 }}
                    whileInView={{ opacity: 1, x: 0, rotateZ: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 2.4 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateZ: 2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {control.icon} {control.text}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="explore-visual-container"
              initial={{ opacity: 0, scale: 0.5, rotateY: 45, z: -100 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.8 }}
              style={{ 
                transform: "perspective(1000px) rotateY(-5deg) rotateX(-2deg)",
                transformStyle: "preserve-3d" 
              }}
            >
              <div className="explore-feature-grid">
                <motion.div 
                  className="feature-card-3d"
                  initial={{ opacity: 0, rotateX: -90 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  whileHover={{ 
                    rotateX: 5, 
                    rotateY: 5, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="feature-icon">�️</div>
                  <h3>Interactive Maps</h3>
                  <p>Explore detailed 3D maps of destinations</p>
                </motion.div>

                <motion.div 
                  className="feature-card-3d"
                  initial={{ opacity: 0, rotateX: -90 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.7 }}
                  whileHover={{ 
                    rotateX: 5, 
                    rotateY: 5, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="feature-icon">📅</div>
                  <h3>Live Events</h3>
                  <p>Discover events happening around the world</p>
                </motion.div>

                <motion.div 
                  className="feature-card-3d"
                  initial={{ opacity: 0, rotateX: -90 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.9 }}
                  whileHover={{ 
                    rotateX: 5, 
                    rotateY: 5, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="feature-icon">🎯</div>
                  <h3>Smart Recommendations</h3>
                  <p>AI-powered travel suggestions</p>
                </motion.div>

                <motion.div 
                  className="feature-card-3d"
                  initial={{ opacity: 0, rotateX: -90 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 2.1 }}
                  whileHover={{ 
                    rotateX: 5, 
                    rotateY: 5, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="feature-icon">📱</div>
                  <h3>Mobile Ready</h3>
                  <p>Access from anywhere, anytime</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating 3D Elements */}
        <div className="floating-elements-explore">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-element-explore"
              initial={{ 
                opacity: 0, 
                scale: 0,
                rotateX: Math.random() * 360,
                rotateY: Math.random() * 360,
                z: -200
              }}
              whileInView={{ 
                opacity: 0.6, 
                scale: 1,
                rotateX: 360,
                rotateY: 360,
                z: 0
              }}
              viewport={{ once: true }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: 2.5 + i * 0.3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                width: '20px',
                height: '20px',
                background: `linear-gradient(45deg, #00d4ff, #03dac6)`,
                borderRadius: Math.random() > 0.5 ? '50%' : '4px',
                transformStyle: 'preserve-3d'
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Featured Destinations with Scroll Animation */}
      <motion.section 
        className="destinations-section"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">Handpicked locations for your next adventure</p>
          </motion.div>
          
          <div className="destinations-grid">
            {[
              { name: "Tokyo, Japan", image: "🏙️", events: 42, type: "Urban" },
              { name: "Santorini, Greece", image: "🏛️", events: 18, type: "Island" },
              { name: "Machu Picchu, Peru", image: "🏔️", events: 12, type: "Historical" },
              { name: "Dubai, UAE", image: "🏗️", events: 35, type: "Modern" },
              { name: "Bali, Indonesia", image: "🌴", events: 28, type: "Tropical" },
              { name: "Iceland", image: "🌋", events: 15, type: "Nature" }
            ].map((destination, index) => (
              <motion.div 
                key={index} 
                className="destination-card"
                initial={{ opacity: 0, y: 50, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3 + index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="destination-image">
                  <span className="destination-emoji">{destination.image}</span>
                  <motion.div 
                    className="destination-overlay"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button 
                      className="explore-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore
                    </motion.button>
                  </motion.div>
                </div>
                <div className="destination-info">
                  <h3 className="destination-name">{destination.name}</h3>
                  <div className="destination-meta">
                    <span className="destination-type">{destination.type}</span>
                    <span className="destination-events">{destination.events} events</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Upcoming Events with Scroll Animation */}
      <motion.section 
        className="events-section"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Don't miss these amazing experiences</p>
          </motion.div>
          
          <div className="events-timeline">
            {[
              { date: "Mar 15", title: "Cherry Blossom Festival", location: "Tokyo, Japan", attendees: "2.5K" },
              { date: "Apr 2", title: "Music & Arts Festival", location: "Coachella, USA", attendees: "125K" },
              { date: "May 18", title: "Northern Lights Tour", location: "Reykjavik, Iceland", attendees: "450" },
              { date: "Jun 10", title: "Summer Solstice", location: "Stonehenge, UK", attendees: "15K" }
            ].map((event, index) => (
              <motion.div 
                key={index} 
                className="event-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: index % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + index * 0.15,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02, 
                  x: 10,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className="event-date"
                  initial={{ scale: 0.8, rotateZ: -10 }}
                  whileInView={{ scale: 1, rotateZ: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <span className="event-month">{event.date.split(' ')[0]}</span>
                  <span className="event-day">{event.date.split(' ')[1]}</span>
                </motion.div>
                <div className="event-details">
                  <motion.h3 
                    className="event-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    {event.title}
                  </motion.h3>
                  <motion.p 
                    className="event-location"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    📍 {event.location}
                  </motion.p>
                  <motion.p 
                    className="event-attendees"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    👥 {event.attendees} attending
                  </motion.p>
                </div>
                <motion.button 
                  className="event-action"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Event
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <TerraCapsuleLogo />
              </div>
              <h3>TERRACAPSULE</h3>
              <p>Your gateway to extraordinary destinations</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Explore</h4>
                <a href="#">Destinations</a>
                <a href="#">Events</a>
                <a href="#">Experiences</a>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Careers</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 TerraCapsule. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
