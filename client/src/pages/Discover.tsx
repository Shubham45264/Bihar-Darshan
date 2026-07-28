import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '../data/AdminContext';

import Container from '../components/layout/Container';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ShareStorySection from '../components/cta/ShareStorySection';
import { MapPin, Utensils, PartyPopper, User, ArrowLeft, ArrowRight, Plus, Upload, X, Sparkles } from 'lucide-react';
import { useContributions } from '../data/ContributionContext';
import { useArticles } from '../data/ArticlesContext';
import CardMediaGallery from '../components/media/CardMediaGallery';
import { auth } from '../lib/firebase';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import biharHeritage from '../assets/bihar-heritage.png';
import biharFood from '../assets/bihar-food.png';
import biharFolkDance from '../assets/bihar-folk-dance.png';
import patnaSahib from '../assets/patna-sahib.png';

interface DiscoverItem {
  id: string;
  type: string;
  district: string;
  image: string;
  title: string;
  description: string;
  longDescription?: string;
  extendedDetails?: string[];
  submittedBy?: string;
  caption?: string;
  videoUrl?: string;
  personalityCategory?: string;
  status?: string;
}

interface CustomCategory {
  id: string;
  title: string;
  description?: string;
  image: string;
  badgeText: string;
  district: string;
}

const Discover = () => {
  const { cultureSubmissions, gallerySubmissions, personalitySubmissions } = useContributions();
  const { articles } = useArticles();
  const { culture: cultureData, personalities } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenAddCategoryModal = () => {
    if (!auth.currentUser) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setIsAddCategoryModalOpen(true);
  };

  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    const searchParams = new URLSearchParams(location.search);
    const cat = searchParams.get('category');
    if (cat === 'food' || cat === 'Food') return 'Food';
    if (cat === 'festival' || cat === 'Festival' || cat === 'festivals' || cat === 'Festivals') return 'Festivals';
    if (cat === 'personalities' || cat === 'Personalities' || cat === 'personality' || cat === 'Personality') return 'Personalities';
    if (location.state && (location.state as any).activeCategory) {
      return (location.state as any).activeCategory;
    }
    return null; // null means viewing category cards grid
  });

  const [selectedItem, setSelectedItem] = useState<DiscoverItem | null>(null);

  const [isCategorySubmittedSuccess, setIsCategorySubmittedSuccess] = useState(false);

  // ── Custom Categories State ──
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  const fetchCategoriesFromDb = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/categories');
      const data = await res.json();
      if (data.success && data.data?.categories) {
        setCustomCategories(data.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories from DB:', err);
    }
  };

  useEffect(() => {
    fetchCategoriesFromDb();
  }, []);

  // Modal State for Adding Category
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryCoverImage, setCategoryCoverImage] = useState<string | null>(null);
  const [categoryCoverUrlInput, setCategoryCoverUrlInput] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cat = searchParams.get('category');
    let targetCategory: string | null = null;
    if (cat) {
      if (cat === 'food' || cat === 'Food') targetCategory = 'Food';
      else if (cat === 'festival' || cat === 'Festival' || cat === 'festivals' || cat === 'Festivals') targetCategory = 'Festivals';
      else if (cat === 'personalities' || cat === 'Personalities' || cat === 'personality' || cat === 'Personality') targetCategory = 'Personalities';
      else targetCategory = cat;
    } else if (location.state && (location.state as any).activeCategory) {
      targetCategory = (location.state as any).activeCategory;
    }

    if (targetCategory) {
      setActiveCategory(targetCategory);
    }
  }, [location]);

  const cultureMap = new Map();
  cultureSubmissions.forEach(item => cultureMap.set(item.id, item));
  cultureData.forEach(item => cultureMap.set(item.id, item));
  const combinedCultureData = Array.from(cultureMap.values());

  const unifiedCulture: DiscoverItem[] = combinedCultureData.map(item => {
    let itemType = item.type || "Food";
    if (item.extendedDetails && Array.isArray(item.extendedDetails)) {
      const customCatDetail = item.extendedDetails.find((d: string) => typeof d === 'string' && d.startsWith('Category: '));
      if (customCatDetail) {
        itemType = customCatDetail.replace('Category: ', '').trim();
      }
    }
    return {
      id: `culture-${item.id}`,
      type: itemType as any,
      district: item.district || "BIHAR",
      image: item.image,
      title: item.title,
      description: item.description,
      longDescription: item.longDescription,
      extendedDetails: item.extendedDetails,
      submittedBy: item.submittedBy,
      caption: item.caption,
      videoUrl: item.videoUrl,
      status: (item as any).status
    };
  });

  const combinedPersonalityData = [...personalitySubmissions, ...personalities];

  const unifiedPersonalities: DiscoverItem[] = combinedPersonalityData.map(item => ({
    id: `personality-${item.id}`,
    type: "Personality",
    district: item.district || "BIHAR",
    image: item.imageUrl,
    title: item.name,
    description: item.description,
    personalityCategory: item.category,
    submittedBy: (item as any).author,
    status: (item as any).status
  }));

  const unifiedGallery: DiscoverItem[] = gallerySubmissions.map(item => ({
    id: `gallery-${item.id}`,
    type: "Gallery",
    district: item.location || "BIHAR",
    image: item.image,
    title: item.title,
    description: item.title,
    submittedBy: item.photographer,
    status: "APPROVED"
  }));

  const unifiedArticles: DiscoverItem[] = articles.map(item => ({
    id: `article-${item.id}`,
    type: "Tribes",
    district: item.location || item.tribe || "BIHAR",
    image: item.image,
    title: item.headline,
    description: item.description,
    submittedBy: item.author,
    status: "APPROVED"
  }));

  const allDiscoverItems = [...unifiedCulture, ...unifiedPersonalities, ...unifiedGallery, ...unifiedArticles];
  const approvedItems = allDiscoverItems.filter(i => !i.status || i.status === 'APPROVED');

  // Default initial categories
  const defaultCategoryCards = [
    {
      id: "Food",
      title: "Food",
      type: "Food",
      badgeText: "Food",
      icon: Utensils,
      image: biharFood,
      district: "BIHAR",
      subtitle: `Explore ${approvedItems.filter(i => i.type === "Food").length} Dishes & Delicacies`
    },
    {
      id: "Festivals",
      title: "Festivals",
      type: "Festival",
      badgeText: "Festival",
      icon: PartyPopper,
      image: biharFolkDance,
      district: "BIHAR",
      subtitle: `Explore ${approvedItems.filter(i => i.type === "Festival").length} Sacred Rituals`
    },
    {
      id: "Personalities",
      title: "Personalities",
      type: "Personality",
      badgeText: "Personalities",
      icon: User,
      image: patnaSahib,
      district: "BIHAR",
      subtitle: `Explore ${approvedItems.filter(i => i.type === "Personality").length} Visionaries & Legends`
    }
  ];

  // Merge default & custom categories
  const allCategoryCards = [
    ...defaultCategoryCards,
    ...customCategories.map(c => {
      const count = approvedItems.filter(i => i.type.toLowerCase() === c.title.toLowerCase()).length;
      return {
        id: c.id,
        title: c.title,
        type: c.title,
        badgeText: c.badgeText || c.title,
        icon: Sparkles,
        image: c.image,
        district: c.district,
        subtitle: c.description || (count > 0 ? `Explore ${count} ${c.title} Entries` : `Explore ${c.title} in Bihar`)
      };
    })
  ];

  // Helper to resolve active category card and proper display title
  const currentCategoryCard = allCategoryCards.find(
    cat => cat.id === activeCategory || cat.title.toLowerCase() === activeCategory?.toLowerCase() || cat.id.toLowerCase() === activeCategory?.toLowerCase()
  );

  const activeCategoryTitle = currentCategoryCard ? currentCategoryCard.title : activeCategory;

  const filteredData = approvedItems.filter(item => {
    if (!activeCategory || activeCategory === "All") return true;
    const targetCategory = activeCategoryTitle || activeCategory;
    if (targetCategory === "Food") return item.type === "Food";
    if (targetCategory === "Festivals") return item.type === "Festival";
    if (targetCategory === "Personalities") return item.type === "Personality";
    if (targetCategory === "Gallery") return item.type === "Gallery";
    if (targetCategory === "Tribes") return item.type === "Tribes";
    return (
      item.type.toLowerCase() === targetCategory.toLowerCase() ||
      item.personalityCategory?.toLowerCase() === targetCategory.toLowerCase()
    );
  });

  // Handle Cover Photo File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Add Category Form Submit
  const handleCreateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!categoryName.trim()) return;

    const coverPhoto = categoryCoverImage || categoryCoverUrlInput.trim() || biharHeritage;

    try {
      const token = await auth.currentUser.getIdToken();
      const payload = {
        title: categoryName.trim(),
        description: categoryDesc.trim() || undefined,
        image: coverPhoto,
        district: "BIHAR",
        badgeText: categoryName.trim()
      };

      await fetch('http://localhost:5000/api/v1/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to save category to backend:', err);
    }

    // Reset input fields & show Thank You message
    setCategoryName('');
    setCategoryDesc('');
    setCategoryCoverImage(null);
    setCategoryCoverUrlInput('');
    setIsCategorySubmittedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-brand-gray">
      <Navbar />

      {/* Hero Banner */}
      <div
        className="bg-brand-dark pt-32 pb-16 mb-12 relative overflow-hidden"
        style={{ backgroundImage: "url('/images/culture/hero-artwork.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-brand-dark/75"></div>
        <div className="absolute inset-0 bg-brand-gold/10 opacity-60 mix-blend-overlay"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-brand-gold/20"></div>
        <Container>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 tracking-tight">
              Discover Bihar's <span className="text-brand-gold">Heritage</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Explore authentic local cuisines, sacred grand festivals, and legendary icons representing Bihar's glorious legacy.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">
              {activeCategory ? (activeCategoryTitle === "All" ? "All Heritage Entries" : activeCategoryTitle) : "Explore Categories"}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {activeCategory ? `Showing ${filteredData.length} items in ${activeCategoryTitle}` : "Select a category card or create a new category"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {activeCategory && (
              <button
                onClick={() => navigate(`/share-story?category=${encodeURIComponent(activeCategoryTitle || activeCategory)}`, { state: { category: activeCategoryTitle || activeCategory } })}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer uppercase tracking-wider active:scale-95"
              >
                <Plus size={16} className="stroke-[3px]" />
                <span>Add {activeCategoryTitle || activeCategory} Entry</span>
              </button>
            )}

            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-brand-gold text-brand-dark font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer uppercase tracking-wider"
              >
                <ArrowLeft size={14} />
                <span>All Categories</span>
              </button>
            )}
          </div>
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="mb-24">
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              /* CATEGORIES VIEW (TALL VERTICAL CARDS matching exact item card size & design) */
              <motion.div
                key="categories-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Rendered Category Cards */}
                {allCategoryCards.map((cat) => {
                  const IconComp = cat.icon || Sparkles;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.title)}
                      className="relative block h-[400px] rounded-3xl overflow-hidden group bg-gray-100 shadow-md transition-all hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer border border-gray-100"
                    >
                      {/* Image */}
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Dark Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none" />

                      {/* Top Badge */}
                      <div className="absolute top-4 left-4 bg-brand-gold px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 text-brand-dark shadow-lg z-25">
                        <IconComp size={14} />
                        <span>{cat.badgeText}</span>
                      </div>

                      {/* Bottom Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                        <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-1">
                          {/* Location tag */}
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-gold mb-1.5 uppercase tracking-wider">
                            <MapPin size={12} />
                            <span>{cat.district}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-3xl font-serif font-bold text-white leading-tight mb-2 drop-shadow-md">
                            {cat.title}
                          </h3>

                          {/* Subtitle */}
                          <div className="text-xs font-semibold text-white/80 flex items-center justify-between mt-1">
                            <span className="line-clamp-1">{cat.subtitle}</span>
                            <ArrowRight size={16} className="text-brand-gold shrink-0 transform transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              /* INDIVIDUAL ITEMS GRID */
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <Link
                      key={item.id}
                      to={item.type === "Personality"
                        ? `/personalities/${item.id.replace('personality-', '')}`
                        : `/culture/${item.id.replace('culture-', '')}`
                      }
                      className="relative block h-[400px] rounded-3xl overflow-hidden group bg-gray-100 shadow-md transition-all hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer border border-gray-100"
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x600?text=Profile+Coming+Soon"; }}
                      />

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none" />

                      {/* Top Badge */}
                      <div className="absolute top-4 left-4 bg-brand-gold px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 text-brand-dark shadow-lg z-25">
                        {item.type === "Festival" ? <PartyPopper size={14} /> : item.type === "Food" ? <Utensils size={14} /> : <User size={14} />}
                        <span>{item.type === "Personality" ? (item.personalityCategory || 'Personality') : item.type}</span>
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                        <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-gold mb-1.5 uppercase tracking-wider">
                            <MapPin size={12} />
                            <span>{item.district}</span>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-1 drop-shadow-md">
                            {item.title}
                          </h3>

                          {item.submittedBy && (
                            <div className="text-xs font-semibold text-white/70 flex items-center gap-1.5 mt-2">
                              <User size={12} className="text-brand-gold" /> <span>By {item.submittedBy}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                          <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out delay-100">
                            <p className="text-xs text-white/90 line-clamp-3 leading-relaxed mt-3 mb-4 drop-shadow-sm">
                              {item.caption || item.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-gold group/btn">
                              Learn More
                              <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MapPin size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">No entries found</h3>
                    <p className="text-gray-500 mb-6">There are currently no items available in {activeCategoryTitle || activeCategory}. Be the first to share one!</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => navigate(`/share-story?category=${encodeURIComponent(activeCategoryTitle || activeCategory)}`, { state: { category: activeCategoryTitle || activeCategory } })}
                        className="px-6 py-3 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-2xl hover:bg-brand-gold/90 transition-all cursor-pointer shadow-md uppercase tracking-wider flex items-center gap-2 active:scale-95"
                      >
                        <Plus size={16} className="stroke-[3px]" />
                        <span>Add {activeCategoryTitle || activeCategory} Entry</span>
                      </button>
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="px-6 py-3 bg-white border border-gray-200 text-brand-dark font-bold text-xs rounded-2xl hover:border-brand-gold transition-colors cursor-pointer uppercase tracking-wider"
                      >
                        View All Categories
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>

      {/* ── MODAL: ADD NEW CATEGORY FORM ── */}
      <AnimatePresence>
        {isAddCategoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsAddCategoryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1A1814] border border-[#8C7A60]/30 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsCategorySubmittedSuccess(false);
                  setIsAddCategoryModalOpen(false);
                }}
                className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {isCategorySubmittedSuccess ? (
                <div className="py-6 px-2 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold mb-4 border border-brand-gold/40 shadow-lg">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-xs md:text-sm text-gray-300 mb-6 max-w-sm leading-relaxed">
                    Your category suggestion has been submitted successfully and is currently under review. Once reviewed and approved by an admin, it will be published on the Discover page.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategorySubmittedSuccess(false);
                      setIsAddCategoryModalOpen(false);
                    }}
                    className="px-8 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-extrabold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer shadow-lg active:scale-95"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                      <Plus size={22} className="stroke-[3px]" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">Add New Category</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Create a custom category to present unique aspects of Bihar's rich heritage.
                  </p>

                  <form onSubmit={handleCreateCategorySubmit} className="space-y-5">
                    {/* Category Name Input (Required) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                        Category Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Handicrafts, Folk Music, Heritage Monuments"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full bg-[#26231E] border border-[#8C7A60]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors font-medium"
                      />
                    </div>

                    {/* Category Description (Optional) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Description <span className="text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Brief description of this category..."
                        value={categoryDesc}
                        onChange={(e) => setCategoryDesc(e.target.value)}
                        className="w-full bg-[#26231E] border border-[#8C7A60]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors font-medium resize-none"
                      />
                    </div>

                    {/* Cover Photo Upload (Required/Optional) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                        Cover Photo
                      </label>

                      {categoryCoverImage ? (
                        <div className="relative h-44 rounded-2xl overflow-hidden border border-brand-gold/50 group">
                          <img src={categoryCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCategoryCoverImage(null)}
                            className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* File Upload Box */}
                          <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-[#8C7A60]/40 hover:border-brand-gold bg-[#26231E] cursor-pointer transition-all p-4 text-center">
                            <Upload size={24} className="text-brand-gold mb-2" />
                            <span className="text-xs font-bold text-white">Click to upload cover photo</span>
                            <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileChange}
                              className="hidden"
                            />
                          </label>

                          {/* Alternatively Image URL */}
                          <div className="relative">
                            <span className="text-[11px] text-gray-400 block mb-1">Or enter image URL:</span>
                            <input
                              type="url"
                              placeholder="https://example.com/cover.jpg"
                              value={categoryCoverUrlInput}
                              onChange={(e) => setCategoryCoverUrlInput(e.target.value)}
                              className="w-full bg-[#26231E] border border-[#8C7A60]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Action Buttons */}
                    <div className="pt-4 border-t border-white/10 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAddCategoryModalOpen(false)}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-extrabold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer shadow-lg active:scale-95"
                      >
                        Add Category
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox / Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0F3D2E] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative text-white space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-white/10 cursor-pointer">✕</button>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 relative h-64 md:h-auto min-h-[260px] rounded-2xl overflow-hidden">
                  <img src={selectedItem.image} alt={selectedItem.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x600?text=Profile+Coming+Soon"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D2E] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-brand-gold text-brand-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">{selectedItem.type === "Personality" ? selectedItem.personalityCategory : selectedItem.type}</div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-brand-gold tracking-wide uppercase"><MapPin size={14} /> <span>{selectedItem.district}</span></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{selectedItem.title}</h2>
                    {selectedItem.caption && <p className="text-gray-400 italic text-sm mb-4 leading-relaxed border-l-2 border-brand-gold pl-3">"{selectedItem.caption}"</p>}
                    {selectedItem.submittedBy && <div className="flex items-center gap-1.5 text-xs text-brand-gold font-bold mb-4"><User size={14} /> <span>Shared by: {selectedItem.submittedBy}</span></div>}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">{selectedItem.longDescription || selectedItem.description}</p>
                    {selectedItem.extendedDetails && selectedItem.extendedDetails.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h4 className="text-xs font-bold uppercase text-white/50 tracking-wider">Key Details</h4>
                        <ul className="space-y-1.5">{selectedItem.extendedDetails.map((detail: string, idx: number) => (<li key={idx} className="text-xs text-gray-400 flex items-start gap-1.5"><span className="text-brand-gold mt-0.5">•</span><span>{detail}</span></li>))}</ul>
                      </div>
                    )}
                    {selectedItem.videoUrl && (<div className="mt-4"><a href={selectedItem.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold hover:underline">🎥 Watch Documentary Video</a></div>)}
                  </div>
                </div>
              </div>

              {/* Card Media Gallery inside Modal */}
              <CardMediaGallery
                itemId={selectedItem.id}
                itemTitle={selectedItem.title}
                initialImages={[selectedItem.image]}
                initialVideoUrl={selectedItem.videoUrl}
              />

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button onClick={() => setSelectedItem(null)} className="px-6 py-2.5 bg-brand-gold text-brand-dark hover:bg-gold-light font-bold text-xs rounded-xl tracking-wider uppercase transition-colors cursor-pointer">Close Details</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareStorySection />
      <Footer />
    </div>
  );
};

export default Discover;