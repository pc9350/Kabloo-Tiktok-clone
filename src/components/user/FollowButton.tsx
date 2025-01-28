'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
}

export function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleFollow = async () => {
    if (!user || user.id === targetUserId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.followed);
      }
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.id === targetUserId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full text-sm font-semibold ${
        isFollowing
          ? 'bg-gray-200 text-black hover:bg-red-100 hover:text-red-500'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } transition-colors disabled:opacity-50`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}