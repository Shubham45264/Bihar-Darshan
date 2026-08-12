import { motion } from "framer-motion";
import { Heart, Play, Video, MessageCircle, Eye, Users } from "lucide-react";
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.35,
        delay: (index % 12) * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl cursor-pointer bg-neutral-900 border border-white/10 hover:border-[#D4A017]/60 shadow-sm hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
    >
      {/* ── Image / Video Container ── */}
      <div className="relative w-full h-full overflow-hidden">
        {isVideo ? (
          <video
            src={item.image}
            poster={posterUrl}
            className="w-full h-full object-cover scale-[1.35] group-hover:scale-[1.42] transition-transform duration-500"
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
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x400?text=Bihar+Gallery"; }}
            className="w-full h-full object-cover scale-[1.35] group-hover:scale-[1.42] transition-transform duration-500"
            loading="lazy"
          />
        )}

        {/* ── Top-Right Media Badge (Instagram Style) ── */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 pointer-events-none">
          {isVideo && (
            <div className="p-1 sm:p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md">
              <Video size={12} className="sm:w-3.5 sm:h-3.5" />
            </div>
          )}
          {item.source === "community" && (
            <div className="p-1 sm:p-1.5 rounded-lg bg-[#D4A017]/80 text-black backdrop-blur-md font-bold text-[9px] sm:text-[10px] flex items-center gap-1 shadow-md">
              <Users size={10} /> <span className="hidden sm:inline">Community</span>
            </div>
          )}
        </div>

        {/* ── Default Mobile Bottom Text Gradient Overlay ── */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
          <p className="text-white font-bold text-[10px] sm:text-xs truncate drop-shadow-sm">{item.title}</p>
        </div>

        {/* ── Instagram Hover Stats Overlay ── */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5 sm:p-4 z-20">
          {/* Top Category Tag */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-2 py-0.5 rounded-full border border-[#D4A017]/30">
              {item.category}
            </span>
          </div>

          {/* Center Stats (Instagram Explore Style) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-white font-extrabold text-xs sm:text-sm md:text-base">
            <span className="flex items-center gap-1.5 drop-shadow-md">
              <Heart size={16} fill="white" className="text-white sm:w-5 sm:h-5" />
              {formatCount(item.likes)}
            </span>
            <span className="flex items-center gap-1.5 drop-shadow-md">
              <MessageCircle size={16} fill="white" className="text-white sm:w-5 sm:h-5" />
              {formatCount(item.comments || item.views || 12)}
            </span>
          </div>

          {/* Bottom Title & Author */}
          <div className="text-left w-full">
            <p className="text-white font-bold text-xs sm:text-sm line-clamp-1 drop-shadow-sm">{item.title}</p>
            <p className="text-[#D4A017] text-[10px] sm:text-xs truncate font-medium mt-0.5">By {item.photographer}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
