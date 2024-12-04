import React from 'react';

export function TrendingSidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
        <div className="space-y-3">
          <a href="#" className="block text-green-700 hover:text-green-600">#OrganicFarming</a>
          <a href="#" className="block text-green-700 hover:text-green-600">#Sustainability</a>
          <a href="#" className="block text-green-700 hover:text-green-600">#SmartAgriculture</a>
          <a href="#" className="block text-green-700 hover:text-green-600">#FarmingTips</a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Organic Farming Workshop</h3>
            <p className="text-gray-500">March 25, 2024</p>
          </div>
          <div>
            <h3 className="font-semibold">Agricultural Tech Expo</h3>
            <p className="text-gray-500">April 10, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}