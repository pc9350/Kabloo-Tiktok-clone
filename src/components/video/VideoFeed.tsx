'use client';

import { useState } from 'react';
import { VideoCard } from './VideoCard';
import type { Video, User, VideoWithCreator } from '@/lib/types';



interface VideoFeedProps {
  initialVideos: VideoWithCreator[];
}

export function VideoFeed({ initialVideos }: VideoFeedProps) {
  const [videos] = useState(initialVideos);

  return (
    <div className="snap-y snap-mandatory h-screen w-full overflow-y-scroll">
      {videos.map((video) => (
        <VideoCard 
          key={video.id}
          id={video.id}
          url={video.url}
          caption={video.caption || ''}
          creator={{
            username: video.creator.username,
            avatar: video.creator.avatar
          }}
          likes={video._count.likes}
          comments={video._count.comments}
        />
      ))}
    </div>
  );
}