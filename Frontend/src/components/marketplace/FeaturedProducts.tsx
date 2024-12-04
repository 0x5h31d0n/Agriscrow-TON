import React from 'react';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const products = [
    {
      title: "Organic Tomatoes",
      price: 2.99,
      location: "California",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80",
      category: "Vegetables"
    },
    {
      title: "Fresh Corn",
      price: 1.49,
      location: "Iowa",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80",
      category: "Grains"
    },
    {
      title: "Tractor Rental",
      price: 75.00,
      location: "Texas",
      image: "https://images.unsplash.com/photo-1530267981375-f08dd9317ec8?auto=format&fit=crop&q=80",
      category: "Equipment"
    },
    {
      title: "Organic Apples",
      price: 3.99,
      location: "Washington",
      image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80",
      category: "Fruits"
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}