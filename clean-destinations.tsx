            <div className="destinations-grid">
              {countries.map((country, index) => (
                <motion.div 
                  key={country.id}
                  className="destination-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1 + index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    backdropFilter: 'blur(15px)'
                  }}
                >
                  <div className="destination-image" style={{
                    position: 'relative',
                    height: '200px',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(3, 218, 198, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <span className="destination-emoji" style={{
                      fontSize: '4rem',
                      filter: 'drop-shadow(0 4px 20px rgba(0, 212, 255, 0.3))'
                    }}>{country.flag}</span>
                    <motion.div 
                      className="destination-overlay"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Link href={`/country/${country.code?.toLowerCase() || 'unknown'}`} passHref>
                        <motion.button 
                          className="explore-btn"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #00d4ff, #03dac6)',
                            border: 'none',
                            borderRadius: '50px',
                            color: '#ffffff',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Explore in 3D
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                  <div className="destination-info" style={{ padding: '1.5rem' }}>
                    <h3 className="destination-name" style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '0.75rem'
                    }}>{country.name}</h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '0.75rem',
                      lineHeight: '1.4'
                    }}>{country.description ? country.description.substring(0, 100) + '...' : 'Discover this amazing destination'}</p>
                    <div className="destination-meta" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className="destination-type" style={{
                        fontSize: '0.875rem',
                        color: '#00d4ff',
                        fontWeight: '500'
                      }}>{country.capital || 'Capital'}</span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8'
                      }}>{country.region || 'Region'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
