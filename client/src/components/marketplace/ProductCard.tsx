import { Phone, Mail, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string | number;
  image: string;
  businessName: string;
  productName: string;
  contact?: string;
  email?: string;
  mapLink?: string;
  onMoreInfo: (id: string | number) => void;
}

const ProductCard = ({
  id,
  image,
  businessName,
  productName,
  contact,
  email,
  onMoreInfo,
}: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl border border-gray-100 flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-64 overflow-hidden shrink-0">
        {/* Tag Badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EAB308] flex items-center justify-center shadow-md">
          <Tag size={13} className="text-black sm:w-[15px] sm:h-[15px]" />
        </div>

        <motion.img
          src={image}
          alt={productName}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7 }}
          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=Bihar+Handicraft"; }}
        />
        {/* Subtle orange accent line below image */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EAB308] opacity-80" />
      </div>

      {/* Bottom Content */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title, Subtitle */}
          <div className="flex items-start gap-2 sm:gap-3.5 mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FAF6F0] hidden sm:flex items-center justify-center text-[#EAB308] shrink-0">
              <Tag size={18} className="stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-xl md:text-2xl font-serif font-bold text-[#1A2530] leading-snug line-clamp-1">
                {productName}
              </h2>
              <p className="text-[11px] sm:text-xs font-semibold text-gray-400 mt-0.5 line-clamp-1">
                {businessName}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          {(contact || email) && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-bold text-slate-700 py-1.5 sm:py-3 border-t border-gray-100 mt-2">
              {contact && (
                <div className="flex items-center gap-1 shrink-0">
                  <Phone size={12} className="text-[#EAB308]" />
                  <span>{contact}</span>
                </div>
              )}
              {contact && email && (
                <div className="h-3 w-[1px] bg-slate-200 hidden sm:block" />
              )}
              {email && (
                <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                  <Mail size={12} className="text-[#EAB308] shrink-0" />
                  <span className="truncate text-slate-600 font-medium text-[10px] sm:text-xs">{email}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Learn More Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMoreInfo(id)}
          className="w-full rounded-xl bg-[#EAB308] hover:bg-[#EAB308]/90 py-2 sm:py-3 font-bold text-black border border-transparent shadow shadow-yellow-600/10 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm tracking-wide mt-2 cursor-pointer"
        >
          Learn More →
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;