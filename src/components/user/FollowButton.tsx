'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface FollowButtonProps {
  targetUserId: string;
  targetClerkId: string; 
  initialIsFollowing: boolean;
  onFollowUpdate?: (isFollowing: boolean) => void;
}

export function FollowButton({ targetUserId, targetClerkId, initialIsFollowing, onFollowUpdate }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing, targetUserId]);

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
        onFollowUpdate?.(data.followed);
      }
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.id === targetClerkId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full text-sm font-semibold ${
        isFollowing
          ? 'bg-gray-200 text-black hover:bg-red-100 hover:text-red-500'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } transition-colors disabled:opacity-50`}
      type="button"
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}