'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountryInfo, formatPopulation, formatArea, getPrimaryLanguage, getPrimaryCurrency } from '../utils/countryAPI';

interface CountryTooltipProps {
  countryInfo: CountryInfo | null;
  position: { x: number; y: number };
  visible: boolean;
}

export default function CountryTooltip({ countryInfo, position, visible }: CountryTooltipProps) {
  if (!countryInfo || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="country-tooltip"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: 'fixed',
            left: Math.min(position.x + 15, window.innerWidth - 320),
            top: Math.max(position.y - 10, 10),
            zIndex: 10000,
            pointerEvents: 'none',
          }}
        >
          <div className="tooltip-content">
            {/* Header with Flag and Country Name */}
            <motion.div 
              className="tooltip-header"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(0, 212, 255, 0.2)'
              }}
            >
              <div 
                style={{
                  fontSize: '2rem',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }}
              >
                {countryInfo.flag}
              </div>
              <div>
                <div 
                  className="tooltip-country"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#00D4FF',
                    lineHeight: 1.2
                  }}
                >
                  {countryInfo.name.common}
                </div>
                {countryInfo.name.official !== countryInfo.name.common && (
                  <div 
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontStyle: 'italic'
                    }}
                  >
                    {countryInfo.name.official}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Country Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              {/* Capital */}
              {countryInfo.capital && countryInfo.capital.length > 0 && (
                <div className="tooltip-row">
                  <span className="tooltip-label">
                    🏛️ Capital
                  </span>
                  <span className="tooltip-value">
                    {countryInfo.capital[0]}
                  </span>
                </div>
              )}

              {/* Population */}
              <div className="tooltip-row">
                <span className="tooltip-label">
                  👥 Population
                </span>
                <span className="tooltip-value">
                  {formatPopulation(countryInfo.population)}
                </span>
              </div>

              {/* Area */}
              <div className="tooltip-row">
                <span className="tooltip-label">
                  🗺️ Area
                </span>
                <span className="tooltip-value">
                  {formatArea(countryInfo.area)}
                </span>
              </div>

              {/* Region */}
              <div className="tooltip-row">
                <span className="tooltip-label">
                  🌍 Region
                </span>
                <span className="tooltip-value">
                  {countryInfo.region}
                  {countryInfo.subregion && `, ${countryInfo.subregion}`}
                </span>
              </div>

              {/* Language */}
              <div className="tooltip-row">
                <span className="tooltip-label">
                  💬 Language
                </span>
                <span className="tooltip-value">
                  {getPrimaryLanguage(countryInfo.languages)}
                </span>
              </div>

              {/* Currency */}
              <div className="tooltip-row">
                <span className="tooltip-label">
                  💰 Currency
                </span>
                <span className="tooltip-value">
                  {getPrimaryCurrency(countryInfo.currencies)}
                </span>
              </div>

              {/* Timezone */}
              {countryInfo.timezones && countryInfo.timezones.length > 0 && (
                <div className="tooltip-row">
                  <span className="tooltip-label">
                    🕐 Timezone
                  </span>
                  <span className="tooltip-value">
                    {countryInfo.timezones[0]}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Footer with additional info */}
            {countryInfo.independent !== undefined && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center'
                }}
              >
                {countryInfo.independent ? '🏛️ Independent Nation' : '🏴 Territory/Dependency'}
              </motion.div>
            )}

            {/* Arrow pointing to the country */}
            <div 
              className="tooltip-arrow"
              style={{
                position: 'absolute',
                left: '-6px',
                top: '20px',
                width: '12px',
                height: '12px',
                background: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRight: 'none',
                borderTop: 'none',
                transform: 'rotate(45deg)',
                zIndex: -1
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
