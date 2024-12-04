import React from 'react';
import { Calendar, DollarSign, Clock } from 'lucide-react';

interface EquipmentCardProps {
  title: string;
  price: number;
  image: string;
  availability: string;
  description: string;
}

function EquipmentCard({ title, price, image, availability, description }: EquipmentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-green-700">
            <DollarSign className="h-5 w-5 mr-1" />
            <span className="text-xl font-bold">${price}/day</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{availability}</span>
          </div>
        </div>
        <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-600">
          Rent Now
        </button>
      </div>
    </div>
  );
}

export function RentalPage() {
  const equipment = [
    {
      title: "Modern Tractor",
      price: 150,
      image: "https://images.unsplash.com/photo-1530267981375-f08dd9317ec8?auto=format&fit=crop&q=80",
      availability: "Available Now",
      description: "High-performance tractor suitable for large-scale farming operations."
    },
    {
      title: "Harvester",
      price: 200,
      image: "https://images.unsplash.com/photo-1570800818746-d6d69b4b2de9?auto=format&fit=crop&q=80",
      availability: "Available from 03/25",
      description: "Efficient grain harvester with advanced features for quick harvesting."
    },
    {
      title: "Seeding Machine",
      price: 75,
      image: "https://images.unsplash.com/photo-1589345307356-dded6184ad45?auto=format&fit=crop&q=80",
      availability: "Available Now",
      description: "Precision seeding machine for accurate and efficient planting."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Equipment Rental</h1>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
          <Calendar className="h-5 w-5" />
          <span>View Calendar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item, index) => (
          <EquipmentCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}