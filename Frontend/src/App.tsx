import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { FeaturedProducts } from './components/marketplace/FeaturedProducts';
import { MarketplacePage } from './components/marketplace/MarketplacePage';
import { RentalPage } from './components/equipment/RentalPage';
import { SellPage } from './components/sell/SellPage';
import { CommunityPage } from './components/community/CommunityPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { LoginPage } from './components/auth/LoginPage';
import { FarmerDashboard } from './components/dashboard/FarmerDashboard';
import { BuyerDashboard } from './components/dashboard/BuyerDashboard';
import { LandlordDashboard } from './components/dashboard/LandlordDashboard';
import { RenterDashboard }  from './components/dashboard/RenterDashboard';

interface UserInfo {
  name: string;
  email: string;
  role: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (storedAuth === 'true' && storedUserInfo) {
      setIsAuthenticated(true);
      setUserInfo(JSON.parse(storedUserInfo));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'logout') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userInfo');
      setIsAuthenticated(false);
      setUserInfo(null);
      setCurrentPage('home');
    } else {
      setCurrentPage(page);
    }
  };

  const renderDashboard = () => {
    if (!userInfo) return null;

    switch (userInfo.role) {
      case 'farmer':
        return <FarmerDashboard userInfo={userInfo} />;
      case 'buyer':
        return <BuyerDashboard userInfo={userInfo} />;
      case 'landlord':
        return <LandlordDashboard userInfo={userInfo} />;
      case 'renter':
        return <RenterDashboard userInfo={userInfo} />;
      default:
        return null;
    }
  };

  const renderPage = () => {
    if (isAuthenticated && currentPage === 'dashboard') {
      return renderDashboard();
    }

    switch (currentPage) {
      case 'marketplace':
        return <MarketplacePage />;
      case 'rent':
        return <RentalPage />;
      case 'sell':
        return <SellPage onNavigate={handleNavigate} />;
      case 'community':
        return <CommunityPage />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} setIsAuthenticated={setIsAuthenticated} setUserInfo={setUserInfo} />;
      default:
        return (
          <>
            <Hero />
            <FeaturedProducts />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onNavigate={handleNavigate} 
        isAuthenticated={isAuthenticated} 
        userInfo={userInfo}
      />
      {renderPage()}
    </div>
  );
}

export default App;