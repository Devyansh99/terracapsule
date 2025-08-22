"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Globe3D from "../components/Globe3D";

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
          setTimeout(() => setShowEnterButton(true), 800);
          return 100;
        }
        return old + 1.5;
      });
    }, 60);

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
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
      >
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full"></div>
              <span className="text-xl font-bold">TerraCapsule</span>
            </div>
            <div className="hidden md:flex space-x-6 text-sm">
              <a href="#explore" className="hover:text-cyan-400 transition-colors">Explore</a>
              <a href="#destinations" className="hover:text-cyan-400 transition-colors">Destinations</a>
              <a href="#events" className="hover:text-cyan-400 transition-colors">Events</a>
              <a href="#planner" className="hover:text-cyan-400 transition-colors">Trip Planner</a>
            </div>
          </div>
        </nav>

        {/* Hero Section with Globe */}
        <section className="flex items-center justify-center min-h-screen px-6 pt-20">
          <div className="text-center max-w-6xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="w-96 h-96 mx-auto mb-12"
            >
              <Globe3D onLocationClick={handleLocationClick} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 bg-clip-text text-transparent"
            >
              Discover Tomorrow's Adventures
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl text-gray-300 mb-12 leading-relaxed"
            >
              Explore upcoming events, festivals, and experiences around the world. 
              <br />Plan your next adventure with AI-powered recommendations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full text-white font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300">
                Start Exploring
              </button>
              <button className="px-8 py-4 border border-gray-600 rounded-full text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300">
                View Demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🗺️",
                  title: "Interactive Globe",
                  description: "Explore destinations in 3D with real-time data and upcoming events"
                },
                {
                  icon: "🎉", 
                  title: "Live Events",
                  description: "Discover festivals, concerts, and experiences happening around the world"
                },
                {
                  icon: "🤖",
                  title: "AI Trip Planner",
                  description: "Get personalized itineraries and recommendations powered by AI"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-colors duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.main>
    </AnimatePresence>
  );
}
