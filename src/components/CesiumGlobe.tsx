'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface CesiumGlobeProps {
  className?: string;
  onCountryHover?: (country: string | null) => void;
}

// Dynamically import CesiumGlobeContent to avoid SSR issues
const CesiumGlobeContent = dynamic(() => import('./CesiumGlobeContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
        <div className="text-white text-sm font-medium">Loading 3D Earth...</div>
      </div>
    </div>
  )
});

export default function CesiumGlobe({ className = '', onCountryHover }: CesiumGlobeProps) {
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        minHeight: '500px', 
        height: '100vh',
        width: '100%',
        background: 'transparent'
      }}
    >
      <CesiumGlobeContent onCountryHover={onCountryHover} />
    </div>
  );
}
