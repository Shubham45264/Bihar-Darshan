import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShareStorySection from "../components/cta/ShareStorySection";
import DistrictsPageMap from "../components/districts/DistrictsPageMap";
import DistrictGridCard from "../components/districts/DistrictGridCard";
import { useAdminData } from "../data/AdminContext";
import {
  geoNameToDisplayName,
  displayNameToGeoName,
} from "../data/districtsData";
import biharHeritage from "../assets/bihar-heritage.png";

const Districts = () => {
  const { districts: allDistricts } = useAdminData();
  const [hoveredCardDistrict, setHoveredCardDistrict] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filtered + sorted districts
  const filteredDistricts = useMemo(() => {
    let result = [...allDistricts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [searchQuery]);

  const hoveredGeoName = useMemo(() => {
    if (!hoveredCardDistrict) return null;
    return displayNameToGeoName[hoveredCardDistrict] ?? hoveredCardDistrict;
  }, [hoveredCardDistrict]);

  // Handlers
  const handleMapSelect = (geoName: string | null) => {
    if (!geoName) return;
    const displayName = geoNameToDisplayName[geoName] ?? geoName;
    navigate(`/districts/${displayName.toLowerCase()}`);
  };

  const handleMapHover = (geoName: string | null) => {
    if (!geoName) {
      setHoveredCardDistrict(null);
      return;
    }
    const displayName = geoNameToDisplayName[geoName] ?? geoName;
    setHoveredCardDistrict(displayName);
  };


  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — Map & Overview
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] w-full flex flex-col pt-32 pb-24 md:pb-0 justify-center overflow-hidden">
        {/* Dark heritage background */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={biharHeritage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510]/92 via-[#1e1912]/88 to-[#15110d]/92" />
          {/* Subtle warm overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#D4A017]/5 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-12 items-start">
            {/* ── Left Side ── */}
            <div className="pt-4 lg:pt-8">
              {/* Heading */}
              <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-none mb-4">
                Explore Bihar's <span className="text-[#EAB308]">Districts</span>
              </h1>

              {/* Decorative gold line */}
              <div className="w-12 h-0.5 bg-gold rounded-full mb-6" />

              {/* Description */}
              <p className="text-white/60 text-[15px] leading-relaxed max-w-md mb-8">
                Explore all the districts of Bihar. Click on the map or select a
                district from below to discover its culture, heritage, places
                and more.
              </p>

              {/* Search input */}
              <div className="relative max-w-sm">
                <input
                  type="text"
                  placeholder="Search district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-5 pr-12 py-3.5 text-sm font-medium text-white placeholder:text-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                  <Search size={18} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* ── Right Side — Map ── */}
            <div className="relative">
              {/* Map */}
              <DistrictsPageMap
                selectedDistrict={null}
                hoveredCardDistrict={hoveredGeoName}
                onSelectDistrict={handleMapSelect}
                onHoverDistrict={handleMapHover}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — District Grid
          ═══════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 pb-20 sm:pb-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              All Districts
            </h2>
          </div>

          {/* District grid — 2 columns on mobile, 3-5 on desktop */}
          {filteredDistricts.length > 0 ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5"
            >
              {filteredDistricts.map((district) => (
                <DistrictGridCard
                  key={district.name}
                  name={district.name}
                  image={district.image}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No districts found
              </h3>
              <p className="text-sm text-gray-400">
                Try a different search term
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-5 py-2 bg-gold text-white font-semibold text-sm rounded-full hover:bg-gold-dark transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      <ShareStorySection />
      <Footer />
    </div>
  );
};

export default Districts;
