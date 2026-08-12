import { motion } from "framer-motion";
import { Heart, Play, Video, MessageCircle, Eye, Users, MapPin } from "lucide-react";
import type { ExtendedGalleryItem } from "../../pages/Gallery";

interface GalleryCardProps {
  item: ExtendedGalleryItem;
  index: number;
  spanClass?: string;
  onClick: () => void;
}

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

const getPosterUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    return url.replace(/\/video\/upload\/(v\d+\/)?/, '/video/upload/f_jpg,so_0/$1').replace(/\.(mp4|mov|webm|mkv)$/i, '.jpg');
  }
  return url;
};

const GalleryCard = ({ item, index, onClick }: GalleryCardProps) => {
  const isVideo = item.mediaType === "video" || item.image.includes('/video/upload/') || item.image.endsWith('.mp4');
  const posterUrl = isVideo ? getPosterUrl(item.image) : item.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.4,
        delay: (index % 10) * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="break-inside-avoid inline-block w-full mb-4 sm:mb-6 group relative overflow-hidden rounded-2xl cursor-pointer bg-[#0d1520] border border-white/10 hover:border-[#D4A017]/60 shadow-md hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
    >
      {/* ── Image / Video Container ── */}
      <div className="relative w-full overflow-hidden">
        {isVideo ? (
          <video
            src={item.image}
            poster={posterUrl}
            className="w-full h-auto max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-105"
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
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x500?text=Bihar+Gallery"; }}
            className="w-full h-auto max-h-[520px] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* ── Top-Right Media Badge ── */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 pointer-events-none">
          {isVideo && (
            <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md">
              <Video size={14} />
            </div>
          )}
          {item.source === "community" && (
            <div className="px-2.5 py-1 rounded-lg bg-[#D4A017] text-black font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              Community
            </div>
          )}
        </div>

        {/* ── Bottom Overlay Card Details ── */}
        <div className="p-4 bg-gradient-to-t from-[#0d1520] via-[#0d1520]/95 to-transparent pt-8 -mt-6 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-2.5 py-0.5 rounded-md border border-[#D4A017]/30">
              {item.category}
            </span>
            {item.location && (
              <span className="text-[10px] text-white/50 flex items-center gap-1 font-medium">
                <MapPin size={10} className="text-[#D4A017]" /> {item.location}
              </span>
            )}
          </div>

          <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#D4A017] transition-colors">
            {item.title}
          </h3>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs text-white/60">
            <span className="font-medium text-white/70 truncate max-w-[60%]">
              By {item.photographer}
            </span>
            <div className="flex items-center gap-3 shrink-0 font-semibold text-white/80">
              <span className="flex items-center gap-1">
                <Heart size={13} className="text-red-400 fill-red-400/30" />
                {formatCount(item.likes)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} className="text-[#D4A017]" />
                {formatCount(item.views)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
