import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, ChevronDown, Check, Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import TopCategoryStoriesSlider from '../components/discover/TopCategoryStoriesSlider';
import { API_BASE_URL } from '../config/api';

interface SubCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  _count?: { stories: number };
}

interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  subcategories: SubCategory[];
  _count?: { stories: number };
}

const Discover = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [subcategorySearchQuery, setSubcategorySearchQuery] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);



  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/categories?status=APPROVED&_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data.categories) {
        setCategories(data.data.categories);

        // If categorySlug is in URL, find matched category
        if (categorySlug) {
          const matched = data.data.categories.find((c: Category) => c.slug === categorySlug);
          if (matched) {
            setSelectedCategory(matched);
          }
        } else {
          setSelectedCategory(null);
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categorySlug]);

  // Filter Categories on main page
  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(categorySearchQuery.toLowerCase()))
  );

  // Filter Subcategories on detail page
  const activeSubcategories = selectedCategory ? selectedCategory.subcategories : [];
  const filteredSubcategories = activeSubcategories.filter((sub) => {
    const matchesSearch = sub.title.toLowerCase().includes(subcategorySearchQuery.toLowerCase());
    const matchesFilter = selectedSubFilter === 'All' || sub.title === selectedSubFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-gray-900 flex flex-col font-sans">
      {/* Top Navbar with White Text on Hero Artwork Banner */}
      <Navbar forceWhiteText={true} />

      {/* Top Hero Artwork Banner */}
      <div
        className="relative min-h-[45vh] sm:min-h-[60vh] md:min-h-[85vh] w-full flex flex-col pt-24 sm:pt-32 pb-12 sm:pb-20 justify-center bg-[#1A1A1A] overflow-hidden border-b border-white/10 shadow-lg"
        style={{
          backgroundImage: "url('/images/culture/hero-artwork.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay over artwork */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#EAB308]/40" />

        <Container>
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-2 sm:space-y-4 px-2">
            <span className="text-[#EAB308] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold block font-sans">
              HERITAGE & CULTURE
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-7xl text-white tracking-tight leading-tight">
              Explore the <span className="text-[#EAB308]">Treasures</span> of Bihar
            </h1>
          </div>
        </Container>
      </div>

      <main className="flex-1 py-6 sm:py-10">
        <Container>
          {/* VIEW 1: CATEGORY SELECTION (Explore Bihar Grid) */}
          {!categorySlug && !selectedCategory && (
            <div className="space-y-6 sm:space-y-8">
              {/* Header Bar below Hero Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-gray-300/70">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">Explore Bihar</h2>
                  <p className="text-gray-600 text-xs sm:text-base mt-0.5 sm:mt-1">Find places, experiences and stories across Bihar</p>
                </div>

                {/* Search categories input */}
                <div className="relative w-full md:w-80">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-full pl-11 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#EAB308] focus:ring-2 focus:ring-[#EAB308]/20 shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Categories Grid (2 columns on mobile, 6 on xl) */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5 py-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-40 sm:h-48 rounded-xl sm:rounded-2xl bg-gray-200 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
                  {filteredCategories.map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => {
                        setSelectedCategory(cat);
                        navigate(`/discover/${cat.slug}`);
                      }}
                      className="group relative h-40 sm:h-48 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl border border-gray-200 hover:border-[#EAB308] transition-all duration-300 transform hover:-translate-y-1 bg-white"
                    >
                      {/* Background Image */}
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Dark Gradient Overlay for title readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all" />

                      {/* Category Label at bottom left */}
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col justify-end">
                        <h3 className="text-white font-bold text-sm sm:text-base leading-tight tracking-snug group-hover:text-[#EAB308] transition-colors drop-shadow">
                          {cat.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: CATEGORY DETAIL & SUBCATEGORIES GRID */}
          {(categorySlug || selectedCategory) && selectedCategory && (
            <div className="space-y-6 sm:space-y-8">
              {/* Category Detail Header Banner (Full Image Cover with Text Overlay) */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gray-900 p-5 sm:p-8 lg:p-12 min-h-[200px] sm:min-h-[260px] flex flex-col justify-end">
                {/* Background Image Cover */}
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#EAB308]/60" />

                {/* Content Overlay */}
                <div className="relative z-10 max-w-2xl text-white space-y-2 sm:space-y-4">
                  <Link
                    to="/discover"
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-1.5 bg-[#EAB308] hover:bg-[#B8860B] text-black text-[11px] sm:text-xs font-extrabold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all shadow-md uppercase tracking-wider cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Categories</span>
                  </Link>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display drop-shadow-md">
                    {selectedCategory.title}
                  </h1>

                  <p className="text-gray-200 text-xs sm:text-base leading-relaxed font-normal line-clamp-3">
                    {selectedCategory.description ||
                      `Explore Bihar's rich ${selectedCategory.title.toLowerCase()}, ancient sites, stories and cultural treasures.`}
                  </p>
                </div>
              </div>

              {/* TOP 5 TRENDING STORIES SLIDER (Above Subcategories) */}
              <TopCategoryStoriesSlider
                categoryId={selectedCategory.id}
                categorySlug={selectedCategory.slug}
                categoryTitle={selectedCategory.title}
              />

              {/* Filter & Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sub-categories..."
                    value={subcategorySearchQuery}
                    onChange={(e) => setSubcategorySearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#EAB308] focus:ring-2 focus:ring-[#EAB308]/20 shadow-sm transition-all"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative w-full sm:w-64">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 flex items-center justify-between text-gray-900 text-sm hover:border-gray-400 shadow-sm transition-all"
                  >
                    <span>{selectedSubFilter}</span>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden py-1"
                      >
                        <button
                          onClick={() => {
                            setSelectedSubFilter('All');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-100 flex items-center justify-between font-medium"
                        >
                          <span>All</span>
                          {selectedSubFilter === 'All' && <Check size={16} className="text-[#EAB308]" />}
                        </button>
                        {selectedCategory.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setSelectedSubFilter(sub.title);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between font-medium"
                          >
                            <span className="truncate">{sub.title}</span>
                            {selectedSubFilter === sub.title && <Check size={16} className="text-[#EAB308]" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Subcategories Grid (2 columns on mobile, 4 on lg) */}
              {filteredSubcategories.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <p className="text-gray-500 text-sm">No subcategories found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {filteredSubcategories.map((sub, idx) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => navigate(`/discover/${selectedCategory.slug}/${sub.slug}`)}
                      className="group relative h-44 sm:h-56 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-[#EAB308] transition-all duration-300 shadow-md hover:shadow-xl bg-white"
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/90 transition-all" />

                      {/* Subcategory Title */}
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 flex items-center justify-between">
                        <h3 className="text-white font-bold text-sm sm:text-lg leading-tight tracking-snug group-hover:text-[#EAB308] transition-colors drop-shadow">
                          {sub.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Discover;