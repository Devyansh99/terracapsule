// API Service for fetching 3D models, destinations, and events data

import { Location, Event, ThreeDModel, APIResponse, WeatherData, FlightData } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.terracapsule.com';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

class APIService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Destinations API
  async getDestinations(params?: {
    limit?: number;
    page?: number;
    category?: string;
    country?: string;
    search?: string;
  }): Promise<APIResponse<Location[]>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.country) searchParams.set('country', params.country);
    if (params?.search) searchParams.set('search', params.search);

    return this.request<Location[]>(`/destinations?${searchParams}`);
  }

  async getDestinationById(id: string): Promise<APIResponse<Location>> {
    return this.request<Location>(`/destinations/${id}`);
  }

  // Events API
  async getEvents(params?: {
    limit?: number;
    page?: number;
    category?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    featured?: boolean;
  }): Promise<APIResponse<Event[]>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.location) searchParams.set('location', params.location);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.featured) searchParams.set('featured', params.featured.toString());

    return this.request<Event[]>(`/events?${searchParams}`);
  }

  async getEventById(id: string): Promise<APIResponse<Event>> {
    return this.request<Event>(`/events/${id}`);
  }

  // 3D Models API
  async get3DModels(params?: {
    type?: string;
    location?: string;
    limit?: number;
  }): Promise<APIResponse<ThreeDModel[]>> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.location) searchParams.set('location', params.location);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    return this.request<ThreeDModel[]>(`/3d-models?${searchParams}`);
  }

  async get3DModelById(id: string): Promise<APIResponse<ThreeDModel>> {
    return this.request<ThreeDModel>(`/3d-models/${id}`);
  }

  // Weather API Integration
  async getWeatherData(coordinates: { lat: number; lng: number }): Promise<APIResponse<WeatherData>> {
    return this.request<WeatherData>(`/weather?lat=${coordinates.lat}&lng=${coordinates.lng}`);
  }

  // Flight Data API
  async getFlightData(params: {
    from: string;
    to: string;
    departDate: string;
    returnDate?: string;
    passengers?: number;
  }): Promise<APIResponse<FlightData[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, value.toString());
      }
    });

    return this.request<FlightData[]>(`/flights?${searchParams}`);
  }

  // Search across all content
  async globalSearch(query: string, filters?: {
    types?: Array<'destinations' | 'events' | 'models'>;
    location?: string;
    dateRange?: { from: string; to: string };
  }): Promise<APIResponse<{
    destinations: Location[];
    events: Event[];
    models: ThreeDModel[];
  }>> {
    const searchParams = new URLSearchParams({ q: query });
    
    if (filters?.types) {
      searchParams.set('types', filters.types.join(','));
    }
    if (filters?.location) {
      searchParams.set('location', filters.location);
    }
    if (filters?.dateRange) {
      searchParams.set('dateFrom', filters.dateRange.from);
      searchParams.set('dateTo', filters.dateRange.to);
    }

    return this.request(`/search?${searchParams}`);
  }
}

// Create singleton instance
export const apiService = new APIService();

// Export individual API functions for convenience
export const {
  getDestinations,
  getDestinationById,
  getEvents,
  getEventById,
  get3DModels,
  get3DModelById,
  getWeatherData,
  getFlightData,
  globalSearch,
} = apiService;
