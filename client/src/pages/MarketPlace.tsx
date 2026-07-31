import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, Gem, Palette, Layers } from "lucide-react";
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
      <section className="relative min-h-[90vh] md:min-h-[85vh] w-full flex flex-col pt-32 pb-24 md:pb-0 justify-center mb-12">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={marketplaceBanner}
            alt="Bihar Marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col h-full justify-center">
          {/* Main Content */}
          <div className="w-full md:w-3/5 lg:w-1/2 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-6 block font-sans">
                SUPPORT LOCAL ARTISANS
              </span>

              <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white tracking-tight mb-6">
                Discover Bihar's <span className="text-[#EAB308]">Marketplace</span>
              </h1>

              <p className="text-white/80 text-lg md:text-xl max-w-md mb-10 font-medium leading-relaxed">
                Explore authentic products, handicrafts, and artworks crafted by talented artisans across Bihar.
              </p>

            </motion.div>
          </div>
        </div>
      </section>

      <Container>
        {/* Filter Bar */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-3 mb-10 flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat
                  ? "bg-brand-dark text-white shadow-md font-extrabold"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat === "All" ? "All Products" : cat}</span>
              </button>
            ))}
          </div>

          {/* Add Your Product Button */}
          <button
            onClick={() => navigate('/marketplace/add')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} strokeWidth={3} />
            ADD YOUR PRODUCT
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20"
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
              <div className="col-span-full py-24 text-center text-gray-400 font-semibold">
                No products found in this category.
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