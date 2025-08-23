'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl mb-8">TerraCapsule Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">✅ Basic React Rendering</h2>
          <p>If you can see this, React is working correctly.</p>
        </div>
        
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">✅ Tailwind CSS</h2>
          <p>If this has proper styling, Tailwind is working.</p>
        </div>
        
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">🔄 Environment Variables</h2>
          <p>Cesium Token Available: {process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN ? '✅ Yes' : '❌ No'}</p>
        </div>
        
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">🌐 Back to Main Site</h2>
          <a href="/" className="text-blue-400 hover:text-blue-300">← Go back to main site</a>
        </div>
      </div>
    </div>
  );
}
