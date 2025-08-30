# 📡 TerraCapsule API Documentation

This document provides comprehensive information about all APIs used in the TerraCapsule platform.

## 🌐 External API Integrations

### 1. Google Gemini AI API

**🔗 Base URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

#### Purpose
- Powers the intelligent chatbot with natural language processing
- Provides context-aware geographical knowledge
- Handles custom TerraCapsule commands

#### Authentication
```javascript
// API Key in headers
Authorization: Bearer YOUR_GEMINI_API_KEY
```

#### Usage in TerraCapsule
```javascript
// Located in: /src/app/api/chat/route.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

#### Features Used
- **Text Generation**: Natural language responses
- **Context Understanding**: Maintains conversation history
- **Custom Prompts**: TerraCapsule-specific geographical knowledge
- **Command Processing**: Interprets `/explore`, `/terrain`, etc.

#### Rate Limits
- **Free Tier**: 60 requests per minute
- **Quota**: 1,500 requests per day
- **Context Window**: 30,000 tokens per request

---

### 2. Google Maps JavaScript API

**🔗 Base URL**: `https://maps.googleapis.com/maps/api/js`

#### Purpose
- High-resolution satellite imagery
- Geocoding and reverse geocoding
- Place details and geographical coordinates
- Location search functionality

#### Authentication
```javascript
// API Key in URL parameters
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places
```

#### Usage in TerraCapsule
```javascript
// Environment variable
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

// Used in components for geocoding and place data
const geocoder = new google.maps.Geocoder();
```

#### APIs Enabled
- **Maps JavaScript API**: Core mapping functionality
- **Places API**: Location search and details
- **Geocoding API**: Address to coordinates conversion
- **Static Maps API**: Satellite imagery URLs

#### Rate Limits
- **Maps JavaScript API**: 28,500 requests per month (free)
- **Places API**: $17 per 1,000 requests after free quota
- **Geocoding**: $5 per 1,000 requests after free quota

---

### 3. CesiumJS Ion API

**🔗 Base URL**: `https://api.cesium.com/v1/`

#### Purpose
- 3D terrain data streaming
- High-resolution satellite imagery tiles
- Global elevation models
- 3D building data

#### Authentication
```javascript
// Ion Access Token
Cesium.Ion.defaultAccessToken = 'YOUR_ION_TOKEN';
```

#### Usage in TerraCapsule
```javascript
// Located in: /src/components/CesiumGlobe.tsx
Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN;

// Terrain provider
const terrainProvider = await Cesium.createWorldTerrainAsync({
  requestWaterMask: true,
  requestVertexNormals: true
});
```

#### Features Used
- **World Terrain**: Global elevation data
- **Satellite Imagery**: High-resolution imagery layers
- **3D Tiles**: Building and infrastructure data
- **Ion Assets**: Curated datasets

#### Rate Limits
- **Free Tier**: 1GB per month data streaming
- **Requests**: 50,000 per month
- **Storage**: 5GB asset storage

---

## 🏠 Internal TerraCapsule APIs

### 1. Chat API - `/api/chat`

#### Endpoint
```
POST /api/chat
GET /api/chat (status check)
```

#### Purpose
- Handle AI chatbot interactions
- Process natural language queries
- Execute custom TerraCapsule commands
- Maintain conversation context

#### Request Format
```json
{
  "message": "Tell me about Japan",
  "history": [
    {
      "sender": "user",
      "message": "Previous message",
      "time": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Response Format
```json
{
  "success": true,
  "message": "Japan is an island nation in East Asia...",
  "isCustomCommand": false,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

#### Supported Commands
- `/explore [country]` - Country information
- `/terrain [location]` - Terrain analysis
- `/weather [location]` - Climate data
- `/compare [A] vs [B]` - Location comparison
- `/population [location]` - Demographics
- `/resources [country]` - Natural resources
- `/help` - Command list

#### Natural Language Processing
The API automatically detects user intent:
```javascript
// Examples of natural language to command mapping
"Tell me about Japan" → /explore Japan
"What's the terrain in Alps?" → /terrain Alps
"How's the weather in Iceland?" → /weather Iceland
```

---

### 2. Country API - `/api/countries` (Planned)

#### Endpoints
```
GET /api/countries - List all countries
GET /api/countries/[code] - Get specific country data
POST /api/countries - Add country data
PUT /api/countries/[code] - Update country data
```

#### Purpose
- Manage country-specific data
- Store geographical information
- Handle country profiles and statistics

---

### 3. Authentication API - `/api/auth` (Planned)

#### Endpoints
```
POST /api/auth/login - User login
POST /api/auth/register - User registration
POST /api/auth/logout - User logout
GET /api/auth/profile - User profile
```

#### Purpose
- Handle user authentication
- Manage user sessions
- Secure API access

---

## 🔧 API Configuration

### Environment Variables

```bash
# Required for Production
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN=your_cesium_token

# Optional for Enhanced Features
MONGODB_URI=mongodb://localhost:27017/terracapsule
JWT_SECRET=your-secure-jwt-secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### API Key Security

#### Client-side Keys (NEXT_PUBLIC_*)
- **Google Maps**: Safe to expose, restricted by domain
- **Cesium Ion**: Safe to expose, usage tracked by token

#### Server-side Keys
- **Gemini API**: Server-only, never exposed to client
- **JWT Secret**: Server-only, used for authentication
- **MongoDB URI**: Server-only, database connection

---

## 📊 API Usage Monitoring

### Response Time Targets
- **Chat API**: < 2 seconds average response time
- **Google Maps**: < 500ms for geocoding requests
- **Cesium Data**: < 1 second for terrain tiles

### Error Handling
- **Fallback Responses**: When APIs are unavailable
- **Rate Limit Management**: Queuing and retry logic
- **Graceful Degradation**: Core functionality without APIs

### Monitoring Tools
- **Next.js Analytics**: Built-in performance monitoring
- **Vercel Analytics**: Request tracking and metrics
- **Custom Logging**: API usage and error tracking

---

## 🚀 API Integration Examples

### Chatbot Integration
```typescript
// Frontend usage
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userInput,
    history: conversationHistory
  })
});

const data = await response.json();
```

### Maps Integration
```typescript
// Component usage
useEffect(() => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places", "geometry"]
  });

  loader.load().then((google) => {
    // Initialize map
  });
}, []);
```

### Cesium Integration
```typescript
// 3D Globe initialization
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: await Cesium.createWorldImageryAsync({
    style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
  }),
  terrainProvider: await Cesium.createWorldTerrainAsync({
    requestWaterMask: true,
    requestVertexNormals: true
  })
});
```

---

## 🔒 Security Best Practices

### API Key Protection
1. **Environment Variables**: Never commit API keys to version control
2. **Domain Restrictions**: Restrict Google Maps API to specific domains
3. **Rate Limiting**: Implement client-side request throttling
4. **Error Handling**: Don't expose API keys in error messages

### CORS Configuration
```typescript
// Next.js API routes automatically handle CORS
// Custom headers can be set per route
export async function POST(request: NextRequest) {
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

### Request Validation
```typescript
// Input validation and sanitization
const { message, history } = await request.json();

if (!message || typeof message !== 'string') {
  return NextResponse.json(
    { error: 'Invalid message format' }, 
    { status: 400 }
  );
}
```

---

## 📈 Performance Optimization

### Caching Strategy
- **Static Assets**: CDN caching for images and 3D models
- **API Responses**: Redis caching for repeated queries
- **Client Caching**: Browser cache for map tiles and terrain data

### Load Balancing
- **Vercel Edge Functions**: Automatic geographic distribution
- **API Gateway**: Request routing and throttling
- **Database Optimization**: Connection pooling and indexing

### Monitoring and Analytics
- **Real-time Metrics**: API response times and error rates
- **Usage Analytics**: Track popular features and commands
- **Performance Alerts**: Automated notifications for issues

---

*Last Updated: January 2025*
*Version: 1.0.0*
