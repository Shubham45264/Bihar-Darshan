import Carousel from "../common/Carousel";
import PlaceCard from "./PlaceCard";
import { useAdminData } from "../../data/AdminContext";

const PopularPlaces = () => {
  const { popularPlaces } = useAdminData();

  return (
    <section id="places" className="py-12 sm:py-16 lg:py-20 overflow-hidden">
      {popularPlaces.length > 0 ? (
        <Carousel title="Popular Places You Must Visit" subtitle="Explore">
          {popularPlaces.map((place, index) => (
            <PlaceCard
              key={place.name}
              image={place.image}
              name={place.name}
              district={place.district}
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
