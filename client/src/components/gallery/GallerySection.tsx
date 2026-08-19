import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ZoomIn } from "lucide-react";
import { useAdminData } from "../../data/AdminContext";
import { useContributions } from "../../data/ContributionContext";
import { galleryData as defaultGalleryData, type GalleryItem } from "../../data/galleryData";

type Cfg = { col: string; showOverlay: boolean };

const CFG: Cfg[] = [
  { col: "col-span-2", showOverlay: false }, // 0 – hero
  { col: "col-span-1", showOverlay: false }, // 1
  { col: "col-span-1", showOverlay: false }, // 2
  { col: "col-span-1", showOverlay: false }, // 3
  { col: "col-span-2", showOverlay: false }, // 4 – wide centre
  { col: "col-span-1", showOverlay: false }, // 5
  { col: "col-span-1", showOverlay: false }, // 6
  { col: "col-span-1", showOverlay: false }, // 7
  { col: "col-span-2", showOverlay: false }, // 8 – wide right
];

const getPosterUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    return url.replace(/\/video\/upload\/(v\d+\/)?/, '/video/upload/f_jpg,so_0/$1').replace(/\.(mp4|mov|webm|mkv)$/i, '.jpg');
  }
  return url;
};

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

        {/* ── 2-Frame Grid Mobile Responsive Mosaic ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[170px] sm:auto-rows-[220px]">
          {galleryItems.map((item, index) => {
            const cfg = CFG[index] ?? { col: "col-span-1", showOverlay: false };
            const isVideo = item.mediaType === "video" || (item.image && (item.image.includes('/video/upload/') || item.image.endsWith('.mp4')));

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
                {/* Photo or Video */}
                {isVideo ? (
                  <video
                    src={item.image}
                    poster={getPosterUrl(item.image)}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.6]"
                    muted
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.6]"
                    loading="lazy"
                  />
                )}

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
                    <div className="w-12 h-12 rounded-full border-2 border-white/60 bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <Play size={20} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Hover title + action overlay */}
                {!cfg.showOverlay && (
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out p-3"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)" }}
                  >
                    <p className="text-white font-semibold text-sm leading-snug line-clamp-1 drop-shadow">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {isVideo ? (
                        <><Play size={12} fill="white" className="text-white opacity-80" /><span className="text-white/70 text-xs">Play video</span></>
                      ) : (
                        <><ZoomIn size={12} className="text-white opacity-80" /><span className="text-white/70 text-xs">View photo</span></>
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
              {lightboxItem.mediaType === "video" || (lightboxItem.image && (lightboxItem.image.includes('/video/upload/') || lightboxItem.image.endsWith('.mp4'))) ? (
                <div className="relative bg-black aspect-video w-full flex items-center justify-center">
                  <video
                    key={lightboxItem.image}
                    src={lightboxItem.image}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    poster={getPosterUrl(lightboxItem.image)}
                    className="w-full h-full max-h-[calc(90dvh-72px)] object-contain"
                  >
                    <source src={lightboxItem.image} type="video/mp4" />
                    Your browser does not support playing this video.
                  </video>
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
                  {lightboxItem.category} • {lightboxItem.mediaType === "video" || (lightboxItem.image && (lightboxItem.image.includes('/video/upload/') || lightboxItem.image.endsWith('.mp4'))) ? "Video" : "Photo"}
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

