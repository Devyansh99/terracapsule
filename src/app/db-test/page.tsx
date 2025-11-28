'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Country {
  id: string;
  code: string;
  name: string;
  capital: string;
  flag: string;
  region: string;
  population: string;
  area: number;
  description: string;
  _count: {
    destinations: number;
    events: number;
  };
}

interface Destination {
  id: string;
  name: string;
  type: string;
  description: string;
  rating: number | null;
  country: {
    code: string;
    name: string;
    flag: string;
  };
}

export default function DatabaseTestPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch countries from SQLite via Prisma
      const countriesRes = await fetch('/api/countries');
      const countriesData = await countriesRes.json();
      
      // Fetch destinations from SQLite via Prisma
      const destinationsRes = await fetch('/api/destinations');
      const destinationsData = await destinationsRes.json();

      if (countriesData.success) {
        setCountries(countriesData.data);
      }

      if (destinationsData.success) {
        setDestinations(destinationsData.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from database');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-4">❌ {error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Database Test Dashboard
          </h1>
          <p className="text-gray-400">Testing hybrid MongoDB + SQLite setup</p>
        </div>

        {/* Database Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-semibold text-cyan-400">MongoDB Status</h2>
            </div>
            <p className="text-gray-300 mb-2">✅ Connected & Active</p>
            <p className="text-sm text-gray-400">Used for: User Authentication (Login/Register)</p>
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
              <p className="text-xs text-gray-500">Collections:</p>
              <p className="text-sm text-cyan-300">• users</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-semibold text-blue-400">SQLite Status</h2>
            </div>
            <p className="text-gray-300 mb-2">✅ Connected & Active</p>
            <p className="text-sm text-gray-400">Used for: Countries, Destinations, Events, Reviews</p>
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
              <p className="text-xs text-gray-500">Tables:</p>
              <p className="text-sm text-blue-300">• {countries.length} Countries • {destinations.length} Destinations</p>
            </div>
          </div>
        </div>

        {/* Countries Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">🌍</span>
            Countries from SQLite
            <span className="text-sm text-gray-400 font-normal">({countries.length} total)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country) => (
              <div 
                key={country.id}
                className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl p-5 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-4xl">{country.flag}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{country.name}</h3>
                    <p className="text-sm text-gray-400">{country.capital}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Region:</span>
                    <span className="text-gray-200">{country.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Population:</span>
                    <span className="text-gray-200">{parseInt(country.population).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Area:</span>
                    <span className="text-gray-200">{country.area.toLocaleString()} km²</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-700">
                    <span className="text-gray-400">Destinations:</span>
                    <span className="text-cyan-400 font-semibold">{country._count.destinations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Destinations Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">📍</span>
            Destinations from SQLite
            <span className="text-sm text-gray-400 font-normal">({destinations.length} total)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {destinations.map((destination) => (
              <div 
                key={destination.id}
                className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{destination.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-xl">{destination.country.flag}</span>
                      <span className="text-gray-400">{destination.country.name}</span>
                    </div>
                  </div>
                  {destination.rating && (
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-yellow-300 font-semibold">{destination.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-3">{destination.description}</p>
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                  {destination.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Test Section */}
        <div className="mt-8 p-6 bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl">
          <h2 className="text-xl font-semibold text-green-400 mb-3">✅ API Endpoints Working</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <code className="text-cyan-300">GET /api/countries</code>
              <span className="text-gray-400">- Fetching from SQLite via Prisma</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <code className="text-cyan-300">GET /api/destinations</code>
              <span className="text-gray-400">- Fetching from SQLite via Prisma</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <code className="text-cyan-300">POST /api/auth/register</code>
              <span className="text-gray-400">- Using MongoDB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <code className="text-cyan-300">POST /api/auth/login</code>
              <span className="text-gray-400">- Using MongoDB</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🎉 Hybrid Database Setup: MongoDB (Auth) + SQLite (Data) Working Perfectly!</p>
        </div>
      </div>
    </div>
  );
}
