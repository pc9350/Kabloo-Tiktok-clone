'use client';

import { useEffect, useState } from 'react';
import type { VideoComment } from '@/lib/types';
import { IoCloseOutline } from 'react-icons/io5';

interface CommentsSectionProps {
  videoId: string;
//   comments: number;
  onClose: () => void;
}

interface Comment {
    id: string;
    text: string;
    user: {
      username: string;
      avatar: string;
    };
    createdAt: string;
  }

export function CommentsSection({ videoId, onClose }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
        const response = await fetch(`/api/videos/${videoId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: newComment }),
        });
  
        if (response.ok) {
          const comment = await response.json();
          setComments(prev => [comment, ...prev]);
          setNewComment('');
        }
      } catch (error) {
        console.error('Failed to post comment:', error);
      }
    };

    // const comment: VideoComment = {
    //   id: Date.now().toString(),
    //   text: newComment,
    //   user: {
    //     id: 'current-user',
    //     username: 'You',
    //     avatar: '/avatars/default.png',
    //     followers: 0,
    //     following: 0
    //   },
    //   createdAt: new Date(),
    //   likes: 0
    // };

//     setComments(prev => [comment, ...prev]);
//     setNewComment('');
//     // TODO: Send to API
//   };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
      <div 
        className="w-full bg-white rounded-t-3xl p-4 pb-24" // Added pb-24 for bottom nav space
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <h3 className="text-xl font-bold text-black">Comments ({comments.length})</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Close Comments"
            type="button"
          >
            <IoCloseOutline size={24} className="text-black" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto mb-4">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading comments...</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3 mb-4 p-2">
                <img 
                  src={comment.user.avatar} 
                  alt={comment.user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-black">{comment.user.username}</p>
                  <p className="text-gray-700">{comment.text}</p>
                  <div className="flex gap-4 mt-1 text-sm text-gray-500">
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmitComment} className="fixed bottom-16 left-0 right-0 bg-white p-4 border-t border-gray-200">
          <div className="flex gap-2 max-w-screen-sm mx-auto">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-black"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium disabled:opacity-50"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}