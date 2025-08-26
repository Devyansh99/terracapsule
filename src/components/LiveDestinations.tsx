'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';

export default function LiveDestinations() {
  const [destinations, setDestinations] = useState(apiService.getMockDestinations());
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section id="destinations" className="py-20 bg-gradient-to-br from-slate-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Popular <span className="text-green-400">Destinations</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover amazing places around the world with real-time data
          </p>

          {/* Live Status */}
          <motion.div
            className="flex justify-center items-center space-x-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Live Data</span>
            </div>
            <div className="text-green-400 font-bold">
              {destinations.length} Destinations
            </div>
          </motion.div>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-green-400/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              {/* Destination Card */}
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                      <span>📍</span>
                      <span>{destination.name}</span>
                    </h3>
                    <p className="text-gray-400 text-sm">{destination.country}</p>
                  </div>
                  
                  {/* Live Indicator */}
                  <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Live</span>
                  </div>
                </div>

                {/* Mock Image Placeholder */}
                <div className="w-full h-40 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl opacity-50">🏙️</div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center space-x-1">
                      <span>👥</span>
                      <span>Population</span>
                    </span>
                    <span className="text-white font-medium">
                      {destination.population ? `${(destination.population / 1000000).toFixed(1)}M` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center space-x-1">
                      <span>🌐</span>
                      <span>Coordinates</span>
                    </span>
                    <span className="text-white font-medium text-xs">
                      {parseFloat(destination.lat).toFixed(2)}, {parseFloat(destination.lng).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Destination
                </motion.button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-green-500/5 transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20 hover:border-green-400/50 flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <span>🔄</span>
            <span>{isLoading ? 'Loading...' : 'Load More Destinations'}</span>
          </motion.button>
          
          <p className="text-gray-400 text-sm mt-4">
            More destinations will be available with live API integration
          </p>
        </motion.div>
      </div>
    </section>
  );
}
