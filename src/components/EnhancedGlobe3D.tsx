// Enhanced Globe3D component with Three.js integration for real 3D models

'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { apiService } from '../services/api';
import { Location, ThreeDModel } from '../types/api';

// Earth component with realistic textures
function Earth({ locations }: { locations: Location[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/textures/earth-day.jpg', (texture) => {
      setEarthTexture(texture);
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Convert lat/lng to 3D coordinates on sphere
  const latLngTo3D = (lat: number, lng: number, radius: number = 2) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta),
    };
  };

  return (
    <group>
      {/* Earth Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Location Markers */}
      {locations.map((location) => {
        const pos = latLngTo3D(location.coordinates.lat, location.coordinates.lng, 2.05);
        return (
          <group key={location.id} position={[pos.x, pos.y, pos.z]}>
            {/* Marker */}
            <mesh
              onPointerOver={() => setHovered(location.id)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial 
                color={location.type === 'event' ? '#ff6b6b' : '#4ecdc4'}
                emissive={hovered === location.id ? '#ffffff' : '#000000'}
                emissiveIntensity={hovered === location.id ? 0.2 : 0}
              />
            </mesh>

            {/* Tooltip */}
            {hovered === location.id && (
              <Html distanceFactor={10}>
                <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm max-w-48">
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-gray-300">{location.country}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {location.events.length} events • ★ {location.rating}
                  </p>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Animated atmosphere effect
function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.1, 64, 64]} />
      <meshBasicMaterial 
        color="#4a90e2"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Camera controller for smooth interactions
function CameraController() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new THREE.OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    return () => controls.dispose();
  }, [camera, gl]);

  return null;
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
    </div>
  );
}

// Main Enhanced Globe3D component
export default function EnhancedGlobe3D() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGlobeData();
  }, []);

  const loadGlobeData = async () => {
    try {
      setLoading(true);
      
      // Fetch destinations and events
      const [destinationsResponse, eventsResponse] = await Promise.all([
        apiService.getDestinations({ limit: 50 }),
        apiService.getEvents({ limit: 100, featured: true })
      ]);

      if (destinationsResponse.success) {
        setLocations(destinationsResponse.data);
      } else {
        // Fallback to mock data if API fails
        setLocations(getMockLocations());
      }

      setError(null);
    } catch (err) {
      console.error('Error loading globe data:', err);
      setError('Failed to load globe data');
      // Use mock data as fallback
      setLocations(getMockLocations());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development/fallback
  const getMockLocations = (): Location[] => [
    {
      id: '1',
      name: 'Tokyo',
      country: 'Japan',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      type: 'destination',
      description: 'Vibrant metropolis',
      images: [],
      rating: 4.8,
      reviewCount: 15420,
      popularityScore: 95,
      climate: { season: 'Spring', temperature: '20°C', weather: 'Mild' },
      activities: ['Sightseeing', 'Food Tours', 'Shopping'],
      events: []
    },
    {
      id: '2', 
      name: 'Paris',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      type: 'destination',
      description: 'City of lights',
      images: [],
      rating: 4.7,
      reviewCount: 23100,
      popularityScore: 92,
      climate: { season: 'Spring', temperature: '15°C', weather: 'Pleasant' },
      activities: ['Museums', 'Architecture', 'Cuisine'],
      events: []
    },
    // Add more mock locations...
  ];

  if (loading) {
    return (
      <div className="relative w-96 h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-96 h-96 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p>Error loading globe</p>
          <button 
            onClick={loadGlobeData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 h-96 relative">
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 45 
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Stars 
            radius={300} 
            depth={60} 
            count={20000} 
            factor={7} 
            saturation={0} 
            fade 
          />
          <Earth locations={locations} />
          <Atmosphere />
        </Suspense>
        
        <CameraController />
      </Canvas>

      {/* Globe Controls */}
      <div className="absolute bottom-4 left-4 space-x-2">
        <button 
          className="px-3 py-1 bg-black/70 text-white text-xs rounded hover:bg-black/90"
          onClick={loadGlobeData}
        >
          Refresh Data
        </button>
        <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
          {locations.length} locations
        </span>
      </div>
    </div>
  );
}
