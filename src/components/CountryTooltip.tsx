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

  // Robust positioning logic to keep tooltip fully visible
  const tooltipWidth = 350;
  const tooltipHeight = 300; // Approximate height
  const margin = 16;
  const navHeight = 80;

  let x = position.x + 24; // Default offset from cursor
  let y = position.y + 16; // Default below cursor

  // If tooltip goes off right edge, show to left of cursor
  if (x + tooltipWidth > window.innerWidth - margin) {
    x = position.x - tooltipWidth - 24;
  }
  // If tooltip goes off left edge, clamp to margin
  if (x < margin) {
    x = margin;
  }
  // If tooltip goes off bottom edge, show above cursor
  if (y + tooltipHeight > window.innerHeight - margin) {
    y = position.y - tooltipHeight - 24;
  }
  // If tooltip goes off top edge or overlaps nav, clamp below nav
  if (y < navHeight + margin) {
    y = navHeight + margin;
  }

  const tooltipPos = { x, y };

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
            left: tooltipPos.x,
            top: tooltipPos.y,
            zIndex: 10000,
            pointerEvents: 'none',
            maxWidth: tooltipWidth,
            width: 'auto',
          }}
        >
          <div className="tooltip-content" style={{
            background: 'linear-gradient(120deg, rgba(20, 30, 48, 0.92) 60%, rgba(0, 212, 255, 0.10) 100%)',
            backdropFilter: 'blur(32px) saturate(1.2)',
            border: '1.5px solid rgba(0, 212, 255, 0.22)',
            borderRadius: '22px',
            padding: '1.5rem 1.25rem 1.25rem 1.5rem',
            minWidth: '320px',
            maxWidth: '370px',
            boxShadow: '0 8px 32px 0 rgba(0, 212, 255, 0.18), 0 2px 24px 0 rgba(0,0,0,0.45)',
            position: 'relative',
            overflow: 'hidden',
            color: '#eafcff',
            fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
            letterSpacing: '0.01em',
            fontSize: '1rem',
            transition: 'box-shadow 0.2s',
          }}>
            {/* Subtle glow effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)'
            }} />
            
            {/* Header with Flag and Country Name */}
            <motion.div 
              className="tooltip-header"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.1rem',
                marginBottom: '1.1rem',
                paddingBottom: '0.85rem',
                borderBottom: '1.5px solid rgba(0, 212, 255, 0.13)',
                background: 'linear-gradient(90deg, rgba(0,212,255,0.04) 0%, rgba(0,212,255,0.01) 100%)',
                boxShadow: '0 2px 12px rgba(0,212,255,0.04)',
              }}
            >
              <div 
                style={{
                  fontSize: '2.3rem',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 2px 8px rgba(0, 212, 255, 0.18))',
                  marginRight: '0.2rem',
                  textShadow: '0 0 8px rgba(0,212,255,0.12)',
                }}
              >
                {countryInfo.flag}
              </div>
              <div>
                <div 
                  className="tooltip-country"
                  style={{
                    fontSize: '1.18rem',
                    fontWeight: 700,
                    color: '#00d4ff',
                    lineHeight: 1.22,
                    letterSpacing: '0.02em',
                    textShadow: '0 0 8px rgba(0,212,255,0.13)',
                  }}
                >
                  {countryInfo.name.common}
                </div>
                {countryInfo.name.official !== countryInfo.name.common && (
                  <div 
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.55)',
                      fontStyle: 'italic',
                      marginTop: '0.1rem',
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
              style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.2rem' }}
            >
              {/* Capital */}
              {countryInfo.capital && countryInfo.capital.length > 0 && (
                <div className="tooltip-row">
                  <span className="tooltip-label" style={{ fontWeight: 500, color: '#00d4ff', marginRight: 8 }}>🏛️ Capital</span>
                  <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>{countryInfo.capital[0]}</span>
                </div>
              )}

              {/* Population */}
              <div className="tooltip-row">
                <span className="tooltip-label" style={{ fontWeight: 500, color: '#00d4ff', marginRight: 8 }}>👥 Population</span>
                <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>{formatPopulation(countryInfo.population)}</span>
              </div>

              {/* Area */}
              <div className="tooltip-row">
                <span className="tooltip-label" style={{ fontWeight: 500, color: '#00d4ff', marginRight: 8 }}>🗺️ Area</span>
                <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>{formatArea(countryInfo.area)}</span>
              </div>

              {/* Region */}
              <div className="tooltip-row">
                <span className="tooltip-label" style={{ fontWeight: 500, color: '#00d4ff', marginRight: 8 }}>🌍 Region</span>
                <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>{countryInfo.region}{countryInfo.subregion && `, ${countryInfo.subregion}`}</span>
              </div>

              {/* Language */}
              <div className="tooltip-row">
                <span className="tooltip-label" style={{ fontWeight: 500, color: '#00d4ff', marginRight: 8 }}>💬 Language</span>
                <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>{getPrimaryLanguage(countryInfo.languages)}</span>
              </div>

              {/* Currency */}
              <div className="tooltip-row">
                <span className="tooltip-label" style={{ fontWeight: 500, color: '#00d4ff', marginRight: 8 }}>💰 Currency</span>
                <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>{getPrimaryCurrency(countryInfo.currencies)}</span>
              </div>

              {/* Timezone */}
              {countryInfo.timezones && countryInfo.timezones.length > 0 && (
                <div className="tooltip-row">
                  <span className="tooltip-label" style={{ fontWeight: 500, color: '#00d4ff', marginRight: 8 }}>🕐 Timezone</span>
                  <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>{countryInfo.timezones[0]}</span>
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
                  marginTop: '0.85rem',
                  paddingTop: '0.85rem',
                  borderTop: '1.5px solid rgba(0,212,255,0.09)',
                  fontSize: '0.82rem',
                  color: 'rgba(0,212,255,0.7)',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                  fontWeight: 500,
                  textShadow: '0 0 8px rgba(0,212,255,0.10)',
                }}
              >
                {countryInfo.independent ? '🏛️ Independent Nation' : '🏴 Territory/Dependency'}
              </motion.div>
            )}

            {/* Arrow pointing to the country - position based on tooltip placement */}
            <div 
              className="tooltip-arrow"
              style={{
                position: 'absolute',
                left: x > position.x ? '-7px' : 'calc(100% - 7px)',
                top: '32px',
                width: '14px',
                height: '14px',
                background: 'rgba(0, 212, 255, 0.18)',
                border: '2px solid rgba(0, 212, 255, 0.22)',
                borderRight: x > position.x ? 'none' : '2px solid rgba(0, 212, 255, 0.22)',
                borderTop: x > position.x ? 'none' : '2px solid rgba(0, 212, 255, 0.22)',
                borderLeft: x > position.x ? '2px solid rgba(0, 212, 255, 0.22)' : 'none',
                borderBottom: x > position.x ? '2px solid rgba(0, 212, 255, 0.22)' : 'none',
                transform: x > position.x ? 'rotate(45deg)' : 'rotate(-135deg)',
                zIndex: -1,
                boxShadow: '0 0 12px 2px rgba(0,212,255,0.13)',
                transition: 'left 0.2s, box-shadow 0.2s',
                animation: 'arrowPulse 1.2s infinite',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
