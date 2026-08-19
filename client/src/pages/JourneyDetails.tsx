import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe,
  Phone,
  MessageSquare,
  Maximize2,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Navigation,
  ShieldCheck,
  Coffee,
  Camera,
  Car,
  BriefcaseMedical,
  Quote,
  ArrowRight,
  Tag,
  Building2,
  XCircle,
  Users,
  ExternalLink,
  Mail,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import PremiumFooter from "../components/tourism/PremiumFooter";
import JourneyCard from "../components/tourism/JourneyCard";
import { featuredTrips } from "../data/tourismData";
import { useContributions } from "../data/ContributionContext";
import { auth } from "../lib/firebase";

// Amenities mapping
const AMENITIES = [
  { icon: ShieldCheck, label: "Luxury Stay" },
  { icon: Navigation, label: "Private Guide" },
  { icon: Coffee, label: "Premium Meals" },
  { icon: Camera, label: "Photography" },
  { icon: Car, label: "Luxury Transport" },
  { icon: BriefcaseMedical, label: "Medical Support" },
];

const JourneyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { journeySubmissions, refreshJourneys } = useContributions();
  const [isLoading, setIsLoading] = useState(true);
  const foundTrip = featuredTrips.find((t) => t.id === id) || journeySubmissions.find((t) => t.id === id);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isAuthor = currentUser && foundTrip && (foundTrip as any).authorId === currentUser.uid;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    refreshJourneys().finally(() => setIsLoading(false));
  }, [id, refreshJourneys]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0F3D2E]/20 border-t-[#0F3D2E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!foundTrip) {
    return <Navigate to="/tourism" replace />;
  }

  // Populate/sanitize currentTrip to ensure older/incomplete items in localStorage don't crash
  const currentTrip = {
    ...foundTrip,
    overviewText: foundTrip.overviewText || foundTrip.description || (foundTrip as any).desc || "",
    description: foundTrip.description || foundTrip.overviewText || (foundTrip as any).desc || "",
    rating: foundTrip.rating || 4.9,
    reviews: foundTrip.reviews || [],
    galleryImages: foundTrip.galleryImages && foundTrip.galleryImages.length > 0
      ? foundTrip.galleryImages
      : [foundTrip.image],
    guide: foundTrip.guide || {
      name: "Ramesh Kumar",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
      experience: "10+ Years",
      languages: ["English", "Hindi", "Magahi"],
      intro: "Verified Expert Guide for this custom trip.",
      phone: "+919876543210",
      email: "guide@example.com",
      whatsapp: "+919876543210"
    },
    timeline: foundTrip.timeline && foundTrip.timeline.length > 0
      ? foundTrip.timeline
      : [
        {
          day: 1,
          title: "Explore the Landmarks",
          activities: [
            {
              time: "Flexible",
              activity: "Sightseeing",
              description: (foundTrip as any).desc || foundTrip.description || "Explore and discover the rich heritage of the location."
            }
          ]
        }
      ],
    // Extended fields
    category: (foundTrip as any).category || "",
    companyName: (foundTrip as any).companyName || foundTrip.provider || "",
    tripDuration: (foundTrip as any).tripDuration || foundTrip.duration || "",
    highlights: (foundTrip as any).highlights as string[] | undefined,
    includedServices: (foundTrip as any).includedServices as string[] | undefined,
    excludedServices: (foundTrip as any).excludedServices as string[] | undefined,
    googleMapsLink: (foundTrip as any).googleMapsLink || "",
  };

  const relatedTrips = journeySubmissions.filter((t) => t.id !== id).slice(0, 3);

  // Gallery Memories (using actual gallery or fallbacks)
  const memories = currentTrip.galleryImages.map((url, idx) => ({
    id: idx,
    url,
    category: idx === 0 ? "Destination" : idx === 1 ? "Premium Stay" : "Traveler Moment",
    title: idx === 0 ? "Breathtaking Sights" : idx === 1 ? "Luxury Accommodations" : "Creating Memories",
    className: idx === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
  }));
  // Fill if less than 5
  if (memories.length < 5) {
    memories.push({
      id: 99,
      url: "https://images.unsplash.com/photo-1542314831-c6a4d14d8387?q=80&w=1000",
      category: "Accommodation",
      title: "Resort Life",
      className: "md:col-span-1 md:row-span-1"
    });
  }

  return (
    <div className="min-h-screen bg-brand-gray text-brand-dark selection:bg-brand-gold selection:text-white font-sans relative overflow-x-hidden">
      <Navbar forceDarkText={true} />

      {/* Decorative Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-multiply">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
      </div>

      {/* ========================
          SECTION 1: Premium Hero
          ======================== */}
      <section className="relative min-h-[75vh] pt-32 pb-16 w-full overflow-hidden flex flex-col justify-between">
        {/* Parallax Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 h-[120%] -top-[10%]">
          <img
            src={currentTrip.image}
            alt={currentTrip.title}
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
        </motion.div>

        {/* Back & Action Buttons */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1280px] relative z-20 flex justify-between items-center w-full mb-12">
          <Link
            to="/tourism"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Experiences
          </Link>
          {isAuthor && (
            <Link
              to={`/tourism/create-journey?editId=${currentTrip.id}`}
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-600 text-black font-semibold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-105 font-sans"
            >
              Edit Experience
            </Link>
          )}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1280px] relative z-10 w-full flex flex-col lg:flex-row lg:items-end justify-between gap-12 mt-auto">
          {/* Left Side */}
          <div className="flex-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Category + Company row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {currentTrip.category && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-brand-gold/20 border border-[#F4A261]/40 text-brand-gold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Tag className="w-3 h-3" />{currentTrip.category}
                  </span>
                )}
                {currentTrip.companyName && currentTrip.companyName !== 'Community Contributor' && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/60 uppercase tracking-widest">
                    <Building2 className="w-3 h-3 text-brand-gold" />{currentTrip.companyName}
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
                {currentTrip.title}
              </h1>

              <p className="text-white/80 text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-6">
                {currentTrip.overviewText.slice(0, 150)}...
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-6 flex-wrap">
                {currentTrip.tripDuration && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Clock className="w-4 h-4 text-brand-gold" />
                    <span>{currentTrip.tripDuration}</span>
                  </div>
                )}
                {currentTrip.departureCity && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    <span>{currentTrip.departureCity}</span>
                  </div>
                )}
                {currentTrip.bestTime && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Star className="w-4 h-4 text-brand-gold" />
                    <span>Best: {currentTrip.bestTime}</span>
                  </div>
                )}
                {currentTrip.groupSize && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Users className="w-4 h-4 text-brand-gold" />
                    <span>{currentTrip.groupSize}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================
          SECTION 2: Story & Guide
          ======================== */}
      <section className="py-[120px] container mx-auto px-6 md:px-12 max-w-[1280px] relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* Left Column (65%) */}
          <div className="lg:w-[65%] space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-8 font-light">
                The Journey
              </h2>

              <blockquote className="relative p-8 bg-white rounded-2xl border border-brand-gold/20 shadow-sm mb-12">
                <Quote className="absolute top-6 left-6 w-12 h-12 text-brand-gold opacity-20" />
                <p className="text-2xl font-serif text-brand-dark leading-relaxed italic relative z-10 pl-6">
                  "{currentTrip.quote || "Not just a holiday, but a journey aligned with the rich soil, spiritual structures, and legends."}"
                </p>
              </blockquote>

              <div className="prose prose-lg prose-p:text-[#4A4A4A] prose-p:leading-loose max-w-none text-lg font-light">
                <p>{currentTrip.overviewText}</p>
                <p className="mt-6">{currentTrip.description}</p>
              </div>
            </motion.div>

            {/* Journey Highlights */}
            {currentTrip.highlights && currentTrip.highlights.filter((h: string) => h.trim()).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h3 className="text-2xl font-serif text-brand-dark mb-6 font-light">Journey Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentTrip.highlights.filter((h: string) => h.trim()).map((h: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-brand-gold/20 shadow-sm">
                      <span className="text-brand-gold mt-0.5 shrink-0">✦</span>
                      <span className="text-[#4A4A4A] text-sm leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Included & Excluded Services */}
            {((currentTrip.includedServices && currentTrip.includedServices.filter((s: string) => s.trim()).length > 0) ||
              (currentTrip.excludedServices && currentTrip.excludedServices.filter((s: string) => s.trim()).length > 0)) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <h3 className="text-2xl font-serif text-brand-dark mb-6 font-light">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Included */}
                    {currentTrip.includedServices && currentTrip.includedServices.filter((s: string) => s.trim()).length > 0 && (
                      <div className="bg-white rounded-2xl p-6 border border-brand-gold/20 shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-green-600 mb-4">Included</h4>
                        <ul className="space-y-2">
                          {currentTrip.includedServices.filter((s: string) => s.trim()).map((s: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Excluded */}
                    {currentTrip.excludedServices && currentTrip.excludedServices.filter((s: string) => s.trim()).length > 0 && (
                      <div className="bg-white rounded-2xl p-6 border border-brand-gold/20 shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-4">Not Included</h4>
                        <ul className="space-y-2">
                          {currentTrip.excludedServices.filter((s: string) => s.trim()).map((s: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            {/* Google Maps */}
            {currentTrip.googleMapsLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <a
                  href={currentTrip.googleMapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand-gold transition-colors duration-300"
                >
                  <ExternalLink className="w-4 h-4" /> View on Google Maps
                </a>
              </motion.div>
            )}
          </div>

          {/* Right Column (35%) Sticky Guide Card */}
          <div className="lg:w-[35%] w-full lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-brand-gold/20 shadow-xl shadow-black/5"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6">
                  <img
                    src={currentTrip.guide.image}
                    alt={currentTrip.guide.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-brand-gold/20"
                  />
                  <div className="absolute bottom-0 right-0 bg-brand-gold text-white p-2 rounded-full border-2 border-white">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Verified Expert</span>
                <h3 className="text-2xl font-serif text-brand-dark mb-1">{currentTrip.guide.name}</h3>
                <p className="text-[#6A6A6A] text-sm">{currentTrip.guide.experience} Experience</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-sm text-[#4A4A4A] pb-4 border-b border-brand-gold/20">
                  <Globe className="w-5 h-5 text-brand-gold" />
                  <span>Speaks: {currentTrip.guide.languages.join(", ")}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#4A4A4A] pb-4 border-b border-brand-gold/20">
                  <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  <span>{currentTrip.rating} / 5 ({currentTrip.reviews.length} reviews)</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${currentTrip.guide.phone}`}
                  className="w-full h-14 bg-brand-dark text-white rounded-full flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors duration-300"
                >
                  <Phone className="w-4 h-4" />
                  Call Guide
                </a>
                <a
                  href={`https://wa.me/${currentTrip.guide.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-[#128C7E] transition-colors duration-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
                {currentTrip.guide.email && (
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(currentTrip.guide.email)}&su=${encodeURIComponent(`Inquiry about ${currentTrip.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-14 bg-[#EA4335] text-white rounded-full flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-[#C5221F] transition-colors duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    Email Guide
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ========================
          SECTION 4: Immersive Gallery
          ======================== */}
      <section className="py-[120px] container mx-auto px-6 md:px-12 max-w-[1280px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Visual Artifacts</span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-dark font-light">Immersive Gallery</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {memories.map((mem, idx) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              onClick={() => setLightboxIndex(idx)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-700 bg-black ${mem.className}`}
            >
              <img
                src={mem.url}
                alt={mem.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-2 block">
                  {mem.category}
                </span>
                <h3 className="text-white font-serif text-2xl">
                  {mem.title}
                </h3>
              </div>

              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                <Maximize2 className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================
          SECTION 5: Journey Timeline
          ======================== */}
      <section className="py-[120px] bg-white relative">
        <div className="container mx-auto px-6 md:px-12 max-w-[1000px] relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Itinerary</span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-dark font-light">Journey Details</h2>
          </div>

          <div className="space-y-12">
            {currentTrip.timeline.map((day, dayIdx) => (
              <motion.div
                key={dayIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-brand-gray rounded-2xl p-8 md:p-10 shadow-sm border border-brand-gold/20"
              >
                <h3 className="text-2xl font-serif text-brand-dark mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-brand-gold/20 pb-6">
                  <span className="text-brand-gold font-bold text-sm tracking-widest uppercase bg-white px-4 py-2 rounded-full shadow-sm">
                    Day {day.day}
                  </span>
                  <span>{day.title}</span>
                </h3>

                <div className="space-y-8">
                  {day.activities.map((act, actIdx) => (
                    <div key={actIdx} className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                      {act.time && (
                        <div className="sm:w-32 shrink-0 pt-1">
                          <span className="text-[#6A6A6A] text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded shadow-sm inline-block">
                            {act.time}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-serif text-brand-dark mb-2">{act.activity}</h4>
                        <p className="text-[#4A4A4A] leading-relaxed text-sm">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* SECTION 7: Traveler Reviews Removed */}

      {/* ========================
          SECTION 8: Related Experiences
          ======================== */}
      <section className="py-[120px] bg-white relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-[1280px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Continue Exploring</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-dark font-light">Related Experiences</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {relatedTrips.map((trip) => (
              <JourneyCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: Call To Action Removed */}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-xl"
          >
            <button onClick={() => setLightboxIndex(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 z-[100] transition-colors">
              <X className="w-5 h-5" />
            </button>

            <button onClick={() => { const len = memories.length; setLightboxIndex((p) => (p !== null ? (p - 1 + len) % len : null)); }} className="absolute left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 z-[100] transition-colors hidden md:flex">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button onClick={() => { const len = memories.length; setLightboxIndex((p) => (p !== null ? (p + 1) % len : null)); }} className="absolute right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 z-[100] transition-colors hidden md:flex">
              <ChevronRight className="w-5 h-5" />
            </button>

            <motion.div key={lightboxIndex} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="max-w-5xl w-full max-h-[85vh] relative flex flex-col items-center justify-center">
              <img src={memories[lightboxIndex].url} alt={memories[lightboxIndex].title} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl select-none" />
              <div className="text-center mt-8">
                <h4 className="text-white font-serif text-2xl mb-2">{memories[lightboxIndex].title}</h4>
                <span className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">
                  {memories[lightboxIndex].category} • {lightboxIndex + 1} / {memories.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PremiumFooter />
    </div>
  );
};

export default JourneyDetails;
