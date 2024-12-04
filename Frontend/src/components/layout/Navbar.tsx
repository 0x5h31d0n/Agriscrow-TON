import React, { useState } from 'react';
import { Tractor, User, Menu, LogIn } from 'lucide-react';
import { WalletConnect } from '../wallet/WalletConnect';

interface NavbarProps {
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  userInfo: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Navbar({ onNavigate, isAuthenticated, userInfo }: NavbarProps) {
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <nav className="bg-green-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <Tractor className="h-6 w-6" />
          <span className="text-xl font-bold">Agriscrow</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <button onClick={() => onNavigate('marketplace')} className="hover:text-green-200">
            Marketplace
          </button>
          <button onClick={() => onNavigate('rent')} className="hover:text-green-200">
            Rent Equipment
          </button>
          <button onClick={() => onNavigate('sell')} className="hover:text-green-200">
            Sell Produce
          </button>
          <button onClick={() => onNavigate('community')} className="hover:text-green-200">
            Community
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <WalletConnect />
          
          {/* Auth Buttons */}
          <div className="relative">
            <button 
              onClick={() => setShowAuthMenu(!showAuthMenu)}
              className="flex items-center space-x-1 hover:text-green-200"
            >
              <User className="h-5 w-5" />
              <span className="hidden md:inline">
                {isAuthenticated ? userInfo?.name : 'Account'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showAuthMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setShowAuthMenu(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 w-full text-left"
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('logout');
                        setShowAuthMenu(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setShowAuthMenu(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 w-full text-left"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('register');
                        setShowAuthMenu(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 w-full text-left"
                    >
                      <User className="h-4 w-4" />
                      <span>Register</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Menu className="h-6 w-6 md:hidden cursor-pointer" />
        </div>
      </div>
    </nav>
  );
}