import React from 'react';
import { MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

interface PostCardProps {
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export function PostCard({ author, avatar, content, image, likes, comments, timestamp }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h3 className="font-semibold">{author}</h3>
          <p className="text-gray-500 text-sm">{timestamp}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{content}</p>
      {image && (
        <img src={image} alt="Post content" className="rounded-lg mb-4 w-full" />
      )}
      <div className="flex items-center space-x-6 text-gray-500">
        <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
          <ThumbsUp className="h-5 w-5" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
          <MessageSquare className="h-5 w-5" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}