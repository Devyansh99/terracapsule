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
      message: 'Hello! Welcome to TerraCapsule! 🌍 How can I help you explore our platform today?', 
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
    setNewMessage('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "That's a great question! TerraCapsule offers advanced 3D mapping and terrain analysis tools.",
        "I can help you navigate through our features. Would you like to know about our country exploration tools?",
        "TerraCapsule provides real-time geographical data and interactive visualizations. What specific feature interests you?",
        "Our platform combines satellite imagery with AI-powered insights. Feel free to ask about any country or location!",
        "Thanks for your interest! You can explore countries, view terrain data, and get detailed geographical information.",
        "I'm here to help you discover the world through TerraCapsule's advanced mapping technology!"
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      
      const botMessage: Message = {
        id: messages.length + 2,
        sender: 'bot',
        message: randomResponse,
        time: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
                    <p style={{ margin: 0, marginBottom: '4px' }}>{msg.message}</p>
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
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '3px'
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
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#22d3ee'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '12px',
                      marginLeft: '4px'
                    }}>
                      Assistant is typing...
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
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end'
              }}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    minHeight: '20px',
                    maxHeight: '80px',
                    fontFamily: 'inherit'
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
                      ? 'linear-gradient(135deg, #22d3ee, #3b82f6)'
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
                  ➤
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
