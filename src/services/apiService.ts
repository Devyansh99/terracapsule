// Basic API Service for TerraCapsule
// We'll expand this modularly

export interface BasicEventData {
  id: string;
  name: string;
  start: string;
  location: string;
  url: string;
}

export interface BasicPlaceData {
  id: string;
  name: string;
  country: string;
  lat: string;
  lng: string;
  population?: number;
}

export interface BasicWeatherData {
  temperature: number;
  description: string;
  location: string;
}

class SimpleAPIService {
  // Mock data for now - we'll connect real APIs modularly
  getMockEvents(): BasicEventData[] {
    return [
      {
        id: '1',
        name: 'Global Tech Conference 2024',
        start: '2024-12-01',
        location: 'New York, USA',
        url: '#'
      },
      {
        id: '2', 
        name: 'World Climate Summit',
        start: '2024-12-15',
        location: 'Paris, France',
        url: '#'
      }
    ];
  }

  getMockDestinations(): BasicPlaceData[] {
    return [
      {
        id: '1',
        name: 'Tokyo',
        country: 'Japan', 
        lat: '35.6762',
        lng: '139.6503',
        population: 14000000
      },
      {
        id: '2',
        name: 'Paris',
        country: 'France',
        lat: '48.8566',
        lng: '2.3522',
        population: 2100000
      }
    ];
  }

  getMockWeather(): BasicWeatherData[] {
    return [
      {
        temperature: 22,
        description: 'Sunny',
        location: 'New York'
      },
      {
        temperature: 18,
        description: 'Partly Cloudy', 
        location: 'London'
      }
    ];
  }

  // Statistics
  getStats() {
    return {
      events: 1250,
      destinations: 850,
      countries: 195,
      weatherLocations: 12
    };
  }
}

export const apiService = new SimpleAPIService();
