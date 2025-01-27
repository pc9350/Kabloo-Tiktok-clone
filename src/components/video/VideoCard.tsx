"use client";

import { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { CommentsSection } from "./CommentsSection";
import { VideoInteractions } from "./VideoInteractions";

interface VideoCardProps {
  id: string;
  url: string;
  caption: string;
  creator: {
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
}

export function VideoCard({ id, url, caption, creator, likes, comments }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative h-screen w-full snap-start bg-black">
      <video
        className="h-full w-full"
        src={url}
        loop
        muted
        autoPlay
        playsInline
        controls={false}
        ref={videoRef}
        onClick={togglePlay}
      />

      <VideoInteractions
        videoId={id}
        initialLikes={likes}
        initialComments={comments}
        onCommentClick={() => setShowComments(true)}
      />

      {showComments && (
        <CommentsSection
          videoId={id}
          onClose={() => setShowComments(false)}
        />
      )}

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          onClick={togglePlay}
        >
          <div className="p-4 rounded-full bg-black/50">
            <FaPlay className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-row gap-2 items-center">
            <img
              src={creator.avatar}
              alt={creator.username}
              className="w-10 h-10 rounded-full"
            />
            <p className="text-white font-bold">{creator.username}</p>
          </div>
          <p className="text-white text-sm px-2">{caption}</p>
        </div>
      </div>

      {/* <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        <button
          className="p-2 rounded-full bg-gray-800/60"
          title="Like"
          type="button"
        >
          <FcLike className="w-6 h-6 text-white" />
        </button>
        <button
          className="p-2 rounded-full bg-gray-800/60"
          title="Comment"
          type="button"
        >
          <FaComment className="w-6 h-6 text-white" />
        </button>
        <button
          className="p-2 rounded-full bg-gray-800/60"
          title="Share"
          type="button"
        >
          <FcShare className="w-6 h-6 text-white" />
        </button>
      </div> */}
    </div>
  );
}
