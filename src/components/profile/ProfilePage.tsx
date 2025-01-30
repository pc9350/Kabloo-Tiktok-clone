// Remove the 'use client' directive if it exists
import { FollowButton } from "../user/FollowButton";
import { VideoGrid } from "./VideoGrid";

interface ProfilePageProps {
  profile: any; // Type this properly based on your profile data
  currentClerkId: string | null;
  isFollowing: boolean;
}

export function ProfilePage({ profile, currentClerkId, isFollowing }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-8 mb-8">
          <img
            src={profile.avatar}
            alt={profile.username}
            className="w-24 h-24 rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
            <div className="flex gap-6 mb-4">
              <div>
                <span className="font-bold">{profile._count.videos}</span>{" "}
                Videos
              </div>
              <div>
                <span className="font-bold">{profile._count.followers}</span>{" "}
                Followers
              </div>
              <div>
                <span className="font-bold">{profile._count.following}</span>{" "}
                Following
              </div>
            </div>
            {currentClerkId !== profile.clerkId && (
              <FollowButton
                targetUserId={profile.id}
                targetClerkId={profile.clerkId}
                initialIsFollowing={isFollowing}
              />
            )}
          </div>
        </div>

        <VideoGrid initialVideos={profile.videos} />
      </div>
    </div>
  );
}