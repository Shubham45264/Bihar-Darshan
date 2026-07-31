import Carousel from "../common/Carousel";
import DistrictCard from "./DistrictCard";
import { useAdminData } from "../../data/AdminContext";

const featuredNames = [
  "Patna",
  "Gaya",
  "Nalanda",
  "Bhagalpur",
  "Muzaffarpur",
  "Darbhanga",
];

const DistrictSection = () => {
  const { districts: allDistricts } = useAdminData();

  // Find districts from admin context to ensure updated photos are rendered
  const featuredDistricts = featuredNames
    .map((name) => allDistricts.find((d) => d.name.toLowerCase() === name.toLowerCase()))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const displayDistricts = featuredDistricts.length > 0 ? featuredDistricts : allDistricts.slice(0, 6);

  return (
    <section id="districts" className="pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 overflow-hidden">
      <Carousel
        title="Districts of Bihar"
        subtitle="Discover"
        actionLabel="View All Districts"
        actionHref="/districts"
      >
        {displayDistricts.map((district, index) => (
          <DistrictCard
            key={district.name}
            image={district.image}
            name={district.name}
            index={index}
          />
        ))}
      </Carousel>
    </section>
  );
};

export default DistrictSection;
