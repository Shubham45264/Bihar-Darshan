import { motion } from "framer-motion";
import { Heart, Share2, Bookmark, Eye, Play, Image, Clock, MapPin, MessageCircle, CheckCircle2, Users } from "lucide-react";
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

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getPosterUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    return url.replace(/\/video\/upload\/(v\d+\/)?/, '/video/upload/f_jpg,so_0/$1').replace(/\.(mp4|mov|webm|mkv)$/i, '.jpg');
  }
  return url;
};

const GalleryCard = ({ item, index, spanClass, onClick }: GalleryCardProps) => {
  const isVideo = item.mediaType === "video" || item.image.includes('/video/upload/') || item.image.endsWith('.mp4');
  const posterUrl = isVideo ? getPosterUrl(item.image) : item.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: (index % 10) * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-[#0F3D2E] w-full h-full ${spanClass || "col-span-1 row-span-1"}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        {isVideo ? (
          <video
            src={item.image}
            poster={posterUrl}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            muted
            playsInline
            preload="metadata"
            onMouseEnter={(e) => e.currentTarget.play().catch(() => { })}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Video Play Button (center) */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform duration-500 group-hover:scale-110">
              <Play size={20} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Community Submission Overlay */}
        {item.source !== "official" && (
          <div className="gallery-community-overlay">
            <p className="gallery-community-caption">
              📸 {item.title}
            </p>
            <span className="gallery-community-author">
              By: {item.photographer}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GalleryCard;
