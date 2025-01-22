'use client';

import { useState } from 'react';
import { VideoCard } from './VideoCard';

const DUMMY_VIDEOS = [
  {
    id: '1',
    url: '/videos/Sample_video_1.mp4',
    caption: 'Moon throughout the day!',
    creator: {
      username: 'user1',
      avatar: '/user.png'
    }
  },
  {
    id: '2',
    url: '/videos/Sample_video_2.mp4',
    caption: 'Turtle in the water!!',
    creator: {
      username: 'user2',
      avatar: '/user.png'
    }
  },
  // Add more dummy videos
];

export function VideoFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="snap-y snap-mandatory h-screen w-full overflow-y-scroll">
      {DUMMY_VIDEOS.map((video) => (
        <VideoCard key={video.id} {...video} likes={0} comments={[]} />
      ))}
    </div>
  );
}