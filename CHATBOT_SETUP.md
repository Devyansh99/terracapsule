# TerraCapsule AI Chatbot Setup Guide

## 🤖 Gemini AI Integration

Your TerraCapsule chatbot is now powered by Google's Gemini AI with intelligent responses and custom commands!

## 🚀 Getting Your Free Gemini API Key

### Step 1: Get Your API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select your project or create a new one
5. Copy your API key

### Step 2: Configure the Environment
1. Open `.env.local` file in your project root
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

## ⚡ Custom TerraCapsule Commands

Your AI assistant now supports these intelligent commands:

- `/explore [country]` - Get detailed country information
- `/terrain [location]` - Analyze terrain features and elevation data
- `/navigate [destination]` - Navigation tips and geographical context
- `/compare [country1] vs [country2]` - Compare countries across multiple dimensions
- `/weather [location]` - Climate and weather information
- `/population [country/city]` - Demographics and population statistics
- `/resources [country]` - Natural resources and economic geography
- `/help` or `/commands` - List all available commands
- `/features` - Explain TerraCapsule platform capabilities
- `/demo` - Get suggestions for interesting locations to explore

## 🎯 Features

### Intelligent Responses
- Powered by Google's Gemini Pro model
- Context-aware conversations with memory
- Smart suggestions based on your queries
- Geographical and terrain expertise

### Enhanced UI
- Command detection and highlighting
- Formatted responses with markdown support
- Visual indicators for custom commands
- Real-time command suggestions
- Professional chat interface

### Fallback System
- Graceful handling of API issues
- Offline fallback responses
- Error recovery with helpful messages

## 🔧 Usage Tips

1. **Natural Language**: Ask questions naturally - "What's the terrain like in Switzerland?"
2. **Commands**: Use `/` commands for specific data - `/explore Japan`
3. **Comparisons**: Compare locations - `/compare France vs Germany`
4. **Context**: The AI remembers your conversation for better responses
5. **Exploration**: Ask for suggestions - `/demo` or "show me interesting places"

## 🌍 Example Interactions

```
User: /explore Iceland
Bot: 🇮🇸 **Iceland Overview:**
• **Geography**: Nordic island nation in North Atlantic
• **Terrain**: Volcanic landscapes, glaciers, geysers, waterfalls
• **Climate**: Subarctic oceanic climate
• **Population**: ~370,000 people
• **Capital**: Reykjavík
• **Notable**: Ring Road, Blue Lagoon, Northern Lights

💡 *Try "/terrain Iceland" for detailed geological analysis!*
```

```
User: What's the best way to explore mountains on TerraCapsule?
Bot: Great question! 🏔️ TerraCapsule offers several ways to explore mountainous terrain:

• **3D Visualization**: Use our Cesium-powered globe to view mountains in 3D
• **Elevation Data**: Real-time terrain analysis with elevation profiles
• **Satellite Imagery**: High-resolution satellite views of mountain ranges
• **Interactive Exploration**: Click and explore any mountain range worldwide

Try these commands:
• `/terrain Himalayas` - Analyze the world's highest peaks
• `/explore Switzerland` - Discover Alpine geography
• `/demo` - Get suggested mountain ranges to explore
```

## 🛠️ Development Notes

- API endpoint: `/api/chat`
- Model: Google Gemini Pro
- Context window: Last 10 messages
- Response limit: ~200 words for better UX
- Markdown support: **bold**, bullet points, paragraphs
- Error handling: Automatic fallbacks and retries

## 🔒 Security

- API keys are stored securely in environment variables
- No sensitive data is logged or stored
- All requests are server-side processed
- Conversation history is temporary (client-side only)

## 🎨 Customization

The chatbot appearance and behavior can be customized in:
- `/src/components/ChatBot.tsx` - Main component
- `/src/app/api/chat/route.ts` - AI logic and commands
- Styling is done via inline styles for maximum compatibility

Enjoy exploring the world with your intelligent TerraCapsule assistant! 🌍✨
