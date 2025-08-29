import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthResponse {
  message: string
  user?: User
  error?: string
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setLoading(false)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      setLoading(false)
      return { message: '', error: errorMessage }
    }
  }

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setLoading(false)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      setLoading(false)
      return { message: '', error: errorMessage }
    }
  }

  const logout = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // Redirect to home or reload page
      window.location.reload()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    register,
    logout,
    loading,
    error,
    setError
  }
}
