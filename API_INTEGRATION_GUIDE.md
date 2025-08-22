# TerraCapsule API Integration Guide

## Overview
This guide explains how to enhance your TerraCapsule travel platform with 3D models, real-time data APIs, and advanced interactive features.

## 🚀 Quick Start

### 1. Install Required Dependencies

```bash
# Install Three.js ecosystem for 3D models
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing

# Install additional APIs and utilities
npm install axios swr date-fns

# Install development dependencies
npm install -D @types/three
```

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.terracapsule.com
NEXT_PUBLIC_API_KEY=your_api_key_here

# Third-party API Keys
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_FLIGHTS_API_KEY=your_amadeus_api_key
NEXT_PUBLIC_MAPS_API_KEY=your_google_maps_api_key

# 3D Models CDN
NEXT_PUBLIC_MODELS_CDN_URL=https://models.terracapsule.com
```

## 📁 New Files Structure

```
src/
├── types/
│   ├── api.ts              ✅ Created (API interfaces)
│   └── three.d.ts          📝 Create (Three.js types)
├── services/
│   ├── api.ts              ✅ Created (API service layer)
│   ├── weather.ts          📝 Create (Weather API)
│   ├── flights.ts          📝 Create (Flight API)
│   └── models.ts           📝 Create (3D model loader)
├── components/
│   ├── EnhancedGlobe3D.tsx ✅ Created (Advanced globe)
│   ├── WeatherWidget.tsx   📝 Create (Weather display)
│   ├── FlightTracker.tsx   📝 Create (Flight visualization)
│   └── ModelViewer.tsx     📝 Create (3D model viewer)
├── hooks/
│   ├── useLocations.ts     📝 Create (Location data hook)
│   ├── useWeather.ts       📝 Create (Weather data hook)
│   └── use3DModels.ts      📝 Create (3D model loading)
├── utils/
│   ├── coordinates.ts      📝 Create (Lat/lng utilities)
│   ├── animations.ts       📝 Create (3D animations)
│   └── api-helpers.ts      📝 Create (API utilities)
└── public/
    ├── textures/           📝 Create directory
    │   ├── earth-day.jpg   📝 Add (Earth texture)
    │   ├── earth-night.jpg 📝 Add (Night texture)
    │   └── earth-clouds.jpg📝 Add (Cloud texture)
    └── models/             📝 Create directory
        ├── landmarks/      📝 Add (3D landmarks)
        ├── vehicles/       📝 Add (Planes, ships)
        └── terrain/        📝 Add (Terrain models)
```

## 🔌 API Integrations

### 1. **Weather API (OpenWeatherMap)**
```typescript
// Example implementation in src/services/weather.ts
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeather(lat: number, lng: number) {
  const response = await fetch(
    `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
  );
  return response.json();
}
```

### 2. **Flight Data API (Amadeus)**
```typescript
// Example implementation in src/services/flights.ts
const FLIGHTS_API_KEY = process.env.NEXT_PUBLIC_FLIGHTS_API_KEY;
const AMADEUS_BASE_URL = 'https://api.amadeus.com/v1';

export async function getFlightOffers(origin: string, destination: string) {
  // Implementation for flight search
}
```

### 3. **3D Models API (Custom or Sketchfab)**
```typescript
// Example implementation in src/services/models.ts
export async function load3DModel(modelId: string) {
  const modelUrl = `${process.env.NEXT_PUBLIC_MODELS_CDN_URL}/${modelId}.glb`;
  // Use Three.js GLTFLoader to load the model
}
```

## 🌍 Globe Enhancement Features

### Current Implementation:
- ✅ Canvas-based interactive globe with mouse controls
- ✅ Country hover tooltips
- ✅ Location markers with different types
- ✅ Rotation animation

### Enhanced 3D Features to Add:
- 🔄 **Real 3D Earth model** with textures (day/night/clouds)
- 🔄 **Dynamic weather visualization** (clouds, precipitation)
- 🔄 **Flight path animations** showing real-time flights
- 🔄 **3D landmark models** for famous destinations
- 🔄 **Satellite view toggle** with different map styles
- 🔄 **Time-based lighting** (day/night cycle)
- 🔄 **Atmospheric effects** (aurora, city lights at night)

## 📱 Implementation Steps

### Phase 1: Core 3D Setup
1. ✅ Install Three.js dependencies
2. ✅ Create enhanced Globe3D component
3. 🔄 Add Earth textures and materials
4. 🔄 Implement smooth camera controls

### Phase 2: Data Integration
1. 🔄 Connect to weather APIs
2. 🔄 Integrate flight tracking data
3. 🔄 Load 3D landmark models
4. 🔄 Real-time event updates

### Phase 3: Interactive Features
1. 🔄 Click-to-travel animations
2. 🔄 Weather overlays on globe
3. 🔄 Flight path visualizations
4. 🔄 Time-based visual changes

### Phase 4: Performance Optimization
1. 🔄 Model LOD (Level of Detail)
2. 🔄 Texture compression
3. 🔄 Efficient API caching
4. 🔄 Progressive loading

## 🎯 Next Actions Required

### Immediate (This Session):
1. **Install Three.js packages** - Run the npm install command above
2. **Add environment variables** - Create `.env.local` with API keys
3. **Add Earth textures** - Download and add texture images to `/public/textures/`
4. **Test enhanced globe** - Replace current Globe3D with EnhancedGlobe3D

### Short Term (Next Development Phase):
1. **Weather integration** - Create weather service and widget
2. **Flight tracking** - Add real-time flight data visualization
3. **3D landmarks** - Load and display famous landmark 3D models
4. **Performance optimization** - Implement efficient rendering

### Long Term (Future Enhancements):
1. **AR/VR support** - Add immersive experiences
2. **AI recommendations** - Smart travel suggestions based on data
3. **Social features** - User-generated content and sharing
4. **Mobile optimization** - Touch-optimized 3D interactions

## 💡 Development Tips

1. **Start Simple**: Begin with basic Three.js globe, then add features incrementally
2. **Mock Data First**: Use fallback data during development, add real APIs later
3. **Performance**: Use React.memo, useMemo for expensive 3D operations
4. **Error Handling**: Always provide fallbacks for API failures
5. **Progressive Enhancement**: Ensure 2D fallback for devices without WebGL

## 🛠 Troubleshooting

### Common Issues:
- **WebGL not supported**: Provide Canvas 2D fallback
- **Large model files**: Implement progressive loading
- **API rate limits**: Add caching and request throttling
- **Mobile performance**: Use lower quality models on mobile

Would you like me to proceed with any specific implementation step?
