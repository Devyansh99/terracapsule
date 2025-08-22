// API Types and Interfaces for 3D Models and Data

export interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'destination' | 'event' | 'landmark' | 'attraction';
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  popularityScore: number;
  climate: {
    season: string;
    temperature: string;
    weather: string;
  };
  activities: string[];
  events: Event[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  category: 'festival' | 'concert' | 'sports' | 'cultural' | 'adventure';
  price: {
    min: number;
    max: number;
    currency: string;
  };
  attendees: {
    current: number;
    capacity: number;
  };
  images: string[];
  organizer: string;
  featured: boolean;
}

export interface ThreeDModel {
  id: string;
  name: string;
  modelUrl: string; // .glb or .gltf file URL
  textureUrl?: string;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  animations?: string[];
  type: 'landmark' | 'terrain' | 'building' | 'vehicle';
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Weather API Integration
export interface WeatherData {
  location: string;
  coordinates: { lat: number; lng: number };
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitationChance: number;
  }>;
}

// Flight Data API
export interface FlightData {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    coordinates: { lat: number; lng: number };
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    coordinates: { lat: number; lng: number };
  };
  price: number;
  currency: string;
  duration: string;
  stops: number;
}
