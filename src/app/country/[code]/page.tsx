'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
      
      // Debug logging
      console.log('API Response:', data)
      console.log('Response success:', data.success)
      
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

  const formatPopulation = (pop: string) => {
    const num = parseInt(pop)
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-white text-lg">Loading country data...</span>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Country Not Found</h1>
          <p className="text-cyan-300 mb-6">{error}</p>
          <Link href="/" className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            TerraCapsule
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-cyan-300 text-lg">{country.flag}</span>
            <h1 className="text-xl font-semibold">{country.name}</h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-8xl mb-6"
            >
              {country.flag}
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {country.name}
            </h1>
            <p className="text-xl text-cyan-300 mb-6">{country.officialName}</p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {country.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Population', value: formatPopulation(country.population.toString()), icon: '👥' },
              { label: 'Capital', value: country.capital, icon: '🏛️' },
              { label: 'Area', value: `${country.area.toLocaleString()} km²`, icon: '📏' },
              { label: 'Region', value: country.region, icon: '🌍' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-cyan-400/20"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-lg font-semibold text-cyan-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Destinations */}
      {Array.isArray(country.destinations) && country.destinations.length > 0 && (
        <motion.section 
          className="py-16 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Top Destinations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(Array.isArray(country.destinations) ? country.destinations : []).map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-cyan-400/20 hover:border-cyan-400/40 transition-all group"
                >
                  {destination.imageUrl && (
                    <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <img 
                        src={destination.imageUrl} 
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-cyan-400">{destination.name}</h3>
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                        {destination.type}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{destination.description}</p>
                    {Array.isArray(destination.highlights) && destination.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-cyan-300 mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights.slice(0, 3).map((highlight, i) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      {destination.averageRating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="ml-1 text-sm">{destination.averageRating.toFixed(1)}</span>
                          <span className="text-gray-400 text-xs ml-1">({destination.totalReviews})</span>
                        </div>
                      )}
                      <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Cultural Information */}
      <motion.section 
        className="py-16 px-6 bg-black/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Highlights */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-cyan-400">Must-See Highlights</h2>
              <div className="space-y-4">
                {(() => {
                  try {
                    const highlights = Array.isArray(country.highlights) 
                      ? country.highlights 
                      : typeof country.highlights === 'string' 
                        ? JSON.parse(country.highlights) 
                        : [];
                    return highlights.map((highlight: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-4 bg-white/5 rounded-lg border border-cyan-400/20"
                      >
                        <span className="text-cyan-400 mr-3">✨</span>
                        <span>{highlight}</span>
                      </motion.div>
                    ));
                  } catch (error) {
                    return [];
                  }
                })()}
              </div>
            </div>

            {/* Travel Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-cyan-400">Travel Information</h2>
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-lg border border-cyan-400/20">
                  <h3 className="font-semibold text-cyan-300 mb-2">🌤️ Best Time to Visit</h3>
                  <p className="text-gray-300">{country.bestTimeToVisit}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-cyan-400/20">
                  <h3 className="font-semibold text-cyan-300 mb-2">🏛️ Cultural Tips</h3>
                  <p className="text-gray-300">{country.culturalTips}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-cyan-400/20">
                  <h3 className="font-semibold text-cyan-300 mb-2">🗣️ Languages</h3>
                  <p className="text-gray-300">{(() => {
                    try {
                      const languages = Array.isArray(country.languages) 
                        ? country.languages 
                        : typeof country.languages === 'string' 
                          ? JSON.parse(country.languages) 
                          : [];
                      return languages.join(', ') || 'Multiple languages spoken';
                    } catch (error) {
                      return 'Multiple languages spoken';
                    }
                  })()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Weather */}
      {Array.isArray(country.weatherData) && country.weatherData.length > 0 && (
        <motion.section 
          className="py-16 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Current Weather</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-cyan-400/20 max-w-md mx-auto">
              <div className="text-4xl mb-4">{country.weatherData[0].temperature}°C</div>
              <div className="text-cyan-400 font-semibold mb-2">{country.weatherData[0].condition}</div>
              <div className="text-gray-300 text-sm">Humidity: {country.weatherData[0].humidity}%</div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Chat Section Placeholder */}
      <motion.section 
        className="py-16 px-6 bg-black/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ask About {country.name}</h2>
          <p className="text-gray-300 mb-8">
            Have questions about visiting {country.name}? Our AI travel assistant can help you plan your trip!
          </p>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
            🤖 Chat with AI Assistant (Coming Soon)
          </button>
        </div>
      </motion.section>
    </div>
  )
}
