'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountryInfo, formatPopulation, formatArea, getPrimaryLanguage, getPrimaryCurrency } from '../utils/countryAPI';

// API Keys
const GEONAMES_USERNAME = 'devyansh_agarwal';
const EVENTBRITE_TOKEN = 'RZWIX4RA7XXXZDQ7IN';

// Quick weather fetch function
async function fetchQuickWeather(country: string) {
  try {
    const geoRes = await fetch(`http://api.geonames.org/searchJSON?q=${country}&maxRows=1&username=${GEONAMES_USERNAME}`);
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    const city = geoData.geonames?.[0];
    if (!city) return null;
    
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`);
    if (!weatherRes.ok) return null;
    const weatherData = await weatherRes.json();
    return weatherData.current_weather || null;
  } catch (error) {
    return null;
  }
}

// Quick events preview fetch
async function fetchEventsPreview(country: string) {
  try {
    const res = await fetch(`https://www.eventbriteapi.com/v3/events/search/?location.address=${country}&token=${EVENTBRITE_TOKEN}&page_size=2`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events || []).slice(0, 2);
  } catch (error) {
    return [];
  }
}

interface CountryTooltipProps {
  countryInfo: CountryInfo | null;
  position: { x: number; y: number };
  visible: boolean;
}

export default function CountryTooltip({ countryInfo, position, visible }: CountryTooltipProps) {
  const [weather, setWeather] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Load additional data when tooltip becomes visible
  useEffect(() => {
    if (!visible || !countryInfo) {
      setWeather(null);
      setEvents([]);
      return;
    }

    setLoadingData(true);
    Promise.all([
      fetchQuickWeather(countryInfo.name.common),
      fetchEventsPreview(countryInfo.name.common)
    ]).then(([weatherData, eventsData]) => {
      setWeather(weatherData);
      setEvents(eventsData);
      setLoadingData(false);
    }).catch(() => {
      setLoadingData(false);
    });
  }, [visible, countryInfo?.name.common]);

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

              {/* Weather Section */}
              {weather && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(0, 212, 255, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 212, 255, 0.15)'
                  }}
                >
                  <div className="tooltip-row">
                    <span className="tooltip-label" style={{ fontWeight: 500, color: '#03dac6', marginRight: 8 }}>🌤️ Current Weather</span>
                    <span className="tooltip-value" style={{ fontWeight: 400, color: '#eafcff' }}>
                      {weather.temperature}°C
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Events Preview */}
              {events.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(3, 218, 198, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 218, 198, 0.15)'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#03dac6', marginBottom: '0.5rem' }}>
                    🎉 Upcoming Events ({events.length})
                  </div>
                  {events.map((event, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: '#eafcff', marginBottom: idx < events.length - 1 ? '0.3rem' : 0 }}>
                      {event.name?.text?.substring(0, 40)}...
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Loading indicator for additional data */}
              {loadingData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'rgba(0, 212, 255, 0.7)'
                  }}
                >
                  Loading weather & events...
                </motion.div>
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
