import { useState, useEffect } from 'react';
import { MessageSquare, Eye, ArrowBigUp, ArrowBigDown, Share2, Image as ImageIcon, Video, Send } from 'lucide-react';
import type { Discussion, Comment } from '../../data/communityData';
import { auth } from '../../lib/firebase';
import { API_BASE_URL } from '../../config/api';

interface DiscussionItemProps {
  discussion: Discussion;
}

const tagStyleMap: Record<string, string> = {
  Destinations: 'bg-blue-100 text-blue-700',
  Tips: 'bg-green-100 text-green-700',
  Itinerary: 'bg-yellow-100 text-yellow-700',
};

const avatarColorMap: Record<string, string> = {
  RK: 'bg-orange-400',
  NS: 'bg-purple-500',
  AR: 'bg-blue-500',
  TA: 'bg-teal-500',
  PV: 'bg-pink-500',
  BA: 'bg-indigo-500',
  WP: 'bg-green-500',
  ER: 'bg-red-500',
  YOU: 'bg-brand-gold',
};

const mapBackendComment = (c: any): Comment => ({
  id: c.id,
  author: c.author?.name || 'Anonymous',
  authorAvatar: c.author?.avatar || c.author?.name?.substring(0, 2).toUpperCase() || 'A',
  timeAgo: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now',
  content: c.content,
  replies: c.children ? c.children.map(mapBackendComment) : [],
});

const DiscussionItem = ({ discussion }: DiscussionItemProps) => {
  const tagStyle = tagStyleMap[discussion.tag] ?? 'bg-gray-100 text-gray-600';
  const avatarColor = avatarColorMap[discussion.authorAvatar] ?? 'bg-gray-400';
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(discussion.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [voteCountAdjustment, setVoteCountAdjustment] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pollVotesOffset, setPollVotesOffset] = useState<Record<string, number>>({});
  const [localViews, setLocalViews] = useState(
    parseInt(String(discussion.views || '0').replace(/[^0-9]/g, ''), 10) || 0
  );

  // Fetch comments when comments section is shown
  useEffect(() => {
    if (!showComments) return;
    if (String(discussion.id).startsWith('d') || String(discussion.id).startsWith('local_')) {
      return;
    }

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const response = await fetch(`${API_BASE_URL}/community/posts/${discussion.id}/comments`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.comments) {
            const mapped = result.data.comments.map(mapBackendComment);
            setLocalComments(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [showComments, discussion.id]);

  // Increment views on mount
  useEffect(() => {
    if (String(discussion.id).startsWith('d') || String(discussion.id).startsWith('local_')) {
      return;
    }

    const incrementView = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/community/posts/${discussion.id}/view`, {
          method: 'PATCH'
        });
        if (response.ok) {
          setLocalViews(prev => prev + 1);
        }
      } catch (err) {
        console.error("Failed to increment views:", err);
      }
    };

    const timer = setTimeout(incrementView, 1200);
    return () => clearTimeout(timer);
  }, [discussion.id]);

  const getOptionVotes = (optId: string) => {
    const baseVal = discussion.poll?.options.find(o => o.id === optId)?.votes || 0;
    const offset = pollVotesOffset[optId] || 0;
    return Math.max(0, baseVal + offset);
  };

  // Calculate total votes for poll
  const totalVotes = discussion.poll?.options.reduce((sum, o) => sum + getOptionVotes(o.id), 0) ?? 0;

  const handleVotePoll = async (optionId: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to vote in polls.");
      return;
    }

    if (selectedOption === optionId) return;

    const previousOptionId = selectedOption;

    setSelectedOption(optionId);
    setPollVotesOffset(prev => {
      const next = { ...prev };
      if (previousOptionId) {
        next[previousOptionId] = (next[previousOptionId] || 0) - 1;
      }
      next[optionId] = (next[optionId] || 0) + 1;
      return next;
    });

    if (String(discussion.id).startsWith('d') || String(discussion.id).startsWith('local_')) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/community/posts/${discussion.id}/vote`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionId,
          previousOptionId: previousOptionId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit poll vote');
      }
    } catch (err) {
      console.error(err);
      setSelectedOption(previousOptionId);
      setPollVotesOffset(prev => {
        const next = { ...prev };
        if (previousOptionId) {
          next[previousOptionId] = (next[previousOptionId] || 0) + 1;
        }
        next[optionId] = (next[optionId] || 0) - 1;
        return next;
      });
    }
  };

  const baseLikes = discussion.likes !== undefined ? discussion.likes : (discussion.replies || 0);
  const currentLikes = baseLikes + voteCountAdjustment;

  const handleVote = async (newVote: 'up' | 'down' | null) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to vote on posts.");
      return;
    }

    const previousVote = voted;
    const prevVal = previousVote === 'up' ? 1 : previousVote === 'down' ? -1 : 0;
    const newVal = newVote === 'up' ? 1 : newVote === 'down' ? -1 : 0;
    const diff = newVal - prevVal;

    // Fast local update
    setVoted(newVote);
    setVoteCountAdjustment(prev => prev + diff);

    if (String(discussion.id).startsWith('d') || String(discussion.id).startsWith('local_')) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/community/posts/${discussion.id}/like`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voteType: newVote ? newVote.toUpperCase() : 'NONE',
          previousVote: previousVote ? previousVote.toUpperCase() : 'NONE'
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update vote on server');
      }
    } catch (err) {
      console.error(err);
      // Rollback
      setVoted(previousVote);
      setVoteCountAdjustment(prev => prev - diff);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please login to comment.");
      return;
    }

    const val = newCommentText.trim();
    setNewCommentText('');

    if (String(discussion.id).startsWith('d') || String(discussion.id).startsWith('local_')) {
      // Fallback for local mock data
      const newComment: Comment = {
        id: `c_${Date.now()}`,
        author: user.displayName || 'You',
        authorAvatar: user.photoURL || 'YOU',
        timeAgo: 'Just now',
        content: val,
        replies: []
      };
      if (replyingToId) {
        setLocalComments(prev => prev.map(c =>
          c.id === replyingToId ? { ...c, replies: [...(c.replies || []), newComment] } : c
        ));
      } else {
        setLocalComments(prev => [...prev, newComment]);
      }
      setReplyingToId(null);
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/community/posts/${discussion.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: val,
          parentId: replyingToId || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.comment) {
          const freshComment = mapBackendComment(result.data.comment);

          if (replyingToId) {
            setLocalComments(prev => prev.map(c => {
              if (c.id === replyingToId) {
                return { ...c, replies: [...(c.replies || []), freshComment] };
              }
              return c;
            }));
          } else {
            setLocalComments(prev => [...prev, freshComment]);
          }
        }
      }
    } catch (e) {
      console.error("Failed to add comment:", e);
    } finally {
      setReplyingToId(null);
    }
  };

  return (
    <div className="border-b border-gray-100 last:border-0 group hover:bg-gray-50/80 transition-colors duration-150">
      <div className="px-4 py-3">
        {/* Top row: avatar, author, tag */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
          >
            {discussion.authorAvatar}
          </div>
          <span className="text-xs font-semibold text-gray-700">{discussion.author}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{discussion.timeAgo}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagStyle} ml-auto`}>
            {discussion.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug mb-1 group-hover:text-amber-700 transition-colors duration-150">
          {discussion.title}
        </h3>

        {/* Full content */}
        {discussion.content && (
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            {discussion.content}
          </p>
        )}

        {/* Inline Image / Video */}
        {discussion.mediaUrl && (
          <div className="mt-2 mb-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-[350px]">
            {discussion.mediaType === 'video' ? (
              <video
                src={discussion.mediaUrl}
                controls
                className="w-full max-h-[350px] object-cover"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={discussion.mediaUrl}
                alt={discussion.title}
                className="w-full max-h-[350px] object-cover"
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* Inline Poll */}
        {discussion.poll && (
          <div className="mt-2 mb-2 bg-gray-50 rounded-xl border border-gray-100 p-3" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold text-gray-800 mb-3">{discussion.poll.question}</p>
            <div className="space-y-2">
              {discussion.poll.options.map((option) => {
                const votes = getOptionVotes(option.id);
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                return (
                  <div key={option.id} className="relative">
                    <div
                      className="absolute inset-0 rounded-lg bg-amber-100/60 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                    <div
                      onClick={() => handleVotePoll(option.id)}
                      className={`relative flex items-center justify-between px-3 py-2 rounded-lg border bg-white/60 transition-colors cursor-pointer ${selectedOption === option.id
                          ? 'border-brand-gold bg-amber-50/70 font-semibold shadow-sm animate-pulse'
                          : 'border-gray-200 hover:border-amber-300'
                        }`}
                    >
                      <span className="text-xs font-medium text-gray-700 z-10">{option.text}</span>
                      <span className="text-xs font-bold text-gray-500 ml-2 shrink-0 z-10">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">{totalVotes} votes</p>
          </div>
        )}

        {/* Bottom action bar — Reddit-style */}
        <div className="flex items-center gap-1 mt-2 -ml-1">
          {/* Upvote/Downvote */}
          <div className="flex items-center bg-gray-100/80 rounded-full">
            <button
              onClick={(e) => { e.stopPropagation(); handleVote(voted === 'up' ? null : 'up'); }}
              className={`p-1.5 rounded-l-full hover:bg-gray-200 transition-colors ${voted === 'up' ? 'text-gold-dark' : 'text-gray-500'}`}
            >
              <ArrowBigUp size={18} fill={voted === 'up' ? 'currentColor' : 'none'} />
            </button>
            <span className="text-xs font-bold text-gray-700 px-1 min-w-[20px] text-center">
              {currentLikes}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); handleVote(voted === 'down' ? null : 'down'); }}
              className={`p-1.5 rounded-r-full hover:bg-gray-200 transition-colors ${voted === 'down' ? 'text-blue-500' : 'text-gray-500'}`}
            >
              <ArrowBigDown size={18} fill={voted === 'down' ? 'currentColor' : 'none'} />
            </button>
          </div>



          {/* Share */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Share2 size={14} />
            Share
          </button>

          {/* Comment */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${showComments ? 'bg-amber-50 text-amber-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <MessageSquare size={14} />
            {localComments.length > 0 ? localComments.length : 'Comment'}
          </button>

          {/* Views */}
          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Eye size={13} />
            {localViews} views
          </span>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-gray-100 pt-4" onClick={(e) => e.stopPropagation()}>
            {/* Existing Comments */}
            <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {localComments.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No comments yet. Be the first to start the discussion!</p>
              ) : (
                localComments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-3.5">
                    <div className="flex items-center gap-2.5 mb-2">
                      {comment.authorAvatar && (comment.authorAvatar.startsWith('http') || comment.authorAvatar.startsWith('/')) ? (
                        <img
                          src={comment.authorAvatar}
                          alt={comment.author}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className={`w-7 h-7 rounded-full ${avatarColorMap[comment.authorAvatar] || 'bg-brand-gold'} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {comment.authorAvatar}
                        </div>
                      )}
                      <div>
                        <div className="text-[13px] font-semibold text-gray-800 leading-none">{comment.author}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{comment.timeAgo}</div>
                      </div>
                    </div>
                    <p className="text-[14px] text-gray-700 ml-[38px] mb-2 leading-relaxed">{comment.content}</p>
                    <div className="ml-[38px] flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplyingToId(replyingToId === comment.id ? null : comment.id);
                          if (replyingToId !== comment.id) {
                            setNewCommentText('');
                          }
                        }}
                        className={`text-[12px] font-semibold transition-colors flex items-center gap-1 ${replyingToId === comment.id ? 'text-amber-600' : 'text-gray-500 hover:text-amber-600'}`}
                      >
                        <MessageSquare size={12} />
                        Reply
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-[38px] mt-3 space-y-3 border-l-2 border-gray-100 pl-3">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-1.5">
                              {reply.authorAvatar && (reply.authorAvatar.startsWith('http') || reply.authorAvatar.startsWith('/')) ? (
                                <img
                                  src={reply.authorAvatar}
                                  alt={reply.author}
                                  className="w-5 h-5 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className={`w-5 h-5 rounded-full ${avatarColorMap[reply.authorAvatar] || 'bg-brand-gold'} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>
                                  {reply.authorAvatar}
                                </div>
                              )}
                              <span className="text-[12px] font-semibold text-gray-800">{reply.author}</span>
                              <span className="text-[11px] text-gray-400">· {reply.timeAgo}</span>
                            </div>
                            <p className="text-[13px] text-gray-600 ml-7">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingToId === comment.id && (
                      <div className="ml-[38px] mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <input
                          type="text"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder={`Replying to ${comment.author}...`}
                          className="flex-1 text-[13px] bg-white border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddComment(); }}
                          disabled={!newCommentText.trim()}
                          className="p-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors shadow-sm"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Main Comment Input */}
            {!replyingToId && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 text-[14px] bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-1 focus:ring-amber-400 transition-all"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddComment(); }}
                  disabled={!newCommentText.trim()}
                  className="p-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-50 disabled:bg-gray-300 transition-colors shadow-sm"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionItem;
