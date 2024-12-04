import React, { useState, useRef } from 'react';
import { Upload, Camera, DollarSign, MapPin } from 'lucide-react';
import { useTonWallet } from '../wallet/useTonWallet';

interface ProductFormData {
  title: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  description: string;
  image_url?: string;
}

interface SellPageProps {
  onNavigate: (page: string) => void;
}

export function SellPage({ onNavigate }: SellPageProps) {
  const { isConnected, walletAddress, connect } = useTonWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    category: 'Vegetables',
    price: 0,
    quantity: 0,
    unit: 'kg',
    location: '',
    description: '',
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Attempt to connect if not connected
      if (!isConnected || !walletAddress) {
        await connect();
        if (!isConnected) {
          alert('Please connect your wallet to list products');
          return;
        }
      }

      const userStr = localStorage.getItem('userInfo');
      if (!userStr) {
        alert('Please login to list products');
        onNavigate('login');
        return;
      }

      const user = JSON.parse(userStr);
      if (!user.email) {
        alert('Invalid user data. Please login again');
        onNavigate('login');
        return;
      }

      // Validate form data
      if (formData.price <= 0) {
        alert('Price must be greater than 0');
        return;
      }

      if (formData.quantity <= 0) {
        alert('Quantity must be greater than 0');
        return;
      }

      // Upload image if selected
      let image_url = '';
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        
        try {
          const imageResponse = await fetch('http://localhost:5000/api/upload-image', {
            method: 'POST',
            body: imageFormData,
          });
          const imageData = await imageResponse.json();
          if (imageData.success) {
            image_url = imageData.url;
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }

      // Submit product data with wallet address
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image_url,
          seller_email: user.email,
          seller_name: user.name,
          seller_wallet: walletAddress
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Product listed successfully!');
        onNavigate('marketplace');
      } else {
        alert(data.error || 'Failed to list product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to list product. Please check your connection and try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  // Add wallet connection status display
  const renderWalletStatus = () => {
    if (!isConnected) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-700">
            Please connect your wallet to list products. Your wallet address will be used to receive payments.
          </p>
          <button
            type="button"
            onClick={connect}
            className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500"
          >
            Connect Wallet
          </button>
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-green-700">
          Wallet connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">List Your Agricultural Products</h1>

      {renderWalletStatus()}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Product Images
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <div className="relative w-full h-48 mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Drag and drop your images here, or click to select files</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex items-center space-x-2 px-4 py-2 border rounded-lg mx-auto hover:bg-gray-50"
            >
              <Camera className="h-5 w-5" />
              <span>Upload Images</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="e.g., Fresh Organic Tomatoes"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
            >
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
              <option>Equipment</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter quantity"
                  required
                />
                <select 
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 border-l bg-white px-2 py-1 text-sm"
                >
                  <option>kg</option>
                  <option>tons</option>
                  <option>pieces</option>
                  <option>boxes</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="City, State"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              rows={4}
              placeholder="Describe your product..."
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 font-semibold"
          >
            List Product
          </button>
        </div>
      </form>
    </div>
  );
}