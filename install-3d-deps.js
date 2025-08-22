// Package installation script for 3D and API enhancements

const { execSync } = require('child_process');

console.log('🚀 Installing TerraCapsule 3D Enhancement Dependencies...\n');

const packages = {
  '3D Graphics': [
    'three@^0.160.0',
    '@react-three/fiber@^8.15.0', 
    '@react-three/drei@^9.92.0',
    '@react-three/postprocessing@^2.15.0'
  ],
  'API & Data': [
    'axios@^1.6.0',
    'swr@^2.2.0',
    'date-fns@^3.0.0'
  ],
  'Development': [
    '@types/three@^0.160.0'
  ]
};

function installPackages() {
  try {
    console.log('📦 Installing production dependencies...\n');
    
    Object.entries(packages).forEach(([category, pkgs]) => {
      console.log(`Installing ${category} packages:`);
      pkgs.forEach(pkg => console.log(`  - ${pkg}`));
      
      const isDevDeps = category === 'Development';
      const installCmd = `npm install ${isDevDeps ? '--save-dev' : ''} ${pkgs.join(' ')}`;
      
      execSync(installCmd, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log(`✅ ${category} packages installed\n`);
    });
    
    console.log('🎉 All dependencies installed successfully!');
    console.log('\nNext steps:');
    console.log('1. Create .env.local with API keys');
    console.log('2. Add Earth textures to /public/textures/');
    console.log('3. Replace Globe3D with EnhancedGlobe3D');
    console.log('4. Test the enhanced 3D globe\n');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.log('\nManual installation:');
    console.log('Run: npm install three @react-three/fiber @react-three/drei @react-three/postprocessing axios swr date-fns');
    console.log('Dev: npm install -D @types/three');
  }
}

if (require.main === module) {
  installPackages();
}

module.exports = { installPackages, packages };
