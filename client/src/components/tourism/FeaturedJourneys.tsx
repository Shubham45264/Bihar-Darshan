import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Edit3, MapPin, Clock, Wallet, Building2, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContributions } from "../../data/ContributionContext";
import { auth } from "../../lib/firebase";

const CATEGORY_COLORS: Record<string, string> = {
  Spiritual: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Heritage: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Wildlife: "bg-green-500/20 text-green-300 border-green-500/30",
  Nature: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Adventure: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Cultural: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Religious: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Historical: "bg-yellow-600/20 text-yellow-300 border-yellow-600/30",
};

const FeaturedJourneys = () => {
  const [showAll, setShowAll] = useState(false);
  const { journeySubmissions, refreshJourneys } = useContributions();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    refreshJourneys();
  }, [refreshJourneys]);

  const combinedJourneys = journeySubmissions;
  const displayJourneys = showAll ? combinedJourneys : combinedJourneys.slice(0, 3);

  return (
    <section className="py-24 bg-[#F8F5EF]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-3"
            >
              <span className="text-[#c19a5b] text-[11px] font-bold uppercase tracking-[0.2em] font-sans">
                CURATED EXPERIENCES
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif text-[#3e2723] flex items-center gap-4"
            >
              Signature Journeys & Itineraries
              <div className="hidden md:block h-[2px] w-12 bg-[#c19a5b]" />
            </motion.h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/tourism/create-journey"
              className="flex items-center gap-2 text-sm font-bold text-white bg-[#c19a5b] px-6 py-2 rounded-full hover:bg-[#a8864d] transition-colors shadow-sm font-sans"
            >
              Create
            </Link>
            {combinedJourneys.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 text-sm font-bold text-[#3e2723] hover:text-[#c19a5b] transition-colors border border-[#3e2723]/20 px-4 py-2 rounded-full hover:border-[#c19a5b] font-sans"
              >
                {showAll ? "Show Less" : "See all experiences"} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {displayJourneys.length === 0 ? (
          <div className="text-center py-24 bg-white/40 border border-dashed border-[#c19a5b]/40 rounded-3xl backdrop-blur-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#c19a5b]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#c19a5b]">
              <ArrowRight size={24} className="rotate-45" />
            </div>
            <h4 className="text-xl font-serif text-[#3e2723] mb-2">No Published Journeys Yet</h4>
            <p className="text-[#3e2723]/60 mb-8 max-w-md mx-auto text-sm font-sans">
              All community-submitted itineraries require administrative review before becoming public. Share your unique Bihar travel experience now!
            </p>
            <Link
              to="/tourism/create-journey"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#c19a5b] px-8 py-3 rounded-full hover:bg-[#a8864d] transition-all duration-300 shadow-md font-sans hover:scale-105"
            >
              Share Your Journey
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayJourneys.map((trip, i) => {
              const isAuthor = currentUser && (trip as any).authorId === currentUser.uid;
              const tripCategory = (trip as any).category || "";
              const companyName = (trip as any).companyName || trip.provider || "Community Contributor";
              const tripDuration = (trip as any).tripDuration || trip.duration || "";
              const highlights = (trip as any).highlights as string[] | undefined;
              const categoryStyle = CATEGORY_COLORS[tripCategory] || "bg-[#c19a5b]/15 text-[#c19a5b] border-[#c19a5b]/30";

              return (
                <motion.div
                  key={trip.id + i.toString()}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.1, duration: 0.7, ease: "easeOut" }}
                  className="h-full"
                >
                  <Link
                    to={`/tourism/${trip.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-[#e8dfcf]/50 overflow-hidden flex flex-col h-full group hover:shadow-[0_20px_40px_-15px_rgba(62,39,35,0.15)] hover:-translate-y-2 transition-all duration-500 relative"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden shrink-0">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=Bihar+Tourism"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2c1e16]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {isAuthor && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/tourism/create-journey?editId=${trip.id}`);
                          }}
                          className="absolute top-3 right-3 z-20 bg-[#F4A261] hover:bg-[#E5914F] text-black w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 font-sans"
                          title="Edit Experience"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-start items-center text-center relative bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]">

                      {/* Company name */}
                      {companyName && companyName !== "Community Contributor" && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#3e2723]/50 uppercase tracking-wider mb-2">
                          <Building2 size={10} className="text-[#c19a5b]" />
                          {companyName}
                        </span>
                      )}

                      {/* Duration + Location */}
                      <div className="flex items-center gap-3 mb-3 text-xs font-bold text-[#c19a5b] font-sans">
                        <span className="flex items-center gap-1"><Clock size={12} /> {tripDuration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {trip.departureCity}</span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-[#3e2723] group-hover:text-[#8b5a2b] transition-colors duration-300 mb-2">{trip.title}</h3>

                      <p className="text-sm text-[#3e2723]/60 mb-4 line-clamp-2 max-w-sm">{(trip as any).desc || trip.description}</p>


                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-[#e8dfcf]/60 w-full flex items-center justify-between">
                        <span className="text-xs text-[#3e2723]/50 font-sans flex items-center gap-1">
                          <Wallet size={12} className="text-[#c19a5b]" />
                          Budget: <strong className="text-[#3e2723] font-bold ml-1">{trip.price}</strong>
                        </span>
                        <div className="flex items-center gap-1 text-[#8b5a2b] font-bold text-xs uppercase tracking-widest">
                          View Details
                          <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                            <ArrowRight size={14} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Animated bottom border */}
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#c19a5b] group-hover:w-full transition-all duration-700 ease-in-out" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJourneys;
