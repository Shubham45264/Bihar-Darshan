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

const getAspectClass = (aspect?: string) => {
  switch (aspect) {
    case 'portrait':
      return 'aspect-[3/4]';
    case 'landscape':
      return 'aspect-[4/3]';
    case 'square':
      return 'aspect-square';
    default:
      return 'aspect-[4/3] sm:aspect-[3/4]';
  }
};

const GalleryCard = ({ item, index, onClick }: GalleryCardProps) => {
  const isVideo = item.mediaType === "video" || item.image.includes('/video/upload/') || item.image.endsWith('.mp4');
  const posterUrl = isVideo ? getPosterUrl(item.image) : item.image;
  const aspectClass = getAspectClass(item.aspectRatio);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.4,
        delay: (index % 10) * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`break-inside-avoid inline-block w-full mb-3 sm:mb-4 lg:mb-6 group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer bg-neutral-900 border border-white/10 hover:border-[#D4A017]/60 shadow-sm hover:shadow-2xl transition-all duration-300 ${aspectClass}`}
      onClick={onClick}
    >
      {/* ── Image / Video Container ── */}
      <div className="relative w-full h-full overflow-hidden">
        {isVideo ? (
          <video
            src={item.image}
            poster={posterUrl}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* ── Top-Right Media Badge ── */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          {isVideo && (
            <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md">
              <Video size={13} />
            </div>
          )}
          {item.source === "community" && (
            <div className="px-2 py-1 rounded-lg bg-[#D4A017]/90 text-black backdrop-blur-md font-bold text-[10px] flex items-center gap-1 shadow-md">
              <Users size={10} /> <span>Community</span>
            </div>
          )}
        </div>

        {/* ── Default Mobile Bottom Caption Overlay ── */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
          <p className="text-white font-bold text-xs sm:text-sm truncate drop-shadow-sm">{item.title}</p>
          <p className="text-[#D4A017] text-[10px] sm:text-xs truncate font-medium mt-0.5">By {item.photographer}</p>
        </div>

        {/* ── Masonry Hover Stats Overlay ── */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 sm:p-5 z-20">
          {/* Top Category Tag */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-2.5 py-1 rounded-full border border-[#D4A017]/30">
              {item.category}
            </span>
          </div>

          {/* Center Masonry Stats */}
          <div className="flex items-center justify-center gap-5 text-white font-extrabold text-sm sm:text-base">
            <span className="flex items-center gap-1.5 drop-shadow-md">
              <Heart size={18} fill="white" className="text-white" />
              {formatCount(item.likes)}
            </span>
            <span className="flex items-center gap-1.5 drop-shadow-md">
              <MessageCircle size={18} fill="white" className="text-white" />
              {formatCount(item.comments || item.views || 12)}
            </span>
          </div>

          {/* Bottom Title & Author */}
          <div className="text-left w-full">
            <p className="text-white font-bold text-xs sm:text-sm md:text-base line-clamp-1 drop-shadow-sm">{item.title}</p>
            <p className="text-[#D4A017] text-[11px] sm:text-xs truncate font-medium mt-0.5">By {item.photographer}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
