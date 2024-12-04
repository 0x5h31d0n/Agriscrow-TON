import React from 'react';
import { Shield, Coins, Users, Leaf, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <div className={`group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300
      transform hover:-translate-y-1 border border-gray-100 hover:border-green-100
      ${index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'}`}>
      <div className="text-green-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center text-green-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export function FeatureCards() {
  const features = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Secure Escrow",
      description: "Trade with confidence using our blockchain-based escrow system that protects both buyers and sellers."
    },
    {
      icon: <Coins className="h-10 w-10" />,
      title: "TON Integration",
      description: "Seamless payments using TON cryptocurrency, enabling fast and low-cost transactions."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Direct Trading",
      description: "Connect directly with farmers and buyers, eliminating intermediaries and reducing costs."
    },
    {
      icon: <Leaf className="h-10 w-10" />,
      title: "Sustainable Agriculture",
      description: "Support sustainable farming practices and contribute to a greener future."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Why Choose Agriscrow?
          </h2>
          <p className="text-lg text-gray-600">
            Experience the future of agricultural trading with our secure, efficient, and sustainable platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 