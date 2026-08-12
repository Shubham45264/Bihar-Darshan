import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import LatestArticlesSection from '../components/tribals/LatestArticlesSection';
import TribeCulturalSections from '../components/tribals/CulturalHighlightsGrid';
import TribeVideoSlider from '../components/tribals/TribeVideoSlider';
import { getTribeCulturalSections } from '../data/tribeCulturalData';
import { useAdminData } from '../data/AdminContext';
import { API_BASE_URL } from '../config/api';


const TribeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tribes } = useAdminData();
  const [tribe, setTribe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const foundTribe = tribes.find((t: any) => t.id === id);
    if (foundTribe) {
      setTribe(foundTribe);
      setIsLoading(false);
    } else {
      const fetchTribe = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/tribes/${id}`);
          const data = await res.json();
          if (data.success && data.data.tribe) {
            setTribe(data.data.tribe);
          }
        } catch (error) {
          console.error("Error fetching tribe:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTribe();
    }
  }, [id, tribes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tribe) {
    return <Navigate to="/tribals" />;
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#451A03] overflow-x-hidden relative">
      <Navbar forceDarkText={true} />

      {/* Global Parchment Background Texture */}
      <div
        className="fixed inset-0 z-0 opacity-100 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: "url('/images/tribals/parchment_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Main Content Wrapper */}
      <div className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 font-serif">

        {/* Back Button */}
        <div className="mb-6 sm:mb-12">
          <Link to="/tribals" className="inline-flex items-center text-[#B45309] hover:text-[#D4A017] font-bold text-xs sm:text-sm tracking-widest uppercase transition-colors">
            <span className="mr-2">←</span> Back to Directory
          </Link>
        </div>

        {/* Decorative Elements */}
        <motion.img
          initial={{ opacity: 0, rotate: -20 }} animate={{ opacity: 0.4, rotate: -10 }} transition={{ duration: 1 }}
          src="/images/tribals/bow_nobg.png" className="hidden sm:block absolute top-40 right-2 lg:right-20 w-24 lg:w-48 object-contain z-0 mix-blend-multiply pointer-events-none opacity-40" alt=""
        />
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.4, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
          src="/images/tribals/fish_nobg.png" className="hidden sm:block absolute top-[80vh] left-2 lg:left-12 w-20 lg:w-36 object-contain z-0 mix-blend-multiply pointer-events-none opacity-40" alt=""
        />

        {/* Tribe Section */}
        <div className="relative flex flex-col items-center mb-10 sm:mb-16 mt-4 sm:mt-8">

          {/* Header Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8 px-2"
          >
            <h2 className="text-xl sm:text-3xl md:text-4xl text-[#B45309] mb-1 sm:mb-2 tracking-widest font-bold">{tribe.hindiName}</h2>
            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-7xl uppercase tracking-[0.06em] sm:tracking-[0.2em] text-[#451A03] border-b border-[#D4A017]/40 pb-3 sm:pb-4 inline-block max-w-full break-words">
              {tribe.englishName}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto italic text-[#582C12] font-medium leading-relaxed">
              {tribe.description || tribe.shortDesc}
            </p>
          </motion.div>

          {/* Infographic Layout */}
          <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">

              {/* Left Info Column */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4 flex flex-col order-2 lg:order-1 text-center lg:text-right px-1 lg:px-0"
              >
                <div className="bg-[#FEF3C7]/90 lg:bg-transparent p-5 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-[#D4A017]/30 lg:border-none shadow-sm lg:shadow-none lg:translate-y-8">
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider mb-2 sm:mb-3 text-[#451A03] border-b lg:border-b-0 lg:border-r-4 border-[#D4A017] lg:pr-4 pb-2 lg:pb-0 inline-block lg:block">
                    {tribe.leftTitle || "Cultural Heritage"}
                  </h3>
                  <p className="text-sm sm:text-[1.05rem] leading-relaxed text-[#582C12] mt-2 font-medium">
                    {tribe.leftDesc}
                  </p>
                </div>
              </motion.div>

              {/* Central Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-4 flex justify-center order-1 lg:order-2 px-0 z-10"
              >
                <img
                  src={tribe.image}
                  alt={tribe.englishName}
                  className="w-full max-w-[14rem] sm:max-w-[20rem] lg:max-w-[26rem] h-auto object-contain drop-shadow-2xl my-4 sm:my-8 mix-blend-multiply"
                />
              </motion.div>

              {/* Right Info Column */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4 flex flex-col order-3 text-center lg:text-left px-1 lg:px-0"
              >
                <div className="bg-[#FEF3C7]/90 lg:bg-transparent p-5 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-[#D4A017]/30 lg:border-none shadow-sm lg:shadow-none mt-2 lg:mt-0 lg:-translate-y-8">
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider mb-2 sm:mb-3 text-[#451A03] border-b lg:border-b-0 lg:border-l-4 border-[#D4A017] lg:pl-4 pb-2 lg:pb-0 inline-block lg:block">
                    {tribe.rightTitle || "Traditional Practices"}
                  </h3>
                  <p className="text-sm sm:text-[1.05rem] leading-relaxed text-[#582C12] mt-2 font-medium">
                    {tribe.rightDesc}
                  </p>
                </div>
              </motion.div>

            </div>

            {/* Bottom Info Block */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto text-center px-1 mt-8 sm:mt-12 relative z-20"
            >
              <div className="bg-[#FEF3C7]/90 p-4 sm:p-6 rounded-2xl border border-[#D4A017]/30 shadow-sm backdrop-blur-md">
                <p className="text-sm sm:text-[1.1rem] leading-relaxed text-[#451A03] italic font-medium">
                  {tribe.bottomDesc}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Tribe Video Slider (User submissions & Admin verified) */}
          <TribeVideoSlider tribeId={id || ''} tribeName={tribe.englishName} />

          {/* Cultural Highlights */}
          <div className="w-full max-w-6xl mx-auto mt-12 mb-20 px-4 lg:px-0 relative z-20">
            <TribeCulturalSections sections={(tribe.cultureSections && tribe.cultureSections.length > 0) ? tribe.cultureSections : getTribeCulturalSections(id || '', tribe.englishName)} />
          </div>

          {/* Latest Articles Section */}
          <LatestArticlesSection tribeName={tribe.englishName} />

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default TribeDetail;
