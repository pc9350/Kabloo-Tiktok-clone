'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CommentsSection } from './CommentsSection';


interface VideoInteractionsProps {
  videoId: string;
  initialLikes: number;
  initialComments: number;
  onCommentClick: () => void;
}

export function VideoInteractions({ videoId, initialLikes, initialComments }: VideoInteractionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { user, isLoaded } = useUser();

  // Check if user has liked the video on component mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/videos/${videoId}/likes`);
        if (response.ok) {
          const { hasLiked } = await response.json();
          setIsLiked(hasLiked);
        }
      } catch (error) {
        console.error('Failed to check like status:', error);
      }
    };

    checkLikeStatus();
  }, [videoId, user]);
  
  const handleLike = async () => {
    if (!user || isLiking) return;

    try {
        setIsLiking(true);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);
        await fetch(`/api/videos/${videoId}/likes`, {
            method: isLiked ? 'DELETE' : 'POST',
          });

      } catch (error) {
        setLikes(prev => isLiked ? prev + 1 : prev - 1);
        setIsLiked(isLiked);
        console.error('Failed to like video:', error);
      } finally {
        setIsLiking(false);
      }
    };

  return (
    <>
    <div className="absolute right-4 bottom-12 flex flex-col gap-4">
      <button 
        onClick={handleLike}
        disabled={!isLoaded || isLiking || !user}
        type='button'
        className={`p-3 rounded-full bg-gray-800/60 transition-all hover:bg-gray-700/60 
            ${isLiking ? 'opacity-50' : ''}`}
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
        type='button'
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">💬</span>
          <span className="text-white text-xs">{initialComments}</span>
        </div>
      </button>

      <button className="p-3 rounded-full bg-gray-800/60 transition-all hover:bg-gray-700/60"
        type='button'
      >
        <span className="text-2xl">📤</span>
      </button>
    </div>

    {showComments && (
        <CommentsSection
          videoId={videoId}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
}