import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUserInfo: (info: any) => void;
}

export function LoginPage({ onNavigate, setIsAuthenticated, setUserInfo }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const authService = new AuthService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await authService.login(formData.email, formData.password);
      if (result.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify(result.data));
        setIsAuthenticated(true);
        setUserInfo(result.data);
        onNavigate('dashboard');
      } else {
        alert(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Welcome Back to Agriscrow
        </h1>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-sm text-green-700 hover:text-green-600 mt-1"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </button>

            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-green-700 hover:text-green-600"
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}