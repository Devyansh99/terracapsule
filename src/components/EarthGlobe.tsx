"use client";
import { useEffect, useRef, useState } from "react";

interface Country {
  name: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  { name: "United States", lat: 39.8283, lng: -98.5795 },
  { name: "United Kingdom", lat: 55.3781, lng: -3.4360 },
  { name: "France", lat: 46.2276, lng: 2.2137 },
  { name: "Germany", lat: 51.1657, lng: 10.4515 },
  { name: "Japan", lat: 36.2048, lng: 138.2529 },
  { name: "Australia", lat: -25.2744, lng: 133.7751 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253 },
  { name: "India", lat: 20.5937, lng: 78.9629 },
  { name: "China", lat: 35.8617, lng: 104.1954 },
  { name: "Canada", lat: 56.1304, lng: -106.3468 },
  { name: "Russia", lat: 61.5240, lng: 105.3188 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375 },
  { name: "Egypt", lat: 26.0975, lng: 30.0444 },
  { name: "Mexico", lat: 23.6345, lng: -102.5528 },
  { name: "Argentina", lat: -38.4161, lng: -63.6167 },
  { name: "Italy", lat: 41.8719, lng: 12.5674 },
  { name: "Spain", lat: 40.4637, lng: -3.7492 },
  { name: "Turkey", lat: 38.9637, lng: 35.2433 },
  { name: "Thailand", lat: 15.8700, lng: 100.9925 },
  { name: "South Korea", lat: 35.9078, lng: 127.7669 }
];

export default function EarthGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size - make it bigger for the hero section
    const size = Math.min(window.innerWidth * 0.5, 500);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;

    let autoRotation = 0;

    const drawEarthGlobe = () => {
      ctx.clearRect(0, 0, size, size);

      // Slow auto rotation
      autoRotation += 0.001;

      // Smooth rotation towards mouse target
      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.02;
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.02;

      const totalRotationX = rotationRef.current.x;
      const totalRotationY = rotationRef.current.y + autoRotation;

      // Draw outer glow/atmosphere
      const atmosphereGradient = ctx.createRadialGradient(
        centerX, centerY, radius,
        centerX, centerY, radius + 40
      );
      atmosphereGradient.addColorStop(0, "rgba(135, 206, 250, 0.4)");
      atmosphereGradient.addColorStop(0.7, "rgba(135, 206, 250, 0.2)");
      atmosphereGradient.addColorStop(1, "rgba(135, 206, 250, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 40, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGradient;
      ctx.fill();

      // Draw Earth sphere with realistic gradient
      const earthGradient = ctx.createRadialGradient(
        centerX - radius * 0.3, 
        centerY - radius * 0.3, 
        0,
        centerX, 
        centerY, 
        radius
      );
      earthGradient.addColorStop(0, "#87CEEB"); // Light blue (ocean)
      earthGradient.addColorStop(0.4, "#4682B4"); // Steel blue
      earthGradient.addColorStop(0.8, "#1E3A8A"); // Dark blue
      earthGradient.addColorStop(1, "#0F172A"); // Very dark blue

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = earthGradient;
      ctx.fill();

      // Add subtle shadow for depth
      const shadowGradient = ctx.createRadialGradient(
        centerX + radius * 0.3, 
        centerY + radius * 0.3, 
        0,
        centerX + radius * 0.3, 
        centerY + radius * 0.3, 
        radius * 0.8
      );
      shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
      shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = shadowGradient;
      ctx.fill();

      // Draw continents with more realistic shapes
      drawEarthContinents(ctx, centerX, centerY, radius, totalRotationX, totalRotationY);

      // Draw country markers
      countries.forEach(country => {
        const point = project3DTo2D(
          country.lat, 
          country.lng, 
          centerX, 
          centerY, 
          radius, 
          totalRotationX, 
          totalRotationY
        );

        if (point.visible) {
          // Draw marker with glow
          const isHovered = hoveredCountry === country.name;
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(point.x, point.y, isHovered ? 12 : 8, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? "rgba(255, 107, 107, 0.3)" : "rgba(255, 217, 61, 0.2)";
          ctx.fill();

          // Inner marker
          ctx.beginPath();
          ctx.arc(point.x, point.y, isHovered ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? "#FF6B6B" : "#FFD93D";
          ctx.fill();

          // White center dot
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(drawEarthGlobe);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x: e.clientX, y: e.clientY });

      if (!mouseRef.current.isDown) {
        // Convert mouse position to rotation for subtle interaction
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        targetRotationRef.current.x = deltaY * 0.3;
        targetRotationRef.current.y = deltaX * 0.3;
      }

      // Check if hovering over a country
      let hoveredCountryName = null;
      const totalRotationX = rotationRef.current.x;
      const totalRotationY = rotationRef.current.y + autoRotation;

      countries.forEach(country => {
        const point = project3DTo2D(
          country.lat, 
          country.lng, 
          centerX, 
          centerY, 
          radius, 
          totalRotationX, 
          totalRotationY
        );

        if (point.visible) {
          const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
          if (distance < 20) {
            hoveredCountryName = country.name;
          }
        }
      });

      setHoveredCountry(hoveredCountryName);
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleMouseDrag = (e: MouseEvent) => {
      if (!mouseRef.current.isDown) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const deltaX = x - mouseRef.current.x;
      const deltaY = y - mouseRef.current.y;

      targetRotationRef.current.x += deltaY * 0.01;
      targetRotationRef.current.y += deltaX * 0.01;

      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseDrag);
    canvas.style.cursor = "grab";

    drawEarthGlobe();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseDrag);
    };
  }, [hoveredCountry]);

  return (
    <div className="earth-globe-wrapper">
      <canvas ref={canvasRef} className="earth-canvas" />
      {hoveredCountry && (
        <div 
          className="country-tooltip"
          style={{
            left: mousePos.x + 15,
            top: mousePos.y - 10,
            position: 'fixed',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <div className="tooltip-content">
            {hoveredCountry}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function project3DTo2D(
  lat: number, 
  lng: number, 
  centerX: number, 
  centerY: number, 
  radius: number,
  rotationX: number,
  rotationY: number
) {
  // Convert lat/lng to radians
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // 3D coordinates
  const x3d = Math.cos(latRad) * Math.cos(lngRad + rotationY);
  const y3d = Math.sin(latRad);
  const z3d = Math.cos(latRad) * Math.sin(lngRad + rotationY);

  // Apply X rotation
  const y3dRotated = y3d * Math.cos(rotationX) - z3d * Math.sin(rotationX);
  const z3dRotated = y3d * Math.sin(rotationX) + z3d * Math.cos(rotationX);

  // Project to 2D
  const x2d = centerX + x3d * radius;
  const y2d = centerY - y3dRotated * radius;

  return {
    x: x2d,
    y: y2d,
    visible: z3dRotated > -0.2 // Show points slightly behind the sphere
  };
}

function drawEarthContinents(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  rotationX: number,
  rotationY: number
) {
  // More detailed continent shapes
  const continentShapes = [
    // North America
    { lat: 50, lng: -100, size: 45, shape: 'ellipse' },
    { lat: 60, lng: -105, size: 30, shape: 'ellipse' },
    { lat: 25, lng: -80, size: 25, shape: 'ellipse' },
    { lat: 65, lng: -150, size: 20, shape: 'circle' }, // Alaska
    
    // South America
    { lat: -15, lng: -60, size: 40, shape: 'ellipse' },
    { lat: -30, lng: -65, size: 25, shape: 'ellipse' },
    
    // Europe
    { lat: 55, lng: 10, size: 25, shape: 'ellipse' },
    { lat: 60, lng: 25, size: 20, shape: 'ellipse' },
    
    // Africa
    { lat: 0, lng: 20, size: 50, shape: 'ellipse' },
    { lat: -25, lng: 25, size: 35, shape: 'ellipse' },
    
    // Asia
    { lat: 35, lng: 100, size: 55, shape: 'ellipse' },
    { lat: 60, lng: 90, size: 45, shape: 'ellipse' },
    { lat: 70, lng: 100, size: 30, shape: 'ellipse' },
    
    // Australia
    { lat: -25, lng: 135, size: 22, shape: 'ellipse' },
    
    // Greenland
    { lat: 72, lng: -40, size: 18, shape: 'ellipse' },
    
    // Antarctica (partial)
    { lat: -80, lng: 0, size: 60, shape: 'circle' }
  ];

  ctx.fillStyle = "#228B22"; // Forest green for land
  
  continentShapes.forEach(continent => {
    const point = project3DTo2D(
      continent.lat,
      continent.lng,
      centerX,
      centerY,
      radius,
      rotationX,
      rotationY
    );

    if (point.visible) {
      const adjustedSize = continent.size * 0.4;
      
      ctx.beginPath();
      if (continent.shape === 'ellipse') {
        ctx.ellipse(point.x, point.y, adjustedSize, adjustedSize * 0.7, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(point.x, point.y, adjustedSize, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  });
}
