// Test script to verify authentication system
async function testRegistration() {
  console.log('Testing user registration...');
  
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    console.log('Registration response:', data);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      return testUser;
    } else {
      console.log('❌ Registration failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return null;
  }
}

async function testLogin(user) {
  console.log('Testing user login...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      }),
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Login error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting authentication system tests...\n');
  
  const user = await testRegistration();
  if (user) {
    console.log('');
    await testLogin(user);
  }
  
  console.log('\n🏁 Tests completed!');
}

runTests();
