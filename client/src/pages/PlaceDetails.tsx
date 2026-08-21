import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Star, Sparkles, Compass, Navigation, Landmark, Info, ChevronRight, X, Maximize2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import { useAdminData } from '../data/AdminContext';
import { staticDistrictDetails } from '../data/districtDetailsData';
import type { PopularPlaceItem } from '../data/popularPlacesDefaults';

const PlaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { popularPlaces, districtDetails } = useAdminData();

  const [place, setPlace] = useState<PopularPlaceItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights'>('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    if (!id) return;

    const normalizedId = id.toLowerCase().trim();

    // 1. Search in popularPlaces
    const matchedPlace = popularPlaces.find(p =>
      (p.id && p.id.toLowerCase() === normalizedId) ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedId ||
      p.name.toLowerCase() === normalizedId
    );

    if (matchedPlace) {
      setPlace(matchedPlace);
      return;
    }

    // 2. Search in district topAttractions
    const allDetails = { ...staticDistrictDetails, ...districtDetails };
    for (const [distKey, distVal] of Object.entries(allDetails)) {
      if (distVal.topAttractions) {
        const foundAttraction = distVal.topAttractions.find(att =>
          att.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedId ||
          att.name.toLowerCase() === normalizedId
        );

        if (foundAttraction) {
          const districtName = distVal.name ? `${distVal.name} District` : `${distKey} District`;
          setPlace({
            id: normalizedId,
            name: foundAttraction.name,
            district: districtName,
            districtSlug: distKey.toLowerCase(),
            image: foundAttraction.image,
            images: [foundAttraction.image],
            description: foundAttraction.description || foundAttraction.shortDescription || '',
            overview: foundAttraction.description,
            bestTimeToVisit: foundAttraction.bestTime || 'October to March',
            rating: foundAttraction.rating || 4.8,
            category: 'Top Tourist Attraction'
          });
          return;
        }
      }
    }

    // 3. Fallback dummy place if not found
    setPlace({
      id: normalizedId,
      name: id.replace(/-/g, ' ').toUpperCase(),
      district: 'Bihar Tourism',
      districtSlug: 'patna',
      image: '/src/assets/bihar-heritage.png',
      description: 'Discover the rich historical and spiritual attractions of Bihar.',
      overview: 'Bihar is home to monumental heritage, ancient university ruins, sacred pilgrimages, and vibrant culture.',
      bestTimeToVisit: 'October to March'
    });
  }, [id, popularPlaces, districtDetails]);

  if (!place) {
    return (
      <div className="min-h-screen bg-[#0F3D2E] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4A017]/20 border-t-[#D4A017] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium tracking-wider uppercase text-[#D4A017]">Loading Attraction Details...</p>
        </div>
      </div>
    );
  }

  // Derive target district slug for linking
  const targetDistrictSlug = (place.districtSlug || place.district.replace(/district/i, '').trim()).toLowerCase();

  // Combine main image + extra images for gallery
  const allImages = Array.from(new Set([place.image, ...(place.images || [])])).filter(Boolean);

  // Other related places
  const relatedPlaces = popularPlaces.filter(p => p.id !== place.id && p.name !== place.name).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#D4A017]/25 text-[#1A1A1A]">
      <Navbar forceDarkText={false} />

      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#181310]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover object-center scale-110 brightness-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181310] via-[#181310]/70 to-[#181310]/40" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#181310]/50 to-[#181310]" />
        </div>

        <Container className="relative z-10 max-w-5xl">
          {/* Top Breadcrumb Nav */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/80 hover:text-[#D4A017] text-xs font-bold uppercase tracking-[0.2em] transition-colors bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>

          {/* Place Title & Category */}
          <div className="space-y-4 max-w-3xl">
            {place.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#D4A017] text-[11px] font-extrabold uppercase tracking-widest">
                <Sparkles size={12} />
                {place.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-lg">
              {place.name}
            </h1>

            <p className="text-base sm:text-xl text-white/85 font-light leading-relaxed drop-shadow max-w-2xl">
              {place.description}
            </p>
          </div>


        </Container>
      </section>

      {/* ── 2. GALLERY & CONTENT MAIN ─────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-[#FDFBF7]">
        <Container className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left Column: Photos Gallery & Detailed Narrative */}
            <div className="lg:col-span-2 space-y-10">

              {/* Photo Showcase / Gallery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8C6239] flex items-center gap-2">
                    <Compass size={16} /> Photo Showcase
                  </h2>
                  <span className="text-xs text-gray-500 font-medium">
                    {allImages.length} {allImages.length === 1 ? 'Photo' : 'Photos'}
                  </span>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allImages.map((imgUrl, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`
                        relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-xl border border-gray-200/80 transition-all duration-300
                        ${index === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}
                      `}
                    >
                      <img
                        src={imgUrl}
                        alt={`${place.name} view ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-black/60 backdrop-blur-md text-white p-3 rounded-full border border-white/20">
                          <Maximize2 size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 flex gap-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 font-semibold text-sm tracking-wide transition-colors relative ${
                    activeTab === 'overview' ? 'text-[#8C6239]' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Overview & Significance
                  {activeTab === 'overview' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C6239]" />
                  )}
                </button>

                {place.highlights && place.highlights.length > 0 && (
                  <button
                    onClick={() => setActiveTab('highlights')}
                    className={`pb-3 font-semibold text-sm tracking-wide transition-colors relative ${
                      activeTab === 'highlights' ? 'text-[#8C6239]' : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    Key Highlights
                    {activeTab === 'highlights' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C6239]" />
                    )}
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6 text-gray-700 leading-relaxed font-serif text-base sm:text-lg">
                  <h3 className="text-xl font-sans font-bold text-gray-900">
                    About {place.name}
                  </h3>
                  {(place.overview || place.description).split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#8C6239]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {activeTab === 'highlights' && place.highlights && (
                <div className="space-y-4">
                  <h3 className="text-xl font-sans font-bold text-gray-900 mb-4">
                    Must-See Highlights & Key Features
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {place.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200/80 shadow-sm"
                      >
                        <div className="p-2 rounded-lg bg-[#D4A017]/15 text-[#8C6239] shrink-0 mt-0.5">
                          <Landmark size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {item}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Essential spot to explore during your visit to {place.name}.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: District Banner Card & Related Attractions */}
            <div className="space-y-8">

              {/* District Link Callout Card */}
              <div className="bg-gradient-to-br from-[#251E18] to-[#14100D] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-white/10 space-y-4">
                <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
                  <MapPin size={160} />
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A017] block">
                  District Portal
                </span>

                <h3 className="text-2xl font-serif font-bold text-white">
                  Explore {place.district}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed">
                  Plan your journey with complete district maps, seasonal recommendations, transport guides, and historical context.
                </p>

                <Link
                  to={`/districts/${targetDistrictSlug}`}
                  className="w-full py-3 px-4 rounded-xl bg-[#D4A017] hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <MapPin size={16} />
                  Open {place.district} Page
                </Link>
              </div>

              {/* Related Attractions */}
              {relatedPlaces.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6239]">
                    Other Popular Destinations
                  </h3>

                  <div className="space-y-3">
                    {relatedPlaces.map((relItem) => (
                      <Link
                        key={relItem.id}
                        to={`/places/${relItem.id}`}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-[#D4A017] transition-all group shadow-sm hover:shadow-md"
                      >
                        <img
                          src={relItem.image}
                          alt={relItem.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm group-hover:text-[#8C6239] transition-colors truncate">
                            {relItem.name}
                          </h4>
                          <span className="text-xs text-gray-400 block mt-0.5">
                            {relItem.district}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8C6239] transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </Container>
      </section>

      {/* ── IMAGE ZOOM MODAL ────────────────────────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full border border-white/20 transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Zoomed attraction view"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PlaceDetails;
