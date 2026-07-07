import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MessageSquare, CornerDownRight } from 'lucide-react';
import apiClient from '../../services/apiClient';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import EmptyState from '../ui/EmptyState';
import { formatDate } from '../../utils/formatDate';

const CommentSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2].map((i) => (
      <div key={i} className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const CampaignComments = ({ campaignId }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // commentId
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/comments?campaignId=${campaignId}`);
      // Sort comments: root comments first, then group replies
      const allComments = response.data.data.comments;
      
      const rootComments = allComments.filter(c => !c.parentCommentId);
      const replies = allComments.filter(c => c.parentCommentId);
      
      // Attach replies to root comments
      const structuredComments = rootComments.map(root => ({
        ...root,
        replies: replies.filter(r => r.parentCommentId === root._id).sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
      })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setComments(structuredComments);
    } catch (err) {
      console.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (parentId = null) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;
    
    setSubmitting(true);
    try {
      await apiClient.post('/comments', {
        campaignId,
        text,
        parentCommentId: parentId
      });
      if (parentId) {
        setReplyText('');
        setReplyTo(null);
      } else {
        setNewComment('');
      }
      fetchComments();
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CommentSkeleton />;

  return (
    <div className="space-y-6 min-h-[120px]">
      {/* New Comment Input */}
      {isAuthenticated ? (
        <div className="flex gap-4 mb-8">
          <Avatar size="md" src={user?.profilePicture} />
          <div className="flex-1 space-y-2">
            <textarea
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Leave a comment..."
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={() => handlePostComment(null)} isLoading={submitting} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-gray-600 dark:text-gray-300 mb-8">
          Please log in to leave a comment.
        </div>
      )}

      {/* Comment List */}
      {comments.length === 0 ? (
        <EmptyState 
          title="No comments yet"
          message="Be the first to share your thoughts on this campaign."
        />
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar size="md" src={comment.user?.profilePicture} />
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{comment.text}</p>
                  
                  {isAuthenticated && (
                    <button 
                      onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                      className="text-xs font-medium text-gray-500 hover:text-blue-600 mt-3 flex items-center transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" /> Reply
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                {replyTo === comment._id && (
                  <div className="flex gap-3 mt-3 ml-4">
                    <Avatar size="sm" src={user?.profilePicture} />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        className="flex-1 rounded-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePostComment(comment._id)}
                      />
                      <Button size="sm" onClick={() => handlePostComment(comment._id)} isLoading={submitting} disabled={!replyText.trim()}>Reply</Button>
                    </div>
                  </div>
                )}

                {/* Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                    {comment.replies.map(reply => (
                      <div key={reply._id} className="flex gap-3 relative">
                        <CornerDownRight className="w-4 h-4 absolute -left-6 top-2 text-gray-300 dark:text-gray-700" />
                        <Avatar size="sm" src={reply.user?.profilePicture} />
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">
                              {reply.user?.firstName} {reply.user?.lastName}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignComments;
