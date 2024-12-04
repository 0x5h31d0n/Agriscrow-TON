import React from 'react';
import { Home, Calendar, Clock, Hammer } from 'lucide-react';

interface RenterDashboardProps {
  userInfo: {
    name: string;
    email: string;
  };
}

export function RenterDashboard({ userInfo }: RenterDashboardProps) {
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
            <h2 className="text-lg font-semibold">Active Rentals</h2>
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-gray-600">Current Properties</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Hammer className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Equipment</h2>
          </div>
          <p className="text-3xl font-bold">7</p>
          <p className="text-gray-600">Rented Items</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Upcoming</h2>
          </div>
          <p className="text-3xl font-bold">2</p>
          <p className="text-gray-600">Scheduled Rentals</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">History</h2>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-gray-600">Past Rentals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Rentals</h2>
          {/* Add rental list here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Browse Properties
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              Rent Equipment
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              View Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 