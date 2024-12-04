import React, { useState } from 'react';
import { User, Tractor, ShoppingCart, Home } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { LoginPage } from './LoginPage';

type UserRole = 'farmer' | 'buyer' | 'landlord' | 'renter';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function RegisterPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const authService = new AuthService();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const roleOptions: RoleOption[] = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Sell your produce and rent equipment',
      icon: <Tractor className="h-6 w-6" />
    },
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Purchase fresh produce directly from farmers',
      icon: <ShoppingCart className="h-6 w-6" />
    },
    {
      id: 'landlord',
      title: 'Landlord',
      description: 'Lease your land and equipment',
      icon: <Home className="h-6 w-6" />
    },
    {
      id: 'renter',
      title: 'Renter',
      description: 'Rent land and equipment for farming',
      icon: <User className="h-6 w-6" />
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      const success = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        selectedRole!
      );
      if (success) {
        onNavigate('login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Join Agriscrow
        </h1>

        {/* Role Selection */}
        {!selectedRole && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Select your role
            </h2>
            {roleOptions.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-50 rounded-full text-green-700">
                    {role.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-gray-600">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Registration Form */}
        {selectedRole && (
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <button 
                onClick={() => setSelectedRole(null)}
                className="text-green-700 hover:text-green-600"
              >
                ← Back
              </button>
              <h2 className="text-xl font-semibold text-gray-700">
                Register as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  required
                />
              </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Create Account
              </button>

              <p className="text-center text-gray-600 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-green-700 hover:text-green-600"
                >
                  Login here
                </button>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}