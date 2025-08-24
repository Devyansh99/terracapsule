'use client';

import React, { useEffect, useRef, useState } from 'react';
import CountryTooltip from './CountryTooltip';
import { getCountryInfo, CountryInfo } from '../utils/countryAPI';

interface CesiumGlobeContentProps {
  onCountryHover?: (country: string | null) => void;
}

export default function CesiumGlobeContent({ onCountryHover }: CesiumGlobeContentProps) {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let viewer: any = null;
    let rotationAnimationFrame: number | undefined;
    let rotationThrottle: NodeJS.Timeout | undefined;
    let hoverThrottle: NodeJS.Timeout | undefined;

    const initializeCesium = async () => {
      try {
        // Dynamically import Cesium
        console.log('Starting Cesium initialization...');
        const Cesium = await import('cesium');
        console.log('Cesium imported successfully');
        
        // Set up Cesium Ion access token from environment variable
        const accessToken = process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN;
        console.log('Access token available:', !!accessToken);
        Cesium.Ion.defaultAccessToken = accessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2ZhNS02OGI5LTRhNGEtYTFlYi01NzNkN2I3MGJhNGYiLCJpZCI6MjM0MzIsImlhdCI6MTY5MTEwMzg5MX0.uKqtB8tjmLZAu4seTjdAFD2YUa_xS3hqZpUSuKn_5ss';

        if (!cesiumContainer.current) {
          console.error('Cesium container not found');
          return;
        }

        console.log('Creating Cesium viewer...');

        // Create the Cesium viewer with improved settings
        viewer = new Cesium.Viewer(cesiumContainer.current, {
          // Disable UI controls for cleaner look
          animation: false,
          timeline: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          infoBox: false,
          selectionIndicator: false,
          vrButton: false,
          creditContainer: document.createElement('div'), // Hide credits
          
          // Scene options for better performance
          scene3DOnly: true,
          requestRenderMode: true, // Only render when needed - MAJOR performance improvement
          maximumRenderTimeChange: Infinity,
        });

        viewerRef.current = viewer;
        console.log('Cesium viewer created successfully');

        // Hide the Cesium logo/credits
        if (viewer.cesiumWidget.creditContainer) {
          (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none';
        }

        // Enhanced visual settings for beautiful Earth
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.dynamicAtmosphereLighting = false; // Disable for performance
        viewer.scene.globe.showGroundAtmosphere = true;
        viewer.scene.skyBox.show = false; // Remove stars for cleaner look
        viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
        viewer.scene.canvas.style.background = 'transparent';
        
        // Performance optimizations
        viewer.scene.fog.enabled = false;
        viewer.scene.highDynamicRange = false;
        
        // Enhanced camera controls
        viewer.scene.screenSpaceCameraController.enableRotate = true;
        viewer.scene.screenSpaceCameraController.enableTranslate = true;
        viewer.scene.screenSpaceCameraController.enableZoom = true;
        viewer.scene.screenSpaceCameraController.enableTilt = true;
        viewer.scene.screenSpaceCameraController.enableLook = true;

        // Set initial camera position for stunning Earth view
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(0, 15, 25000000), // Nice global view
          orientation: {
            heading: 0,
            pitch: -Cesium.Math.PI_OVER_TWO * 0.8, // Slightly tilted
            roll: 0
          }
        });

        // Add very subtle auto-rotation (much slower and performance-optimized)
        let isUserInteracting = false;
        let rotationAnimationFrame: number;
        
        const rotateCamera = () => {
          if (!isUserInteracting && viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.0002); // Even slower rotation
            viewer.scene.requestRender(); // Request render only when rotating
          }
          rotationAnimationFrame = requestAnimationFrame(rotateCamera);
        };
        
        // Start rotation with throttling
        rotationThrottle = setTimeout(() => {}, 0); // Initialize
        const throttledRotation = () => {
          clearTimeout(rotationThrottle);
          rotationThrottle = setTimeout(rotateCamera, 50); // Throttle to 20fps for rotation
        };
        
        throttledRotation();

        // Interaction detection for pausing rotation
        let interactionTimeout: NodeJS.Timeout;
        
        const startInteraction = () => {
          isUserInteracting = true;
          clearTimeout(interactionTimeout);
          cancelAnimationFrame(rotationAnimationFrame);
          viewer.scene.requestRender(); // Request render on interaction
        };

        const endInteraction = () => {
          clearTimeout(interactionTimeout);
          interactionTimeout = setTimeout(() => {
            isUserInteracting = false;
            throttledRotation(); // Resume throttled rotation
          }, 2000); // Resume rotation 2 seconds after user stops
        };

        // Add interaction event listeners
        viewer.scene.canvas.addEventListener('mousedown', startInteraction);
        viewer.scene.canvas.addEventListener('wheel', startInteraction);
        viewer.scene.canvas.addEventListener('touchstart', startInteraction);
        viewer.scene.canvas.addEventListener('mouseup', endInteraction);
        viewer.scene.canvas.addEventListener('touchend', endInteraction);

        // Country markers and pins (reduced for performance)
        const countryData = [
          { name: 'United States', lat: 39.8283, lng: -98.5795 },
          { name: 'China', lat: 35.8617, lng: 104.1954 },
          { name: 'Brazil', lat: -14.2350, lng: -51.9253 },
          { name: 'Russia', lat: 61.5240, lng: 105.3188 },
          { name: 'India', lat: 20.5937, lng: 78.9629 },
          { name: 'Australia', lat: -25.2744, lng: 133.7751 },
          { name: 'Japan', lat: 36.2048, lng: 138.2529 },
          { name: 'United Kingdom', lat: 55.3781, lng: -3.4360 },
          { name: 'France', lat: 46.2276, lng: 2.2137 },
          { name: 'Germany', lat: 51.1657, lng: 10.4515 }
        ];

        // Add country pins
        countryData.forEach(country => {
          const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(country.lng, country.lat, 300000), // Elevated
            point: {
              pixelSize: 12,
              color: Cesium.Color.CYAN,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
              scaleByDistance: new Cesium.NearFarScalar(1000000, 1.5, 50000000, 0.4),
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
              text: country.name,
              font: '14pt monospace',
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -25),
              scaleByDistance: new Cesium.NearFarScalar(1000000, 1.0, 50000000, 0.2),
              show: false // Initially hidden
            }
          });
          
          // Store country info
          (entity as any).countryInfo = country;
        });

        // Enhanced mouse interaction for country hover and clicks (performance optimized)
        hoverThrottle = setTimeout(() => {}, 0); // Initialize
        
        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(async (movement: any) => {
          clearTimeout(hoverThrottle);
          hoverThrottle = setTimeout(async () => {
            const pickedObject = viewer.scene.pick(movement.endPosition);
            
            // Update tooltip position
            setTooltipPosition({
              x: movement.endPosition.x,
              y: movement.endPosition.y
            });
            
            if (Cesium.defined(pickedObject) && (pickedObject.id as any)?.countryInfo) {
              const country = (pickedObject.id as any).countryInfo.name;
              
              // Show label for hovered country
              pickedObject.id.label.show = true;
              setHoveredCountry(country);
              onCountryHover?.(country);
              
              // Get detailed country information
              try {
                const countryData = await getCountryInfo(getCountryCodeFromName(country));
                if (countryData) {
                  setCountryInfo(countryData);
                  setTooltipVisible(true);
                }
              } catch (error) {
                console.warn('Error fetching country data:', error);
              }
              
              viewer.scene.requestRender();
            } else {
              // Hide all labels when not hovering
              viewer.entities.values.forEach((entity: any) => {
                if (entity.label) {
                  entity.label.show = false;
                }
              });
              setHoveredCountry(null);
              setCountryInfo(null);
              setTooltipVisible(false);
              onCountryHover?.(null);
              viewer.scene.requestRender();
            }
          }, 16); // Throttle to ~60fps
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Click handler for country selection
        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((click: any) => {
          const pickedObject = viewer.scene.pick(click.position);
          
          if (Cesium.defined(pickedObject) && (pickedObject.id as any)?.countryInfo) {
            const country = (pickedObject.id as any).countryInfo.name;
            
            // Fly to country
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                (pickedObject.id as any).countryInfo.lng,
                (pickedObject.id as any).countryInfo.lat,
                8000000 // Zoom level
              ),
              duration: 2.0
            });
            
            setHoveredCountry(country);
            onCountryHover?.(country);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
              setHoveredCountry(null);
              onCountryHover?.(null);
            }, 5000);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        setIsLoaded(true);
        console.log('Cesium initialization complete');

      } catch (err) {
        console.error('Failed to initialize Cesium:', err);
        setError(`Failed to load 3D Earth: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    // Helper function to get country code from country name
    const getCountryCodeFromName = (countryName: string): string => {
      const countryCodeMap: { [key: string]: string } = {
        'United States': 'US',
        'China': 'CN',
        'Brazil': 'BR',
        'Russia': 'RU',
        'India': 'IN',
        'Australia': 'AU',
        'Japan': 'JP',
        'United Kingdom': 'GB',
        'France': 'FR',
        'Germany': 'DE'
      };
      
      return countryCodeMap[countryName] || countryName.substring(0, 2).toUpperCase();
    };

    initializeCesium();

    // Cleanup
    return () => {
      if (rotationAnimationFrame) {
        cancelAnimationFrame(rotationAnimationFrame);
      }
      if (rotationThrottle) {
        clearTimeout(rotationThrottle);
      }
      if (hoverThrottle) {
        clearTimeout(hoverThrottle);
      }
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, [onCountryHover]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg text-white">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold mb-2">3D Globe Loading</h3>
          <p className="text-sm text-gray-300 mb-4">
            Setting up your interactive Earth experience...
          </p>
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <button 
            onClick={() => {
              setError(null);
              setIsLoaded(false);
            }} 
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
          >
            Retry Loading
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Make sure you have an active internet connection
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={cesiumContainer}
        className="w-full h-full"
        style={{ 
          minHeight: '400px',
          pointerEvents: isLoaded ? 'auto' : 'none'
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
          <div className="flex flex-col items-center space-y-4 text-white">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl">🌍</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold mb-1">Loading 3D Earth...</div>
              <div className="text-sm text-gray-300">Initializing CesiumJS Globe</div>
            </div>
            <div className="text-xs text-gray-400 max-w-xs text-center">
              This may take a moment on first load as we download Earth imagery
            </div>
          </div>
        </div>
      )}
      {hoveredCountry && !tooltipVisible && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-md text-sm font-medium border border-gray-600">
          📍 {hoveredCountry}
        </div>
      )}
      <CountryTooltip
        countryInfo={countryInfo}
        position={tooltipPosition}
        visible={tooltipVisible}
      />
    </>
  );
}
