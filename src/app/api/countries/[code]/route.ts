import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    console.log('Looking for country with code:', code.toUpperCase())
    
    const country = await prisma.country.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        destinations: {
          include: {
            reviews: {
              select: {
                rating: true,
                comment: true,
                userName: true,
                createdAt: true
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 5
            },
            events: {
              where: {
                endDate: {
                  gte: new Date()
                }
              },
              orderBy: {
                startDate: 'asc'
              },
              take: 3
            }
          }
        },
        events: {
          where: {
            endDate: {
              gte: new Date()
            }
          },
          orderBy: {
            startDate: 'asc'
          },
          take: 5
        },
        weatherData: {
          orderBy: {
            recordedAt: 'desc'
          },
          take: 1
        }
      }
    })

    if (!country) {
      console.log('Country not found for code:', code.toUpperCase())
      return NextResponse.json(
        { 
          success: false, 
          error: 'Country not found' 
        },
        { status: 404 }
      )
    }

    console.log('Country found:', country.name)

    // Calculate average ratings for destinations
    const destinationsWithRatings = country.destinations.map(destination => ({
      ...destination,
      averageRating: destination.reviews.length > 0
        ? destination.reviews.reduce((sum, review) => sum + review.rating, 0) / destination.reviews.length
        : null,
      totalReviews: destination.reviews.length
    }))

    // Convert BigInt values to strings for JSON serialization
    const serializedCountry = {
      ...country,
      population: country.population.toString(),
      destinations: destinationsWithRatings
    }

    return NextResponse.json({
      success: true,
      data: serializedCountry
    })
  } catch (error) {
    console.error('Error fetching country:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch country data' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params
    const body = await request.json()
    
    const updatedCountry = await prisma.country.update({
      where: { code: code.toUpperCase() },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCountry
    })
  } catch (error) {
    console.error('Error updating country:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update country' 
      },
      { status: 500 }
    )
  }
}
