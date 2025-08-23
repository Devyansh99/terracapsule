# Google Maps API Setup Guide for TerraCapsule

This guide will help you set up Google Maps JavaScript API to enable the Google Earth-like globe feature in your TerraCapsule application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select an existing project
3. Give your project a meaningful name like "TerraCapsule-Maps"
4. Note down your Project ID

## Step 2: Enable Google Maps JavaScript API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Maps JavaScript API"
3. Click on **"Maps JavaScript API"** from the results
4. Click **"ENABLE"**

## Step 3: Create API Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **"API Key"**
3. Copy the generated API key
4. Click **"RESTRICT KEY"** (recommended for security)

## Step 4: Configure API Key Restrictions

### Application Restrictions (Choose one):
- **HTTP referrers (websites)** - Recommended for web apps
  - Add your domain: `https://yourdomain.com/*`
  - For localhost development: `http://localhost:3000/*`

### API Restrictions:
1. Click **"Restrict key"**
2. Select **"Maps JavaScript API"**
3. Also enable:
   - Geocoding API (for country detection)
   - Places API (for enhanced location features)

## Step 5: Set Up Environment Variables

1. In your project root, create or edit `.env.local`:

```env
# Google Maps API Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE

# Optional: Set additional Maps configuration
NEXT_PUBLIC_GOOGLE_MAPS_VERSION=weekly
```

2. Replace `YOUR_API_KEY_HERE` with your actual API key from Step 3

## Step 6: Restart Your Development Server

```bash
npm run dev
```

The Google Earth globe should now load with real satellite imagery and interactive features!

## Features Included

✅ **Real Satellite Imagery** - Authentic Google Earth visuals
✅ **Country Detection** - Click any country to see its name
✅ **Smooth Rotation** - Auto-rotating globe that pauses on hover
✅ **Mouse Controls** - Drag to control the globe manually
✅ **Dark Theme** - Custom styled to match TerraCapsule design
✅ **Loading States** - Proper loading indicators and error handling

## Troubleshooting

### Common Issues:

1. **"Loading Google Earth..." stuck forever**
   - Check if your API key is correctly set in `.env.local`
   - Verify the API key has Maps JavaScript API enabled
   - Check browser console for error messages

2. **"Referer blocked" errors**
   - Add your domain to HTTP referrer restrictions
   - For development, ensure `http://localhost:3000/*` is allowed

3. **"Quota exceeded" errors**
   - Check your Google Cloud Console for usage limits
   - Google Maps has generous free tier: 28,000 map loads per month

4. **Country clicks not working**
   - Ensure Geocoding API is enabled in your Google Cloud project
   - Verify your API key has access to Geocoding API

### Cost Information:
- Maps JavaScript API: **FREE** for first 28,000 loads/month
- Geocoding API: **FREE** for first 40,000 requests/month
- Most personal/demo projects will stay within free limits

### Security Best Practices:
1. ✅ Always restrict your API keys
2. ✅ Use HTTP referrer restrictions for web apps
3. ✅ Monitor usage in Google Cloud Console
4. ✅ Never commit API keys to version control
5. ✅ Rotate API keys periodically

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key restrictions in Google Cloud Console
3. Ensure all required APIs are enabled
4. Test with a fresh API key if problems persist

---

**Next Steps**: Once the Google Earth globe is working, you can enhance it further with:
- Custom markers for travel destinations
- Flight path animations
- Weather overlay integration
- 3D building overlays in urban areas
