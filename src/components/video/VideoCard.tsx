"use client";

import { useEffect, useRef, useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import { CommentsSection } from "./CommentsSection";
import { VideoInteractions } from "./VideoInteractions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FollowButton } from "../user/FollowButton";
import Link from "next/link";

interface VideoCardProps {
  id: string;
  url: string;
  caption: string;
  creator: {
    id: string;
    clerkId: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  onFollowUpdate?: (creatorId: string, isFollowing: boolean) => void;
}

export function VideoCard({
  id,
  url,
  caption,
  creator,
  likes,
  comments,
  onFollowUpdate,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(comments);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reduce initial quality for faster loading
    video.setAttribute("playsinline", "");
    video.preload = "metadata";

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          // Start loading the video when it's about to be visible
          video.preload = "auto";

          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error: unknown) => {
                if (error instanceof Error && error.name !== "AbortError") {
                  console.error("Video playback error:", error);
                }
              });
          }
        } else {
          video.pause();
          setIsPlaying(false);
          // Reduce memory usage when not visible
          video.preload = "metadata";
        }
      },
      {
        threshold: 0.1,
        rootMargin: "300px 0px", // Start loading slightly before the video is visible
      }
    );

    observer.observe(video);
    return () => observer.disconnect();
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
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error: unknown) => {
            if (error instanceof Error && error.name !== "AbortError") {
              console.error("Video playback error:", error);
            }
          });
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  return (
    <div className="relative h-[calc(100vh-45px)] w-full snap-start bg-black">
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

      {user?.id === creator.id && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-2 rounded-full absolute top-4 right-4 ${
            isDeleting ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
          } transition-colors`}
          title="Delete video"
          type="button"
        >
          <FaTrash
            className={`w-5 h-5 text-white ${
              isDeleting ? "animate-pulse" : ""
            }`}
          />
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
        preload="metadata"
        poster={`${url}?thumb=1`} // Add a poster image if available
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <source src={url} type="video/mp4" />
      </video>

      {/* Bottom overlay with user info and interactions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center space-x-3 mb-5"> */}
          <Link
            href={`/main/profile/${creator.id}`}
            className="flex items-center space-x-3 mb-5 hover:opacity-80 transition-opacity"
          >
            <img
              src={creator.avatar}
              alt={creator.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-bold">{creator.username}</p>
              <p className="text-white text-sm">{caption}</p>
            </div>

            {/* <FollowButton
              targetUserId={creator.id}
              targetClerkId={creator.clerkId}
              initialIsFollowing={false}
              onFollowUpdate={(isFollowing) => onFollowUpdate?.(creator.id, isFollowing)}
            /> */}
          </Link>

          {/* Right side interactions */}
          <div className="flex flex-col items-center">
            <VideoInteractions
              videoId={id}
              initialLikes={likes}
              initialComments={comments}
              onCommentClick={() => setShowComments(true)}
            />
          </div>
        </div>
      </div>

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

      {showComments && (
        <CommentsSection
          videoId={id}
          onClose={() => setShowComments(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
