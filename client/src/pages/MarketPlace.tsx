import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, Gem, Palette, Layers, Search, X, Filter, ChevronDown } from "lucide-react";
import marketplaceBanner from "../assets/marketplace-banner.jpg";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShareStorySection from "../components/cta/ShareStorySection";
import Container from "../components/layout/Container";
import ProductCard from "../components/marketplace/ProductCard";
import { product as initialProducts } from "../data/product";
import { useContributions } from "../data/ContributionContext";

const MarketPlace = () => {
  const navigate = useNavigate();
  const { productSubmissions, refreshProducts } = useContributions();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const allProducts = [...productSubmissions, ...initialProducts];
  const categories = ["All", ...Array.from(new Set(allProducts.map((p) => p.category)))];

  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "all":
        return <LayoutGrid size={15} />;
      case "jewelry":
        return <Gem size={15} />;
      case "art & craft":
      case "art":
      case "craft":
        return <Palette size={15} />;
      default:
        return <Layers size={15} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex flex-col pt-28 sm:pt-36 pb-16 md:pb-0 justify-center mb-8 sm:mb-12">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={marketplaceBanner}
            alt="Bihar Marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-5 sm:px-6 relative z-10 flex flex-col h-full justify-center">
          {/* Main Content */}
          <div className="w-full md:w-3/5 lg:w-1/2 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-gold uppercase tracking-[0.25em] text-xs font-bold mb-4 sm:mb-6 block font-sans">
                SUPPORT LOCAL ARTISANS
              </span>

              <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-4 sm:mb-6">
                Handcrafted <span className="text-[#EAB308]">Elegance</span>
              </h1>

              <p className="text-white/85 text-base sm:text-lg md:text-xl max-w-md mb-8 sm:mb-10 font-medium leading-relaxed">
                Explore authentic handicrafts, fine art, and cultural creations meticulously crafted by master artisans of Bihar.
              </p>

            </motion.div>
          </div>
        </div>
      </section>

      <Container>
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] shadow-sm border border-gray-100 p-2.5 sm:p-3 mb-6 sm:mb-10 flex flex-col md:flex-row items-center gap-3 justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat
                  ? "bg-brand-dark text-white shadow-md font-extrabold"
                  : "bg-gray-50 text-[#3e2723] hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat === "All" ? "All Products" : cat}</span>
              </button>
            ))}
          </div>

          {/* Category Dropdown & Add Product Button */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* Category Dropdown Filter */}
            <div className="relative w-full sm:w-56">
              <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4A017] pointer-events-none" />
              <select
                aria-label="Select Category"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold appearance-none cursor-pointer transition-all"
              >
                <option value="All">Select Category ({allProducts.length})</option>
                {categories.filter(c => c !== "All").map((cat) => {
                  const count = allProducts.filter(p => p.category === cat).length;
                  return (
                    <option key={cat} value={cat}>
                      {cat} ({count})
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Add Your Product Button */}
            <button
              onClick={() => navigate('/marketplace/add')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer w-full sm:w-auto shrink-0"
            >
              <Plus size={16} strokeWidth={3} />
              ADD YOUR PRODUCT
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-8 pb-16 sm:pb-20"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  {...item}
                  onMoreInfo={(id: string | number) => navigate(`/marketplace/${id}`)}
                />
              ))
            ) : (
              <div className="col-span-full py-16 sm:py-24 text-center text-gray-400 font-semibold text-sm sm:text-base flex flex-col items-center justify-center gap-3">
                <p>No products found in this category.</p>
                {activeCategory !== "All" && (
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    View All Products
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>

      <ShareStorySection />
      <Footer />
    </div>
  );
};

export default MarketPlace;