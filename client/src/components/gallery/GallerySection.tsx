import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ZoomIn } from "lucide-react";
import { useAdminData } from "../../data/AdminContext";
import { useContributions } from "../../data/ContributionContext";
import { galleryData as defaultGalleryData, type GalleryItem } from "../../data/galleryData";

/* ─────────────────────────────────────────────────────────────────
   Mosaic layout  (matches reference screenshot)

   Uses a 4-column CSS grid with 3 rows of height ~220 px each.

   Row 1  │ [0] col-span-2  │ [1] col-span-1 │ [2] col-span-1 │
   Row 2  │ [3] col-span-1  │ [4] col-span-2 │ [5] col-span-1 │
   Row 3  │ [6] col-span-1  │ [7] col-span-1 │ [8] col-span-2 │

   Item 0  → hero card with title + description gradient overlay
   Item 4  → video / wide centre  (play-button shown if video)
   All cards → rounded-xl, gap-3, hover scale + dim
───────────────────────────────────────────────────────────────── */

type Cfg = { col: string; showOverlay: boolean };

const CFG: Cfg[] = [
  { col: "col-span-2 md:col-span-2", showOverlay: true }, // 0 – hero
  { col: "col-span-1 md:col-span-1", showOverlay: false }, // 1
  { col: "col-span-1 md:col-span-1", showOverlay: false }, // 2
  { col: "col-span-1 md:col-span-1", showOverlay: false }, // 3
  { col: "col-span-1 md:col-span-2", showOverlay: false }, // 4 – wide centre on desktop
  { col: "col-span-1 md:col-span-1", showOverlay: false }, // 5
  { col: "col-span-1 md:col-span-1", showOverlay: false }, // 6
  { col: "col-span-1 md:col-span-1", showOverlay: false }, // 7
  { col: "col-span-1 md:col-span-2", showOverlay: false }, // 8 – wide right on desktop
];

const GallerySection = () => {
  const { gallerySubmissions } = useContributions();
  const { gallery: adminGallery } = useAdminData();
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Combine user uploaded community photos (latest first), admin photos, and default fallback photos
  const combinedItems: GalleryItem[] = [
    ...gallerySubmissions,
    ...adminGallery,
    ...defaultGalleryData
  ];

  // Deduplicate and select top 9 items
  const uniqueMap = new Map<string | number, GalleryItem>();
  combinedItems.forEach(item => {
    const key = item.image || item.id;
    if (key && !uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  const galleryItems = Array.from(uniqueMap.values()).slice(0, 9);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (lightboxItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxItem]);

  const openLightbox = (item: GalleryItem) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(null);

  return (
    <section id="gallery" className="py-16 sm:py-20 lg:py-24 bg-bg-section">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">
              Moments
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-bold leading-tight">
              Photo Gallery
            </h2>
          </div>

          <Link
            to="/gallery"
            className="hidden sm:inline-flex text-sm font-medium text-gold hover:text-gold-dark transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* ── Mosaic Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-2.5 sm:gap-3.5 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px]">
          {galleryItems.map((item, index) => {
            const cfg = CFG[index] ?? { col: "col-span-1", showOverlay: false };
            const isVideo = item.mediaType === "video";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className={`${cfg.col} relative overflow-hidden rounded-xl cursor-pointer group bg-black`}
                onClick={() => openLightbox(item)}
              >
                {/* Photo */}
                <img
                  src={item.image || defaultGalleryData[0].image}
                  alt={item.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultGalleryData[0].image;
                  }}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.6]"
                  loading="lazy"
                />

                {/* Hero text overlay (item 0 only) */}
                {cfg.showOverlay && (
                  <div className="absolute inset-0 flex flex-col justify-end p-5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }}
                  >
                    <h3 className="text-white font-bold text-lg sm:text-xl leading-snug drop-shadow">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-white/80 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2 drop-shadow">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Always-visible play icon for video cards */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/60 bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <Play size={18} fill="white" className="text-white ml-0.5 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                )}

                {/* Hover / Mobile title + action overlay (all non-hero cards) */}
                {!cfg.showOverlay && (
                  <div
                    className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)" }}
                  >
                    <p className="text-white font-semibold text-xs sm:text-sm leading-snug line-clamp-1 drop-shadow">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                      {isVideo ? (
                        <><Play size={10} fill="white" className="text-white opacity-80" /><span className="text-white/80 text-[10px] sm:text-xs">Play video</span></>
                      ) : (
                        <><ZoomIn size={10} className="text-white opacity-80" /><span className="text-white/80 text-[10px] sm:text-xs">View photo</span></>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/gallery" className="text-sm font-medium text-gold">
            View All Gallery →
          </Link>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-[10000] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full rounded-xl overflow-hidden flex flex-col max-h-[90dvh]"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.mediaType === "video" ? (
                <div className="relative bg-black aspect-video">
                  <img src={lightboxItem.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(184, 134, 11, 0.9)" }}
                    >
                      <Play size={28} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full flex-1 min-h-0 object-contain bg-black mx-auto block"
                  style={{ maxHeight: "calc(90dvh - 72px)" }}
                />
              )}

              <div
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                style={{ background: "rgba(15,10,5,0.95)", borderTop: "1px solid rgba(184,134,11,0.3)" }}
              >
                <div>
                  <h4 className="text-white font-bold text-sm">{lightboxItem.title}</h4>
                  <p className="text-white/60 text-xs mt-1">
                    by {lightboxItem.photographer} • {lightboxItem.location}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-widest font-semibold text-right" style={{ color: "#F4A261" }}>
                  {lightboxItem.category} • {lightboxItem.mediaType === "video" ? "Video" : "Photo"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;

