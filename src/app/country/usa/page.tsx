'use client'
import { motion } from 'framer-motion'
import ChatBot from '../../../components/ChatBot'
import SimpleAnimatedLogo from '../../../components/SimpleAnimatedLogo'
import Link from 'next/link'

export default function CountryPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: 'white'
    }}>
      {/* Professional ChatBot Component - Works on all pages */}
      <ChatBot />

      {/* Navigation */}
      <nav style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(34, 211, 238, 0.2)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px' }}>
            <SimpleAnimatedLogo />
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '24px', 
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TerraCapsule
          </h1>
        </Link>

        <Link href="/" style={{
          background: 'transparent',
          border: '1px solid rgba(34, 211, 238, 0.5)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}>
          ← Back to Home
        </Link>
      </nav>

      {/* Country Content */}
      <div style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Country Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '60px',
              padding: '40px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(34, 211, 238, 0.2)'
            }}
          >
            <div style={{ fontSize: '80px', lineHeight: 1 }}>🇺🇸</div>
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '900',
                margin: '0 0 10px 0',
                background: 'linear-gradient(135deg, #22d3ee, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                United States
              </h1>
              <p style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                North America • 331.9M population • Washington, D.C.
              </p>
            </div>
          </motion.div>

          {/* Information Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: '30px',
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(34, 211, 238, 0.2)'
              }}
            >
              <h3 style={{
                color: '#22d3ee',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                🏛️ Government
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
                <li><strong>Capital:</strong> Washington, D.C.</li>
                <li><strong>Type:</strong> Federal Republic</li>
                <li><strong>States:</strong> 50 + D.C.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                padding: '30px',
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(34, 211, 238, 0.2)'
              }}
            >
              <h3 style={{
                color: '#22d3ee',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                📊 Demographics
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
                <li><strong>Population:</strong> 331.9 million</li>
                <li><strong>Area:</strong> 9.8 million km²</li>
                <li><strong>Density:</strong> 36/km²</li>
              </ul>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              textAlign: 'center',
              padding: '50px 30px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(59, 130, 246, 0.1))',
              border: '1px solid rgba(34, 211, 238, 0.3)'
            }}
          >
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Want to Learn More?
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              Use our professional AI chat assistant in the bottom-right corner! 
              It scrolls with you and works on every page.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{
                background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                border: 'none',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}>
                🌍 Explore More Countries
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '40px',
        borderTop: '1px solid rgba(34, 211, 238, 0.2)',
        background: 'rgba(15, 23, 42, 0.8)',
        textAlign: 'center'
      }}>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          margin: 0,
          fontSize: '14px'
        }}>
          © 2025 TerraCapsule. Professional geographical exploration with AI assistance.
        </p>
      </div>
    </div>
  )
}
