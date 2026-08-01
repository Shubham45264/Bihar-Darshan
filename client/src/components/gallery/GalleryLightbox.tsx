import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Heart,
  Eye,
  MessageCircle,
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  Users
} from "lucide-react";
import type { ExtendedGalleryItem } from "../../pages/Gallery";

interface GalleryLightboxProps {
  item: ExtendedGalleryItem | null;
  items: ExtendedGalleryItem[];
  onClose: () => void;
  onNavigate: (item: ExtendedGalleryItem) => void;
}

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const GalleryLightbox = ({
  item,
  items,
  onClose,
  onNavigate,
}: GalleryLightboxProps) => {
  const navigate = useNavigate();
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(items[currentIndex - 1]);
  }, [hasPrev, currentIndex, items, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(items[currentIndex + 1]);
  }, [hasNext, currentIndex, items, onNavigate]);

  const handleDownload = async () => {
    try {
      if (!item) return;
      const imageUrl = item.image;

      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      let extension = 'jpg';
      if (blob.type.includes('png')) extension = 'png';
      else if (blob.type.includes('gif')) extension = 'gif';
      else if (blob.type.includes('video/mp4') || imageUrl.endsWith('.mp4')) extension = 'mp4';
      else if (blob.type.includes('webp')) extension = 'webp';

      link.download = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download media:', err);
      if (item) {
        const link = document.createElement('a');
        link.href = item.image;
        link.target = '_blank';
        link.download = item.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ background: "rgba(0, 0, 0, 0.95)" }}
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-medium text-sm tracking-widest uppercase">
            {currentIndex + 1} / {items.length}
          </div>

          {/* Previous Arrow */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/5 hover:bg-gold/20 hover:border-gold/40 border border-white/10 flex items-center justify-center transition-all duration-300 backdrop-blur-md hidden md:flex"
            >
              <ChevronLeft size={28} className="text-white" />
            </button>
          )}

          {/* Next Arrow */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/5 hover:bg-gold/20 hover:border-gold/40 border border-white/10 flex items-center justify-center transition-all duration-300 backdrop-blur-md hidden md:flex"
            >
              <ChevronRight size={28} className="text-white" />
            </button>
          )}

          {/* Content */}
          <motion.div
            key={item.id}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full h-full max-w-7xl md:h-auto md:max-h-[90vh] md:mx-16 flex flex-col md:flex-row rounded-none md:rounded-3xl overflow-hidden shadow-2xl bg-[#0a0d14]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image/Media Area */}
            <div className="relative flex-1 bg-black/50 flex items-center justify-center overflow-hidden min-h-[40vh] md:min-h-0">
              {item.mediaType === "video" || item.image.includes('/video/upload/') || item.image.endsWith('.mp4') ? (
                <video
                  key={item.image}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  poster={
                    item.image.includes('cloudinary.com') || item.image.includes('res.cloudinary.com')
                      ? item.image.replace(/\/video\/upload\/(v\d+\/)?/, '/video/upload/f_jpg,so_0/$1').replace(/\.(mp4|mov|webm|mkv)$/i, '.jpg')
                      : undefined
                  }
                  className="w-full h-full object-contain"
                >
                  <source src={item.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Info Panel */}
            <div className="w-full md:w-[400px] flex flex-col bg-[#12161c] border-l border-white/[0.05] overflow-y-auto overflow-x-hidden">

              {/* Header */}
              <div className="p-6 border-b border-white/[0.05]">
                <h2 className="text-white font-serif text-2xl font-bold leading-snug mb-4">
                  {item.title}
                </h2>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-lg font-bold text-gold shrink-0">
                    {item.photographer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {item.photographer}
                    </p>
                    <p className="text-white/40 text-xs font-medium mt-0.5">
                      Uploaded on {formatDate(item.uploadDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="p-6 border-b border-white/[0.05] space-y-4">
                <div className="flex items-start gap-3 text-white/70">
                  <Tag size={16} className="text-gold/60 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold block mb-1">Category</span>
                    <span className="font-semibold text-white/90">{item.category}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 mt-auto">
                <div className="flex flex-col gap-3">
                  {item.source === "official" && item.link && (
                    <button
                      onClick={() => {
                        onClose();
                        navigate(item.link!);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#2a303c] border border-white/10 hover:bg-[#343b48] hover:border-white/20 text-white font-bold text-sm tracking-wide transition-all duration-300">
                      Know More
                    </button>
                  )}
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-black font-bold text-sm tracking-wide transition-all duration-300"
                  >
                    <Download size={16} />
                    Download Media
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Arrows (Overlay) */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:hidden pointer-events-none">
              {hasPrev ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
              ) : <div />}
              {hasNext ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              ) : <div />}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;
