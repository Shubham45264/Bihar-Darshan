import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ShareStorySection from '../components/cta/ShareStorySection';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { mockTribes } from '../data/mockTribes';

export const Tribals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tribes, setTribes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTribes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/tribes');
        const data = await res.json();
        if (data.success && data.data.tribes) {
          const dbTribes = data.data.tribes;
          const merged = [...mockTribes];
          dbTribes.forEach((dbT: any) => {
            const idx = merged.findIndex(t => t.id === dbT.id);
            if (idx >= 0) merged[idx] = { ...merged[idx], ...dbT };
            else merged.push(dbT);
          });
          setTribes(merged);
        }
      } catch (error) {
        console.error('Error fetching tribes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTribes();
  }, []);

  const filteredTribes = tribes.filter(tribe =>
    (tribe.englishName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tribe.hindiName || '').includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#451A03] font-sans overflow-x-hidden selection:bg-[#D4A017] selection:text-white relative">
      <Navbar />

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

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6 inline-block"
            >
              <span className="px-4 py-1.5 rounded-full border border-[#D4A017]/40 bg-[#FEF3C7]/90 text-[#B45309] text-sm tracking-[0.2em] font-semibold uppercase backdrop-blur-md shadow-sm">
                ANCIENT TRADITIONS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#451A03] tracking-wide mb-4 font-bold"
            >
              Living Indigenous Cultures of <span className="text-[#D4A017] drop-shadow-sm">Bihar</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl md:text-4xl text-[#B45309] font-signature italic mb-8"
            >
              बिहार की जीवंत जनजाति एवं लोक संस्कृति
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-[#582C12] max-w-2xl leading-relaxed mx-auto md:mx-0 font-medium"
            >
              Step into the sacred heritage of Bihar's indigenous communities—where centuries of art, music, and sacred harmony with nature endure.
            </motion.p>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex-1 w-full flex justify-center relative"
          >
            <div className="relative w-full max-w-md aspect-square rounded-full bg-[#FEF3C7]/80 border border-[#D4A017]/30 shadow-xl overflow-hidden flex items-center justify-center p-8 backdrop-blur-md group">
              <div className="absolute inset-0 bg-[#EAB308]/25 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
              <img
                src="/images/tribals/santhal_nobg.png"
                alt="Tribal Heritage"
                className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-700 drop-shadow-xl opacity-90 hover:opacity-100"
                onError={(e) => {
                  e.currentTarget.src = "/images/tribals/santhal.png";
                }}
              />
            </div>
          </motion.div>
        </section>

        {/* Search & Filter */}
        <section className="px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto mb-16 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="relative max-w-md mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#B45309]" />
            </div>
            <input
              type="text"
              placeholder="Search tribes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFFBEB]/90 border border-[#D4A017]/35 text-[#451A03] rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017] transition-all backdrop-blur-md placeholder:text-[#B45309]/60 shadow-sm font-medium"
            />
          </motion.div>
        </section>

        {/* Directory Grid */}
        <section className="px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto pb-32">
              {isLoading ? (
                <div className="col-span-full py-20 flex justify-center">
                  <div className="w-8 h-8 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredTribes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTribes.map((tribe, index) => (
                <motion.div
                  key={tribe.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1, margin: "50px" }}
                  transition={{ delay: (index % 4) * 0.05, duration: 0.4 }}
                >
                  <Link to={`/tribals/${tribe.id}`} className="block group h-full">
                    <div className="h-full bg-[#FFFBEB]/90 rounded-3xl overflow-hidden border border-[#D4A017]/25 group-hover:border-[#D4A017] transition-all duration-500 backdrop-blur-md flex flex-col group-hover:-translate-y-2 group-hover:shadow-[0_10px_40px_-10px_rgba(212,160,23,0.3)] relative">

                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#FEF3C7]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Image Container */}
                      <div className="relative h-56 w-full overflow-hidden flex items-center justify-center p-6 bg-[#FEF3C7]/40">
                        <div className="absolute inset-0 bg-[#EAB308]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-50" />

                        <img
                          src={tribe.image}
                          alt={tribe.englishName}
                          className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-xl opacity-90 group-hover:opacity-100 mix-blend-multiply"
                          onError={(e) => {
                            e.currentTarget.src = `/images/tribals/${tribe.id}_nobg.png`;
                          }}
                        />
                      </div>

                      {/* Content Container */}
                      <div className="p-6 flex-grow flex flex-col relative z-20 bg-gradient-to-t from-[#FFFBEB] via-[#FFFBEB] to-transparent pt-8 -mt-8">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-serif font-bold text-[#451A03] group-hover:text-[#D4A017] transition-colors">{tribe.englishName}</h2>
                          <span className="text-xl font-signature font-bold text-[#B45309]">{tribe.hindiName}</span>
                        </div>
                        <p className="text-sm text-[#582C12] line-clamp-3 mb-6 flex-grow italic font-medium">
                          {tribe.shortDesc}
                        </p>
                        <div className="flex items-center text-[#B45309] text-sm font-bold uppercase tracking-wider group-hover:tracking-widest transition-all mt-auto group-hover:text-[#D4A017]">
                          Explore <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#FFFBEB]/90 border border-[#D4A017]/25 rounded-3xl backdrop-blur-md shadow-sm">
              <p className="text-[#451A03] text-lg font-medium">No tribes found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-6 py-2 bg-[#D4A017]/20 text-[#B45309] font-bold rounded-full hover:bg-[#D4A017]/30 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </div>

      <ShareStorySection />
      <Footer />
    </div>
  );
};

export default Tribals;
