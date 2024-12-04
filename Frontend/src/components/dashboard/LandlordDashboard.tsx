import React from 'react';
import { Home, Key, DollarSign, Users } from 'lucide-react';

interface LandlordDashboardProps {
  userInfo: {
    name: string;
    email: string;
  };
}

export function LandlordDashboard({ userInfo }: LandlordDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {userInfo.name}</h1>
        <p className="text-gray-600">{userInfo.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Home className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Properties</h2>
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-gray-600">Listed Properties</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Active Leases</h2>
          </div>
          <p className="text-3xl font-bold">5</p>
          <p className="text-gray-600">Current Tenants</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Revenue</h2>
          </div>
          <p className="text-3xl font-bold">$12,450</p>
          <p className="text-gray-600">This Month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Inquiries</h2>
          </div>
          <p className="text-3xl font-bold">15</p>
          <p className="text-gray-600">New Requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Property Overview</h2>
          {/* Add property list here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              List New Property
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              View Lease Agreements
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              Manage Equipment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 