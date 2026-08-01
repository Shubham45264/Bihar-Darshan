import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Image as ImageIcon, Upload, X, MapPin, Quote, Camera, Plus, Trash2, GripVertical, CheckCircle, Phone, MessageSquare, Globe, Star, Clock, ArrowLeft, Tag, Building2, ListChecks, XCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import PremiumFooter from "../components/tourism/PremiumFooter";
import { useContributions } from "../data/ContributionContext";
import heroBg from "../assets/hero.png";
import "./CreateJourney.css";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

// ─────────────────────────────────────────────────────────────────────────────
// Interface Definitions
// ─────────────────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: string;
  url: string;
  title: string;
}

interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
}

interface TimelineDay {
  id: string;
  day: number;
  title: string;
  activities: Activity[];
}

const CATEGORY_OPTIONS = [
  "Spiritual",
  "Heritage",
  "Wildlife",
  "Nature",
  "Adventure",
  "Cultural",
  "Religious",
  "Historical",
];

const BIHAR_DISTRICTS = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur",
  "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad",
  "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura",
  "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia",
  "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi",
  "Siwan", "Supaul", "Vaishali", "West Champaran",
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const CreateJourney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId");
  const { journeySubmissions, addJourneySubmission, updateJourneySubmission } = useContributions();
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // ── Collapsible Sections ──────────────────────────────────────────────────
  const [openSections, setOpenSections] = useState({
    hero: true,
    intro: false,
    guide: false,
    gallery: false,
    details: false,
    timeline: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ── Load data when editing ────────────────────────────────────────────────
  useEffect(() => {
    if (editId && journeySubmissions.length > 0) {
      const trip = journeySubmissions.find((t) => t.id === editId);
      if (trip) {
        setTitle(trip.title || "");
        setShortDesc((trip as any).desc || "");
        setDescription(trip.description || "");
        setHeroImage(trip.image || null);
        if (trip.quote) setQuote(trip.quote);
        if (trip.price) setBudget(trip.price);
        if (trip.departureCity) setDistrict(trip.departureCity);
        if ((trip as any).category) setCategory((trip as any).category);
        if ((trip as any).companyName) setCompanyName((trip as any).companyName);
        if ((trip as any).tripDuration) setTripDuration((trip as any).tripDuration);
        if ((trip as any).highlights?.length) setHighlights((trip as any).highlights);
        if ((trip as any).includedServices?.length) setIncludedServices((trip as any).includedServices);
        if ((trip as any).excludedServices?.length) setExcludedServices((trip as any).excludedServices);
        if ((trip as any).googleMapsLink) setGoogleMapsLink((trip as any).googleMapsLink);
        if (trip.bestTime) setBestTime(trip.bestTime);
        if (trip.groupSize) setGroupSize(trip.groupSize);
        if (trip.rating) setRating(String(trip.rating));
        if ((trip as any).userRating) setUserRating(String((trip as any).userRating));
        if (trip.guide) {
          setGuideName(trip.guide.name || "");
          setGuidePhoto(trip.guide.image || null);
          setExperience(trip.guide.experience || "");
          setLanguages(trip.guide.languages?.join(", ") || "");
          setCallNumber(trip.phone || trip.guide.phone || "");
          setWhatsapp(trip.whatsapp || trip.guide.whatsapp || "");
        }
        if (trip.galleryImages) {
          setGallery(trip.galleryImages.map((url, idx) => ({ id: String(idx), url, title: `Gallery ${idx}` })));
        }
        if (trip.timeline && trip.timeline.length > 0) {
          setTimeline(
            trip.timeline.map((day, dIdx) => ({
              id: String(dIdx),
              day: day.day,
              title: day.title,
              activities: day.activities.map((act, aIdx) => ({
                id: String(aIdx),
                time: act.time || "Flexible",
                title: act.activity || "Sightseeing",
                description: act.description || "",
              })),
            }))
          );
        }
      }
    }
  }, [editId, journeySubmissions]);

  // ── Form States ───────────────────────────────────────────────────────────

  // Section 1: Hero Banner
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [district, setDistrict] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [heroImage, setHeroImage] = useState<string | null>(null);

  // Section 2: Introduction
  const [quote, setQuote] = useState("");
  const [highlights, setHighlights] = useState<string[]>(["", "", "", "", ""]);
  const [description, setDescription] = useState("");

  // Section 3: Guide Information
  const [guidePhoto, setGuidePhoto] = useState<string | null>(null);
  const [guideName, setGuideName] = useState("");
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState("");
  const [rating, setRating] = useState("5");
  const [userRating, setUserRating] = useState("5");
  const [callNumber, setCallNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Section 4: Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Section 5: Journey Details
  const [bestTime, setBestTime] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [includedServices, setIncludedServices] = useState<string[]>(["", "", ""]);
  const [excludedServices, setExcludedServices] = useState<string[]>(["", ""]);

  // Section 6: Timeline
  const [timeline, setTimeline] = useState<TimelineDay[]>([
    {
      id: "day1",
      day: 1,
      title: "",
      activities: [{ id: "act1", time: "", title: "", description: "" }],
    },
  ]);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const heroInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ── File Upload Handlers ──────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await uploadToCloudinary(e.target.files[0]);
        setter(res.secure_url);
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        alert("Failed to upload image to Cloudinary");
      }
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(async (file, index) => {
        try {
          const res = await uploadToCloudinary(file);
          setGallery((prev) => [...prev, { id: res.public_id || (Date.now().toString() + index), url: res.secure_url, title: "Gallery Memory" }]);
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
        }
      });
    }
  };

  const removeGalleryItem = (id: string) => setGallery((prev) => prev.filter((item) => item.id !== id));
  const updateGalleryTitle = (id: string, title: string) => setGallery((prev) => prev.map((item) => (item.id === id ? { ...item, title } : item)));

  // ── Highlights Handlers ───────────────────────────────────────────────────
  const updateHighlight = (idx: number, val: string) => setHighlights((prev) => prev.map((h, i) => (i === idx ? val : h)));
  const addHighlight = () => setHighlights((prev) => [...prev, ""]);
  const removeHighlight = (idx: number) => setHighlights((prev) => prev.filter((_, i) => i !== idx));

  // ── Services Handlers ─────────────────────────────────────────────────────
  const updateIncluded = (idx: number, val: string) => setIncludedServices((prev) => prev.map((s, i) => (i === idx ? val : s)));
  const addIncluded = () => setIncludedServices((prev) => [...prev, ""]);
  const removeIncluded = (idx: number) => setIncludedServices((prev) => prev.filter((_, i) => i !== idx));

  const updateExcluded = (idx: number, val: string) => setExcludedServices((prev) => prev.map((s, i) => (i === idx ? val : s)));
  const addExcluded = () => setExcludedServices((prev) => [...prev, ""]);
  const removeExcluded = (idx: number) => setExcludedServices((prev) => prev.filter((_, i) => i !== idx));

  // ── Timeline Handlers ─────────────────────────────────────────────────────
  const addDay = () => {
    const newDayNum = timeline.length + 1;
    setTimeline((prev) => [...prev, { id: Date.now().toString(), day: newDayNum, title: "", activities: [] }]);
  };

  const removeDay = (dayId: string) => setTimeline((prev) => prev.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, day: i + 1 })));

  const addActivity = (dayId: string) => {
    setTimeline((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? { ...day, activities: [...day.activities, { id: Date.now().toString(), time: "", title: "", description: "" }] }
          : day
      )
    );
  };

  const removeActivity = (dayId: string, actId: string) => {
    setTimeline((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, activities: day.activities.filter((a) => a.id !== actId) } : day
      )
    );
  };

  const updateActivity = (dayId: string, actId: string, field: keyof Activity, value: string) => {
    setTimeline((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, activities: day.activities.map((a) => (a.id === actId ? { ...a, [field]: value } : a)) } : day
      )
    );
  };

  const updateDayTitle = (dayId: string, title: string) => {
    setTimeline((prev) => prev.map((day) => (day.id === dayId ? { ...day, title } : day)));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title || !shortDesc) {
      alert("Please fill out Journey Title and Short Description.");
      return;
    }

    const durationDays = timeline.length;
    const computedDuration = tripDuration || `${durationDays > 1 ? durationDays - 1 : 1} Nights / ${durationDays} Days`;

    const filteredHighlights = highlights.filter((h) => h.trim() !== "");
    const filteredIncluded = includedServices.filter((s) => s.trim() !== "");
    const filteredExcluded = excludedServices.filter((s) => s.trim() !== "");

    const submissionData = {
      title,
      shortDesc,
      description: description || shortDesc,
      image: heroImage || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2000&auto=format&fit=crop",
      duration: computedDuration,
      tripDuration: computedDuration,
      overviewText: description || shortDesc,
      quote,
      category,
      companyName,
      highlights: filteredHighlights,
      includedServices: filteredIncluded,
      excludedServices: filteredExcluded,
      googleMapsLink,
      guideName: guideName || "Community Guide",
      guideImage: guidePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
      guideExperience: experience || "5+ Years",
      guideLanguages: languages ? languages.split(",").map((l) => l.trim()) : ["Hindi", "English"],
      guideIntro: "Verified community guide for this journey.",
      guidePhone: callNumber || "+919876543210",
      guideEmail: "guide@example.com",
      guideWhatsapp: whatsapp || "+919876543210",
      rating: parseFloat(rating) || 5,
      userRating: parseFloat(userRating) || 5,
      galleryImages:
        gallery.map((g) => g.url).length > 0
          ? gallery.map((g) => g.url)
          : [heroImage || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2000&auto=format&fit=crop"],
      timeline: timeline.map((day) => ({
        day: day.day,
        title: day.title || `Day ${day.day}`,
        activities: day.activities.map((act) => ({
          time: act.time || "Flexible",
          activity: act.title || "Sightseeing",
          description: act.description || "Explore and enjoy.",
        })),
      })),
      district: district || "Patna",
      price: budget || "Flexible",
      phone: callNumber || "+919876543210",
      whatsapp: whatsapp || "+919876543210",
      difficulty: "Easy" as const,
      bestTime: bestTime || "October to March",
      groupSize: groupSize || "Flexible",
      transportation: "Custom Arranged",
      startPoint: district || "Patna",
      endPoint: district || "Patna",
      emergencyContact: callNumber || "+919876543210",
      email: "contributor@example.com",
      stops: timeline.map((day) => day.title).filter((t) => t && t.trim() !== ""),
    };

    try {
      if (editId) {
        await updateJourneySubmission(editId, submissionData);
      } else {
        await addJourneySubmission(submissionData);
      }
      setShowSuccessCard(true);
      window.dispatchEvent(new Event('submissionCreated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e: any) {
      alert("Failed to submit journey. Please ensure you are logged in and try again.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="create-journey-wrapper" style={{ backgroundImage: `url(${heroBg})` }}>
      {/* Decorative Mandalas */}
      <div className="bg-decor bg-decor-left">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="45" strokeWidth="0.3" strokeDasharray="1,1" />
          <circle cx="50" cy="50" r="35" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="22" strokeWidth="0.6" />
          <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18 18 L 82 82 M 18 82 L 82 18" strokeWidth="0.2" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos((angle * Math.PI) / 180)} y2={50 + 40 * Math.sin((angle * Math.PI) / 180)} strokeWidth="0.3" />;
          })}
        </svg>
      </div>
      <div className="bg-decor bg-decor-right">
        <svg viewBox="0 0 100 120" fill="none" stroke="currentColor">
          <path d="M 10 110 L 90 110 L 80 80 L 20 80 Z" strokeWidth="0.4" />
          <path d="M 25 80 L 75 80 L 65 50 L 35 50 Z" strokeWidth="0.4" />
          <path d="M 38 50 L 62 50 L 50 15 Z" strokeWidth="0.4" />
          <line x1="50" y1="15" x2="50" y2="5" strokeWidth="0.8" />
          <circle cx="50" cy="5" r="2.5" fill="currentColor" />
          <path d="M 42 110 A 8 8 0 0 1 58 110 Z" strokeWidth="0.4" />
        </svg>
      </div>

      <Navbar forceWhiteText={true} />

      <main className="create-journey-content">
        <div className="create-journey-panel">
          <button className="btn-secondary mr-auto flex items-center gap-2 mb-8" onClick={() => navigate("/tourism")}>
            <ArrowLeft size={16} /> Back
          </button>

          <h1 className="create-journey-title">Create Featured Journey</h1>
          <p className="create-journey-subtitle">Design a memorable experience to showcase on the Bihar Darshan tourism page.</p>

          <div className="form-container">

            {/* ─────────────────────────────────────────────────────────── */}
            {/* SECTION 1: Hero Banner                                       */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="form-section">
              <div className="form-section-header" onClick={() => toggleSection("hero")}>
                <h3><ImageIcon className="section-icon" size={24} /> 1. Hero Banner</h3>
                {openSections.hero ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              <AnimatePresence>
                {openSections.hero && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="form-section-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        {/* Journey Title */}
                        <div className="form-group">
                          <label className="form-label">Journey Title <span className="text-red-400">*</span></label>
                          <input type="text" className="form-control-dark" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mahabodhi Trail" />
                        </div>

                        {/* Category + Company Name */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-group">
                            <label className="form-label flex items-center gap-1"><Tag size={13} /> Category <span className="text-red-400">*</span></label>
                            <select className="form-control-dark" value={category} onChange={(e) => setCategory(e.target.value)}>
                              <option value="">Select Category</option>
                              {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label flex items-center gap-1"><Building2 size={13} /> Company / Provider Name</label>
                            <input type="text" className="form-control-dark" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Bihar Tours Pvt Ltd" />
                          </div>
                        </div>

                        {/* Trip Duration + Budget */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-group">
                            <label className="form-label flex items-center gap-1"><Clock size={13} /> Trip Duration <span className="text-red-400">*</span></label>
                            <select className="form-control-dark" value={tripDuration} onChange={(e) => setTripDuration(e.target.value)}>
                              <option value="">Select Duration</option>
                              <option value="1 Day">1 Day</option>
                              <option value="2 Days / 1 Night">2 Days / 1 Night</option>
                              <option value="3 Days / 2 Nights">3 Days / 2 Nights</option>
                              <option value="4 Days / 3 Nights">4 Days / 3 Nights</option>
                              <option value="5 Days / 4 Nights">5 Days / 4 Nights</option>
                              <option value="6 Days / 5 Nights">6 Days / 5 Nights</option>
                              <option value="7+ Days">7+ Days</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Estimated Budget</label>
                            <input type="text" className="form-control-dark" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. ₹15,000" />
                          </div>
                        </div>

                        {/* Departure District */}
                        <div className="form-group">
                          <label className="form-label flex items-center gap-1"><MapPin size={13} /> Departure District <span className="text-red-400">*</span></label>
                          <select className="form-control-dark" value={district} onChange={(e) => setDistrict(e.target.value)}>
                            <option value="">Select District</option>
                            {BIHAR_DISTRICTS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        {/* Short Description */}
                        <div className="form-group">
                          <label className="form-label">Short Description <span className="text-red-400">*</span></label>
                          <textarea
                            className="form-control-dark"
                            value={shortDesc}
                            onChange={(e) => setShortDesc(e.target.value)}
                            placeholder="Brief tagline about your journey..."
                            rows={3}
                            maxLength={200}
                          />
                          <span className="text-white/40 text-xs mt-1 block">{shortDesc.length} / 200 characters</span>
                        </div>
                      </div>

                      {/* Hero Image Upload */}
                      <div className="form-group">
                        <label className="form-label">Hero Banner Image <span className="text-red-400">*</span></label>
                        <div className="upload-zone" onClick={() => !heroImage && heroInputRef.current?.click()}>
                          <input type="file" ref={heroInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setHeroImage)} />
                          {heroImage ? (
                            <>
                              <img src={heroImage} alt="Hero Preview" className="preview-image rounded-xl" />
                              <button className="remove-image-btn" onClick={(e) => { e.stopPropagation(); setHeroImage(null); }}><X size={16} /></button>
                            </>
                          ) : (
                            <>
                              <div className="upload-icon"><Upload size={24} /></div>
                              <p className="upload-text">Upload Hero Image</p>
                              <p className="upload-subtext">High quality landscape image</p>
                              <p className="upload-subtext">Recommended size: 1200×600px</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="mt-8 pt-8 border-t border-[#F4A261]/20">
                      <h4 className="text-white font-bold mb-4">Live Preview: Hero Card</h4>
                      <div className="relative h-[280px] w-full rounded-2xl overflow-hidden flex items-end">
                        <div className="absolute inset-0 z-0 bg-gray-700">
                          {heroImage ? (
                            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image Selected</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D2E] via-[#0F3D2E]/40 to-transparent" />
                        </div>
                        <div className="relative z-10 p-8 w-full flex flex-col gap-2">
                          {category && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#F4A261]/20 border border-[#F4A261]/40 text-[#F4A261] px-3 py-1 rounded-full w-fit">{category}</span>
                          )}
                          {companyName && (
                            <span className="text-white/60 text-xs font-semibold flex items-center gap-1"><Building2 size={11} />{companyName}</span>
                          )}
                          <h2 className="font-display font-bold text-3xl text-white leading-tight">{title || "Journey Title"}</h2>
                          <p className="text-white/80 text-sm font-light">{shortDesc || "Short description..."}</p>
                          <div className="flex items-center gap-4 mt-2 text-[#F4A261] text-xs font-bold">
                            {tripDuration && <span className="flex items-center gap-1"><Clock size={11} />{tripDuration}</span>}
                            {district && <span className="flex items-center gap-1"><MapPin size={11} />{district}</span>}
                            {budget && <span>• {budget}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* SECTION 2: Journey Introduction                              */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="form-section">
              <div className="form-section-header" onClick={() => toggleSection("intro")}>
                <h3><Quote className="section-icon" size={24} /> 2. Journey Introduction</h3>
                {openSections.intro ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {openSections.intro && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="form-section-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Quote + Description */}
                      <div className="space-y-5">
                        <div className="form-group">
                          <label className="form-label">Journey Quote</label>
                          <input
                            type="text"
                            className="form-control-dark"
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            placeholder="An inspiring quote about this journey..."
                          />
                          <span className="text-white/40 text-xs mt-1 block">{quote.length} / 150 characters</span>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Journey Description</label>
                          <textarea
                            className="form-control-dark"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Full detailed description of what makes this journey special..."
                            rows={7}
                          />
                          <span className="text-white/40 text-xs mt-1 block">{description.length} / 2000 characters</span>
                        </div>
                      </div>

                      {/* Right: Highlights */}
                      <div className="form-group">
                        <label className="form-label flex items-center gap-1"><ListChecks size={14} /> Journey Highlights</label>
                        <p className="text-white/50 text-xs mb-3">Add 4–6 highlights about this journey.</p>
                        <div className="space-y-2">
                          {highlights.map((h, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-[#F4A261]">✦</span>
                              <input
                                type="text"
                                className="form-control-dark flex-1 py-2"
                                value={h}
                                onChange={(e) => updateHighlight(idx, e.target.value)}
                                placeholder={`e.g. UNESCO World Heritage Site`}
                              />
                              {highlights.length > 1 && (
                                <button onClick={() => removeHighlight(idx)} className="text-red-400 hover:text-red-300 p-1 transition">
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button onClick={addHighlight} className="mt-3 flex items-center gap-2 text-[#F4A261] hover:text-[#e09151] font-bold text-sm transition">
                          <Plus size={15} /> Add highlight
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* SECTION 3: Guide Information                                 */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="form-section">
              <div className="form-section-header" onClick={() => toggleSection("guide")}>
                <h3><CheckCircle className="section-icon" size={24} /> 3. Guide Information</h3>
                {openSections.guide ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {openSections.guide && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="form-section-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Guide Photo */}
                      <div className="form-group">
                        <label className="form-label">Guide Photo</label>
                        <div className="upload-zone" style={{ minHeight: "150px" }} onClick={() => !guidePhoto && guideInputRef.current?.click()}>
                          <input type="file" ref={guideInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setGuidePhoto)} />
                          {guidePhoto ? (
                            <>
                              <img src={guidePhoto} alt="Guide Preview" className="preview-image rounded-xl object-contain" />
                              <button className="remove-image-btn" onClick={(e) => { e.stopPropagation(); setGuidePhoto(null); }}><X size={16} /></button>
                            </>
                          ) : (
                            <>
                              <div className="upload-icon"><Camera size={24} /></div>
                              <p className="upload-text text-sm">Upload Photo</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="form-group">
                          <label className="form-label">Guide Name</label>
                          <input type="text" className="form-control-dark" value={guideName} onChange={(e) => setGuideName(e.target.value)} placeholder="e.g. Ramesh Kumar" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="form-group">
                            <label className="form-label">Experience</label>
                            <select className="form-control-dark" value={experience} onChange={(e) => setExperience(e.target.value)}>
                              <option value="">Select Experience</option>
                              <option value="1-2 Years">1-2 Years</option>
                              <option value="3-5 Years">3-5 Years</option>
                              <option value="5-10 Years">5-10 Years</option>
                              <option value="10+ Years">10+ Years</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Rating</label>
                            <select className="form-control-dark" value={rating} onChange={(e) => setRating(e.target.value)}>
                              <option value="5">5 ⭐⭐⭐⭐⭐</option>
                              <option value="4">4 ⭐⭐⭐⭐</option>
                              <option value="3">3 ⭐⭐⭐</option>
                              <option value="2">2 ⭐⭐</option>
                              <option value="1">1 ⭐</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Your Rating</label>
                            <select className="form-control-dark" value={userRating} onChange={(e) => setUserRating(e.target.value)}>
                              <option value="5">5 ⭐⭐⭐⭐⭐</option>
                              <option value="4">4 ⭐⭐⭐⭐</option>
                              <option value="3">3 ⭐⭐⭐</option>
                              <option value="2">2 ⭐⭐</option>
                              <option value="1">1 ⭐</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Languages (comma separated)</label>
                          <input type="text" className="form-control-dark" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. English, Hindi, Magahi" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-group">
                            <label className="form-label flex items-center gap-1"><Phone size={12} /> Call Number</label>
                            <input type="text" className="form-control-dark" value={callNumber} onChange={(e) => setCallNumber(e.target.value)} placeholder="+91 9876543210" />
                          </div>
                          <div className="form-group">
                            <label className="form-label flex items-center gap-1"><MessageSquare size={12} /> WhatsApp Number</label>
                            <input type="text" className="form-control-dark" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 9876543210" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview: Guide Card */}
                    <div className="mt-8 pt-8 border-t border-[#F4A261]/20 flex justify-center">
                      <div className="w-full max-w-[350px]">
                        <h4 className="text-white font-bold mb-4 text-center">Live Preview: Guide Card</h4>
                        <div className="bg-[#1a1512] rounded-2xl p-8 border border-[#D4A017]/20 shadow-xl">
                          <div className="flex flex-col items-center text-center mb-6">
                            <div className="relative mb-4">
                              {guidePhoto ? (
                                <img src={guidePhoto} alt={guideName} className="w-24 h-24 rounded-full object-cover border-4 border-[#D4A017]/20" />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-[#D4A017]/20 flex items-center justify-center text-gray-400 text-xs">Photo</div>
                              )}
                              <div className="absolute bottom-0 right-0 bg-[#F4A261] text-white p-1.5 rounded-full border-2 border-white">
                                <CheckCircle className="w-3 h-3" />
                              </div>
                            </div>
                            <span className="text-[#F4A261] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Verified Expert</span>
                            <h3 className="text-xl font-serif text-white">{guideName || "Guide Name"}</h3>
                            <p className="text-white/70 text-xs">{experience || "Experience"} Experience</p>
                          </div>
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-xs text-white/70 pb-3 border-b border-[#D4A017]/20">
                              <Globe className="w-4 h-4 text-[#F4A261]" />
                              <span>Speaks: {languages || "..."}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/70 pb-3 border-b border-[#D4A017]/20">
                              <Star className="w-4 h-4 text-[#F4A261] fill-[#F4A261]" />
                              <span>{rating || "0"} / 5 Rating</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="w-full h-10 bg-[#0F3D2E] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest pointer-events-none">
                              <Phone className="w-3 h-3" /> Call Guide
                            </button>
                            <button className="w-full h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest pointer-events-none">
                              <MessageSquare className="w-3 h-3" /> WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* SECTION 4: Immersive Gallery                                 */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="form-section">
              <div className="form-section-header" onClick={() => toggleSection("gallery")}>
                <h3><Camera className="section-icon" size={24} /> 4. Immersive Gallery</h3>
                {openSections.gallery ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {openSections.gallery && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="form-section-content">
                    <div className="mb-4 flex justify-between items-center">
                      <p className="text-white/70 text-sm">Add images to build an immersive gallery.</p>
                      <button className="btn-secondary px-4 py-2 flex items-center gap-2 text-sm" onClick={() => galleryInputRef.current?.click()}>
                        <Plus size={16} /> Add Images
                      </button>
                      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                    </div>

                    <div className="space-y-4 mb-8">
                      {gallery.length === 0 ? (
                        <div className="text-center p-8 bg-[#1a1512]/50 rounded-xl border border-dashed border-[#F4A261]/50 text-white/70">
                          No images added yet. Click "Add Images" to upload.
                        </div>
                      ) : (
                        gallery.map((item) => (
                          <div key={item.id} className="gallery-item-row flex items-center gap-4 p-3 rounded-xl shadow-sm">
                            <GripVertical className="text-gray-400 cursor-grab" />
                            <img src={item.url} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <input type="text" className="form-control-light py-2" value={item.title} onChange={(e) => updateGalleryTitle(item.id, e.target.value)} placeholder="Image Title" />
                            </div>
                            <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" onClick={() => removeGalleryItem(item.id)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {gallery.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-[#F4A261]/20">
                        <h4 className="text-white font-bold mb-4">Live Preview: Gallery Grid</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
                          {gallery.map((mem, idx) => (
                            <div key={`prev-${mem.id}`} className={`relative rounded-xl overflow-hidden bg-black ${idx === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"}`}>
                              <img src={mem.url} alt={mem.title} className="w-full h-full object-cover opacity-80" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-serif text-lg">{mem.title}</h3>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* SECTION 5: Journey Details                                   */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="form-section">
              <div className="form-section-header" onClick={() => toggleSection("details")}>
                <h3><ListChecks className="section-icon" size={24} /> 5. Journey Details</h3>
                {openSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {openSections.details && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="form-section-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left column */}
                      <div className="space-y-5">
                        <div className="form-group">
                          <label className="form-label">Best Time to Visit</label>
                          <select className="form-control-dark" value={bestTime} onChange={(e) => setBestTime(e.target.value)}>
                            <option value="">Select Best Time</option>
                            <option value="All Year Round">All Year Round</option>
                            <option value="Winter (Oct - Mar)">Winter (Oct - Mar)</option>
                            <option value="Summer (Apr - Jun)">Summer (Apr - Jun)</option>
                            <option value="Monsoon (Jul - Sep)">Monsoon (Jul - Sep)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label flex items-center justify-between">
                            <span className="flex items-center gap-1"><Globe size={13} /> Google Maps Link</span>
                            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-[#F4A261] text-xs hover:underline flex items-center gap-1">Open Maps <Globe size={10} /></a>
                          </label>
                          <input type="url" className="form-control-dark" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} placeholder="https://maps.app.goo.gl/..." />
                          <p className="text-white/40 text-xs mt-1">Search your location in Google Maps, click share, and paste the link here.</p>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Group Size</label>
                          <input type="text" className="form-control-dark" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} placeholder="e.g. 10-15 Travelers, or Flexible" />
                        </div>

                        {/* Included Services */}
                        <div className="form-group">
                          <label className="form-label flex items-center gap-1 text-green-400">
                            <CheckCircle size={14} className="text-green-400" /> Included Services
                          </label>
                          <div className="space-y-2">
                            {includedServices.map((s, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-green-400 shrink-0" />
                                <input
                                  type="text"
                                  className="form-control-dark flex-1 py-2"
                                  value={s}
                                  onChange={(e) => updateIncluded(idx, e.target.value)}
                                  placeholder={`e.g. Guide Service, Accommodation, Breakfast...`}
                                />
                                {includedServices.length > 1 && (
                                  <button onClick={() => removeIncluded(idx)} className="text-red-400 hover:text-red-300 p-1 transition"><X size={13} /></button>
                                )}
                              </div>
                            ))}
                          </div>
                          <button onClick={addIncluded} className="mt-2 flex items-center gap-2 text-green-400 hover:text-green-300 font-bold text-sm transition">
                            <Plus size={14} /> Add Included Service
                          </button>
                        </div>
                      </div>

                      {/* Right column: Excluded Services */}
                      <div className="form-group">
                        <label className="form-label flex items-center gap-1 text-red-400 mt-0 md:mt-[calc(5rem+20px+76px+76px+8px)]">
                          <XCircle size={14} className="text-red-400" /> Excluded Services
                        </label>
                        <div className="space-y-2">
                          {excludedServices.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <X size={14} className="text-red-400 shrink-0" />
                              <input
                                type="text"
                                className="form-control-dark flex-1 py-2"
                                value={s}
                                onChange={(e) => updateExcluded(idx, e.target.value)}
                                placeholder={`e.g. Personal Expenses, Shopping, Entry Tickets...`}
                              />
                              {excludedServices.length > 1 && (
                                <button onClick={() => removeExcluded(idx)} className="text-red-400 hover:text-red-300 p-1 transition"><X size={13} /></button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button onClick={addExcluded} className="mt-2 flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm transition">
                          <Plus size={14} /> Add Excluded Service
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* SECTION 6: Journey Timeline (Itinerary)                      */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="form-section">
              <div className="form-section-header" onClick={() => toggleSection("timeline")}>
                <h3><Clock className="section-icon" size={24} /> 6. Journey Itinerary (Day-wise)</h3>
                {openSections.timeline ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {openSections.timeline && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="form-section-content">
                    <div className="space-y-8">
                      {timeline.map((day) => (
                        <div key={day.id} className="day-container p-6 rounded-2xl shadow-sm relative">
                          <button className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition" onClick={() => removeDay(day.id)} title="Remove Day">
                            <X size={20} />
                          </button>

                          <div className="flex items-center gap-4 mb-6">
                            <div className="bg-[#F4A261] text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-widest">
                              Day {day.day}
                            </div>
                            <input
                              type="text"
                              className="form-control-light font-serif text-lg text-white py-2"
                              value={day.title}
                              onChange={(e) => updateDayTitle(day.id, e.target.value)}
                              placeholder="Day Title (e.g. Arrival & Mahabodhi Temple)"
                            />
                          </div>

                          <div className="space-y-4 pl-4 border-l-2 border-[#D4A017]/20 ml-4">
                            {day.activities.map((act) => (
                              <div key={act.id} className="relative activity-row p-4 rounded-xl flex flex-col sm:flex-row gap-4">
                                <button className="absolute top-2 right-2 text-red-300 hover:text-red-600 p-1" onClick={() => removeActivity(day.id, act.id)}>
                                  <X size={14} />
                                </button>
                                <div className="sm:w-32">
                                  <input type="text" className="form-control-light py-2 text-xs font-bold text-center" value={act.time} onChange={(e) => updateActivity(day.id, act.id, "time", e.target.value)} placeholder="10:00 AM" />
                                </div>
                                <div className="flex-1 space-y-3">
                                  <input type="text" className="form-control-light py-2" value={act.title} onChange={(e) => updateActivity(day.id, act.id, "title", e.target.value)} placeholder="Activity Title" />
                                  <textarea className="form-control-light py-2 text-sm" style={{ minHeight: "60px" }} value={act.description} onChange={(e) => updateActivity(day.id, act.id, "description", e.target.value)} placeholder="Activity Description..." />
                                </div>
                              </div>
                            ))}
                            <button className="flex items-center gap-2 text-[#F4A261] hover:text-[#e09151] font-bold text-sm px-4 py-2 transition" onClick={() => addActivity(day.id)}>
                              <Plus size={16} /> Add Activity
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <button className="btn-secondary w-full flex justify-center items-center gap-2" onClick={addDay}>
                        <Plus size={18} /> Add Another Day
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>{/* /form-container */}

          {/* Submit */}
          <div className="form-actions border-t border-[#F4A261]/20 pt-8 mt-12">
            <button className="btn-primary" onClick={handleSubmit}>Submit Journey</button>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <PremiumFooter />
      </div>

      {/* Success Modal */}
      {showSuccessCard && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 font-sans">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A3A2F] border border-[#EAB308]/25 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative text-center text-white"
          >
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-[#EAB308] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/5">
              <CheckCircle className="text-[#EAB308] w-10 h-10" />
            </div>
            <h3 className="font-display text-3xl font-bold text-white mb-4">
              Submission <span className="text-[#EAB308]">Successful!</span>
            </h3>
            <div className="heritage-divider mb-6">
              <span className="divider-line text-white/20"></span>
              <span className="divider-motif text-[#EAB308]">✦</span>
              <span className="divider-line text-white/20"></span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Your custom journey itinerary has been submitted and is currently <strong>Pending Admin Approval</strong>. It will be visible to everyone once approved by an administrator.
            </p>
            <button
              onClick={() => { setShowSuccessCard(false); navigate("/tourism"); }}
              className="w-full py-3.5 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-extrabold rounded-xl transition-all cursor-pointer uppercase tracking-wider text-xs shadow-lg hover:scale-105 duration-300"
            >
              Continue to Tourism Page
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CreateJourney;
