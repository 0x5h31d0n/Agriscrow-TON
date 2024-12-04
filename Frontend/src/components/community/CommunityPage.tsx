import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { CommunityTabs } from './CommunityTabs';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { TrendingSidebar } from './TrendingSidebar';

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');

  const posts = [
    {
      author: "John Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      content: "Just harvested our first batch of organic tomatoes for the season! The yield is looking great this year thanks to the new irrigation system.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80",
      likes: 24,
      comments: 6,
      timestamp: "2 hours ago"
    },
    {
      author: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      content: "Looking for advice on organic pest control methods for apple orchards. Has anyone tried companion planting?",
      likes: 15,
      comments: 8,
      timestamp: "5 hours ago"
    }
  ];

  const handlePost = (content: string) => {
    // Implement post creation logic
    console.log('New post:', content);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Farming Community</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600">
          <Users className="h-5 w-5" />
          <span>Join Groups</span>
        </button>
      </div>

      <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CreatePost onPost={handlePost} />
          {posts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>

        <TrendingSidebar />
      </div>
    </div>
  );
}