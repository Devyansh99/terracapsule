'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Country {
  id: string
  code: string
  name: string
  officialName: string
  capital: string
  population: string
  area: number
  region: string
  continent: string
  latitude: number
  longitude: number
  flag: string
  flagImageUrl: string
  timezone: string
  languages: string[]
  currencies: any
  description: string
  highlights: string[]
  bestTimeToVisit: string
  culturalTips: string
  destinations: Destination[]
  events: Event[]
  weatherData: WeatherData[]
}

interface Destination {
  id: string
  name: string
  type: string
  description: string
  latitude: number
  longitude: number
  imageUrl: string
  highlights: string[]
  rating: number
  averageRating: number
  totalReviews: number
  bestTimeToVisit: string
  entryFee: string
  website: string
}

interface Event {
  id: string
  title: string
  description: string
  type: string
  startDate: string
  endDate: string
  location: string
  imageUrl: string
  price: string
}

interface WeatherData {
  temperature: number
  humidity: number
  condition: string
  description: string
}

export default function CountryPage() {
  const params = useParams()
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to get country-specific hero images
  const getCountryHeroImage = (countryName: string) => {
    const countryImages: { [key: string]: string } = {
      'United States': 'https://images.unsplash.com/photo-1564596184263-5b8e8600c0ee?w=1200&h=600&fit=crop', // Grand Canyon
      'China': 'https://images.unsplash.com/photo-1538298867774-6a54d3c0d75d?w=1200&h=600&fit=crop', // Great Wall
      'Brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&h=600&fit=crop', // Christ the Redeemer
      'Russia': 'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=1200&h=600&fit=crop', // Red Square
      'India': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=600&fit=crop', // Taj Mahal
      'Australia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop', // Sydney Opera House
      'Japan': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&h=600&fit=crop', // Mount Fuji
      'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop', // London
      'France': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop', // Eiffel Tower
      'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=600&fit=crop', // Brandenburg Gate
      'Canada': 'https://images.unsplash.com/photo-1503614472-8c93d56cd8d1?w=1200&h=600&fit=crop', // Banff
      'Mexico': 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&h=600&fit=crop', // Chichen Itza
      'Italy': 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=1200&h=600&fit=crop', // Colosseum
      'Spain': 'https://images.unsplash.com/photo-1571843667267-8fc6dd8b74ce?w=1200&h=600&fit=crop', // Sagrada Familia
      'Egypt': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&h=600&fit=crop', // Pyramids
    };
    
    return countryImages[countryName] || `https://images.unsplash.com/1200x600/?${encodeURIComponent(countryName)}+landscape+landmark&w=1200&h=600&fit=crop`;
  };

  useEffect(() => {
    if (params.code) {
      fetchCountryData(params.code as string)
    }
  }, [params.code])

  const fetchCountryData = async (code: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/countries/${code}`)
      const data = await response.json()
      
      if (data.success) {
        setCountry(data.data)
      } else {
        setError(data.error || 'Failed to fetch country data')
      }
    } catch (error) {
      setError('Failed to fetch country data')
      console.error('Error fetching country:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-8 animate-fade-in relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 animate-bounce-subtle">
            🌍 Loading...
          </h1>
          <p className="text-xl">Fetching country information</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white p-8 animate-fade-in relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            ❌ Error
          </h1>
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white p-8 animate-fade-in relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            🔍 Not Found
          </h1>
          <p className="text-xl">Country not found</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute rounded-full animate-pulse"
          style={{
            top: '-160px',
            right: '-160px',
            width: '320px',
            height: '320px',
            background: 'rgba(147, 51, 234, 0.2)',
            filter: 'blur(60px)'
          }}
        ></div>
        <div 
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '-160px',
            left: '-160px',
            width: '384px',
            height: '384px',
            background: 'rgba(59, 130, 246, 0.15)',
            filter: 'blur(60px)',
            animationDelay: '2s'
          }}
        ></div>
        <div 
          className="absolute rounded-full animate-pulse"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '256px',
            height: '256px',
            background: 'rgba(6, 182, 212, 0.1)',
            filter: 'blur(60px)',
            animationDelay: '4s'
          }}
        ></div>
      </div>

      {/* Header Navigation */}
      <nav 
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        className="relative z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              style={{ fontSize: '16px', fontWeight: '500' }}
            >
              <span style={{ marginRight: '8px' }}>←</span>
              <span>Back to Globe</span>
            </button>
            <div className="flex items-center space-x-6">
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>TerraCapsule</span>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🌍
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Image Section */}
        <div 
          className="relative mb-16 rounded-3xl overflow-hidden"
          style={{
            height: '400px',
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${getCountryHeroImage(country.name)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div 
                className="inline-block mb-6 transition-transform duration-500 hover:scale-110 cursor-pointer"
                style={{
                  fontSize: '96px',
                  filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))'
                }}
              >
                {country.flag}
              </div>
              
              <h1 
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '16px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  lineHeight: '1.1'
                }}
              >
                {country.name}
              </h1>
              
              <p 
                style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '300',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                }}
              >
                {country.officialName}
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <p 
              style={{
                fontSize: '18px',
                color: '#94a3b8',
                lineHeight: '1.7',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {country.description}
            </p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '80px'
          }}
        >
          {[
            { icon: '👥', value: parseInt(country.population).toLocaleString(), label: 'Population', gradient: 'linear-gradient(135deg, #22d3ee, #3b82f6)', hoverColor: 'rgba(34, 211, 238, 0.2)' },
            { icon: '🏛️', value: country.capital, label: 'Capital City', gradient: 'linear-gradient(135deg, #10b981, #059669)', hoverColor: 'rgba(16, 185, 129, 0.2)' },
            { icon: '📏', value: country.area.toLocaleString(), label: 'Square KM', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', hoverColor: 'rgba(139, 92, 246, 0.2)' },
            { icon: '🌍', value: country.region, label: 'Region', gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)', hoverColor: 'rgba(245, 158, 11, 0.2)' }
          ].map((stat, index) => (
            <div
              key={index}
              className="group transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${stat.hoverColor}`;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div 
                style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px',
                  transition: 'transform 0.3s ease'
                }}
                className="group-hover:scale-110"
              >
                {stat.icon}
              </div>
              <div 
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  background: stat.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {stat.value}
              </div>
              <div 
                style={{
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information Sections */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '48px',
            marginBottom: '80px'
          }}
        >
          {/* Country Details */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <h3 
              style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '24px',
                background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🌟 Country Details
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Continent', value: country.continent },
                { label: 'Time Zone', value: country.timezone || 'Multiple zones' },
                { label: 'Languages', value: Array.isArray(country.languages) ? country.languages.join(', ') : 'Multiple languages' },
                { label: 'Coordinates', value: `${country.latitude.toFixed(2)}°, ${country.longitude.toFixed(2)}°` }
              ].map((item, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < 3 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                >
                  <span style={{ color: '#94a3b8', fontWeight: '500' }}>{item.label}</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Information */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <h3 
              style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '24px',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ✈️ Travel Information
            </h3>
            <div className="space-y-6">
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#22d3ee' }}>
                  📅 Best Time to Visit
                </h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  {country.bestTimeToVisit || 'Year-round destination with seasonal highlights'}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#22d3ee' }}>
                  🏛️ Cultural Tips
                </h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  {country.culturalTips || 'Respect local customs and traditions when visiting'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div 
            style={{
              background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2))',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '48px',
              border: '1px solid rgba(34, 211, 238, 0.3)'
            }}
          >
            <h2 
              style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '16px',
                background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🎉 Explore More
            </h2>
            <p 
              style={{
                fontSize: '20px',
                color: '#cbd5e1',
                marginBottom: '32px',
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}
            >
              Discover amazing destinations, local events, and hidden gems in {country.name}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                  borderRadius: '16px',
                  fontWeight: '600',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1.05)';
                  target.style.boxShadow = '0 20px 40px rgba(34, 211, 238, 0.25)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1)';
                  target.style.boxShadow = 'none';
                }}
              >
                🗺️ View Destinations →
              </button>
              <button 
                style={{
                  padding: '16px 32px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1.05)';
                  target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1)';
                  target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                🎯 Local Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
