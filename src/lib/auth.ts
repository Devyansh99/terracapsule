// Simple mock auth for testing modals
export const useAuth = () => ({
  login: async (email: string, password: string) => {
    console.log('Mock login attempt:', email, password);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - simulate error for demo@example.com
    if (email === 'error@test.com') {
      throw new Error('Invalid email or password');
    }
    
    // Mock success
    console.log('Login successful!');
    alert('Welcome back! Login successful.');
    return { success: true };
  },
  register: async (name: string, email: string, password: string) => {
    console.log('Mock register attempt:', name, email, password);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - simulate error for existing email
    if (email === 'exists@test.com') {
      throw new Error('Email already exists');
    }
    
    // Mock success
    console.log('Registration successful!');
    alert(`Welcome ${name}! Account created successfully.`);
    return { success: true };
  }
});
