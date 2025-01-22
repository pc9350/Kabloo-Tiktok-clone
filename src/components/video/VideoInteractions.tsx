'use client';

import { VideoComment } from '@/lib/types';
import { useState } from 'react';

interface VideoInteractionsProps {
  videoId: string;
  initialLikes: number;
  initialComments: VideoComment[];
  onCommentClick: () => void;
}

export function VideoInteractions({ videoId, initialLikes, initialComments }: VideoInteractionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showComments, setShowComments] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: Send to API
  };

  return (
    <div className="absolute right-4 bottom-20 flex flex-col gap-4">
      <button 
        onClick={handleLike}
        className="p-3 rounded-full bg-gray-800/60 transition-all hover:bg-gray-700/60"
      >
        <div className="flex flex-col items-center">
          <span className={`text-2xl ${isLiked ? 'text-red-500' : 'text-white'}`}>
            ❤️
          </span>
          <span className="text-white text-xs">{likes}</span>
        </div>
      </button>

      <button 
        onClick={() => setShowComments(true)}
        className="p-3 rounded-full bg-gray-800/60 transition-all hover:bg-gray-700/60"
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">💬</span>
          <span className="text-white text-xs">{initialComments.length}</span>
        </div>
      </button>

      <button className="p-3 rounded-full bg-gray-800/60 transition-all hover:bg-gray-700/60">
        <span className="text-2xl">📤</span>
      </button>
    </div>
  );
}