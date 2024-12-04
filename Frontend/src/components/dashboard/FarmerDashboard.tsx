import React, { useState, useEffect } from 'react';
import { Tractor, Package, DollarSign, Calendar } from 'lucide-react';

interface FarmerDashboardProps {
  userInfo: {
    name: string;
    email: string;
    id: number;
  };
}

interface Product {
  id: number;
  title: string;
  price: number;
  status: string;
  // ... other fields
}

export function FarmerDashboard({ userInfo }: FarmerDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/farmer/products/${userInfo.id}`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchProducts();
    }
  }, [userInfo]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {userInfo.name}</h1>
        <p className="text-gray-600">{userInfo.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Products</h2>
          </div>
          <p className="text-3xl font-bold">{products.length}</p>
          <p className="text-gray-600">Active Listings</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Sales</h2>
          </div>
          <p className="text-3xl font-bold">$2,450</p>
          <p className="text-gray-600">This Month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Tractor className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Equipment</h2>
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-gray-600">Rented Items</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Orders</h2>
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-gray-600">Pending Delivery</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* Add recent activity list here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Add New Product
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              View Orders
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              Rent Equipment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 