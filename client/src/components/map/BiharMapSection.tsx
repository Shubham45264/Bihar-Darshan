import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import biharHeritage from "../../assets/bihar-heritage.png";
import DistrictsPageMap from "../districts/DistrictsPageMap";
import { allDistricts } from "../../data/districtsData";
import { staticDistrictDetails } from "../../data/districtDetailsData";
import {
  geoNameToDisplayName,
  displayNameToGeoName,
} from "../../data/districtsData";

/* ─── Default district shown before any selection ─── */
const DEFAULT_DISTRICT = "Patna";

const BiharMapSection = () => {
  const [selectedDisplay, setSelectedDisplay] = useState<string>(DEFAULT_DISTRICT);

  /* Convert between GeoJSON names and display names */
  const handleMapSelect = (geoName: string | null) => {
    if (!geoName) return;
    const display = geoNameToDisplayName[geoName] ?? geoName;
    setSelectedDisplay(display);
  };

  const handleMapHover = () => {/* no-op */};

  /* ── Derive data for the selected district ── */
  const districtData = allDistricts.find(
    (d) => d.name.toLowerCase() === selectedDisplay.toLowerCase()
  );

  const detailKey = selectedDisplay.toLowerCase().replace(/\s*\(.*\)/, "").trim();
  const detail = staticDistrictDetails[detailKey];

  /* Unique Photos: use topAttractions images if available, else fallback to district image */
  const rawPhotos: string[] = [];
  if (detail?.topAttractions?.[0]?.image) rawPhotos.push(detail.topAttractions[0].image);
  if (detail?.topAttractions?.[1]?.image) rawPhotos.push(detail.topAttractions[1].image);
  if (districtData?.image) rawPhotos.push(districtData.image);

  // Deduplicate photos so identical images are never shown twice
  const photos = Array.from(new Set(rawPhotos.filter(Boolean)));

  const description =
    detail?.introduction ??
    `Discover the rich culture, heritage, and beauty of ${selectedDisplay}, one of Bihar's remarkable districts.`;

  /* GeoJSON name for map highlight */
  const geoName = displayNameToGeoName[selectedDisplay] ?? selectedDisplay;

  return (
    <section id="map" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">

      {/* ── Dark heritage background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={biharHeritage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510]/92 via-[#1e1912]/88 to-[#15110d]/92" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#D4A017]/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section label ── */}
        <div className="mb-10">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Interactive</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight">
            Explore Bihar
          </h2>
          <p className="text-white/60 mt-2 text-sm sm:text-base max-w-lg">
            Click any district on the map to discover its culture, heritage, and top attractions.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-14 items-start">

          {/* ── LEFT: District Info Panel ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDisplay}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-5"
            >
              {/* District name */}
              <div className="flex items-center gap-2 text-white/80">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <span className="font-semibold text-base">{selectedDisplay}</span>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm sm:text-[15px] leading-relaxed">
                {description}
              </p>

              {/* Photo Display: Single Image if 1 unique photo, 2-column grid if 2 unique photos */}
              {photos.length > 0 && (
                <div className={photos.length > 1 ? "grid grid-cols-2 gap-3" : "w-full"}>
                  {photos.slice(0, 2).map((src, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-xl"
                      style={{ aspectRatio: photos.length > 1 ? "4/3" : "16/9", maxHeight: "240px" }}
                    >
                      <img
                        src={src}
                        alt={`${selectedDisplay} ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* View More button */}
              <div>
                <Link
                  to={`/districts/${selectedDisplay.toLowerCase()}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:border-gold hover:text-gold transition-all duration-300 group"
                >
                  View More
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── RIGHT: Map ── */}
          <div className="relative select-none">
            <DistrictsPageMap
              selectedDistrict={geoName}
              hoveredCardDistrict={null}
              onSelectDistrict={handleMapSelect}
              onHoverDistrict={handleMapHover}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiharMapSection;
