import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Image,
  Video,
  Layers,
  SlidersHorizontal,
  Filter,
  Search
} from "lucide-react";
import type { GalleryCategory } from "../../data/galleryData";
import { galleryCategories } from "../../data/galleryData";

export type MediaFilter = "all" | "photo" | "video";
export type SortOption = "latest" | "popular" | "most-viewed" | "trending";

interface GalleryFiltersProps {
  mediaFilter: MediaFilter;
  categoryFilter: string;
  searchQuery: string;
  sortBy: SortOption;
  onMediaChange: (v: MediaFilter) => void;
  onCategoryChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onSortChange: (v: SortOption) => void;
  totalResults: number;
}

const mediaOptions: { value: MediaFilter; label: string; icon: typeof Image }[] = [
  { value: "all", label: "All", icon: Layers },
  { value: "photo", label: "Photos", icon: Image },
  { value: "video", label: "Videos", icon: Video },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Liked" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "trending", label: "Trending" },
];

const categoryIcons: Record<string, string> = {
  "All Categories": "🏛️",
  Food: "🍽️",
  Culture: "🎭",
  Politicians: "🏛️",
  Places: "📍",
  Heritage: "🏯",
  Festivals: "🎊",
  Agriculture: "🌾",
  "Art & Craft": "🎨",
  Wildlife: "🦁",
  Community: "👥",
  Tourism: "✈️",
  Architecture: "🕌",
  Religion: "🙏",
};



const GalleryFilters = ({
  mediaFilter,
  categoryFilter,
  searchQuery,
  sortBy,
  onMediaChange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  totalResults,
}: GalleryFiltersProps) => {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const mediaRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) setMediaOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allCategories: (GalleryCategory | "All Categories")[] = [
    "All Categories",
    ...galleryCategories,
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.95 },
  };

  const closeAllDropdowns = () => {
    setMediaOpen(false);
    setCategoryOpen(false);
    setSortOpen(false);
  };

  return (
    <div className="sticky top-[72px] z-[100] px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-white border border-gray-100 rounded-2xl px-4 sm:px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1 w-full lg:max-w-xs xl:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search photos, places, festivals..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#F4A261]/60 focus:bg-white focus:ring-2 focus:ring-[#F4A261]/10 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1 lg:justify-end">

              {/* Media Dropdown */}
              <div ref={mediaRef} className="relative">
                <button
                  onClick={() => {
                    const prev = mediaOpen;
                    closeAllDropdowns();
                    setMediaOpen(!prev);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${mediaOpen
                    ? "bg-[#F4A261]/10 border-[#F4A261]/40 text-[#F4A261]"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <SlidersHorizontal size={13} />
                  <span className="inline text-[11px] sm:text-xs">
                    {mediaOptions.find((m) => m.value === mediaFilter)?.label}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-300 ${mediaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {mediaOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 lg:right-0 lg:left-auto mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                    >
                      {mediaOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            onMediaChange(opt.value);
                            setMediaOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${mediaFilter === opt.value
                            ? "bg-[#F4A261]/10 text-[#F4A261]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          <opt.icon size={14} />
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category Dropdown */}
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => {
                    const prev = categoryOpen;
                    closeAllDropdowns();
                    setCategoryOpen(!prev);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${categoryOpen
                    ? "bg-[#F4A261]/10 border-[#F4A261]/40 text-[#F4A261]"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <span className="text-sm">{categoryIcons[categoryFilter] || "🏛️"}</span>
                  <span className="max-w-[90px] sm:max-w-[120px] truncate inline text-[11px] sm:text-xs">{categoryFilter}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-300 ${categoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {categoryOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 lg:right-0 lg:left-auto mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50 max-h-[320px] overflow-y-auto scrollbar-hide"
                    >
                      {allCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            onCategoryChange(cat);
                            setCategoryOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${categoryFilter === cat
                            ? "bg-[#F4A261]/10 text-[#F4A261]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          <span className="text-sm">{categoryIcons[cat]}</span>
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>



              {/* Sort Dropdown */}
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => {
                    const prev = sortOpen;
                    closeAllDropdowns();
                    setSortOpen(!prev);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${sortOpen
                    ? "bg-[#F4A261]/10 border-[#F4A261]/40 text-[#F4A261]"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider hidden sm:inline">Sort</span>
                  <span className="inline text-[11px] sm:text-xs">{sortOptions.find((s) => s.value === sortBy)?.label}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                    >
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            onSortChange(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${sortBy === opt.value
                            ? "bg-[#F4A261]/10 text-[#F4A261]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Mobile Results Count */}
          <div className="mt-3 flex items-center justify-between text-gray-400 text-[11px] font-medium lg:hidden">
            <span>{totalResults} media {totalResults === 1 ? 'item' : 'items'}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GalleryFilters;
