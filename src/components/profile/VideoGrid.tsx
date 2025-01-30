'use client';

import { VideoPreview } from "@/components/video/VideoPreview";
import { useState } from 'react';

interface Video {
  id: string;
  url: string;
  _count: {
    likes: number;
    comments: number;
  };
}

interface VideoGridProps {
  initialVideos: Video[];
}

export function VideoGrid({ initialVideos }: VideoGridProps) {
  const [videos, setVideos] = useState(initialVideos);

  const handleStatsUpdate = (videoId: string, newStats: { comments?: number; likes?: number }) => {
    setVideos(currentVideos => 
      currentVideos.map(video => 
        video.id === videoId
          ? {
              ...video,
              _count: {
                ...video._count,
                ...newStats
              }
            }
          : video
      )
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoPreview
          key={video.id}
          video={{
            id: video.id,
            url: video.url,
            _count: {
              likes: video._count.likes,
              comments: video._count.comments,
            }
          }}
          onStatsUpdate={handleStatsUpdate}
        />
      ))}
    </div>
  );
}