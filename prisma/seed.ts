import { prisma } from '../src/lib/prisma'

const countriesData = [
  {
    code: 'US',
    name: 'United States',
    officialName: 'United States of America',
    capital: 'Washington, D.C.',
    population: BigInt(331900000),
    area: 9833520.0,
    region: 'Americas',
    subregion: 'Northern America',
    continent: 'North America',
    latitude: 39.8283,
    longitude: -98.5795,
    flag: '🇺🇸',
    flagImageUrl: 'https://flagcdn.com/w320/us.png',
    timezone: 'UTC-05:00 to UTC-10:00',
    languages: ['English'],
    currencies: { USD: { name: 'United States Dollar', symbol: '$' } },
    description: 'A vast country spanning diverse landscapes from coast to coast, offering everything from bustling metropolises to natural wonders like the Grand Canyon.',
    highlights: [
      'Statue of Liberty in New York',
      'Grand Canyon in Arizona',
      'Hollywood in California',
      'Yellowstone National Park',
      'Golden Gate Bridge'
    ],
    bestTimeToVisit: 'April to June, September to November',
    culturalTips: 'Tipping 15-20% is customary. Americans value personal space and punctuality.'
  },
  {
    code: 'JP',
    name: 'Japan',
    officialName: 'Japan',
    capital: 'Tokyo',
    population: BigInt(125800000),
    area: 377975.0,
    region: 'Asia',
    subregion: 'Eastern Asia',
    continent: 'Asia',
    latitude: 36.2048,
    longitude: 138.2529,
    flag: '🇯🇵',
    flagImageUrl: 'https://flagcdn.com/w320/jp.png',
    timezone: 'UTC+09:00',
    languages: ['Japanese'],
    currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } },
    description: 'An island nation where ancient traditions blend seamlessly with cutting-edge technology, offering unique cultural experiences and stunning natural beauty.',
    highlights: [
      'Mount Fuji',
      'Tokyo\'s modern skyline',
      'Ancient temples in Kyoto',
      'Cherry blossoms (Sakura)',
      'Traditional hot springs (Onsen)'
    ],
    bestTimeToVisit: 'March to May (Spring), September to November (Autumn)',
    culturalTips: 'Remove shoes when entering homes. Bowing is a common greeting. Silence is valued on public transport.'
  },
  {
    code: 'FR',
    name: 'France',
    officialName: 'French Republic',
    capital: 'Paris',
    population: BigInt(67390000),
    area: 643801.0,
    region: 'Europe',
    subregion: 'Western Europe',
    continent: 'Europe',
    latitude: 46.2276,
    longitude: 2.2137,
    flag: '🇫🇷',
    flagImageUrl: 'https://flagcdn.com/w320/fr.png',
    timezone: 'UTC+01:00',
    languages: ['French'],
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    description: 'The epitome of elegance and culture, famous for its art, cuisine, fashion, and romantic atmosphere in the City of Light.',
    highlights: [
      'Eiffel Tower in Paris',
      'Louvre Museum',
      'Palace of Versailles',
      'French Riviera',
      'Loire Valley Castles'
    ],
    bestTimeToVisit: 'April to June, September to October',
    culturalTips: 'Greet with "Bonjour" before asking questions. Dress elegantly. Lunch is typically 12-2 PM.'
  },
  {
    code: 'BR',
    name: 'Brazil',
    officialName: 'Federative Republic of Brazil',
    capital: 'Brasília',
    population: BigInt(215300000),
    area: 8515767.0,
    region: 'Americas',
    subregion: 'South America',
    continent: 'South America',
    latitude: -14.2350,
    longitude: -51.9253,
    flag: '🇧🇷',
    flagImageUrl: 'https://flagcdn.com/w320/br.png',
    timezone: 'UTC-02:00 to UTC-05:00',
    languages: ['Portuguese'],
    currencies: { BRL: { name: 'Brazilian Real', symbol: 'R$' } },
    description: 'A vibrant country known for its carnival celebrations, Amazon rainforest, beautiful beaches, and passionate football culture.',
    highlights: [
      'Christ the Redeemer statue',
      'Amazon Rainforest',
      'Iguazu Falls',
      'Copacabana Beach',
      'Carnival in Rio de Janeiro'
    ],
    bestTimeToVisit: 'December to March (Summer), May to September (Dry season)',
    culturalTips: 'Brazilians are warm and affectionate. Expect lots of physical contact during greetings. Football is a passion.'
  },
  {
    code: 'AU',
    name: 'Australia',
    officialName: 'Commonwealth of Australia',
    capital: 'Canberra',
    population: BigInt(25690000),
    area: 7692024.0,
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    continent: 'Oceania',
    latitude: -25.2744,
    longitude: 133.7751,
    flag: '🇦🇺',
    flagImageUrl: 'https://flagcdn.com/w320/au.png',
    timezone: 'UTC+08:00 to UTC+10:30',
    languages: ['English'],
    currencies: { AUD: { name: 'Australian Dollar', symbol: 'A$' } },
    description: 'A unique continent-country featuring diverse landscapes, unique wildlife, vibrant cities, and the world\'s largest coral reef system.',
    highlights: [
      'Sydney Opera House',
      'Great Barrier Reef',
      'Uluru (Ayers Rock)',
      'Twelve Apostles',
      'Kangaroo Island'
    ],
    bestTimeToVisit: 'March to May (Autumn), September to November (Spring)',
    culturalTips: 'Australians are laid-back and friendly. "G\'day" is a common greeting. Tipping is not mandatory but appreciated.'
  },
  {
    code: 'EG',
    name: 'Egypt',
    officialName: 'Arab Republic of Egypt',
    capital: 'Cairo',
    population: BigInt(104300000),
    area: 1001450.0,
    region: 'Africa',
    subregion: 'Northern Africa',
    continent: 'Africa',
    latitude: 26.0975,
    longitude: 31.1353,
    flag: '🇪🇬',
    flagImageUrl: 'https://flagcdn.com/w320/eg.png',
    timezone: 'UTC+02:00',
    languages: ['Arabic'],
    currencies: { EGP: { name: 'Egyptian Pound', symbol: '£' } },
    description: 'Home to one of the world\'s oldest civilizations, featuring magnificent pyramids, ancient temples, and the legendary Nile River.',
    highlights: [
      'Pyramids of Giza',
      'Great Sphinx',
      'Valley of the Kings',
      'Karnak Temple Complex',
      'Nile River cruises'
    ],
    bestTimeToVisit: 'October to April (Cooler months)',
    culturalTips: 'Dress modestly, especially when visiting religious sites. Friday is the holy day. Haggling is common in markets.'
  }
]

const destinationsData = [
  // United States destinations
  {
    countryCode: 'US',
    destinations: [
      {
        name: 'New York City',
        type: 'city',
        description: 'The city that never sleeps, featuring iconic landmarks, world-class museums, and Broadway shows.',
        latitude: 40.7128,
        longitude: -74.0060,
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Empire State Building'],
        rating: 4.5,
        bestTimeToVisit: 'April to June, September to November',
        website: 'https://www.nycgo.com'
      },
      {
        name: 'Grand Canyon National Park',
        type: 'nature',
        description: 'One of the world\'s most spectacular natural wonders, carved by the Colorado River.',
        latitude: 36.1069,
        longitude: -112.1129,
        imageUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800',
        highlights: ['South Rim viewpoints', 'Hiking trails', 'Colorado River rafting'],
        rating: 4.8,
        bestTimeToVisit: 'March to May, September to November',
        entryFee: '$35 per vehicle (7 days)',
        website: 'https://www.nps.gov/grca'
      }
    ]
  },
  // Japan destinations
  {
    countryCode: 'JP',
    destinations: [
      {
        name: 'Tokyo',
        type: 'city',
        description: 'Japan\'s bustling capital, blending ultramodern skyscrapers with traditional temples.',
        latitude: 35.6762,
        longitude: 139.6503,
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        highlights: ['Shibuya Crossing', 'Tokyo Skytree', 'Senso-ji Temple', 'Tsukiji Fish Market'],
        rating: 4.6,
        bestTimeToVisit: 'March to May, September to November',
        website: 'https://www.gotokyo.org'
      },
      {
        name: 'Mount Fuji',
        type: 'nature',
        description: 'Japan\'s highest peak and sacred symbol, perfect for climbing and viewing.',
        latitude: 35.3606,
        longitude: 138.7274,
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        highlights: ['Climbing season', 'Five Lakes region', 'Cherry blossoms', 'Hot springs'],
        rating: 4.7,
        bestTimeToVisit: 'July to September (climbing season)',
        website: 'https://www.fujisan-climb.jp'
      }
    ]
  }
  // Add more destinations for other countries...
]

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Clear existing data
    await prisma.review.deleteMany()
    await prisma.event.deleteMany()
    await prisma.weatherData.deleteMany()
    await prisma.destination.deleteMany()
    await prisma.chatSession.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.country.deleteMany()

    console.log('📥 Seeding countries...')
    
    // Seed countries
    for (const countryData of countriesData) {
      await prisma.country.create({
        data: {
          ...countryData,
          languages: JSON.stringify(countryData.languages),
          currencies: JSON.stringify(countryData.currencies),
          highlights: JSON.stringify(countryData.highlights)
        }
      })
      console.log(`✅ Created country: ${countryData.name}`)
    }

    console.log('🏛️ Seeding destinations...')
    
    // Seed destinations
    for (const countryDest of destinationsData) {
      const country = await prisma.country.findUnique({
        where: { code: countryDest.countryCode }
      })
      
      if (country) {
        for (const destData of countryDest.destinations) {
          await prisma.destination.create({
            data: {
              ...destData,
              highlights: JSON.stringify(destData.highlights),
              countryId: country.id
            }
          })
          console.log(`✅ Created destination: ${destData.name}`)
        }
      }
    }

    console.log('🎉 Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
