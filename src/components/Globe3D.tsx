"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface Globe3DProps {
  onLocationClick?: (location: string) => void;
}

export default function Globe3D({ onLocationClick }: Globe3DProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // Mock locations data - will be replaced with real API data
  const locations = [
    { name: "Tokyo", x: 60, y: 45, events: 12 },
    { name: "Paris", x: 30, y: 35, events: 8 },
    { name: "New York", x: 15, y: 40, events: 15 },
    { name: "Sydney", x: 75, y: 70, events: 6 },
    { name: "London", x: 28, y: 32, events: 10 },
  ];

  const handleLocationClick = (location: string) => {
    setSelectedLocation(location);
    onLocationClick?.(location);
  };

  return (
    <div className="relative w-full h-full group">
      {/* Globe Container */}
      <motion.div
        className="w-full h-full bg-gradient-to-br from-blue-900/20 via-green-900/20 to-blue-800/20 rounded-full relative overflow-hidden border-4 border-cyan-500/30 shadow-2xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Globe Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          {/* Latitude lines */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`lat-${i}`}
              className="absolute left-0 right-0 border-t border-cyan-400/20"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
          
          {/* Longitude lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`lng-${i}`}
              className="absolute top-0 bottom-0 border-l border-cyan-400/20"
              style={{ left: `${(i + 1) * 8.33}%` }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Continents representation */}
        <div className="absolute inset-0">
          {/* North America */}
          <div className="absolute w-12 h-16 bg-green-600/40 rounded-lg transform -rotate-12" style={{ left: '10%', top: '25%' }} />
          
          {/* Europe */}
          <div className="absolute w-8 h-10 bg-green-500/40 rounded-md" style={{ left: '45%', top: '20%' }} />
          
          {/* Asia */}
          <div className="absolute w-16 h-20 bg-green-600/40 rounded-xl" style={{ left: '55%', top: '15%' }} />
          
          {/* Africa */}
          <div className="absolute w-10 h-18 bg-green-500/40 rounded-lg" style={{ left: '42%', top: '40%' }} />
          
          {/* Australia */}
          <div className="absolute w-6 h-4 bg-green-600/40 rounded-md" style={{ left: '70%', top: '65%' }} />
        </div>

        {/* Location Markers */}
        {locations.map((location, index) => (
          <motion.div
            key={location.name}
            className="absolute cursor-pointer group"
            style={{ 
              left: `${location.x}%`, 
              top: `${location.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleLocationClick(location.name)}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: selectedLocation === location.name ? 1.3 : 1,
            }}
          >
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
            
            {/* Location dot */}
            <div className="relative w-3 h-3 bg-cyan-400 rounded-full border-2 border-white shadow-lg">
              <div className="absolute inset-0 bg-cyan-300 rounded-full animate-ping opacity-75"></div>
            </div>

            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-cyan-400/30 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              <div className="font-semibold">{location.name}</div>
              <div className="text-cyan-400">{location.events} upcoming events</div>
              
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
            </motion.div>
          </motion.div>
        ))}

        {/* Rotating atmosphere glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(6, 182, 212, 0.1) 90deg,
              rgba(6, 182, 212, 0.2) 180deg,
              rgba(6, 182, 212, 0.1) 270deg,
              transparent 360deg
            )`,
          }}
        />

        {/* Central glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Interaction hint */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-sm text-gray-400">Click markers to explore destinations</p>
      </motion.div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-0 right-0 transform translate-x-full ml-4 bg-gray-900/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 text-white min-w-64"
        >
          <h3 className="font-bold text-cyan-400 mb-2">{selectedLocation}</h3>
          <p className="text-sm text-gray-300 mb-3">
            Discover amazing events and experiences in {selectedLocation}.
          </p>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Upcoming Events:</span>
              <span className="text-cyan-400">
                {locations.find(l => l.name === selectedLocation)?.events}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weather:</span>
              <span className="text-green-400">Perfect</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rating:</span>
              <span className="text-yellow-400">★★★★☆</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-md text-white font-semibold hover:shadow-lg transition-all duration-200">
            Explore {selectedLocation}
          </button>

          {/* Close button */}
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 right-2 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white text-sm"
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
}
