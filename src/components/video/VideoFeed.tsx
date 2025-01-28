'use client';

import { useState, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import type { VideoWithCreator } from '@/lib/types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';


interface VideoFeedProps {
  initialVideos: VideoWithCreator[];
}

export function VideoFeed({ initialVideos }: VideoFeedProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [videos] = useState(initialVideos);

  useEffect(() => {
    setIsClient(true); // Ensure the component is fully mounted before initializing virtualizer
  }, []);


  const virtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isClient ? window.innerHeight : 0),
    overscan: 2,
  });

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>Loading videos...</p>
      </div>
    );
  }
  
  return (
    <div 
      ref={parentRef} 
      className="snap-y snap-mandatory h-screen w-full overflow-y-scroll"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const video = videos[virtualItem.index];
          return (
            <div
              key={video.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <VideoCard 
                key={video.id}
                id={video.id}
                url={video.url}
                caption={video.caption || ''}
                creator={{
                  id: video.creator.id,
                  username: video.creator.username,
                  avatar: video.creator.avatar
                }}
                likes={video._count.likes}
                comments={video._count.comments}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}