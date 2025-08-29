import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called');
    const body = await request.json()
    console.log('Request body:', { ...body, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
    const { firstName, lastName, name, email, password, confirmPassword } = body

    // Handle both name formats (direct name or firstName + lastName)
    const fullName = name || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName)

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    // Validate password confirmation if provided
    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    console.log('MongoDB connection successful');
    const db = client.db('terracapsule')
    const users = db.collection('users')

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const newUser = {
      name: fullName,
      firstName: firstName || fullName.split(' ')[0] || '',
      lastName: lastName || fullName.split(' ').slice(1).join(' ') || '',
      email,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date(),
      profileComplete: !!(firstName && lastName && email) // Track if profile is complete
    }

    const result = await users.insertOne(newUser)

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId, 
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set cookie
    const response = NextResponse.json(
      { 
        message: 'User created successfully',
        user: { 
          id: result.insertedId, 
          email: newUser.email, 
          name: newUser.name,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          profileComplete: newUser.profileComplete
        }
      },
      { status: 201 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
