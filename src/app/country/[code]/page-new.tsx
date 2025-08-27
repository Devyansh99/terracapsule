'use client'
import { useState, useEffect } from 'react'

interface Country {
  name: string;
  code: string;
  flag: string;
  capital: string;
  population: number;
  area: number;
  region: string;
  officialName: string;
  description: string;
  continent: string;
  timezone?: string;
  languages?: string[];
  latitude: number;
  longitude: number;
  bestTimeToVisit?: string;
  culturalTips?: string;
}

export default function CountryPage({ params }: { params: { code: string } }) {
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(`/api/countries/${params.code}`)
        if (response.ok) {
          const data = await response.json()
          setCountry(data)
        }
      } catch (error) {
        console.error('Failed to fetch country:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [params.code])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        ✨ Loading magical country data...
      </div>
    )
  }

  if (!country) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: 'white',
        fontSize: '24px'
      }}>
        Country not found
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated Background Circles */}
      <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-160px',
          right: '-160px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(147, 51, 234, 0.3)',
          filter: 'blur(60px)',
          animation: 'pulse 3s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-160px',
          left: '-160px',
          width: '384px',
          height: '384px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.2)',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: '50'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => window.history.back()} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#22d3ee',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#06b6d4'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#22d3ee'}
            >
              <span>←</span>
              <span>Back to Globe</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>TerraCapsule</span>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                🌍
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div style={{ position: 'relative', zIndex: '10', maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div 
            style={{
              fontSize: '96px',
              marginBottom: '24px',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
          >
            {country.flag}
          </div>
          
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            lineHeight: '1.1'
          }}>
            {country.name}
          </h1>
          
          <p style={{
            fontSize: '24px',
            color: '#cbd5e1',
            fontWeight: '300',
            marginBottom: '24px'
          }}>
            {country.officialName}
          </p>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{
              fontSize: '18px',
              color: '#94a3b8',
              lineHeight: '1.7'
            }}>
              {country.description}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}>
          {[
            { 
              icon: '👥', 
              value: country.population.toLocaleString(), 
              label: 'Population', 
              color: '#22d3ee',
              bgColor: 'rgba(34, 211, 238, 0.1)',
              borderColor: 'rgba(34, 211, 238, 0.3)'
            },
            { 
              icon: '🏛️', 
              value: country.capital, 
              label: 'Capital City', 
              color: '#10b981',
              bgColor: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            },
            { 
              icon: '📏', 
              value: country.area.toLocaleString() + ' km²', 
              label: 'Area', 
              color: '#8b5cf6',
              bgColor: 'rgba(139, 92, 246, 0.1)',
              borderColor: 'rgba(139, 92, 246, 0.3)'
            },
            { 
              icon: '🌍', 
              value: country.region, 
              label: 'Region', 
              color: '#f59e0b',
              bgColor: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgba(245, 158, 11, 0.3)'
            }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement;
                el.style.borderColor = stat.borderColor;
                el.style.background = stat.bgColor;
                el.style.transform = 'scale(1.05)';
                el.style.boxShadow = `0 20px 40px ${stat.bgColor}`;
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement;
                el.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                el.style.background = 'rgba(255, 255, 255, 0.1)';
                el.style.transform = 'scale(1)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
                color: stat.color
              }}>
                {stat.value}
              </div>
              <div style={{
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎉 Explore {country.name}
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#cbd5e1',
              marginBottom: '32px'
            }}>
              Discover amazing destinations and cultural experiences!
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                padding: '16px 32px',
                background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                borderRadius: '16px',
                fontWeight: '600',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
              >
                🗺️ View Map
              </button>
              <button style={{
                padding: '16px 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement;
                el.style.background = 'rgba(255, 255, 255, 0.2)';
                el.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement;
                el.style.background = 'rgba(255, 255, 255, 0.1)';
                el.style.transform = 'scale(1)';
              }}
              >
                🎯 Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
