import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, Eye, Share2, Bookmark, MoreHorizontal, ThumbsDown, Plus, Sparkles, Send, Check, ChevronLeft, ChevronRight, ArrowRight, MessageSquare
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import { auth } from '../lib/firebase';
import { API_BASE_URL } from '../config/api';

import ShareModal from '../components/common/ShareModal';

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
  mediaFiles?: MediaFileItem[];
  authorName: string;
  authorAvatar?: string;
  district: string;
  views: number;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  shares?: number;
  sharedBy?: string[];
  createdAt: string;
  category?: { title: string; slug: string };
  subcategory?: { title: string; slug: string };
}

const StoryMediaCarousel = ({ story }: { story: Story }) => {
  let items: MediaFileItem[] = [];
  if (Array.isArray(story.mediaFiles) && story.mediaFiles.length > 0) {
    items = story.mediaFiles;
  } else if (story.mediaUrl) {
    items = [{ url: story.mediaUrl, type: story.mediaType || 'IMAGE' }];
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-48 sm:h-60 bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0 group">
      {currentItem.type === 'VIDEO' || currentItem.type === 'video' ? (
        <video src={currentItem.url} controls className="w-full h-full object-cover" />
      ) : (
        <img
          src={currentItem.url}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}

      {/* Multiple Media Carousel Navigation */}
      {items.length > 1 && (
        <>
          {/* Badge indicator */}
          <div className="absolute top-3 right-3 bg-black/75 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md z-10">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full transition-all shadow z-10 cursor-pointer"
            >
              <ChevronLeft size={16} />
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
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full transition-all shadow z-10 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1 z-10 pointer-events-none">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`pointer-events-auto h-1 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-[#D4A017] w-4' : 'bg-white/70 w-1.5'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SubcategoryFeed = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const navigate = useNavigate();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [subcategoryTitle, setSubcategoryTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [activeShareStory, setActiveShareStory] = useState<Story | null>(null);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser ? currentUser.uid : 'guest';



  const fetchCategoryAndStories = async () => {
    try {
      setLoading(true);
      // Fetch category & subcategory info
      const catRes = await fetch(`${API_BASE_URL}/categories/${categorySlug}`);
      const catData = await catRes.json();
      if (catData.success && catData.data.category) {
        setCategoryTitle(catData.data.category.title);
        const matchedSub = catData.data.category.subcategories.find((s: any) => s.slug === subcategorySlug);
        if (matchedSub) {
          setSubcategoryTitle(matchedSub.title);
        } else {
          setSubcategoryTitle(subcategorySlug || 'Subcategory');
        }
      }

      // Fetch stories for this subcategory
      const storyRes = await fetch(
        `${API_BASE_URL}/stories?categorySlug=${categorySlug}&subcategorySlug=${subcategorySlug}&status=APPROVED`
      );
      const storyData = await storyRes.json();
      if (storyData.success) {
        setStories(storyData.data.stories || []);
      }
    } catch (err) {
      console.error('Error fetching subcategory stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryAndStories();
  }, [categorySlug, subcategorySlug]);

  const handleLike = async (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE_URL}/stories/${storyId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success && data.data.story) {
        setStories((prev) => prev.map((s) => (s.id === storyId ? data.data.story : s)));
      }
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  const handleShare = (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();
    setActiveShareStory(story);
  };

  const handleShareRecorded = (updatedStory?: any) => {
    if (updatedStory) {
      setStories((prev) => prev.map((s) => (s.id === updatedStory.id ? updatedStory : s)));
    }
  };

  const toggleSave = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    setSavedPosts((prev) => ({ ...prev, [storyId]: !prev[storyId] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-gray-900 flex flex-col font-sans">
      <Navbar forceDarkText={true} />

      <main className="flex-1 pt-28 pb-16">
        <Container>
          {/* Header Banner - Full Container Width */}
          <div className="w-full mb-8 bg-white border border-gray-200/90 p-6 sm:p-8 rounded-3xl shadow-sm">
            <Link
              to={`/discover/${categorySlug}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#D4A017] text-xs font-bold uppercase tracking-wider transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              <span>Back to {categoryTitle || 'Category'}</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <span className="text-[11px] font-bold text-[#D4A017] uppercase tracking-widest">
                  {categoryTitle || 'Explore'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1 font-display">
                  {subcategoryTitle || 'Subcategory Feed'}
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  Discover community stories, photos and experiences in {subcategoryTitle}
                </p>
              </div>

              <Link
                to={`/share-story?category=${encodeURIComponent(categoryTitle)}`}
                className="inline-flex items-center justify-center gap-2 bg-[#D4A017] hover:bg-[#B8860B] text-black font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all shrink-0"
              >
                <Plus size={16} />
                <span>Share Your Story</span>
              </Link>
            </div>
          </div>

          {/* Stories Grid (3 Cards Per Row Full Width) */}
          {loading ? (
            <div className="w-full py-20 text-center">
              <div className="w-10 h-10 border-4 border-[#D4A017]/20 border-t-[#D4A017] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-gray-200 rounded-3xl shadow-sm">
              <Sparkles className="mx-auto text-[#D4A017] mb-3" size={40} />
              <h3 className="text-xl font-bold text-gray-900">No stories here yet</h3>
              <p className="text-gray-600 text-sm mt-2">
                Be the first to share an inspiring story or memory under <strong>{subcategoryTitle}</strong>!
              </p>
              <Link
                to={`/share-story?category=${encodeURIComponent(categoryTitle)}`}
                className="inline-block mt-5 bg-[#D4A017] text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#B8860B] transition-all shadow"
              >
                Share First Story
              </Link>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => {
                const hasLiked = story.likedBy?.includes(currentUserId);

                return (
                  <article
                    key={story.id}
                    className="group bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* 1. Header (Author Info) */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-2.5">
                          {story.authorAvatar && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4A017] to-[#F4A261] p-[1.5px] shrink-0">
                              <img
                                src={story.authorAvatar}
                                alt={story.authorName}
                                className="w-full h-full rounded-full object-cover bg-neutral-200"
                              />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-gray-900">{story.authorName}</span>
                              <span className="text-[9px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
                                {story.district}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {new Date(story.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      {/* 2. Media Carousel (Clickable to story) */}
                      <Link to={`/story/${story.id}`} className="block cursor-pointer">
                        <StoryMediaCarousel story={story} />
                      </Link>

                      {/* 3. Post Content */}
                      <div className="p-3.5 sm:p-4 space-y-2">
                        {/* Title */}
                        <Link to={`/story/${story.id}`}>
                          <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#D4A017] transition-colors line-clamp-1 cursor-pointer">
                            {story.title}
                          </h2>
                        </Link>

                        {/* Short Content Description */}
                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 text-justify">
                          {story.content}
                        </p>

                        {/* Subcategory Tag Pill & Read Full Story Button */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] bg-amber-50 text-[#D4A017] font-bold px-2.5 py-1 rounded-full border border-amber-200/60 uppercase tracking-wider">
                            {subcategoryTitle}
                          </span>

                          {/* Explicit Link Button to Story Details */}
                          <Link
                            to={`/story/${story.id}`}
                            className="inline-flex items-center gap-1 bg-[#D4A017] hover:bg-[#B8860B] text-black font-extrabold text-[11px] px-3 py-1.5 rounded-full transition-all shadow-sm hover:shadow cursor-pointer"
                          >
                            <span>Read Full Story</span>
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* 4. Bottom Action Bar */}
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 text-gray-600 text-xs">
                      <div className="flex items-center gap-4">
                        {/* Like */}
                        <button
                          onClick={(e) => handleLike(e, story.id)}
                          className={`flex items-center gap-1 transition-transform active:scale-125 ${
                            hasLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-500'
                          }`}
                        >
                          <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
                          <span className="font-semibold">{story.likes || 0}</span>
                        </button>

                        {/* Views / Comments metric */}
                        <div className="flex items-center gap-1 text-gray-500" title="Views">
                          <Eye size={16} />
                          <span className="font-medium">{story.views || 0}</span>
                        </div>

                        {/* Share */}
                        <button
                          onClick={(e) => handleShare(e, story)}
                          className="hover:text-black transition-colors flex items-center gap-1 font-medium cursor-pointer"
                          title="Share"
                        >
                          <Send size={16} />
                          <span className="font-semibold">{story.shares || 0}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </main>

      {/* Share Modal */}
      {activeShareStory && (
        <ShareModal
          isOpen={!!activeShareStory}
          onClose={() => setActiveShareStory(null)}
          title={activeShareStory.title}
          description={activeShareStory.content ? activeShareStory.content.slice(0, 120) + '...' : undefined}
          url={`${window.location.origin}/story/${activeShareStory.id}`}
          imageUrl={activeShareStory.mediaUrl || (Array.isArray(activeShareStory.mediaFiles) ? activeShareStory.mediaFiles[0]?.url : undefined)}
          storyId={activeShareStory.id}
          onShareRecorded={handleShareRecorded}
        />
      )}

      <Footer />
    </div>
  );
};

export default SubcategoryFeed;
