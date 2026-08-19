
import { Link } from "react-router-dom";

interface PlaceCardProps {
  id?: string;
  image: string;
  name: string;
  district: string;
  districtSlug?: string;
  description: string;
  index: number;
}

const PlaceCard = ({ id, image, name, district, districtSlug, description }: PlaceCardProps) => {
  const targetId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const targetDistrictSlug = (districtSlug || district.replace(/district/i, '').trim()).toLowerCase();

  return (
    <div className="group flex-shrink-0 w-[260px] sm:w-[280px] cursor-pointer">
      <Link to={`/places/${targetId}`} className="block relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg group-hover:shadow-2xl transition-all duration-500">
        {/* Image Container */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay — deepens on hover for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/95 group-hover:via-black/50" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-[#D4A017] transition-colors">
            {name}
          </h3>

          <span className="inline-block text-white/80 text-xs font-medium mt-1 hover:text-[#D4A017] transition-colors">
            {district}
          </span>

          {/* Description — slides up and fades in on hover */}
          <p
            className="
              text-white/85 text-xs leading-relaxed mt-3
              max-h-0 overflow-hidden opacity-0
              translate-y-3
              transition-all duration-500 ease-out
              group-hover:max-h-24 group-hover:opacity-100 group-hover:translate-y-0
              line-clamp-3
            "
          >
            {description}
          </p>

          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#D4A017]">
            <span>View Full Details</span>
            <span>→</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PlaceCard;


