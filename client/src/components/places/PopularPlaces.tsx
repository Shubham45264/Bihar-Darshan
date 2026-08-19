import Carousel from "../common/Carousel";
import PlaceCard from "./PlaceCard";
import { useAdminData } from "../../data/AdminContext";

const PopularPlaces = () => {
  const { popularPlaces, districtDetails, districts } = useAdminData();

  // Combine popularPlaces with all topAttractions across districts
  const combinedMap = new Map();

  popularPlaces.forEach(p => {
    if (p && p.name) {
      combinedMap.set(p.name.toLowerCase().trim(), p);
    }
  });

  // Include topAttractions from districtDetails
  Object.entries(districtDetails || {}).forEach(([distKey, distVal]) => {
    if (distVal && distVal.topAttractions) {
      distVal.topAttractions.forEach((att: any) => {
        if (att && att.name && !combinedMap.has(att.name.toLowerCase().trim())) {
          const slug = att.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          combinedMap.set(att.name.toLowerCase().trim(), {
            id: slug,
            name: att.name,
            district: att.district || `${distVal.name || distKey} District`,
            districtSlug: distKey.toLowerCase(),
            image: att.image,
            images: [att.image],
            description: att.description || att.shortDescription || '',
            overview: att.description,
            bestTimeToVisit: att.bestTime || 'October to March',
            rating: att.rating || 4.8
          });
        }
      });
    }
  });

  // Include topAttractions from db districts list
  (districts || []).forEach((dist: any) => {
    if (dist && dist.topAttractions) {
      dist.topAttractions.forEach((att: any) => {
        if (att && att.name && !combinedMap.has(att.name.toLowerCase().trim())) {
          const slug = att.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          combinedMap.set(att.name.toLowerCase().trim(), {
            id: slug,
            name: att.name,
            district: att.district || `${dist.name} District`,
            districtSlug: (dist.name || '').toLowerCase(),
            image: att.image,
            images: [att.image],
            description: att.description || att.shortDescription || '',
            overview: att.description,
            bestTimeToVisit: att.bestTime || 'October to March',
            rating: att.rating || 4.8
          });
        }
      });
    }
  });

  const allDisplayPlaces = Array.from(combinedMap.values());

  return (
    <section id="places" className="py-12 sm:py-16 lg:py-20 overflow-hidden">
      {allDisplayPlaces.length > 0 ? (
        <Carousel title="Popular Places You Must Visit" subtitle="Explore">
          {allDisplayPlaces.map((place: any, index: number) => (
            <PlaceCard
              key={place.id || place.name || index}
              id={place.id}
              image={place.image}
              name={place.name}
              district={place.district}
              districtSlug={place.districtSlug}
              description={place.description}
              index={index}
            />
          ))}
        </Carousel>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/60">No popular places showcased yet.</p>
        </div>
      )}
    </section>
  );
};

export default PopularPlaces;
