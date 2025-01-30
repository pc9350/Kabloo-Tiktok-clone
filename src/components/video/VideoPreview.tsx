"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { VideoModal } from "./VideoModal";

interface VideoPreviewProps {
  video: {
    id: string;
    url: string;
    _count: {
      likes: number;
      comments: number;
    };
  };
  onStatsUpdate?: (videoId: string, newStats: { comments?: number; likes?: number }) => void;
}

export function VideoPreview({ video, onStatsUpdate }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentStats, setCurrentStats] = useState(video._count);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

//   const handleClick = () => {
//     router.push(`/main/video/${video.id}`);
//   };

  const handleStatsUpdate = (newStats: { comments?: number; likes?: number }) => {
    const updatedStats = {
      ...currentStats,
      ...newStats
    };
    setCurrentStats(updatedStats);
    onStatsUpdate?.(video.id, newStats);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Ensure parent component has latest stats when modal closes
    if (currentStats.comments !== video._count.comments || 
        currentStats.likes !== video._count.likes) {
      onStatsUpdate?.(video.id, currentStats);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="aspect-[9/16] relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity bg-gray-900 cursor-pointer group"
      >
        <video
          ref={videoRef}
          src={video.url}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          onLoadedData={(e) => {
            e.currentTarget.currentTime = 0;
          }}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="p-3 rounded-full bg-black/50">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex gap-4 text-sm">
            <span>❤️ {video._count.likes}</span>
            <span>💬 {video._count.comments}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <VideoModal
          video={{
            ...video,
            _count: currentStats
          }}
          onClose={handleCloseModal}
          onStatsUpdate={handleStatsUpdate}
        />
      )}
    </>
  );
}
