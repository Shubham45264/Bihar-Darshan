import { Link } from "react-router-dom";

interface DistrictGridCardProps {
  name: string;
  image: string;
}

const DistrictGridCard = ({ name, image }: DistrictGridCardProps) => {
  return (
    <Link
      to={`/districts/${name.toLowerCase()}`}
      className="group flex flex-col h-[210px] sm:h-[260px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_36px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
    >
      {/* Image — fills available vertical space */}
      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800";
          }}
        />
      </div>

      {/* Content — name + Explore button */}
      <div className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-1.5 sm:gap-3 bg-white shrink-0">
        <h3 className="text-xs sm:text-[15px] font-bold text-gray-900 leading-tight truncate">
          {name}
        </h3>

        <span className="flex-shrink-0 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gold text-white text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-xs group-hover:bg-gold-dark transition-colors duration-300">
          Explore
        </span>
      </div>
    </Link>
  );
};

export default DistrictGridCard;
