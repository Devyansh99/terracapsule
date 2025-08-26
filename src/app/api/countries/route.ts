import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        capital: true,
        flag: true,
        region: true,
        population: true,
        area: true,
        latitude: true,
        longitude: true,
        description: true,
        highlights: true,
        _count: {
          select: {
            destinations: true,
            events: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Convert BigInt values to strings for JSON serialization
    const serializedCountries = countries.map(country => ({
      ...country,
      population: country.population.toString()
    }))

    return NextResponse.json({
      success: true,
      data: serializedCountries,
      count: serializedCountries.length
    })
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch countries' 
      },
      { status: 500 }
    )
  }
}
