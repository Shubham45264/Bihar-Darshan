import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Eye, Share2, Bookmark, ThumbsDown, Send, Sparkles, ChevronLeft, ChevronRight, Calendar, MapPin, Tag
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import { auth } from '../lib/firebase';

interface MediaFileItem {
  url: string;
  type: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaFiles?: any;
  authorName: string;
  authorAvatar?: string;
  district: string;
  views: number;
  likes: number;
  dislikes: number;
  likedBy?: string[];
  dislikedBy?: string[];
  createdAt: string;
  category?: { title: string; slug: string };
  subcategory?: { title: string; slug: string };
}

const StoryMediaCarousel = ({ story }: { story: Story }) => {
  let items: MediaFileItem[] = [];

  if (Array.isArray(story.mediaFiles) && story.mediaFiles.length > 0) {
    items = story.mediaFiles;
  } else if (typeof story.mediaFiles === 'string') {
    try {
      const parsed = JSON.parse(story.mediaFiles);
      if (Array.isArray(parsed)) items = parsed;
    } catch (e) {}
  }

  if (items.length === 0 && story.mediaUrl) {
    items = [{ url: story.mediaUrl, type: story.mediaType || 'IMAGE' }];
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-[320px] sm:h-[480px] md:h-[540px] bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0 group rounded-2xl">
      {currentItem.type === 'VIDEO' || currentItem.type === 'video' ? (
        <video src={currentItem.url} controls className="w-full h-full object-cover" />
      ) : (
        <img
          src={currentItem.url}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      )}

      {/* Multiple Media Carousel Navigation */}
      {items.length > 1 && (
        <>
          {/* Badge indicator */}
          <div className="absolute top-4 right-4 bg-black/75 text-white font-bold text-xs px-3.5 py-1.5 rounded-full backdrop-blur-md z-10 tracking-wider shadow">
            {currentIndex + 1} / {items.length}
          </div>

          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition-all shadow-md z-10 cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Right Arrow */}
          {currentIndex < items.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition-all shadow-md z-10 cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-10 pointer-events-none">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`pointer-events-auto h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-[#D4A017] w-7' : 'bg-white/70 w-2.5'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const StoryDetails = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser ? currentUser.uid : 'guest';

  const fetchStory = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`http://localhost:5000/api/v1/stories/${storyId}`);
      const data = await res.json();
      if (data.success && data.data.story) {
        setStory(data.data.story);
        // Record view increment only for logged-in users
        if (currentUserId && currentUserId !== 'guest') {
          fetch(`http://localhost:5000/api/v1/stories/${storyId}/views`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId }),
          })
            .then((r) => r.json())
            .then((viewRes) => {
              if (viewRes.success && viewRes.data?.story) {
                setStory(viewRes.data.story);
              }
            })
            .catch(() => {});
        }
      } else {
        setErrorMsg(data.message || 'Story not found');
      }
    } catch (err) {
      console.error('Error fetching story detail:', err);
      setErrorMsg('Failed to load story details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storyId) fetchStory();
  }, [storyId]);

  const handleLike = async () => {
    if (!story) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/stories/${story.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success && data.data.story) {
        setStory(data.data.story);
      }
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  const handleDislike = async () => {
    if (!story) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/stories/${story.id}/dislike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success && data.data.story) {
        setStory(data.data.story);
      }
    } catch (err) {
      console.error('Error disliking story:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
        <Navbar forceDarkText={true} />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#D4A017]/20 border-t-[#D4A017] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm font-medium">Loading story details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMsg || !story) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
        <Navbar forceDarkText={true} />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <Container>
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <Sparkles className="mx-auto text-[#D4A017] mb-3" size={44} />
              <h2 className="text-2xl font-bold text-gray-900">Story Not Found</h2>
              <p className="text-gray-600 text-sm mt-2">{errorMsg || 'The story you are looking for does not exist.'}</p>
              <button
                onClick={() => navigate('/discover')}
                className="mt-6 bg-[#D4A017] text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#B8860B] transition-all shadow cursor-pointer"
              >
                Back to Discover
              </button>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  const hasLiked = Array.isArray(story.likedBy) && story.likedBy.includes(currentUserId);
  const hasDisliked = Array.isArray(story.dislikedBy) && story.dislikedBy.includes(currentUserId);
  const paragraphs = story.content ? story.content.split('\n').filter((p) => p.trim().length > 0) : [];

  const backLink = story.category && story.subcategory
    ? `/discover/${story.category.slug}/${story.subcategory.slug}`
    : '/discover';

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-gray-900 flex flex-col font-sans">
      <Navbar forceDarkText={true} />

      <main className="flex-1 pt-28 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Back Navigation Button */}
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#D4A017] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to {story.subcategory?.title || story.category?.title || 'Feed'}</span>
            </Link>

            {/* Main Story Container */}
            <article className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
              {/* Header: Author & Metadata */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3.5">
                  {story.authorAvatar && (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4A017] to-[#F4A261] p-[2px] shrink-0 shadow">
                      <img
                        src={story.authorAvatar}
                        alt={story.authorName}
                        className="w-full h-full rounded-full object-cover bg-neutral-200"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-gray-900">{story.authorName}</h3>
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-semibold">
                        <MapPin size={12} className="text-[#D4A017]" />
                        {story.district}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Calendar size={13} />
                      <span>
                        {new Date(story.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subcategory Badge */}
                {story.subcategory && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#D4A017]/10 text-[#D4A017] text-xs font-bold px-3 py-1 rounded-full border border-[#D4A017]/20 uppercase tracking-wider">
                    <Tag size={12} />
                    {story.subcategory.title}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-display leading-tight">
                {story.title}
              </h1>

              {/* Story Media Carousel */}
              <StoryMediaCarousel story={story} />

              {/* Full Multi-Paragraph Content */}
              <div className="space-y-4 pt-2 border-t border-gray-100 text-gray-800 text-base sm:text-lg leading-relaxed">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Interaction Metrics Bar */}
              <div className="pt-6 border-t border-gray-200/90 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-transform active:scale-125 cursor-pointer ${
                      hasLiked ? 'text-rose-600 font-bold' : 'text-gray-700 hover:text-rose-500 font-semibold'
                    }`}
                  >
                    <Heart size={22} fill={hasLiked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{story.likes || 0} Likes</span>
                  </button>

                  {/* Dislike Button */}
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 transition-transform active:scale-125 cursor-pointer ${
                      hasDisliked ? 'text-[#D4A017] font-bold' : 'text-gray-500 hover:text-[#D4A017] font-semibold'
                    }`}
                  >
                    <ThumbsDown size={20} fill={hasDisliked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{story.dislikes || 0}</span>
                  </button>

                  {/* Views Metric */}
                  <div className="flex items-center gap-2 text-gray-500 font-semibold" title="Views">
                    <Eye size={20} />
                    <span className="text-sm">{story.views || 0} Views</span>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold transition-colors relative cursor-pointer"
                    title="Share Post"
                  >
                    <Send size={20} />
                    <span className="text-sm">Share</span>
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#D4A017] text-black font-bold text-[11px] px-2.5 py-0.5 rounded shadow">
                        Link Copied!
                      </span>
                    )}
                  </button>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isSaved ? 'text-[#D4A017] bg-[#D4A017]/10' : 'text-gray-500 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  <Bookmark size={22} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </article>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default StoryDetails;
