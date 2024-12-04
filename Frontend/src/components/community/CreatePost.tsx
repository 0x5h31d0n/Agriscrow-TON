import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface CreatePostProps {
  onPost: (content: string) => void;
}

export function CreatePost({ onPost }: CreatePostProps) {
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    if (postContent.trim()) {
      onPost(postContent);
      setPostContent('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
        rows={3}
        placeholder="Share your farming experience..."
      />
      <div className="flex justify-between items-center mt-4">
        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600">
          <Camera className="h-5 w-5" />
          <span>Add Photo</span>
        </button>
        <button 
          onClick={handlePost}
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
        >
          Post
        </button>
      </div>
    </div>
  );
}