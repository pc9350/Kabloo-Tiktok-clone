"use client";

import { useEffect, useRef, useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import { CommentsSection } from "./CommentsSection";
import { VideoInteractions } from "./VideoInteractions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface VideoCardProps {
  id: string;
  url: string;
  caption: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
}

export function VideoCard({
  id,
  url,
  caption,
  creator,
  likes,
  comments,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  // Preload video when component mounts
  useEffect(() => {
    const preloadVideo = async () => {
      try {
        if (videoRef.current) {
          videoRef.current.load();
        }
      } catch (error) {
        console.error("Error preloading video:", error);
      }
    };

    preloadVideo();
  }, [url]);

  // Handle intersection observer for lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
            setIsPlaying(true);
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete video");
      }

      console.log("Video deleted successfully");

      //   await new Promise(resolve => setTimeout(resolve, 500));
      router.refresh();
      //   router.push("/main/feed");
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative h-screen w-full snap-start bg-black">
      {error && (
        <div className="absolute top-4 left-4 right-4 p-2 bg-red-500 text-white rounded text-sm text-center">
          {error}
        </div>
      )}

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {user?.id === creator.id && ( // Make sure to use clerkId here
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`absolute top-4 right-4 p-2 rounded-full text-white 
            ${isDeleting ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"}
            disabled:opacity-50 transition-all z-10`}
          title="Delete video"
        >
          <FaTrash className={`w-5 h-5 ${isDeleting ? "animate-pulse" : ""}`} />
        </button>
      )}

      <video
        className={`h-full w-full object-contain ${
          !isLoaded ? "invisible" : ""
        }`}
        src={url}
        loop
        muted
        playsInline
        controls={false}
        ref={videoRef}
        onClick={togglePlay}
        onLoadedData={handleLoadedData}
        preload="auto"
      >
      <source src={url} type="video/mp4" />
      </video>

      <VideoInteractions
        videoId={id}
        initialLikes={likes}
        initialComments={comments}
        onCommentClick={() => setShowComments(true)}
      />

      {showComments && (
        <CommentsSection videoId={id} onClose={() => setShowComments(false)} />
      )}

      {!isPlaying && isLoaded && (
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
    </div>
  );
}
