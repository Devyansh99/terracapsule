"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CountryData {
  name: string;
  lat: number;
  lng: number;
  population?: string;
  capital?: string;
  flag?: string;
}

const GoogleEarthGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const animationFrame = useRef<number | undefined>(undefined);
  const autoRotationRef = useRef(0);

  // Enhanced country data with more detailed information
  const countries: CountryData[] = [
    { name: 'United States', lat: 39.8283, lng: -98.5795, population: '331M', capital: 'Washington D.C.', flag: '🇺🇸' },
    { name: 'Brazil', lat: -14.2350, lng: -51.9253, population: '215M', capital: 'Brasília', flag: '🇧🇷' },
    { name: 'China', lat: 35.8617, lng: 104.1954, population: '1.4B', capital: 'Beijing', flag: '🇨🇳' },
    { name: 'Russia', lat: 61.5240, lng: 105.3188, population: '146M', capital: 'Moscow', flag: '🇷🇺' },
    { name: 'Australia', lat: -25.2744, lng: 133.7751, population: '26M', capital: 'Canberra', flag: '🇦🇺' },
    { name: 'India', lat: 20.5937, lng: 78.9629, population: '1.4B', capital: 'New Delhi', flag: '🇮🇳' },
    { name: 'Canada', lat: 56.1304, lng: -106.3468, population: '39M', capital: 'Ottawa', flag: '🇨🇦' },
    { name: 'Argentina', lat: -38.4161, lng: -63.6167, population: '46M', capital: 'Buenos Aires', flag: '🇦🇷' },
    { name: 'Kazakhstan', lat: 48.0196, lng: 66.9237, population: '20M', capital: 'Nur-Sultan', flag: '🇰🇿' },
    { name: 'Algeria', lat: 28.0339, lng: 1.6596, population: '45M', capital: 'Algiers', flag: '🇩🇿' },
    { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, population: '35M', capital: 'Riyadh', flag: '🇸🇦' },
    { name: 'Mexico', lat: 23.6345, lng: -102.5528, population: '130M', capital: 'Mexico City', flag: '🇲🇽' },
    { name: 'Indonesia', lat: -0.7893, lng: 113.9213, population: '274M', capital: 'Jakarta', flag: '🇮🇩' },
    { name: 'Sudan', lat: 12.8628, lng: 30.2176, population: '45M', capital: 'Khartoum', flag: '🇸🇩' },
    { name: 'Libya', lat: 26.3351, lng: 17.2283, population: '7M', capital: 'Tripoli', flag: '🇱🇾' },
    { name: 'Iran', lat: 32.4279, lng: 53.6880, population: '85M', capital: 'Tehran', flag: '🇮🇷' },
    { name: 'Mongolia', lat: 46.8625, lng: 103.8467, population: '3M', capital: 'Ulaanbaatar', flag: '🇲🇳' },
    { name: 'Peru', lat: -9.1900, lng: -75.0152, population: '33M', capital: 'Lima', flag: '🇵🇪' },
    { name: 'Chad', lat: 15.4542, lng: 18.7322, population: '17M', capital: 'N\'Djamena', flag: '🇹🇩' },
    { name: 'Niger', lat: 17.6078, lng: 8.0817, population: '25M', capital: 'Niamey', flag: '🇳🇪' },
    { name: 'Angola', lat: -11.2027, lng: 17.8739, population: '33M', capital: 'Luanda', flag: '🇦🇴' },
    { name: 'Mali', lat: 17.5707, lng: -3.9962, population: '21M', capital: 'Bamako', flag: '🇲🇱' },
    { name: 'South Africa', lat: -30.5595, lng: 22.9375, population: '60M', capital: 'Cape Town', flag: '🇿🇦' },
    { name: 'Colombia', lat: 4.5709, lng: -74.2973, population: '51M', capital: 'Bogotá', flag: '🇨🇴' },
    { name: 'Ethiopia', lat: 9.1450, lng: 40.4897, population: '118M', capital: 'Addis Ababa', flag: '🇪🇹' },
    { name: 'Bolivia', lat: -16.2902, lng: -63.5887, population: '12M', capital: 'Sucre', flag: '🇧🇴' },
    { name: 'Mauritania', lat: 21.0079, lng: -10.9408, population: '5M', capital: 'Nouakchott', flag: '🇲🇷' },
    { name: 'Egypt', lat: 26.8206, lng: 30.8025, population: '104M', capital: 'Cairo', flag: '🇪🇬' },
    { name: 'Tanzania', lat: -6.3690, lng: 34.8888, population: '62M', capital: 'Dodoma', flag: '🇹🇿' },
    { name: 'Nigeria', lat: 9.0820, lng: 8.6753, population: '218M', capital: 'Abuja', flag: '🇳🇬' }
  ];

  // Convert lat/lng to 3D coordinates
  const latLngTo3D = useCallback((lat: number, lng: number, radius: number = 200) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }, []);

  // Project 3D point to 2D screen coordinates
  const project3DTo2D = useCallback((point3D: { x: number; y: number; z: number }, rotX: number, rotY: number) => {
    // Apply rotation
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // Rotate around Y axis
    let x = point3D.x * cosY - point3D.z * sinY;
    let z = point3D.x * sinY + point3D.z * cosY;
    let y = point3D.y;

    // Rotate around X axis
    let finalY = y * cosX - z * sinX;
    let finalZ = y * sinX + z * cosX;

    // Perspective projection
    const distance = 800;
    const scale = distance / (distance + finalZ);
    
    return {
      x: x * scale,
      y: finalY * scale,
      visible: finalZ > -200 // Only show points that are facing forward
    };
  }, []);

  // Draw realistic Earth with satellite imagery-like appearance
  const drawEarth = useCallback((ctx: CanvasRenderingContext2D, rotX: number, rotY: number) => {
    const centerX = 250;
    const centerY = 250;
    const radius = 200;

    // Clear canvas
    ctx.clearRect(0, 0, 500, 500);

    // Draw space background with stars
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, 500, 500);
    
    // Add stars
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 500;
      const y = Math.random() * 500;
      const brightness = Math.random() * 0.8 + 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Earth's shadow/atmosphere glow
    const atmosphereGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.3);
    atmosphereGradient.addColorStop(0, 'rgba(135, 206, 250, 0)');
    atmosphereGradient.addColorStop(0.7, 'rgba(135, 206, 250, 0.1)');
    atmosphereGradient.addColorStop(1, 'rgba(135, 206, 250, 0.3)');
    ctx.fillStyle = atmosphereGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Main Earth sphere - Ocean base
    const oceanGradient = ctx.createRadialGradient(
      centerX - 50, centerY - 50, 0,
      centerX, centerY, radius
    );
    oceanGradient.addColorStop(0, '#4A90E2');
    oceanGradient.addColorStop(0.3, '#2E5BBA');
    oceanGradient.addColorStop(0.7, '#1E3A8A');
    oceanGradient.addColorStop(1, '#0F1729');

    ctx.fillStyle = oceanGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw landmasses using curved paths for a more realistic look
    ctx.fillStyle = '#22543D'; // Forest green base
    
    // North America
    ctx.beginPath();
    const na = project3DTo2D(latLngTo3D(45, -100, radius - 5), rotX, rotY);
    if (na.visible) {
      ctx.arc(centerX + na.x, centerY + na.y, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // South America
    ctx.fillStyle = '#2D5016';
    ctx.beginPath();
    const sa = project3DTo2D(latLngTo3D(-15, -60, radius - 5), rotX, rotY);
    if (sa.visible) {
      ctx.ellipse(centerX + sa.x, centerY + sa.y, 15, 30, Math.PI * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Europe
    ctx.fillStyle = '#1A4B2E';
    ctx.beginPath();
    const eu = project3DTo2D(latLngTo3D(54, 15, radius - 5), rotX, rotY);
    if (eu.visible) {
      ctx.arc(centerX + eu.x, centerY + eu.y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Africa
    ctx.fillStyle = '#3B7F51';
    ctx.beginPath();
    const af = project3DTo2D(latLngTo3D(0, 20, radius - 5), rotX, rotY);
    if (af.visible) {
      ctx.ellipse(centerX + af.x, centerY + af.y, 20, 35, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Asia
    ctx.fillStyle = '#2A5F37';
    ctx.beginPath();
    const as = project3DTo2D(latLngTo3D(35, 105, radius - 5), rotX, rotY);
    if (as.visible) {
      ctx.ellipse(centerX + as.x, centerY + as.y, 30, 25, -Math.PI * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Australia
    ctx.fillStyle = '#1F5A2E';
    ctx.beginPath();
    const au = project3DTo2D(latLngTo3D(-27, 133, radius - 5), rotX, rotY);
    if (au.visible) {
      ctx.ellipse(centerX + au.x, centerY + au.y, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add ice caps
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // North pole
    const np = project3DTo2D(latLngTo3D(85, 0, radius - 3), rotX, rotY);
    if (np.visible) {
      ctx.beginPath();
      ctx.arc(centerX + np.x, centerY + np.y, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // South pole
    const sp = project3DTo2D(latLngTo3D(-85, 0, radius - 3), rotX, rotY);
    if (sp.visible) {
      ctx.beginPath();
      ctx.arc(centerX + sp.x, centerY + sp.y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add cloud layer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 15; i++) {
      const cloudLat = (Math.random() - 0.5) * 160; // -80 to 80
      const cloudLng = (Math.random() - 0.5) * 360; // -180 to 180
      const cloud = project3DTo2D(latLngTo3D(cloudLat, cloudLng, radius + 3), rotX, rotY);
      
      if (cloud.visible) {
        ctx.beginPath();
        ctx.arc(centerX + cloud.x, centerY + cloud.y, Math.random() * 8 + 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw country markers
    countries.forEach((country) => {
      const pos3D = latLngTo3D(country.lat, country.lng, radius + 8);
      const pos2D = project3DTo2D(pos3D, rotX, rotY);
      
      if (pos2D.visible) {
        const screenX = centerX + pos2D.x;
        const screenY = centerY + pos2D.y;

        // Country marker dot
        ctx.fillStyle = hoveredCountry?.name === country.name ? '#FF6B6B' : '#00D4FF';
        ctx.beginPath();
        ctx.arc(screenX, screenY, hoveredCountry?.name === country.name ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing effect for hovered country
        if (hoveredCountry?.name === country.name) {
          ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Store position for hover detection
        (country as any).screenX = screenX;
        (country as any).screenY = screenY;
      } else {
        (country as any).screenX = undefined;
        (country as any).screenY = undefined;
      }
    });

    // Earth highlight/shine effect
    const shineGradient = ctx.createRadialGradient(
      centerX - 60, centerY - 60, 0,
      centerX - 30, centerY - 30, radius * 0.7
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = shineGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

  }, [countries, hoveredCountry, latLngTo3D, project3DTo2D]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Auto rotation when not dragging
    if (!isDragging) {
      autoRotationRef.current += 0.003; // Slow rotation like Google Earth
      setRotation(prev => ({
        x: prev.x,
        y: autoRotationRef.current
      }));
    }

    drawEarth(ctx, rotation.x, rotation.y);
    animationFrame.current = requestAnimationFrame(animate);
  }, [rotation, isDragging, drawEarth]);

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [animate]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    autoRotationRef.current = rotation.y; // Sync auto rotation
  }, [rotation.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setRotation(prev => ({
        x: Math.max(-Math.PI/3, Math.min(Math.PI/3, prev.x - deltaY * 0.01)),
        y: prev.y + deltaX * 0.01
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
      autoRotationRef.current = rotation.y + deltaX * 0.01; // Update auto rotation reference
    } else {
      // Check for country hover
      let hoveredCountryFound: CountryData | null = null;
      
      for (const country of countries) {
        const screenX = (country as any).screenX;
        const screenY = (country as any).screenY;
        
        if (screenX !== undefined && screenY !== undefined) {
          const distance = Math.sqrt(Math.pow(x - screenX, 2) + Math.pow(y - screenY, 2));
          if (distance < 15) { // Hover radius
            hoveredCountryFound = country;
            break;
          }
        }
      }
      
      setHoveredCountry(hoveredCountryFound);
    }
  }, [isDragging, lastMousePos, countries, rotation.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setHoveredCountry(null);
  }, []);

  return (
    <motion.div 
      className="google-earth-container"
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="earth-viewer">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
        
        {/* Earth Controls */}
        <motion.div 
          className="earth-controls"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div 
            className="control-hint"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🖱️ Click and drag to rotate • Hover over dots for info
          </motion.div>
        </motion.div>

        {/* Country Tooltip */}
        {hoveredCountry && (
          <motion.div
            className="country-tooltip"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              left: mousePos.x + 15,
              top: mousePos.y - 10,
            }}
          >
            <div className="tooltip-flag">{hoveredCountry.flag}</div>
            <div className="tooltip-content">
              <h3 className="tooltip-country">{hoveredCountry.name}</h3>
              <div className="tooltip-details">
                <div className="tooltip-row">
                  <span className="tooltip-label">Capital:</span>
                  <span className="tooltip-value">{hoveredCountry.capital}</span>
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Population:</span>
                  <span className="tooltip-value">{hoveredCountry.population}</span>
                </div>
              </div>
            </div>
            <div className="tooltip-arrow"></div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GoogleEarthGlobe;
