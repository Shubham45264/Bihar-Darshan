import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  ChevronDown,
  Quote,
  X
} from "lucide-react";
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import { useAdminData } from '../data/AdminContext';
import { useContributions } from '../data/ContributionContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface Personality {
  id: number | string;
  name: string;
  category: 'Politician' | 'Arts & Cinema' | 'Historical' | 'Literature' | 'Sports';
  district: string;
  description: string;
  imageUrl: string;
  fullBio?: string;
  status?: string;
}

export const personalities: Personality[] = [
  // --- HISTORICAL ---
  {
    id: 1, name: "Samrat Ashoka", category: "Historical", district: "Patna",
    description: "The third Mauryan Emperor who ruled almost the entire Indian subcontinent and spread Buddhism across Asia.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ashoka_the_Great.jpg/800px-Ashoka_the_Great.jpg"
  },
  {
    id: 2, name: "Guru Gobind Singh", category: "Historical", district: "Patna",
    description: "The 10th Sikh Guru, born in Patna Sahib. He was a spiritual master, warrior, poet, and philosopher.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Guru_Gobind_Singh_ji.jpg/800px-Guru_Gobind_Singh_ji.jpg"
  },
  {
    id: 3, name: "Veer Kunwar Singh", category: "Historical", district: "Bhojpur",
    description: "A key leader during the Indian Rebellion of 1857. At the age of 80, he led a select band of armed forces against the British.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Kunwar_Singh.jpg/800px-Kunwar_Singh.jpg"
  },
  {
    id: 4, name: "Aryabhata", category: "Historical", district: "Patna",
    description: "The legendary mathematician-astronomer from the classical age. He invented 'Zero' and calculated the value of Pi.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Aryabhata_statue_at_IUCAA.jpg/800px-Aryabhata_statue_at_IUCAA.jpg"
  },

  // --- POLITICIANS ---
  {
    id: 5, name: "Dr. Rajendra Prasad", category: "Politician", district: "Siwan",
    description: "The first President of the Republic of India and a major leader of the Indian Independence Movement.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Rajendra_Prasad_1950.jpg/800px-Rajendra_Prasad_1950.jpg"
  },
  {
    id: 6, name: "Jayaprakash Narayan", category: "Politician", district: "Saran",
    description: "Popularly known as 'Lok Nayak'. He led the Total Revolution movement against the Indira Gandhi government in the 1970s.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Jayaprakash_Narayan.jpg"
  },
  {
    id: 7, name: "Nitish Kumar", category: "Politician", district: "Nalanda",
    description: "The current and longest-serving Chief Minister of Bihar, known for his focus on infrastructure and women's empowerment.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nitish_Kumar_2015_%28cropped%29.jpg/800px-Nitish_Kumar_2015_%28cropped%29.jpg"
  },
  {
    id: 8, name: "Lalu Prasad Yadav", category: "Politician", district: "Gopalganj",
    description: "Former CM of Bihar and Railway Minister of India. A charismatic leader of the RJD party known for social justice politics.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Lalu_Prasad_Yadav_at_the_NDTV_Indian_of_the_Year_Awards_2008.jpg/800px-Lalu_Prasad_Yadav_at_the_NDTV_Indian_of_the_Year_Awards_2008.jpg"
  },

  // --- ARTS & CINEMA ---
  {
    id: 9, name: "Manoj Bajpayee", category: "Arts & Cinema", district: "West Champaran",
    description: "A legendary powerhouse performer in Indian cinema, known for 'Gangs of Wasseypur', 'Satya', and 'The Family Man'.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Manoj_Bajpayee_promoting_Gully_Boy.jpg/800px-Manoj_Bajpayee_promoting_Gully_Boy.jpg"
  },
  {
    id: 10, name: "Pankaj Tripathi", category: "Arts & Cinema", district: "Gopalganj",
    description: "Beloved actor known for his natural acting style in 'Mirzapur', 'Newton', and 'Ludo'. Proudly represents Bihar's rural roots.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pankaj_Tripathi_in_2019.jpg/800px-Pankaj_Tripathi_in_2019.jpg"
  },
  {
    id: 11, name: "Sushant Singh Rajput", category: "Arts & Cinema", district: "Patna",
    description: "Late actor who rose from TV to Bollywood stardom with films like 'M.S. Dhoni: The Untold Story' and 'Chhichhore'.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sushant_Singh_Rajput_at_the_62nd_Filmfare_Awards_in_2017.jpg/800px-Sushant_Singh_Rajput_at_the_62nd_Filmfare_Awards_in_2017.jpg"
  },
  {
    id: 12, name: "Sharda Sinha", category: "Arts & Cinema", district: "Supaul",
    description: "The 'Bihar Kokila', famous for her folk songs and Chhath Puja anthems which are synonymous with Bihar's culture.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sharda_Sinha.jpg/800px-Sharda_Sinha.jpg"
  },

  // --- LITERATURE ---
  {
    id: 13, name: "Ramdhari Singh Dinkar", category: "Literature", district: "Begusarai",
    description: "One of the most important modern Hindi poets, known as 'Rashtrakavi'. His poem 'Rashmirathi' is a masterpiece.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Ramdhari_Singh_Dinkar.jpg/440px-Ramdhari_Singh_Dinkar.jpg"
  },
  {
    id: 14, name: "Phanishwar Nath Renu", category: "Literature", district: "Araria",
    description: "Pioneer of regional Hindi literature. His novel 'Maila Anchal' is considered the greatest Hindi novel after Godaan.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Phanishwar_Nath_Renu.jpg"
  },

  // --- SPORTS ---
  {
    id: 15, name: "Ishan Kishan", category: "Sports", district: "Patna",
    description: "Dynamic Indian international cricketer who holds the record for the fastest double-century in an ODI match.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ishan_Kishan_at_the_IPL_2022.jpg/800px-Ishan_Kishan_at_the_IPL_2022.jpg"
  },
  {
    id: 16, name: "Pramod Bhagat", category: "Sports", district: "Vaishali",
    description: "Professional para-badminton player who won the Gold Medal at the Tokyo 2020 Paralympics.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pramod_Bhagat_at_the_2020_Paralympics.jpg/800px-Pramod_Bhagat_at_the_2020_Paralympics.jpg"
  },
  {
    id: 17, name: "Karpoori Thakur", category: "Politician", district: "Samastipur",
    description: "Former CM and Bharat Ratna recipient known as 'Jan Nayak' for his lifelong struggle for the marginalized sections of society.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Karpoori_Thakur.jpg/800px-Karpoori_Thakur.jpg"
  }
];

export default function Personalities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDist, setSelectedDist] = useState('All Districts');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedBio, setSelectedBio] = useState<Personality | null>(null);

  const allPersonalities = useMemo(() => {
    return personalities;
  }, []);

  const getUniqueDistricts = () => {
    const dists = allPersonalities.map((p: Personality) => p.district);
    return ['All Districts', ...Array.from(new Set(dists))];
  };

  const categories = [
    "All",
    "Historical",
    "Politician",
    "Arts & Cinema",
    "Literature",
    "Sports",
  ];

  const districts = getUniqueDistricts();

  const filteredData = useMemo(() => {
    return allPersonalities.filter((p: Personality) => {
      const isApproved = !p.status || p.status === 'APPROVED';
      if (!isApproved) return false;

      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDistrict =
        selectedDist === "All Districts" ||
        p.district === selectedDist;

      const matchCategory =
        selectedCat === "All" ||
        p.category === selectedCat;

      return matchSearch && matchDistrict && matchCategory;
    });
  }, [searchTerm, selectedDist, selectedCat, allPersonalities]);

  return (
    <div className="min-h-screen bg-[#FFFFEF] font-sans pb-24">
      <Navbar forceDarkText={true} />
      {/* HEADER SECTION */}
      <div className="bg-[#0F3D2E] text-white pt-24 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-orange-400 text-sm font-bold mb-6 backdrop-blur-md">
          <Star size={14} fill="currentColor" /> THE PRIDE OF BIHAR
        </div>
        <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 tracking-tight">
          Bihar's Iconic <span className="text-orange-500">Legends</span>
        </h1>
        <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
          From the birthplace of Zero and Buddhism to the giants of modern cinema and politics.
          Discover the extraordinary people born in the soil of Bihar.
        </p>
      </div>

      {/* FILTER BOX */}
      <div className="max-w-6xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="relative mb-5">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
            <input
              type="text"
              placeholder="Search for a legend by name (e.g. Aryabhata, Nitish)..."
              className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-slate-800 text-lg font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-5 px-2">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-7 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${selectedCat === cat
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
              <select
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 rounded-2xl border-none appearance-none focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-700 cursor-pointer shadow-sm"
                value={selectedDist}
                onChange={(e) => setSelectedDist(e.target.value)}
              >
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            Displaying {filteredData.length} Icon{filteredData.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredData.map((person: Personality) => (
              <Link
                key={person.id}
                to={`/personalities/${person.id}`}
                className="relative block h-[340px] sm:h-[360px] rounded-2xl overflow-hidden group bg-slate-100 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Image */}
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x600?text=Profile+Coming+Soon"; }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent group-hover:from-black/95 group-hover:via-black/70 transition-all duration-300 pointer-events-none" />

                {/* Category Tag */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-slate-900 shadow-lg z-25 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  {person.category}
                </div>

                {/* Content Overlay — always visible title & metadata */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end">
                  {/* District */}
                  <div className="flex items-center gap-1.5 text-orange-400 text-xs font-black uppercase mb-1 drop-shadow">
                    <MapPin size={12} fill="currentColor" />
                    <span>{person.district}, Bihar</span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-serif font-black text-white leading-tight drop-shadow-md">
                    {person.name}
                  </h3>

                  {/* Description (Expands on Hover) */}
                  <p className="text-[12px] text-white/90 leading-relaxed max-h-0 overflow-hidden opacity-0 group-hover:max-h-28 group-hover:opacity-100 group-hover:mt-2 transition-all duration-300 ease-out line-clamp-4">
                    {person.description}
                  </p>

                  {/* Action link indicator */}
                  <div className="flex items-center justify-between pointer-events-none mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block text-[11px] font-black tracking-wider uppercase text-orange-400 group-hover:underline">
                      Read Bio →
                    </span>
                    <Quote size={18} className="text-white/20 group-hover:text-orange-500/30 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <Search size={64} className="mx-auto text-slate-100 mb-6" />
            <h2 className="text-3xl font-black text-slate-300">No Legends Match Your Search</h2>
            <p className="text-slate-400 mt-2">Try changing the category or searching for another name.</p>
          </div>
        )}
      </div>

      {/* BIO MODAL */}
      <AnimatePresence>
        {selectedBio && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBio(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedBio(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 text-slate-800 rounded-full transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-100 shrink-0">
                <img
                  src={selectedBio.imageUrl}
                  alt={selectedBio.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x600?text=Profile+Coming+Soon"; }}
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter text-slate-900 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> {selectedBio.category}
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto no-scrollbar">
                <span className="text-orange-600 text-[11px] font-black uppercase mb-2 flex items-center gap-1.5">
                  <MapPin size={12} fill="currentColor" /> {selectedBio.district}, Bihar
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{selectedBio.name}</h2>

                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                  {selectedBio.fullBio ? (
                    selectedBio.fullBio.split('\\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p>{selectedBio.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}