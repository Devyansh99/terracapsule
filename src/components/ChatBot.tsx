'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: number
  sender: 'user' | 'bot'
  message: string
  time: Date
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: 'bot', 
      message: 'Hey there! 👋 I\'m your TerraCapsule AI assistant!\n\nI can help you explore countries, terrain, and geography. Try asking:\n• "Tell me about Japan"\n• "What\'s the terrain like in Switzerland?"\n• Or type "/" for quick commands! ⚡', 
      time: new Date() 
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      message: newMessage,
      time: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = newMessage
    setNewMessage('')
    setIsTyping(true)

    try {
      // Prepare conversation history (last 10 messages for context)
      const recentHistory = messages.slice(-10).map(msg => ({
        sender: msg.sender,
        message: msg.message,
        time: msg.time.toISOString()
      }))

      // Call the Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          history: recentHistory
        }),
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: Message = {
          id: messages.length + 2,
          sender: 'bot',
          message: data.message,
          time: new Date()
        }

        setMessages(prev => [...prev, botMessage])
      } else {
        // Error fallback
        const errorMessage: Message = {
          id: messages.length + 2,
          sender: 'bot',
          message: "I'm experiencing some technical difficulties. Please try again! In the meantime, try using commands like /help, /features, or ask me about countries and terrain. 🌍",
          time: new Date()
        }

        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat API Error:', error)
      
      // Network error fallback
      const fallbackMessage: Message = {
        id: messages.length + 2,
        sender: 'bot',
        message: "Sorry, I'm having connection issues right now. Please check your internet connection and try again! 🌐",
        time: new Date()
      }

      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Function to format message text with basic markdown support
  const formatMessage = (text: string) => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n')
    
    return paragraphs.map((paragraph, index) => (
      <div key={index} style={{ marginBottom: index < paragraphs.length - 1 ? '12px' : '0' }}>
        {paragraph.split('\n').map((line, lineIndex) => {
          // Handle bullet points
          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <div key={lineIndex} style={{ 
                marginLeft: '16px', 
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{ color: '#22d3ee', fontSize: '12px', marginTop: '2px' }}>•</span>
                <span>{line.substring(2)}</span>
              </div>
            )
          }
          
          // Handle bold text **text**
          const boldRegex = /\*\*(.*?)\*\*/g
          const parts = line.split(boldRegex)
          
          return (
            <div key={lineIndex} style={{ marginBottom: lineIndex < paragraph.split('\n').length - 1 ? '4px' : '0' }}>
              {parts.map((part, partIndex) => 
                partIndex % 2 === 1 ? 
                  <strong key={partIndex} style={{ color: '#22d3ee', fontWeight: '600' }}>{part}</strong> : 
                  <span key={partIndex}>{part}</span>
              )}
            </div>
          )
        })}
      </div>
    ))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 2147483647, // Maximum possible z-index value
        pointerEvents: 'auto', 
        willChange: 'transform',
        isolation: 'isolate'
      }}
    >
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              width: '380px',
              height: '500px',
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(59, 130, 246, 0.1))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🌍
                  </div>
                  <div>
                    <h3 style={{ 
                      color: 'white', 
                      margin: 0, 
                      fontSize: '16px', 
                      fontWeight: '600' 
                    }}>
                      TerraCapsule Assistant
                    </h3>
                    <p style={{ 
                      color: 'rgba(34, 211, 238, 0.8)', 
                      margin: 0, 
                      fontSize: '12px' 
                    }}>
                      Online • Ready to help
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' 
                      ? '18px 18px 4px 18px' 
                      : '18px 18px 18px 4px',
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, #22d3ee, #3b82f6)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: msg.sender === 'bot' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    color: 'white',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    backdropFilter: msg.sender === 'bot' ? 'blur(10px)' : 'none'
                  }}>
                    {/* Enhanced message display */}
                    {/* Enhanced message display */}
                    <div style={{ marginBottom: '4px' }}>
                      {msg.sender === 'user' ? (
                        <div>
                          {/* Show command indicator for user commands */}
                          {msg.message.startsWith('/') && (
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              marginBottom: '6px',
                              display: 'inline-block',
                              fontWeight: '500'
                            }}>
                              ⚡ Command
                            </div>
                          )}
                          <div>{msg.message}</div>
                        </div>
                      ) : (
                        <div>
                          {/* AI response indicator for helpful suggestions */}
                          {msg.message.includes('💡') && (
                            <div style={{
                              background: 'rgba(34, 211, 238, 0.15)',
                              padding: '3px 8px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              marginBottom: '6px',
                              display: 'inline-block',
                              border: '1px solid rgba(34, 211, 238, 0.3)',
                              fontWeight: '500'
                            }}>
                              💡 Helpful tip
                            </div>
                          )}
                          {formatMessage(msg.message)}
                        </div>
                      )}
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '11px', 
                      opacity: 0.7,
                      textAlign: msg.sender === 'user' ? 'right' : 'left'
                    }}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '2px'
                    }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#22d3ee'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '11px'
                    }}>
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid rgba(34, 211, 238, 0.2)',
              background: 'rgba(15, 23, 42, 0.8)'
            }}>
              {/* Command suggestions when user types "/" */}
              {newMessage.startsWith('/') && newMessage.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    borderRadius: '12px',
                    padding: '10px',
                    marginBottom: '10px',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ color: '#22d3ee', fontWeight: '600', marginBottom: '4px', fontSize: '12px' }}>
                    💡 Quick Commands:
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.3' }}>
                    <strong>/explore</strong> Japan • <strong>/terrain</strong> Alps • <strong>/weather</strong> Iceland • <strong>/help</strong>
                  </div>
                </motion.div>
              )}
              
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end'
              }}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={newMessage.startsWith('/') ? 'Try: /explore Japan' : 'Ask about any country or place...'}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '20px',
                    border: newMessage.startsWith('/') 
                      ? '1px solid rgba(34, 211, 238, 0.5)' 
                      : '1px solid rgba(34, 211, 238, 0.3)',
                    background: newMessage.startsWith('/') 
                      ? 'rgba(34, 211, 238, 0.1)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    minHeight: '20px',
                    maxHeight: '80px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                  rows={1}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    padding: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    background: newMessage.trim() 
                      ? newMessage.startsWith('/') 
                        ? 'linear-gradient(135deg, #22d3ee, #06b6d4)'
                        : 'linear-gradient(135deg, #22d3ee, #3b82f6)'
                      : 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {newMessage.startsWith('/') ? '⚡' : '➤'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        // Add gentle floating animation to make it more noticeable
        animate={{
          y: [0, -8, 0], // Gentle up and down float
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1, y: -12 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: 'none',
          background: isOpen 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #22d3ee, #3b82f6)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: isOpen 
            ? '0 12px 40px rgba(239, 68, 68, 0.5)' 
            : '0 8px 32px rgba(34, 211, 238, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Pulse effect */}
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              top: 0,
              left: 0
            }}
          />
        )}
        
        {/* Icon with rotation animation */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'relative',
            zIndex: 1
          }}
        >
          {isOpen ? '✕' : '💬'}
        </motion.div>

        {/* Notification badge (optional) */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ef4444',
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(15, 23, 42, 1)'
            }}
          >
            1
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}
