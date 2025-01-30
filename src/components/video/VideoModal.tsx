"use client";

import { useState } from "react";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { CommentsSection } from "./CommentsSection";

interface VideoModalProps {
  video: {
    id: string;
    url: string;
    _count: {
      likes: number;
      comments: number;
    };
  };
  onClose: () => void;
  onStatsUpdate: (newStats: { comments?: number; likes?: number }) => void;
}

export function VideoModal({ video, onClose, onStatsUpdate }: VideoModalProps) {
    const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(video._count.comments);
  const [likeCount, setLikeCount] = useState(video._count.likes);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/videos/${video.id}/likes`, {
        method: 'POST',
      });
      if (response.ok) {
        const newLikeState = !isLiked;
        setIsLiked(newLikeState);
        const newLikeCount = likeCount + (newLikeState ? 1 : -1);
        setLikeCount(newLikeCount);
        onStatsUpdate({ likes: newLikeCount });
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleCommentAdded = () => {
    const newCount = commentCount + 1;
    setCommentCount(newCount);
    onStatsUpdate({ comments: newCount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-3xl h-[80vh] flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-20 -right-2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          type="button"
          title="Close"
        >
          <IoMdClose className="w-6 h-6" />
        </button>
        
        <video
          src={video.url}
          className="w-full h-full object-contain"
          controls
          autoPlay
          playsInline
        />
        
        <div className="absolute bottom-12 left-4 flex gap-4 text-white text-xl bg-black/50 p-2 rounded-lg">
        <button
            onClick={handleLike}
            className="flex items-center gap-2 hover:text-red-500 transition-colors"
            title="Like"
            type="button"
          >
            {isLiked ? (
              <FaHeart className="w-5 h-5 text-red-500" />
            ) : (
              <FaRegHeart className="w-5 h-5" />
            )}
            <span>{video._count.likes}</span>
          </button>
          
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
          >
            <FaComment className="w-5 h-5" />
            <span>{commentCount}</span>
          </button>
        </div>

        {showComments && (
          <CommentsSection 
            videoId={video.id} 
            onClose={() => setShowComments(false)}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </div>
    </div>
  );
}
