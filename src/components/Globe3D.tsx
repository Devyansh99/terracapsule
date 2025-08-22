"use client";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
  type: 'city' | 'landmark' | 'nature';
}

interface Globe3DProps {
  onLocationClick?: (location: Location) => void;
}

// Sample locations data
const locations: Location[] = [
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, description: "Vibrant metropolis blending tradition and innovation", type: "city" },
  { name: "Paris, France", lat: 48.8566, lng: 2.3522, description: "City of lights and romance", type: "city" },
  { name: "New York, USA", lat: 40.7128, lng: -74.0060, description: "The city that never sleeps", type: "city" },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093, description: "Harbor city with iconic opera house", type: "city" },
  { name: "Machu Picchu, Peru", lat: -13.1631, lng: -72.5450, description: "Ancient Incan citadel in the Andes", type: "landmark" },
  { name: "Santorini, Greece", lat: 36.3932, lng: 25.4615, description: "Beautiful Greek island with white buildings", type: "nature" },
  { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, description: "Modern oasis in the desert", type: "city" },
  { name: "Bali, Indonesia", lat: -8.3405, lng: 115.0920, description: "Tropical paradise with rich culture", type: "nature" },
  { name: "Iceland", lat: 64.9631, lng: -19.0208, description: "Land of fire and ice", type: "nature" },
  { name: "Rome, Italy", lat: 41.9028, lng: 12.4964, description: "Eternal city with ancient wonders", type: "city" }
];

export default function Globe3D({ onLocationClick }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const size = Math.min(400, window.innerWidth * 0.8);
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Animation loop
    let animationId: number;
    const animate = () => {
      if (!isDragging) {
        setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
      }
      drawGlobe();
      animationId = requestAnimationFrame(animate);
    };

    const drawGlobe = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw globe background
      const gradient = ctx.createRadialGradient(centerX - 50, centerY - 50, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
      gradient.addColorStop(0.3, 'rgba(3, 218, 198, 0.6)');
      gradient.addColorStop(0.7, 'rgba(0, 188, 212, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 150, 167, 0.9)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;

      // Longitude lines
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + (rotation.y * Math.PI) / 180;
        const x1 = centerX + Math.cos(angle) * radius * 0.3;
        const y1 = centerY;
        const x2 = centerX + Math.cos(angle) * radius * 0.7;
        const y2 = centerY;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.abs(Math.cos(angle)) * radius, radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Latitude lines
      for (let i = 1; i < 6; i++) {
        const y = centerY + ((i - 2.5) * radius) / 3;
        const ellipseRadius = Math.sqrt(Math.max(0, radius * radius - Math.pow(y - centerY, 2)));
        
        if (ellipseRadius > 0) {
          ctx.beginPath();
          ctx.ellipse(centerX, y, ellipseRadius, ellipseRadius * 0.3, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw location markers
      locations.forEach(location => {
        const point = projectToSphere(location.lat, location.lng, centerX, centerY, radius, rotation);
        if (point.visible) {
          // Marker circle
          ctx.beginPath();
          ctx.arc(point.x, point.y, hoveredLocation === location ? 8 : 5, 0, Math.PI * 2);
          
          // Different colors for different types
          const colors = {
            city: '#00d4ff',
            landmark: '#ff6b6b',
            nature: '#4ecdc4'
          };
          
          ctx.fillStyle = colors[location.type];
          ctx.shadowColor = colors[location.type];
          ctx.shadowBlur = hoveredLocation === location ? 15 : 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Pulse effect for hovered location
          if (hoveredLocation === location) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
            ctx.strokeStyle = colors[location.type];
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Add subtle glow effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    const projectToSphere = (lat: number, lng: number, centerX: number, centerY: number, radius: number, rotation: { x: number, y: number }) => {
      const phi = (lat * Math.PI) / 180;
      const theta = ((lng + rotation.y) * Math.PI) / 180;
      
      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.sin(theta);
      
      // Simple orthographic projection
      const screenX = centerX + x;
      const screenY = centerY - y;
      const visible = z > -radius * 0.5; // Back face culling
      
      return { x: screenX, y: screenY, visible };
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePos({ x: e.clientX, y: e.clientY });

      if (isDragging) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;
        setRotation(prev => ({
          x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
          y: prev.y + deltaX * 0.5
        }));
        setDragStart({ x, y });
        return;
      }

      // Check for location hover
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

      let found = false;
      for (const location of locations) {
        const point = projectToSphere(location.lat, location.lng, centerX, centerY, radius, rotation);
        if (point.visible) {
          const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
          if (distance <= 15) {
            setHoveredLocation(location);
            canvas.style.cursor = 'pointer';
            found = true;
            break;
          }
        }
      }

      if (!found) {
        setHoveredLocation(null);
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setIsDragging(true);
      setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      canvas.style.cursor = hoveredLocation ? 'pointer' : 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      if (hoveredLocation && onLocationClick) {
        onLocationClick(hoveredLocation);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [rotation, isDragging, dragStart, hoveredLocation, onLocationClick]);

  return (
    <div className="globe-wrapper">
      <canvas
        ref={canvasRef}
        className="interactive-globe"
        style={{ cursor: 'grab' }}
      />
      
      {/* Tooltip for hovered location */}
      {hoveredLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="location-tooltip"
          style={{
            position: 'fixed',
            left: mousePos.x + 15,
            top: mousePos.y - 60,
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <div className="tooltip-content">
            <h3 className="tooltip-title">{hoveredLocation.name}</h3>
            <p className="tooltip-description">{hoveredLocation.description}</p>
            <span className={`tooltip-type type-${hoveredLocation.type}`}>
              {hoveredLocation.type}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
