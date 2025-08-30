'use client';

import React from 'react';

const SimpleAnimatedLogo: React.FC = () => {
  return (
    <>
      <div 
        className="terracapsule-logo"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
          gap: '12px'
        }}
      >
        <div className="logo-globe">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="url(#globeGradient)" stroke="url(#globeBorder)" strokeWidth="1"/>
            <path d="M16 2C16 2 10 8 10 16C10 24 16 30 16 30" stroke="#ffffff" strokeWidth="1.5" opacity="0.7"/>
            <path d="M16 2C16 2 22 8 22 16C22 24 16 30 16 30" stroke="#ffffff" strokeWidth="1.5" opacity="0.7"/>
            <path d="M4 16C4 16 8 12 16 12C24 12 28 16 28 16" stroke="#ffffff" strokeWidth="1.5" opacity="0.7"/>
            <path d="M6 22C6 22 10 20 16 20C22 20 26 22 26 22" stroke="#ffffff" strokeWidth="1.5" opacity="0.5"/>
            <path d="M6 10C6 10 10 12 16 12C22 12 26 10 26 10" stroke="#ffffff" strokeWidth="1.5" opacity="0.5"/>
            <defs>
              <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              <linearGradient id="globeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="logo-text">
          TerraCapsule
        </div>
      </div>
      <style jsx>{`
        .terracapsule-logo {
          cursor: pointer;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
        }
        
        .logo-globe {
          animation: globeRotate 6s ease-in-out infinite;
          transform-origin: center;
          filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.4));
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo-globe svg {
          width: 2em;
          height: 2em;
        }
        
        .logo-text {
          font-size: 1.2em;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #1e40af 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          text-shadow: none;
          position: relative;
        }
        
        .logo-text::before {
          content: 'TerraCapsule';
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #1e40af 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: blur(0px);
          z-index: 1;
        }
        
        @keyframes globeRotate {
          0% { 
            transform: rotateY(0deg) scale(1);
          }
          25% { 
            transform: rotateY(90deg) scale(1.05);
          }
          50% { 
            transform: rotateY(180deg) scale(1);
          }
          75% { 
            transform: rotateY(270deg) scale(1.05);
          }
          100% { 
            transform: rotateY(360deg) scale(1);
          }
        }
        
        .terracapsule-logo:hover .logo-globe {
          animation-duration: 2s;
          filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.6));
        }
        
        .terracapsule-logo:hover .logo-globe svg {
          transform: scale(1.1);
        }
        
        .terracapsule-logo:hover .logo-text {
          transform: scale(1.02);
        }
        
        @media (max-width: 768px) {
          .logo-text {
            font-size: 1em;
          }
          .logo-globe svg {
            width: 1.5em;
            height: 1.5em;
          }
          .terracapsule-logo {
            gap: 8px;
          }
        }
        
        /* Fallback for browsers that don't support background-clip */
        @supports not (-webkit-background-clip: text) {
          .logo-text {
            color: #22d3ee;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </>
  );
};

export default SimpleAnimatedLogo;
