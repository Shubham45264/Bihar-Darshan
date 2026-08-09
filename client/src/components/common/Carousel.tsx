import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}

const Carousel = ({
  children,
  title,
  subtitle,
  actionLabel,
  actionHref,
}: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.75;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 flex items-end justify-between">
        <div>
          {subtitle && (
            <p className="text-gold text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1">
              {subtitle}
            </p>
          )}
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-primary font-bold leading-tight">
            {title}
          </h2>
        </div>

        {/* Navigation & Action Links */}
        <div className="flex items-center gap-3">
          {actionLabel && (
            <Link
              to={actionHref || "#"}
              className="text-xs sm:text-sm font-medium text-gold hover:text-gold-dark transition-colors mr-2 hidden xs:inline-flex"
            >
              {actionLabel} →
            </Link>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 dark:border-white/20 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md flex items-center justify-center text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold hover:text-black hover:border-gold transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 dark:border-white/20 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md flex items-center justify-center text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold hover:text-black hover:border-gold transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div className="relative w-full">
        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-4 sm:px-6 lg:px-8 scrollbar-hide snap-x snap-mandatory max-w-[1400px] mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {React.Children.map(children, (child, idx) => (
            <div key={idx} className="snap-start flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Action Link below */}
      {actionLabel && (
        <div className="mt-3 text-center xs:hidden">
          <Link to={actionHref || "#"} className="text-xs font-semibold text-gold">
            {actionLabel} →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Carousel;
