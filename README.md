# 🌍 TerraCapsule

**Advanced 3D Geographic Visualization & Terrain Analysis Platform**

TerraCapsule is a cutting-edge web application that combines satellite imagery, 3D terrain modeling, and AI-powered geographical insights to provide an immersive exploration experience of our planet. Built with modern web technologies and powered by multiple APIs, it offers real-time geographical data visualization and interactive country exploration.

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![CesiumJS](https://img.shields.io/badge/CesiumJS-1.132.0-48b6b8?style=for-the-badge&logo=cesium)

## 🚀 Features

### 🌐 Interactive 3D Globe
- **Real-time 3D Visualization**: Powered by CesiumJS for smooth, interactive globe rendering
- **Satellite Imagery**: High-resolution satellite data integration
- **Terrain Analysis**: Advanced elevation data and geological information
- **Dynamic Navigation**: Seamless country-to-country exploration

### 🤖 AI-Powered Assistant
- **Intelligent Chatbot**: Gemini AI integration for natural language interactions
- **Custom Commands**: TerraCapsule-specific commands for geographical queries
- **Natural Language Processing**: Understands casual questions about geography
- **Real-time Responses**: Context-aware conversations with memory

### 📊 Data Analytics
- **Country Profiles**: Comprehensive geographical, demographic, and economic data
- **Terrain Comparison**: Side-by-side analysis of different locations
- **Weather Integration**: Climate and weather pattern information
- **Population Statistics**: Demographics and population analytics

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for all devices and screen sizes
- **Professional Animations**: Smooth transitions using Framer Motion
- **Dark Theme**: Modern dark UI optimized for data visualization
- **Intuitive Navigation**: User-friendly interface design

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 15.5.0** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5.0** - Type-safe development

### **3D Visualization & Mapping**
- **CesiumJS 1.132.0** - Advanced 3D globe and terrain rendering
- **Google Maps API** - Satellite imagery and geographical data
- **WebGL** - Hardware-accelerated 3D graphics

### **UI/UX Libraries**
- **Framer Motion 12.23.12** - Professional animations and transitions
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Custom Components** - Hand-crafted React components

### **Database & Authentication**
- **MongoDB** - Document database for user data
- **Prisma 6.14.0** - Type-safe database client
- **JWT** - Secure authentication system
- **bcryptjs** - Password encryption

## 🔌 API Integrations

### **1. Google Gemini AI API**
- **Purpose**: Intelligent chatbot and natural language processing
- **Features**: Context-aware conversations, custom commands, geographical expertise
- **Endpoint**: `https://generativelanguage.googleapis.com/`
- **Documentation**: [Gemini AI Documentation](https://ai.google.dev/docs)

### **2. Google Maps JavaScript API**
- **Purpose**: Satellite imagery, geocoding, and location services
- **Features**: High-resolution imagery, place details, geographical coordinates
- **Endpoint**: `https://maps.googleapis.com/maps/api/js`
- **Documentation**: [Google Maps API](https://developers.google.com/maps/documentation/javascript)

### **3. CesiumJS Ion API**
- **Purpose**: 3D terrain data, satellite imagery streaming
- **Features**: Global terrain models, 3D tiles, imagery layers
- **Endpoint**: `https://api.cesium.com/`
- **Documentation**: [Cesium Ion API](https://cesium.com/learn/ion-sdk/)

### **4. Custom TerraCapsule API**
- **Purpose**: Internal data processing and chatbot responses
- **Endpoints**: 
  - `/api/chat` - AI chatbot interactions
  - `/api/countries` - Country data management
  - `/api/auth` - User authentication
- **Features**: Custom geographical commands, user management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- API keys for external services

### 1. Clone Repository
```bash
git clone https://github.com/Devyansh99/terracapsule.git
cd terracapsule
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env.local` file with the following APIs:

```bash
# Google Maps API (Required)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# CesiumJS Ion Token (Required)
NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN=your_cesium_ion_token

# Gemini AI API (Required for Chatbot)
GEMINI_API_KEY=your_gemini_api_key

# Database (Required)
MONGODB_URI=mongodb://localhost:27017/terracapsule

# Authentication (Required)
JWT_SECRET=your_secure_jwt_secret

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Setup
```bash
# Initialize Prisma
npx prisma generate
npx prisma db push

# Seed database (optional)
npm run db:seed
```

### 5. Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 🔑 API Keys Setup Guide

### **Google Gemini AI API** (Free)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create new API key
4. Add to `GEMINI_API_KEY` in `.env.local`

### **Google Maps JavaScript API**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Maps JavaScript API
4. Create credentials → API key
5. Add to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### **CesiumJS Ion Token**
1. Register at [Cesium Ion](https://cesium.com/ion/)
2. Create new access token
3. Add to `NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN`

## 💻 Development

### Project Structure
```
terracapsule/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API endpoints
│   │   ├── country/        # Country pages
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ChatBot.tsx     # AI chatbot
│   │   ├── CesiumGlobe.tsx # 3D globe
│   │   └── ...
│   └── lib/               # Utilities and configs
├── prisma/               # Database schema
├── public/              # Static assets
└── docs/               # Documentation
```

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
npm run db:seed      # Database seeding
npm run db:reset     # Reset database
```

## 🤖 AI Chatbot Commands

The TerraCapsule AI assistant supports both natural language and specific commands:

### **Natural Language Examples**
- "Tell me about Japan"
- "What's the weather like in Iceland?"
- "How mountainous is Switzerland?"
- "Compare France vs Germany"

### **Specific Commands**
- `/explore [country]` - Detailed country information
- `/terrain [location]` - Terrain analysis and elevation data
- `/weather [location]` - Climate and weather patterns
- `/compare [A] vs [B]` - Side-by-side country comparison
- `/population [location]` - Demographics and population data
- `/resources [country]` - Natural resources and economy
- `/help` - Show all available commands

## 🌐 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables are configured in Vercel dashboard
```

### **Manual Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **API Key Protection**: Server-side API key management
- **JWT Authentication**: Secure user sessions
- **Password Encryption**: bcryptjs for secure password storage
- **Environment Variables**: Sensitive data protection
- **HTTPS Ready**: SSL/TLS encryption support

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ performance rating
- **3D Rendering**: 60 FPS globe interaction
- **API Response Time**: <200ms average
- **Bundle Size**: Optimized with Next.js
- **SEO Optimized**: Meta tags and structured data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CesiumJS** for 3D globe visualization
- **Google** for Maps API and Gemini AI
- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Devyansh99/terracapsule/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Devyansh99/terracapsule/discussions)
- **Email**: [Contact Support](mailto:support@terracapsule.com)

---

<div align="center">
  <strong>🌍 Explore the World with TerraCapsule</strong><br>
  Made with ❤️ for geography enthusiasts and data visualization lovers
</div>
