import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// TerraCapsule custom commands and context
const TERRACAPSULE_CONTEXT = `
You are TerraCapsule Assistant, a friendly and helpful AI for the TerraCapsule platform - a 3D geographic visualization app.

PERSONALITY:
- Be conversational, friendly, and enthusiastic about geography
- Use simple language, avoid technical jargon
- Keep responses under 150 words and easy to read
- Use emojis naturally (🌍 🏔️ 🌊 etc.)
- Be encouraging and make geography exciting

ABOUT TERRACAPSULE:
TerraCapsule lets you explore the world in 3D with satellite imagery, terrain analysis, and interactive maps.

COMMANDS (but also respond to natural language):
- /explore [country] → Country overview with key facts
- /terrain [location] → Landscape and elevation info
- /weather [location] → Climate and weather patterns
- /compare [A] vs [B] → Side-by-side comparison
- /population [place] → Demographics and population data
- /resources [country] → Natural resources and economy
- /help → Show available features

NATURAL LANGUAGE SUPPORT:
- "Tell me about Japan" = /explore Japan
- "What's the terrain like in Alps?" = /terrain Alps
- "How's the weather in Iceland?" = /weather Iceland
- Understand and respond to casual questions naturally

RESPONSE STYLE:
- Start with the most interesting fact
- Use bullet points sparingly, prefer flowing text
- End with a friendly follow-up question or suggestion
- Make every response engaging and informative
`;

// Add natural language to command mapping
function detectIntent(message: string): { command: string | null, location: string | null } {
  const msg = message.toLowerCase();
  
  // Natural language patterns
  if (msg.includes('tell me about') || msg.includes('what is') || msg.includes('about')) {
    const location = message.replace(/tell me about|what is|about/i, '').trim();
    return { command: 'explore', location };
  }
  
  if (msg.includes('terrain') || msg.includes('landscape') || msg.includes('mountains') || msg.includes('elevation')) {
    const location = message.replace(/terrain|landscape|mountains|elevation|like in|in the|what's|how's/gi, '').trim();
    return { command: 'terrain', location };
  }
  
  if (msg.includes('weather') || msg.includes('climate') || msg.includes('temperature')) {
    const location = message.replace(/weather|climate|temperature|like in|in|what's|how's/gi, '').trim();
    return { command: 'weather', location };
  }
  
  if (msg.includes('population') || msg.includes('people') || msg.includes('demographics')) {
    const location = message.replace(/population|people|demographics|many|how|live|in/gi, '').trim();
    return { command: 'population', location };
  }
  
  if (msg.includes('compare') || msg.includes('vs') || msg.includes('versus') || msg.includes('difference')) {
    return { command: 'compare', location: message };
  }
  
  return { command: null, location: null };
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.'
      }, { status: 500 });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Check if it's a custom TerraCapsule command or natural language
    const isCustomCommand = message.startsWith('/');
    const naturalIntent = !isCustomCommand ? detectIntent(message) : null;
    
    // Build conversation context
    let prompt = TERRACAPSULE_CONTEXT + '\n\n';
    
    if (history && history.length > 0) {
      // Only include last 5 messages to keep context manageable
      const recentHistory = history.slice(-5);
      prompt += 'RECENT CONVERSATION:\n';
      recentHistory.forEach((msg: any) => {
        prompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}\n`;
      });
      prompt += '\n';
    }
    
    if (isCustomCommand) {
      prompt += `COMMAND: "${message}"\nRespond according to the command guidelines above.\n\n`;
    } else if (naturalIntent?.command) {
      prompt += `NATURAL LANGUAGE detected as: /${naturalIntent.command} ${naturalIntent.location}\nRespond naturally as if the user used this command.\n\n`;
    } else {
      prompt += `GENERAL QUESTION about geography/exploration. Be helpful and suggest TerraCapsule features.\n\n`;
    }
    
    prompt += `User: ${message}\n\nTerraCapsule Assistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response and make it more natural
    text = text.replace(/TerraCapsule Assistant:\s*/i, '');
    text = text.replace(/^\*\*TerraCapsule Assistant\*\*:\s*/i, '');
    
    // Add contextual suggestions (more natural)
    let enhancedResponse = text;
    
    if (!isCustomCommand && !text.includes('💡') && !text.includes('/')) {
      if (message.toLowerCase().includes('country') || naturalIntent?.command === 'explore') {
        enhancedResponse += '\n\n💡 Want more details? Just ask "tell me about [country name]"!';
      } else if (message.toLowerCase().includes('terrain') || message.toLowerCase().includes('mountain')) {
        enhancedResponse += '\n\n🏔️ Try asking about specific mountain ranges or terrain!';
      } else if (message.toLowerCase().includes('weather') || message.toLowerCase().includes('climate')) {
        enhancedResponse += '\n\n🌦️ I can tell you about climate in any location!';
      }
    }

    return NextResponse.json({
      success: true,
      message: enhancedResponse,
      isCustomCommand,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback response if Gemini fails
    const fallbackResponses = [
      "I'm having a quick connection hiccup! 😅 But I'm still here to help with TerraCapsule. Ask me about any country or location!",
      "My AI brain is taking a coffee break ☕ But I can still chat about geography! What place interests you?",
      "Oops! Technical glitch on my end 🤖 But let's talk geography - what would you like to explore?",
      "Connection's a bit slow right now, but I'm ready to help! Try asking about countries, terrain, or weather anywhere in the world! 🌍"
    ];
    
    return NextResponse.json({
      success: true,
      message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      isCustomCommand: false,
      fallback: true,
      timestamp: new Date().toISOString()
    });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'TerraCapsule AI Assistant API is running',
    endpoints: {
      POST: 'Send a message to the AI assistant',
    },
    commands: [
      '/explore [country] - Get detailed country information',
      '/terrain [location] - Analyze terrain features',
      '/navigate [destination] - Navigation assistance',
      '/compare [country1] vs [country2] - Compare countries',
      '/weather [location] - Climate information',
      '/population [location] - Demographics data',
      '/resources [country] - Natural resources info',
      '/help - Show all commands',
      '/features - TerraCapsule capabilities',
      '/demo - Suggested explorations'
    ]
  });
}
