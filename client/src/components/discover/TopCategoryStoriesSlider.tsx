import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Eye, Heart, ArrowRight, ChevronLeft, ChevronRight,
  Sparkles, MapPin, PlusCircle, Video, Calendar
} from 'lucide-react';

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
  createdAt?: string;
  category?: { title: string; slug: string };
  subcategory?: { title: string; slug: string };
}

interface TopCategoryStoriesSliderProps {
  categoryId?: string;
  categorySlug: string;
  categoryTitle: string;
}

const TopCategoryStoriesSlider: React.FC<TopCategoryStoriesSliderProps> = ({
  categoryId,
  categorySlug,
  categoryTitle,
}) => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setLoading(true);
        const param = categoryId ? `categoryId=${categoryId}` : `categorySlug=${categorySlug}`;
        const res = await fetch(
          `${API_BASE_URL}/stories?${param}&status=APPROVED&limit=20`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.data?.stories)) {
          const fetchedStories: Story[] = data.data.stories;

          // Filter out any invalid items and sort by total engagement: views + likes descending
          const sorted = [...fetchedStories].sort(
            (a, b) => ((b.views || 0) + (b.likes || 0)) - ((a.views || 0) + (a.likes || 0))
          );

          // Showcase ONLY real database stories (top 5)
          setStories(sorted.slice(0, 5));
        } else {
          setStories([]);
        }
      } catch (err) {
        console.error('Error fetching real-time top stories:', err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
    setCurrentIndex(0);
  }, [categoryId, categorySlug, categoryTitle]);

  // Auto-play timer with hover pause
  useEffect(() => {
    if (stories.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [stories.length, isHovered]);

  const currentStory = stories[currentIndex];

  const getMediaInfo = (story?: Story) => {
    if (!story) return { url: '', type: 'IMAGE' };
    if (Array.isArray(story.mediaFiles) && story.mediaFiles.length > 0) {
      return {
        url: story.mediaFiles[0].url,
        type: story.mediaFiles[0].type || 'IMAGE',
      };
    }
    return {
      url: story.mediaUrl || '',
      type: story.mediaType || 'IMAGE',
    };
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleViewStory = (storyId: string) => {
    navigate(`/story/${storyId}`);
  };

  if (loading) {
    return (
      <div className="w-full h-80 rounded-3xl bg-[#FAF6EE] animate-pulse border border-[#EAB308]/30 shadow-md flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Sparkles className="animate-spin text-[#EAB308]" size={32} />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Loading Top Stories...</span>
        </div>
      </div>
    );
  }

  // If NO real stories in DB for this category, display a clean state prompting users to post
  if (stories.length === 0) {
    return (
      <div className="my-6 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F3EDE0] border-2 border-[#EAB308]/30 shadow-xl text-center flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#EAB308]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/5 text-[#EAB308] flex items-center justify-center border border-[#EAB308]/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Flame size={28} className="fill-[#EAB308]" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
            No Stories Posted in {categoryTitle} Yet
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
            Be the first explorer to share your authentic photos, video, or experience in {categoryTitle.toLowerCase()}!
          </p>
        </div>
        <Link
          to="/share-story"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EAB308] via-[#F59E0B] to-[#D97706] hover:brightness-105 text-stone-950 font-black text-xs sm:text-sm px-7 py-3 rounded-full shadow-[0_4px_20px_rgba(234,179,8,0.3)] transition-all transform hover:-translate-y-0.5 uppercase tracking-wider"
        >
          <PlusCircle size={16} />
          <span>Share Your Story</span>
        </Link>
      </div>
    );
  }

  const mediaInfo = getMediaInfo(currentStory);

  return (
    <div className="space-y-4 my-6">
      {/* Slider Header Bar */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#EAB308]/15 flex items-center justify-center text-[#EAB308] border border-[#EAB308]/30 shrink-0 shadow-[0_0_12px_rgba(234,179,8,0.2)]">
          <Flame size={20} className="fill-[#EAB308]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-display flex items-center gap-2">
            Top Community Stories
          </h2>
        </div>
      </div>

      {/* Main Hero Slider Card (Royal Bihar Heritage Parchment Theme) */}
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-[0_15px_40px_rgba(212,160,23,0.16)] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F4ECE0] border border-[#EAB308]/30 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#EAB308] via-[#F59E0B] to-[#EAB308] z-30" />

        {/* Traditional Heritage Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#EAB308_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Ambient Corner Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#EAB308]/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-600/10 blur-3xl rounded-full pointer-events-none" />

        {/* Auto-play Timer Animated Progress Bar (if > 1 story) */}
        {stories.length > 1 && !isHovered && (
          <motion.div
            key={`progress-${currentIndex}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.5, ease: 'linear' }}
            className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#EAB308] via-[#F59E0B] to-[#D97706] z-30 shadow-[0_0_10px_rgba(234,179,8,0.8)]"
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col lg:flex-row items-stretch relative z-10 w-full min-h-0 lg:min-h-[420px]"
          >
            {/* MEDIA COLUMN: Top on mobile, Right on desktop */}
            <div className="w-full lg:w-1/2 h-52 sm:h-72 lg:h-auto min-h-[200px] sm:min-h-[300px] lg:min-h-[420px] relative overflow-hidden bg-stone-900 group/media shrink-0">
              {mediaInfo.type === 'VIDEO' || mediaInfo.type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
                  <video
                    src={mediaInfo.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <img
                  src={mediaInfo.url}
                  alt={currentStory.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-105"
                />
              )}

              {/* Image Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

              {/* Video Badge */}
              {(mediaInfo.type === 'VIDEO' || mediaInfo.type === 'video') && (
                <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                  <Video size={13} className="text-[#EAB308]" /> Video Story
                </div>
              )}
            </div>

            {/* DETAILS COLUMN: Bottom on mobile, Left on desktop */}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:p-10 flex flex-col justify-between space-y-3 sm:space-y-4">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] text-stone-950 font-black text-[11px] sm:text-xs px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full shadow-[0_2px_10px_rgba(234,179,8,0.35)] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={13} className="fill-stone-950" />
                  <span>#{currentIndex + 1} Top Story</span>
                </span>

                {currentStory.subcategory && (
                  <span className="bg-[#EAB308]/15 text-[#7A5200] font-extrabold text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#EAB308]/30">
                    {currentStory.subcategory.title}
                  </span>
                )}

                {currentStory.district && (
                  <span className="bg-white/80 text-stone-800 font-extrabold text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-stone-200/80 flex items-center gap-1 shadow-sm">
                    <MapPin size={12} className="text-[#EAB308]" />
                    <span>{currentStory.district}</span>
                  </span>
                )}
              </div>

              {/* Title & Content Preview */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug font-display tracking-tight drop-shadow-sm">
                  {currentStory.title}
                </h3>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium">
                  {currentStory.content}
                </p>
              </div>

              {/* Author & Stats Row */}
              <div className="pt-3 sm:pt-4 border-t border-[#EAB308]/20 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                {/* Author Info */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {currentStory.authorAvatar ? (
                    <img
                      src={currentStory.authorAvatar}
                      alt={currentStory.authorName}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#EAB308] shadow-md"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EAB308] text-stone-950 font-extrabold flex items-center justify-center text-xs sm:text-sm shadow">
                      {currentStory.authorName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-stone-900 font-extrabold text-xs sm:text-sm leading-none">
                      {currentStory.authorName || 'Explorer'}
                    </p>
                    <p className="text-stone-500 text-[10px] sm:text-[11px] font-semibold mt-1 flex items-center gap-1">
                      <Calendar size={11} className="text-[#EAB308]" />
                      {currentStory.createdAt
                        ? new Date(currentStory.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                        : 'Community Contributor'}
                    </p>
                  </div>
                </div>

                {/* Engagement Numbers */}
                <div className="flex items-center gap-2.5 sm:gap-3 bg-white/90 border border-[#EAB308]/30 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs text-stone-800 shadow-sm font-bold">
                  <span className="flex items-center gap-1 text-stone-700">
                    <Eye size={13} className="text-[#EAB308]" />
                    <span>{currentStory.views || 0}</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <span className="flex items-center gap-1 text-rose-600">
                    <Heart size={13} className="fill-rose-500 text-rose-500" />
                    <span>{currentStory.likes || 0}</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => handleViewStory(currentStory.id)}
                  className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-[#EAB308] via-[#F59E0B] to-[#D97706] hover:brightness-105 text-stone-950 font-black text-xs sm:text-sm px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full shadow-[0_4px_15px_rgba(234,179,8,0.35)] transition-all cursor-pointer"
                >
                  <span>View Story</span>
                  <ArrowRight
                    size={15}
                    className="group-hover/btn:translate-x-1.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (if > 1 story) */}
        {stories.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Story"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#EAB308] text-stone-900 hover:text-stone-950 p-2 sm:p-3 rounded-full border border-[#EAB308]/40 shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Story"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#EAB308] text-stone-900 hover:text-stone-950 p-2 sm:p-3 rounded-full border border-[#EAB308]/40 shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>

            {/* Slide Dots Indicator */}
            <div className="absolute bottom-2.5 sm:bottom-3 inset-x-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
              {stories.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex
                    ? 'w-6 sm:w-8 bg-gradient-to-r from-[#EAB308] to-[#F59E0B] shadow-[0_0_10px_rgba(234,179,8,0.6)]'
                    : 'w-2 sm:w-2.5 bg-stone-400/40 hover:bg-stone-500'
                    }`}
                  title={`Story ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Navigation Strip below Slider (if > 1 story) */}
      {stories.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 pt-1">
          {stories.map((storyItem, idx) => {
            const isActive = idx === currentIndex;
            const itemMedia = getMediaInfo(storyItem);
            return (
              <button
                key={storyItem.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-14 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer text-left group ${isActive
                  ? 'border-[#EAB308] shadow-[0_0_15px_rgba(234,179,8,0.3)] ring-2 ring-[#EAB308]/40 scale-[1.02] bg-[#FAF6EE]'
                  : 'border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100 bg-white'
                  }`}
              >
                <img
                  src={itemMedia.url}
                  alt={storyItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

                <div className="absolute inset-0 p-1.5 sm:p-2 flex flex-col justify-between">
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-[#EAB308] bg-stone-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-full self-start border border-[#EAB308]/30">
                    #{idx + 1}
                  </span>
                  <p className="text-[10px] sm:text-[11px] font-bold text-white truncate leading-tight drop-shadow-md">
                    {storyItem.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopCategoryStoriesSlider;
