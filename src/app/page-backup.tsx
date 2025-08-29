'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import CesiumGlobe from '../components/CesiumGlobe'
import SimpleAnimatedLogo from '../components/SimpleAnimatedLogo'
import Link from 'next/link'

interface Country {
  id: string
  code: string
  name: string
  population: number
  capital: string
  continent: string
  region: string
  flag: string
  coordinates: [number, number]
  languages: string[]
  area: number
  description: string
  highlights: string[]
}

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showEnterButton, setShowEnterButton] = useState(false)
  const [enterSite, setEnterSite] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [globeInteractive, setGlobeInteractive] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [apiStats, setApiStats] = useState({ eventCount: 1000, placeCount: 500 })

  // Modal states for authentication and about
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false) // Don't show by default
  const [showGetStartedModal, setShowGetStartedModal] = useState(false)
  
  // Authentication hooks
  const { login, register, logout, loading, error, setError } = useAuth()
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [isSignUp, setIsSignUp] = useState(false)

  // Handle form submissions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(loginForm.email, loginForm.password)
    if (result.user) {
      setShowSignInModal(false)
      setLoginForm({ email: '', password: '' })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    const result = await register(registerForm.name, registerForm.email, registerForm.password)
    if (result.user) {
      setShowGetStartedModal(false)
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' })
    }
  }

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showSignInModal || showGetStartedModal) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
      document.body.style.height = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
      document.body.style.height = 'unset'
    }
  }, [showSignInModal, showGetStartedModal])

  // Fetch countries from our backend API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        if (data.success) {
          // Transform the data to match our interface
          const transformedCountries = data.data.map((country: any) => ({
            id: country.id,
            code: country.code,
            name: country.name,
            population: parseInt(country.population),
            capital: country.capital,
            continent: country.continent,
            region: country.region,
            flag: country.flag,
            coordinates: [country.latitude, country.longitude] as [number, number],
            languages: country.languages,
            area: country.area,
            description: country.description,
            highlights: country.highlights
          }))
          setCountries(transformedCountries)
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Keep empty array as fallback
      }
    }

    fetchCountries()
  }, [])

  // Function to get country-specific landscape images
  const getCountryImageUrl = (countryName: string) => {
    const countryImages: { [key: string]: string } = {
      'United States': 'https://images.unsplash.com/photo-1564596184263-5b8e8600c0ee?w=400&h=300&fit=crop', // Grand Canyon
      'China': 'https://images.unsplash.com/photo-1538298867774-6a54d3c0d75d?w=400&h=300&fit=crop', // Great Wall
      'Brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop', // Christ the Redeemer
      'Russia': 'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=400&h=300&fit=crop', // Red Square
      'India': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop', // Taj Mahal
      'Australia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', // Sydney Opera House
      'Japan': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop', // Mount Fuji
      'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop', // London
      'France': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop', // Eiffel Tower
      'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop', // Brandenburg Gate
      'Canada': 'https://images.unsplash.com/photo-1503614472-8c93d56cd8d1?w=400&h=300&fit=crop', // Banff
      'Mexico': 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop', // Chichen Itza
      'Italy': 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=400&h=300&fit=crop', // Colosseum
      'Spain': 'https://images.unsplash.com/photo-1571843667267-8fc6dd8b74ce?w=400&h=300&fit=crop', // Sagrada Familia
      'Egypt': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&h=300&fit=crop', // Pyramids
    };
    
    return countryImages[countryName] || `https://images.unsplash.com/1600x900/?${encodeURIComponent(countryName)}+landscape+landmark&w=400&h=300&fit=crop`;
  };

  // Ensure client-side rendering to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Predefined 3D floating elements data (reduced for performance)
  const floating3DElements = [
    { left: 10, top: 20, rotateX: 45, rotateY: 90, isCircle: true, duration: 8 },
    { left: 80, top: 15, rotateX: 90, rotateY: 180, isCircle: false, duration: 12 },
    { left: 25, top: 60, rotateX: 180, rotateY: 270, isCircle: true, duration: 10 },
    { left: 70, top: 75, rotateX: 270, rotateY: 360, isCircle: false, duration: 14 }
  ];

  // Predefined particle data (reduced for performance)
  const particleData = [
    { left: 20, delay: 2, duration: 18, top: 10, opacity: 0.3 },
    { left: 45, delay: 7, duration: 22, top: 30, opacity: 0.2 },
    { left: 75, delay: 1, duration: 16, top: 60, opacity: 0.4 },
    { left: 15, delay: 9, duration: 20, top: 80, opacity: 0.3 },
    { left: 85, delay: 4, duration: 24, top: 40, opacity: 0.2 },
    { left: 35, delay: 11, duration: 17, top: 70, opacity: 0.3 }
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

  // Click-to-Interact functionality for globe
  useEffect(() => {
    if (!enterSite) return;

    let timeoutId2: NodeJS.Timeout;

    const handleScroll = () => {
      if (!globeInteractive) {
        const overlay = document.getElementById('click-to-interact-overlay');
        if (overlay) {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
        }
      }
    };

    const handleGlobeClick = (e: Event) => {
      e.stopPropagation();
      setGlobeInteractive(true);
      const overlay = document.getElementById('click-to-interact-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    };

    const globeContainer = document.getElementById('globe-container');
    const overlay = document.getElementById('click-to-interact-overlay');
    
    if (globeContainer && overlay) {
      // Show overlay immediately when globe loads
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';

      // Hide after 4 seconds if not clicked
      timeoutId2 = setTimeout(() => {
        if (!globeInteractive) {
          overlay.style.opacity = '0';
          overlay.style.pointerEvents = 'none';
        }
      }, 4000);

      // Add scroll listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      overlay.addEventListener('click', handleGlobeClick);
      
      return () => {
        clearTimeout(timeoutId2);
        window.removeEventListener('scroll', handleScroll);
        overlay.removeEventListener('click', handleGlobeClick);
      };
    }
  }, [enterSite, globeInteractive]);

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
                  top: `${particle.top}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                  opacity: particle.opacity,
                  willChange: 'transform'
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
      <section 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100vh', 
          overflow: 'hidden'
        }}
      >
        {/* Floating Navigation - overlays on top with scroll adaptation */}
        <motion.nav 
          className="site-nav"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <div className="nav-container" style={{ pointerEvents: 'auto' }}>
            <div className="nav-logo">
              <div className="logo-icon">
                <SimpleAnimatedLogo />
              </div>
            </div>
            
            <div className="nav-menu">
              <a href="#welcome" className="nav-link">Welcome</a>
              <a href="#destinations" className="nav-link">Destinations</a>
              <a href="#events" className="nav-link">Events</a>
              <button 
                onClick={() => setShowAboutModal(true)}
                className="nav-link"
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                About
              </button>
            </div>
            
            <div className="nav-actions">
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
              <button 
                onClick={() => {
                  console.log('Sign In button clicked!')
                  setShowSignInModal(true)
                }}
                className="nav-button secondary"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowGetStartedModal(true)}
                className="nav-button primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Full-Screen Globe Container with Click-to-Interact */}
        <div 
          id="globe-container"
          style={{ 
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
            style={{ 
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
          >
            <CesiumGlobe className="w-full h-full" />
            
            {/* Click to Interact Overlay */}
            <div
              id="click-to-interact-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                cursor: 'pointer',
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease'
              }}
            >
              <div style={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '24px 32px',
                borderRadius: '16px',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                color: '#fff',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>🌍</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Click to Interact with Globe
                </h3>
                <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
                  Tap anywhere to explore countries and hover for details
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle animated particles for depth - behind globe */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ 
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${(i * 12) + 10}%`,
                top: `${(i * 8) + 15}%`,
                opacity: 0.2 + (i % 3) * 0.1,
                pointerEvents: 'none'
              }}
              animate={{
                y: [-10, -40],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8 + (i * 2),
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </section>
      
      {/* Content Sections Below Globe */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Welcome Section - Professional Overview */}
        <motion.section 
          id="welcome"
          className="explore-3d-section"
          style={{ 
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 0'
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="globe-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ 
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  marginBottom: '2rem'
                }}
              >
                Welcome to TerraCapsule
              </motion.h1>
              
              <motion.p 
                className="globe-subtitle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ 
                  fontSize: '1.3rem',
                  maxWidth: '800px',
                  margin: '0 auto 3rem',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.85)'
                }}
              >
                Experience our planet like never before through an immersive 3D interface. 
                Discover fascinating destinations across carefully curated countries and explore their unique stories, 
                cultures, and wonders from the comfort of your screen.
              </motion.p>

              <motion.div 
                className="hero-stats-3d"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '2rem',
                  margin: '4rem auto 3rem',
                  maxWidth: '800px'
                }}
              >
                {[
                  { number: `${countries.length}+`, label: "Countries", icon: "🌍" },
                  { number: "Real-time", label: "Weather Data", icon: "🌤️" },
                  { number: "Interactive", label: "3D Experience", icon: "�" }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="stat-item-3d"
                    initial={{ opacity: 0, scale: 0.5, rotateY: -45 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '2rem 1.5rem',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{stat.icon}</div>
                    <span className="stat-number-3d" style={{ display: 'block', fontSize: '2rem', fontWeight: '700', color: '#00d4ff', marginBottom: '0.5rem' }}>
                      {stat.number}
                    </span>
                    <span className="stat-label-3d" style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="scroll-indicator"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.8 }}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: 'rgba(255, 255, 255, 0.7)' 
                }}>
                  Discover what makes each destination special
                </span>
                <motion.div 
                  className="scroll-arrow"
                  animate={{ 
                    y: [0, 8, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ 
                    fontSize: '1.5rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 212, 255, 0.3))'
                  }}
                >
                  ↓
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Interactive Experience Section */}
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
                    Immersive
                  </motion.span>
                  <motion.span 
                    className="title-accent-3d"
                    initial={{ opacity: 0, scale: 0.8, rotateZ: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1 }}
                  > 3D Experience</motion.span>
                </motion.h1>
                
                <motion.p 
                  className="explore-subtitle"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1.2 }}
                  style={{ 
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    marginBottom: '3rem',
                    color: 'rgba(255, 255, 255, 0.85)'
                  }}
                >
                  Navigate through a carefully curated selection of countries and regions. 
                  Each destination offers rich cultural insights, historical landmarks, and stunning landscapes
                  brought to life through interactive 3D visualization and real-time data integration.
                </motion.p>
                
                <motion.div 
                  className="hero-stats-3d"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1.5 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                  }}
                >
                  {[
                    { number: "Interactive", label: "Globe Navigation", icon: "🌐" },
                    { number: "Real-time", label: "Weather Updates", icon: "⛅" },
                    { number: "Detailed", label: "Country Information", icon: "📊" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      className="stat-item-3d"
                      initial={{ opacity: 0, scale: 0.5, rotateY: -45 }}
                      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1.7 + index * 0.2 }}
                      whileHover={{ 
                        scale: 1.05, 
                        rotateY: 5,
                        transition: { duration: 0.3 }
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                        borderRadius: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
                      <span className="stat-number-3d" style={{ fontSize: '1rem', fontWeight: '600', color: '#00d4ff', marginBottom: '0.5rem' }}>
                        {stat.number}
                      </span>
                      <span className="stat-label-3d" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  className="explore-actions"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 2.2 }}
                  style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
                >
                  {[
                    { icon: "🗺️", text: "Explore United States", link: "/country/us", active: true },
                    { icon: "🏛️", text: "Explore Canada", link: "/country/ca", active: false },
                    { icon: "🌍", text: "Explore United Kingdom", link: "/country/gb", active: false }
                  ].map((control, index) => (
                    <Link key={control.text} href={control.link}>
                      <motion.button 
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
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          background: control.active ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${control.active ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '25px',
                          color: control.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {control.icon} {control.text}
                      </motion.button>
                    </Link>
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
                <div className="explore-feature-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem',
                  maxWidth: '500px'
                }}>
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
                    style={{
                      padding: '2rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌍</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#00d4ff', marginBottom: '0.5rem' }}>Interactive Maps</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4' }}>Navigate through 3D country representations</p>
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
                    style={{
                      padding: '2rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌤️</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#00d4ff', marginBottom: '0.5rem' }}>Live Weather</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4' }}>Real-time weather conditions worldwide</p>
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
                    style={{
                      padding: '2rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>�️</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#00d4ff', marginBottom: '0.5rem' }}>Cultural Insights</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4' }}>Discover history and heritage</p>
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
                    style={{
                      padding: '2rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>�</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#00d4ff', marginBottom: '0.5rem' }}>Data Visualization</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4' }}>Comprehensive country statistics</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Floating 3D Elements - Optimized */}
          {isClient && (
            <div className="floating-elements-explore">
              {floating3DElements.map((element, i) => (
                <motion.div
                  key={i}
                  className="floating-element-explore"
                  initial={{ 
                    opacity: 0, 
                    scale: 0
                  }}
                  whileInView={{ 
                    opacity: 0.3, 
                    scale: 1
                  }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: element.duration,
                    delay: 1 + i * 0.2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    position: 'absolute',
                    left: `${element.left}%`,
                    top: `${element.top}%`,
                    width: '16px',
                    height: '16px',
                    background: `linear-gradient(45deg, #00d4ff, #03dac6)`,
                    borderRadius: element.isCircle ? '50%' : '4px',
                    willChange: 'transform'
                  }}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Featured Destinations Section */}
        <motion.section 
          id="destinations"
          className="destinations-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="section-title">Curated Destinations</h2>
              <p className="section-subtitle">Explore these carefully selected countries and regions through our 3D interface</p>
            </motion.div>
            
            <div className="destinations-grid">
              {countries.slice(0, 6).map((country, index) => (
                <motion.div 
                  key={country.id} 
                  className="destination-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1 + index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    backdropFilter: 'blur(15px)'
                  }}
                >
                  <div className="destination-image" style={{
                    position: 'relative',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={getCountryImageUrl(country.name)} 
                      alt={`${country.name} landscape`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                      onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(3, 218, 198, 0.1))';
                        }
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '2rem',
                      filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5))',
                      zIndex: 2
                    }}>{country.flag || '🌍'}</div>
                    <motion.div 
                      className="destination-overlay"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <motion.button 
                        className="explore-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '0.75rem 2rem',
                          background: 'linear-gradient(135deg, #00d4ff, #03dac6)',
                          border: 'none',
                          borderRadius: '50px',
                          color: '#ffffff',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          // Scroll to globe and trigger country selection
                          const globeContainer = document.getElementById('globe-container');
                          if (globeContainer) {
                            globeContainer.scrollIntoView({ behavior: 'smooth' });
                            // Add a delay to allow scroll to complete, then simulate country click
                            setTimeout(() => {
                              // Store the country to auto-select in localStorage
                              localStorage.setItem('autoSelectCountry', country.name);
                              // Dispatch custom event to trigger globe interaction
                              window.dispatchEvent(new CustomEvent('autoSelectCountry', { 
                                detail: { countryName: country.name } 
                              }));
                            }, 1000);
                          }
                        }}
                      >
                        Explore in 3D
                      </motion.button>
                    </motion.div>
                  </div>
                  <div className="destination-info" style={{ padding: '1.5rem' }}>
                    <h3 className="destination-name" style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '0.75rem'
                    }}>{country.name}</h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '0.75rem',
                      lineHeight: '1.4'
                    }}>{country.description ? country.description.substring(0, 100) + '...' : 'Discover this amazing destination'}</p>
                    <div className="destination-meta" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className="destination-type" style={{
                        fontSize: '0.875rem',
                        color: '#00d4ff',
                        fontWeight: '500'
                      }}>{country.capital || 'Capital'}</span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8'
                      }}>{country.region || 'Region'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{
                textAlign: 'center',
                marginTop: '3rem',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(0, 212, 255, 0.1)'
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#00d4ff',
                marginBottom: '1rem'
              }}>More Countries Coming Soon</h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                We're continuously expanding our 3D country collection. Each destination is carefully 
                crafted to provide accurate geographical data, cultural insights, and immersive exploration experiences.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Platform Features Section */}
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
              <h2 className="section-title">Platform Features</h2>
              <p className="section-subtitle">Discover what makes TerraCapsule a unique exploration experience</p>
            </motion.div>
            
            <div className="events-timeline" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {[
                { 
                  icon: "🌐", 
                  title: "Interactive 3D Globe", 
                  description: "Navigate seamlessly through countries with smooth 3D transitions and detailed geographical representation",
                  capability: "Real-time Navigation",
                  highlight: true 
                },
                { 
                  icon: "🌤️", 
                  title: "Live Weather Integration", 
                  description: "Get current weather conditions for any location worldwide, updated in real-time",
                  capability: "Global Coverage",
                  highlight: true 
                },
                { 
                  icon: "🏛️", 
                  title: "Cultural Information Hub", 
                  description: "Access comprehensive data about countries including history, culture, and notable landmarks",
                  capability: "Educational Content",
                  highlight: false 
                },
                { 
                  icon: "📊", 
                  title: "Geographic Data Visualization", 
                  description: "Explore detailed statistics and geographical information presented through interactive visuals",
                  capability: "Data-Driven Insights",
                  highlight: false 
                }
              ].map((feature, index) => (
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
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2.5rem',
                    background: feature.highlight ? 'rgba(0, 212, 255, 0.05)' : 'rgba(15, 23, 42, 0.4)',
                    border: feature.highlight ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid rgba(0, 212, 255, 0.1)',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    transformStyle: "preserve-3d"
                  }}
                >
                  <motion.div 
                    className="event-icon"
                    initial={{ scale: 0.8, rotateZ: -10 }}
                    whileInView={{ scale: 1, rotateZ: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    style={{
                      fontSize: '3rem',
                      marginBottom: '1.5rem',
                      textAlign: 'center',
                      filter: 'drop-shadow(0 4px 12px rgba(0, 212, 255, 0.3))'
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <h3 className="event-title" style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1.4rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        marginBottom: '0'
                      }}>{feature.title}</h3>
                      {feature.highlight && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#00d4ff',
                          background: 'rgba(0, 212, 255, 0.1)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Core Feature
                        </span>
                      )}
                    </div>
                    
                    <p style={{
                      fontSize: '0.95rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.5',
                      marginBottom: '1.5rem'
                    }}>
                      {feature.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#00d4ff',
                        fontWeight: '500'
                      }}>
                        🎯 {feature.capability}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
              style={{
                textAlign: 'center',
                marginTop: '4rem',
                padding: '3rem 2rem',
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(3, 218, 198, 0.05))',
                borderRadius: '20px',
                border: '1px solid rgba(0, 212, 255, 0.2)'
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '1rem'
              }}>Experience the Future of Digital Exploration</h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                maxWidth: '700px',
                margin: '0 auto 2rem',
                fontSize: '1.1rem'
              }}>
                TerraCapsule combines cutting-edge 3D technology with comprehensive geographical data 
                to create an unparalleled virtual travel experience. Start exploring the world from wherever you are.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '1rem 2.5rem',
                  background: 'linear-gradient(135deg, #00d4ff, #03dac6)',
                  border: 'none',
                  borderRadius: '50px',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0, 212, 255, 0.3)'
                }}
                onClick={() => {
                  const destinationsSection = document.getElementById('destinations');
                  if (destinationsSection) {
                    destinationsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View All Countries
              </motion.button>
            </motion.div>
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

        {/* About Modal - Professional Fixed Position */}
        <AnimatePresence>
          {showAboutModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
              onClick={() => setShowAboutModal(false)}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 50 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '1200px',
                  width: '95%',
                  height: '90vh',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 58, 138, 0.95))',
                  backdropFilter: 'blur(25px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(34, 211, 238, 0.4)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 100px rgba(34, 211, 238, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowAboutModal(false)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ×
                </button>

                {/* Modal Content - Full Info, No Scroll */}
                <div style={{ 
                  padding: '25px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  color: '#ffffff'
                }}>
                  {/* Header Section - Compact */}
                  <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontSize: '36px' }}>🌍</div>
                      <h1 style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        fontFamily: 'Orbitron, system-ui, sans-serif'
                      }}>
                        TERRACAPSULE
                      </h1>
                    </div>
                    <p style={{
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: '300',
                      letterSpacing: '0.5px',
                      margin: 0
                    }}>
                      Explore • Discover • Travel
                    </p>
                  </div>

                  {/* Main Content Grid - 3 Columns */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '20px',
                    flex: 1,
                    marginBottom: '15px'
                  }}>
                    {/* Column 1 - Mission */}
                    <div>
                      <h2 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#22d3ee',
                        marginBottom: '10px'
                      }}>
                        🚀 Our Mission
                      </h2>
                      <p style={{
                        fontSize: '13px',
                        lineHeight: '1.5',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '15px'
                      }}>
                        TerraCapsule is revolutionizing how people explore our beautiful planet. We combine cutting-edge 3D technology with comprehensive travel information to create immersive experiences.
                      </p>
                      
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#22d3ee',
                        marginBottom: '8px'
                      }}>
                        📊 By the Numbers
                      </h3>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '8px',
                        fontSize: '11px',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '10px',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#22d3ee' }}>195</div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Countries</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>1000+</div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Events</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#8b5cf6' }}>500+</div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Places</div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - Features */}
                    <div>
                      <h2 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#22d3ee',
                        marginBottom: '10px'
                      }}>
                        ✨ What Makes Us Special
                      </h2>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {[
                          { icon: '🌐', title: 'Interactive 3D Globe', desc: 'Navigate our beautifully rendered 3D Earth with smooth interactions and realistic lighting' },
                          { icon: '📊', title: 'Real-Time Data', desc: 'Access up-to-date information about countries, populations, and travel insights' },
                          { icon: '🗺️', title: 'Travel Planning', desc: 'Plan your journeys with intelligent recommendations and cultural insights' },
                          { icon: '🎨', title: 'Beautiful Design', desc: 'Immerse yourself in a thoughtfully crafted interface that makes exploration intuitive' }
                        ].map((feature, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                          }}>
                            <span style={{ fontSize: '16px', marginTop: '2px' }}>{feature.icon}</span>
                            <div>
                              <div style={{ 
                                fontSize: '12px', 
                                fontWeight: '600', 
                                color: '#22d3ee',
                                marginBottom: '3px'
                              }}>
                                {feature.title}
                              </div>
                              <div style={{ 
                                fontSize: '10px', 
                                color: 'rgba(255, 255, 255, 0.8)',
                                lineHeight: '1.3'
                              }}>
                                {feature.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3 - Community & Social */}
                    <div>
                      <h2 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#22d3ee',
                        marginBottom: '10px'
                      }}>
                        🤝 Connect With Us
                      </h2>
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ 
                          fontSize: '13px', 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          marginBottom: '10px',
                          lineHeight: '1.4'
                        }}>
                          Join thousands of travelers who trust TerraCapsule for their journey planning and exploration.
                        </p>
                        <div style={{ display: 'grid', gap: '6px' }}>
                          <a
                            href="https://github.com/Devyansh99/terracapsule"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: '12px',
                              fontWeight: '500',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                          >
                            📦 GitHub Repository
                          </a>
                          <a
                            href="https://twitter.com/terracapsule"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: '12px',
                              fontWeight: '500',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                          >
                            🐦 Follow us on Twitter
                          </a>
                        </div>
                      </div>

                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#22d3ee',
                        marginBottom: '8px'
                      }}>
                        🌟 Why Choose Us?
                      </h3>
                      <div style={{ 
                        background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(59, 130, 246, 0.1))',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid rgba(34, 211, 238, 0.2)'
                      }}>
                        <ul style={{ 
                          margin: 0, 
                          paddingLeft: '15px',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: '1.4'
                        }}>
                          <li>Industry-standard security</li>
                          <li>Real-time data updates</li>
                          <li>AI-powered recommendations</li>
                          <li>Community-driven insights</li>
                          <li>Responsive on all devices</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions - Call to Action */}
                  <div style={{ 
                    textAlign: 'center', 
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{ 
                      color: '#22d3ee', 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      margin: '0 0 8px 0'
                    }}>
                      Ready to Explore?
                    </h3>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      marginBottom: '12px',
                      fontSize: '13px',
                      margin: '0 0 12px 0'
                    }}>
                      Start your journey with TerraCapsule today
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: '12px'
                    }}>
                      <button
                        onClick={() => {
                          setShowAboutModal(false);
                          setShowGetStartedModal(true);
                        }}
                        style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 211, 238, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Get Started
                      </button>
                      <button
                        onClick={() => setShowAboutModal(false)}
                        style={{
                          padding: '10px 20px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        Continue Exploring
                      </button>
                    </div>
                  </div>

                  {/* Mission Section */}
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#22d3ee',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}>
                      Our Mission
                    </h2>
                    <p style={{
                      fontSize: '18px',
                      lineHeight: '1.7',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textAlign: 'center',
                      maxWidth: '700px',
                      margin: '0 auto'
                    }}>
                      TerraCapsule is revolutionizing how people explore our beautiful planet. 
                      We combine cutting-edge 3D technology with comprehensive travel information 
                      to create immersive experiences that inspire wanderlust and facilitate 
                      meaningful travel discoveries.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '30px',
                    marginBottom: '40px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌐</div>
                      <h3 style={{ fontSize: '20px', color: '#22d3ee', marginBottom: '10px' }}>Interactive 3D Globe</h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                        Explore countries in stunning 3D with real-time interactions and detailed information.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
                      <h3 style={{ fontSize: '20px', color: '#3b82f6', marginBottom: '10px' }}>Smart Discovery</h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                        Find events, attractions, and hidden gems with our intelligent recommendation system.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌟</div>
                      <h3 style={{ fontSize: '20px', color: '#8b5cf6', marginBottom: '10px' }}>Travel Intelligence</h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                        Get real-time weather, cultural tips, and travel insights for every destination.
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '24px', color: '#22d3ee', marginBottom: '20px' }}>
                      Ready to Explore?
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '25px' }}>
                      Join thousands of travelers who have discovered their next adventure with TerraCapsule.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setShowAboutModal(false);
                          setShowGetStartedModal(true);
                        }}
                        style={{
                          padding: '12px 30px',
                          background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(34, 211, 238, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Get Started
                      </button>
                      <button
                        onClick={() => {
                          setShowAboutModal(false);
                        }}
                        style={{
                          padding: '12px 30px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        Continue Exploring
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 1: Simple Modal Test - Just show something when button is clicked */}
        {showSignInModal && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)'
              }}
              onClick={() => setShowSignInModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl h-[85vh]"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 58, 138, 0.96))',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 80px rgba(34, 211, 238, 0.1)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Animated Background Pattern */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.1,
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 90%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)
                  `,
                  pointerEvents: 'none'
                }} />

                {/* Floating Particles - Sign In */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`signin-${i}`}
                      initial={{ 
                        opacity: 0, 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%' 
                      }}
                      animate={{ 
                        opacity: [0, 0.6, 0],
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 3
                      }}
                      style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        background: `rgba(${i % 3 === 0 ? '34, 211, 238' : i % 3 === 1 ? '59, 130, 246' : '139, 92, 246'}, 0.8)`,
                        borderRadius: '50%',
                        boxShadow: `0 0 10px rgba(${i % 3 === 0 ? '34, 211, 238' : i % 3 === 1 ? '59, 130, 246' : '139, 92, 246'}, 0.5)`
                      }}
                    />
                  ))}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowSignInModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ✕
                </button>

                {/* Main Content Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  height: '100%',
                  width: '100%'
                }}>
                  {/* Left Side - Branding & Info */}
                  <div style={{
                    padding: '40px 30px',
                    background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(59, 130, 246, 0.1))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden'
                  }}>
                    {/* Logo & Title */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        <div style={{ fontSize: '36px' }}>🌍</div>
                        <h1 style={{
                          fontSize: '36px',
                          fontWeight: '900',
                          background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          margin: 0,
                          fontFamily: 'Orbitron, system-ui, sans-serif'
                        }}>
                          TERRACAPSULE
                        </h1>
                      </div>
                      <p style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '300',
                        letterSpacing: '0.5px',
                        margin: 0
                      }}>
                        Welcome Back, Explorer
                      </p>
                    </div>

                    {/* Features List */}
                    <div style={{ marginBottom: '40px' }}>
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#22d3ee',
                        marginBottom: '24px',
                        textAlign: 'center'
                      }}>
                        Continue Your Journey
                      </h3>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {[
                          { icon: '🗺️', title: 'Saved Explorations', desc: 'Access your bookmarked destinations and travel plans' },
                          { icon: '📊', title: 'Personalized Insights', desc: 'Get customized recommendations based on your interests' },
                          { icon: '🎯', title: 'Travel Goals', desc: 'Track your progress and plan future adventures' },
                          { icon: '🤝', title: 'Community Access', desc: 'Connect with fellow travelers and share experiences' }
                        ].map((feature, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                            <div>
                              <div style={{ 
                                fontSize: '16px', 
                                fontWeight: '600', 
                                color: '#22d3ee',
                                marginBottom: '4px'
                              }}>
                                {feature.title}
                              </div>
                              <div style={{ 
                                fontSize: '14px', 
                                color: 'rgba(255, 255, 255, 0.7)',
                                lineHeight: '1.4'
                              }}>
                                {feature.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '16px',
                      textAlign: 'center',
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#22d3ee' }}>195</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Countries</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#3b82f6' }}>10K+</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Travelers</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#8b5cf6' }}>1M+</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Journeys</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Sign In Form */}
                  <div style={{
                    padding: '40px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <div style={{ maxWidth: '380px', margin: '0 auto', width: '100%' }}>
                      <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px',
                        textAlign: 'center'
                      }}>
                        Sign In
                      </h2>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        fontSize: '14px',
                        textAlign: 'center',
                        marginBottom: '30px'
                      }}>
                        Access your TerraCapsule account
                      </p>

                      {/* Error Display */}
                      {error && (
                        <div style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          marginBottom: '24px',
                          color: '#fca5a5',
                          fontSize: '14px',
                          textAlign: 'center'
                        }}>
                          {error}
                        </div>
                      )}

                      {/* Sign In Form */}
                      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Email Field */}
                        <div>
                          <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                            style={{
                              width: '100%',
                              padding: '16px 20px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '12px',
                              color: 'white',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.border = '1px solid #22d3ee';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 211, 238, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </div>

                        {/* Password Field */}
                        <div>
                          <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>
                            Password
                          </label>
                          <input
                            type="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                            style={{
                              width: '100%',
                              padding: '16px 20px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '12px',
                              color: 'white',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.border = '1px solid #22d3ee';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 211, 238, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}>
                            <input
                              type="checkbox"
                              style={{
                                accentColor: '#22d3ee',
                                borderRadius: '4px',
                                width: '16px',
                                height: '16px'
                              }}
                            />
                            Remember me
                          </label>
                          <button
                            type="button"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#22d3ee',
                              fontSize: '14px',
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}
                          >
                            Forgot password?
                          </button>
                        </div>

                        {/* Sign In Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '16px',
                            background: loading ? 'rgba(34, 211, 238, 0.5)' : 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 211, 238, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                        {/* Divider */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          margin: '24px 0'
                        }}>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>or</span>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
                        </div>

                        {/* Social Sign In */}
                        <button
                          type="button"
                          style={{
                            width: '100%',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          }}
                        >
                          🌐 Continue with Google
                        </button>
                      </form>

                      {/* Sign Up Link */}
                      <div className="mt-8 text-center">
                        <p className="text-white/70 text-base">
                          Don't have an account?{' '}
                          <button
                            onClick={() => {
                              setShowSignInModal(false);
                              setShowGetStartedModal(true);
                              setError(null);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300 underline underline-offset-4 decoration-cyan-400/50 hover:decoration-cyan-300/80 bg-transparent border-0 cursor-pointer"
                          >
                            Get Started
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Get Started Modal - Fixed Position, Immediate Display */}
        <AnimatePresence>
          {showGetStartedModal && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.4 }}
              onClick={() => setShowGetStartedModal(false)}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl h-[85vh] overflow-y-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 30, 0.8))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Animated Background Pattern */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.1,
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 90%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)
                  `,
                  pointerEvents: 'none'
                }} />

                {/* Floating Particles - Get Started */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={`signup-${i}`}
                      initial={{ 
                        opacity: 0, 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%' 
                      }}
                      animate={{ 
                        opacity: [0, 0.7, 0],
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        scale: [0, 1.2, 0]
                      }}
                      transition={{
                        duration: 10 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 4
                      }}
                      style={{
                        position: 'absolute',
                        width: '3px',
                        height: '3px',
                        background: `rgba(${i % 3 === 0 ? '34, 211, 238' : i % 3 === 1 ? '59, 130, 246' : '139, 92, 246'}, 0.9)`,
                        borderRadius: '50%',
                        boxShadow: `0 0 12px rgba(${i % 3 === 0 ? '34, 211, 238' : i % 3 === 1 ? '59, 130, 246' : '139, 92, 246'}, 0.6)`
                      }}
                    />
                  ))}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowGetStartedModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ✕
                </button>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Left Side - Branding & Benefits */}
                  <div 
                    className="p-8 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 flex flex-col justify-center"
                    style={{
                      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Logo & Title */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{ fontSize: '48px' }}>🌍</div>
                        <h1 style={{
                          fontSize: '48px',
                          fontWeight: '900',
                          background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          margin: 0,
                          fontFamily: 'Orbitron, system-ui, sans-serif'
                        }}>
                          TERRACAPSULE
                        </h1>
                      </div>
                      <p style={{
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '300',
                        letterSpacing: '0.5px',
                        margin: 0
                      }}>
                        Begin Your Adventure
                      </p>
                    </div>

                    {/* Benefits List */}
                    <div style={{ marginBottom: '40px' }}>
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#22d3ee',
                        marginBottom: '24px',
                        textAlign: 'center'
                      }}>
                        What Awaits You
                      </h3>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {[
                          { icon: '🚀', title: 'Instant Access', desc: 'Get immediate access to our full 3D globe and travel database' },
                          { icon: '🎯', title: 'Personalized Experience', desc: 'Customize your journey based on your interests and preferences' },
                          { icon: '💾', title: 'Save & Plan', desc: 'Bookmark destinations and create detailed travel itineraries' },
                          { icon: '🌟', title: 'Exclusive Content', desc: 'Access premium features and insider travel recommendations' },
                          { icon: '📱', title: 'Multi-Device Sync', desc: 'Seamlessly access your account across all your devices' },
                          { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with industry-standard security' }
                        ].map((benefit, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <span style={{ fontSize: '24px' }}>{benefit.icon}</span>
                            <div>
                              <div style={{ 
                                fontSize: '16px', 
                                fontWeight: '600', 
                                color: '#22d3ee',
                                marginBottom: '4px'
                              }}>
                                {benefit.title}
                              </div>
                              <div style={{ 
                                fontSize: '14px', 
                                color: 'rgba(255, 255, 255, 0.7)',
                                lineHeight: '1.4'
                              }}>
                                {benefit.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div style={{ 
                      textAlign: 'center',
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontSize: '14px',
                        marginBottom: '16px'
                      }}>
                        Trusted by travelers worldwide
                      </p>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '16px',
                        textAlign: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: '800', color: '#22d3ee' }}>10K+</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Active Users</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: '800', color: '#3b82f6' }}>195</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Countries</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: '800', color: '#8b5cf6' }}>99.9%</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Uptime</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Registration Form */}
                  <div style={{
                    padding: '40px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                      <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px',
                        textAlign: 'center'
                      }}>
                        Create Account
                      </h2>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        fontSize: '14px',
                        textAlign: 'center',
                        marginBottom: '30px'
                      }}>
                        Join thousands of explorers worldwide
                      </p>

                      {/* Error Display */}
                      {error && (
                        <div style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          marginBottom: '24px',
                          color: '#fca5a5',
                          fontSize: '14px',
                          textAlign: 'center'
                        }}>
                          {error}
                        </div>
                      )}

                      {/* Registration Form */}
                      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Name Field */}
                        <div>
                          <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={registerForm.name}
                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                            placeholder="Enter your full name"
                            required
                            style={{
                              width: '100%',
                              padding: '16px 20px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '12px',
                              color: 'white',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.border = '1px solid #22d3ee';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 211, 238, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </div>

                        {/* Email Field */}
                        <div>
                          <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                            style={{
                              width: '100%',
                              padding: '16px 20px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '12px',
                              color: 'white',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.border = '1px solid #22d3ee';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 211, 238, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </div>

                        {/* Password Fields Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{
                              display: 'block',
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '14px',
                              fontWeight: '600',
                              marginBottom: '8px'
                            }}>
                              Password
                            </label>
                            <input
                              type="password"
                              value={registerForm.password}
                              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                              placeholder="Create password"
                              required
                              style={{
                                width: '100%',
                                padding: '16px 20px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.border = '1px solid #22d3ee';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 211, 238, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            />
                          </div>
                          <div>
                            <label style={{
                              display: 'block',
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '14px',
                              fontWeight: '600',
                              marginBottom: '8px'
                            }}>
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={registerForm.confirmPassword}
                              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                              placeholder="Confirm password"
                              required
                              style={{
                                width: '100%',
                                padding: '16px 20px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.border = '1px solid #22d3ee';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 211, 238, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            />
                          </div>
                        </div>

                        {/* Terms & Privacy */}
                        <div style={{ margin: '16px 0' }}>
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '12px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            lineHeight: '1.5'
                          }}>
                            <input
                              type="checkbox"
                              required
                              style={{
                                accentColor: '#22d3ee',
                                borderRadius: '4px',
                                width: '16px',
                                height: '16px',
                                marginTop: '2px'
                              }}
                            />
                            <span>
                              I agree to the{' '}
                              <span style={{ color: '#22d3ee', textDecoration: 'underline' }}>Terms of Service</span>
                              {' '}and{' '}
                              <span style={{ color: '#22d3ee', textDecoration: 'underline' }}>Privacy Policy</span>
                            </span>
                          </label>
                        </div>

                        {/* Create Account Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '16px',
                            background: loading ? 'rgba(34, 211, 238, 0.5)' : 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 211, 238, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        {/* Divider */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          margin: '24px 0'
                        }}>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>or</span>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
                        </div>

                        {/* Social Sign Up */}
                        <button
                          type="button"
                          style={{
                            width: '100%',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          }}
                        >
                          🌐 Continue with Google
                        </button>
                      </form>

                      {/* Sign In Link */}
                      <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
                          Already have an account?{' '}
                          <button
                            onClick={() => {
                              setShowGetStartedModal(false);
                              setShowSignInModal(true);
                              setError(null);
                            }}
                            style={{
                              color: '#22d3ee',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              fontSize: '16px',
                              fontWeight: '600'
                            }}
                          >
                            Sign In
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
