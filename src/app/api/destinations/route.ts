import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get('countryCode')
    const countryId = searchParams.get('countryId')

    let destinations

    if (countryCode) {
      // Find destinations by country code
      const country = await prisma.country.findUnique({
        where: { code: countryCode },
        include: {
          destinations: {
            orderBy: {
              rating: 'desc'
            }
          }
        }
      })

      if (!country) {
        return NextResponse.json(
          { success: false, error: 'Country not found' },
          { status: 404 }
        )
      }

      destinations = country.destinations
    } else if (countryId) {
      // Find destinations by country ID
      destinations = await prisma.destination.findMany({
        where: { countryId },
        include: {
          country: {
            select: {
              code: true,
              name: true,
              flag: true
            }
          }
        },
        orderBy: {
          rating: 'desc'
        }
      })
    } else {
      // Get all destinations
      destinations = await prisma.destination.findMany({
        include: {
          country: {
            select: {
              code: true,
              name: true,
              flag: true
            }
          }
        },
        orderBy: {
          rating: 'desc'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: destinations,
      count: destinations.length
    })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch destinations' 
      },
      { status: 500 }
    )
  }
}
