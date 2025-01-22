'use client';

import { useState } from 'react';
import type { VideoComment } from '@/lib/types';

interface CommentsSectionProps {
  videoId: string;
  comments: VideoComment[];
  onClose: () => void;
}

export function CommentsSection({ videoId, comments: initialComments, onClose }: CommentsSectionProps) {
  const [comments, setComments] = useState<VideoComment[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: VideoComment = {
      id: Date.now().toString(),
      text: newComment,
      user: {
        id: 'current-user',
        username: 'You',
        avatar: '/avatars/default.png',
        followers: 0,
        following: 0
      },
      createdAt: new Date(),
      likes: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    // TODO: Send to API
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div 
        className="absolute bottom-0 w-full bg-black rounded-t-3xl p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Comments ({comments.length})</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-2 mb-4">
              <img 
                src={comment.user.avatar} 
                alt={comment.user.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-bold">{comment.user.username}</p>
                <p>{comment.text}</p>
                <div className="flex gap-4 mt-1 text-sm text-gray-400">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <button>Like ({comment.likes})</button>
                  <button>Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-900 rounded-full px-4 py-2"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-primary rounded-full"
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}