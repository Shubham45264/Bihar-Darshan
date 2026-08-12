import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, RotateCcw } from "lucide-react";
import type { ExtendedGalleryItem } from "../../pages/Gallery";
import GalleryCard from "./GalleryCard";
import GallerySkeleton from "./GallerySkeleton";
interface GalleryGridProps {
  items: ExtendedGalleryItem[];
  onItemClick: (item: ExtendedGalleryItem) => void;
}

const INITIAL_COUNT = 15;
const LOAD_MORE_COUNT = 10;

const GalleryGrid = ({ items, onItemClick }: GalleryGridProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset visible count when items change (e.g. filter change)
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [items]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    // Simulate network delay for skeleton visibility
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, items.length));
      setLoading(false);
    }, 600);
  }, [hasMore, loading, items.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-lg mx-auto"
      >
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gold/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 bg-gold/20 rounded-full" />
          <ImageOff size={40} className="text-gold relative z-10" />
        </div>
        <h3 className="font-serif text-3xl font-bold text-white mb-3">No Media Found</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          We couldn't find any photos or videos matching your current filters. 
          Try adjusting your search criteria, selecting a different district, or exploring another category.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1] hover:border-white/20 transition-all font-semibold text-sm"
        >
          <RotateCcw size={16} />
          Reset All Filters
        </button>
      </motion.div>
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* CSS Columns Masonry Grid (2 columns on mobile, 3 on md, 4 on lg) */}
        <div 
          className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 lg:gap-6"
        >
          {visibleItems.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-4">
            <GallerySkeleton />
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {hasMore && <div ref={sentinelRef} className="h-4" />}

        {/* End indicator */}
        {!hasMore && items.length > 0 && (
          <div className="flex items-center justify-center gap-3 py-12 text-white/20">
            <div className="w-12 h-px bg-white/10" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              You've seen it all
            </span>
            <div className="w-12 h-px bg-white/10" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryGrid;
