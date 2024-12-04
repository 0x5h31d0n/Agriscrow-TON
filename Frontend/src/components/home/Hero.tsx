import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { FeatureCards } from './FeatureCards';

export function Hero() {
  return (
    <>
      <div className="relative bg-gradient-to-br from-green-50 to-green-100">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-green-200 opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-green-200 opacity-20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 sm:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-green-800 text-sm font-medium shadow-sm">
                <ShieldCheck className="h-5 w-5" />
                Secure Blockchain-Based Trading
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Revolutionizing
                  <span className="text-green-700"> Agricultural</span> Trade
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                  Connect directly with farmers, buy fresh produce, rent equipment, and participate 
                  in a transparent agricultural ecosystem powered by blockchain technology.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-700 text-white px-8 py-4 rounded-xl hover:bg-green-600 
                  transform hover:scale-105 transition-all flex items-center justify-center group">
                  Start Trading
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-green-700 text-green-700 px-8 py-4 rounded-xl 
                  hover:bg-green-50 transform hover:scale-105 transition-all">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-green-700">2.5K+</div>
                  <div className="text-sm text-gray-600">Active Farmers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">$1.2M</div>
                  <div className="text-sm text-gray-600">Trade Volume</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">15K+</div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-2xl transform rotate-6"></div>
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80"
                alt="Farm landscape"
                className="rounded-2xl object-cover w-full h-[500px] shadow-2xl transform hover:-rotate-2 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      <FeatureCards />
    </>
  );
}