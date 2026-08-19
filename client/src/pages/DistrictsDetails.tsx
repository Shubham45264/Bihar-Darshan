import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import { useAdminData } from '../data/AdminContext';
import { getDistrictDetail } from '../data/districtDetailsData';
import { allDistricts, resolveDistrictImage } from '../data/districtsData';

const DistrictsDetails = () => {
  const { name } = useParams();
  const rawName = name ? name : 'Patna';
  const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const { districts, popularPlaces } = useAdminData();
  
  // Find from context, fallback to allDistricts/static if missing
  const matchedDistrict = districts.find(dist => dist.name.toLowerCase() === formattedName.toLowerCase())
    || allDistricts.find(dist => dist.name.toLowerCase() === formattedName.toLowerCase());

  const d = matchedDistrict || getDistrictDetail(formattedName);

  // Combine topAttractions from district data and matching popularPlaces
  const baseAttractions = (d as any)?.topAttractions || [];
  const currentSlug = rawName.toLowerCase().replace(/district/i, '').trim();

  const matchingPopularPlaces = popularPlaces.filter(p => {
    if (!p) return false;
    const pSlug = (p.districtSlug || p.district.replace(/district/i, '').trim()).toLowerCase();
    return pSlug === currentSlug || p.district.toLowerCase().includes(currentSlug);
  });

  const combinedMap = new Map();

  baseAttractions.forEach((att: any) => {
    if (att && att.name) {
      combinedMap.set(att.name.toLowerCase().trim(), {
        name: att.name,
        image: att.image,
        description: att.description || att.shortDescription || '',
        district: att.district || d.name
      });
    }
  });

  matchingPopularPlaces.forEach((p: any) => {
    if (p && p.name) {
      combinedMap.set(p.name.toLowerCase().trim(), {
        name: p.name,
        image: p.image,
        description: p.description,
        district: p.district
      });
    }
  });

  const allDistrictAttractions = Array.from(combinedMap.values());

  const rawImage = matchedDistrict?.image || (d as any).image || allDistricts.find(dist => dist.name.toLowerCase() === formattedName.toLowerCase())?.image || '';
  const heroBgImage = resolveDistrictImage(rawImage);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [name]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#D4A017]/25">
      <Navbar forceDarkText={false} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-[#251E18]">
        {/* Background District Image with Gradient Overlays */}
        {heroBgImage && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <img
              src={heroBgImage}
              alt={d.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark overlays for high text contrast and rich aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#251E18] via-[#251E18]/75 to-[#251E18]/50" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
          </div>
        )}

        <Container className="relative z-10 max-w-4xl">
          <Link
            to="/districts"
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#D4A017] text-xs font-bold uppercase tracking-[0.2em] transition-colors mb-6 drop-shadow-sm"
          >
            <ArrowLeft size={14} />
            Back to Districts
          </Link>
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#D4A017] uppercase tracking-[0.3em] drop-shadow-sm">
              District Profile
            </span>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white leading-tight drop-shadow-md">
              {d.name}
            </h1>
            <p className="text-lg sm:text-xl font-serif italic text-white/90 mt-2 drop-shadow-sm">
              {d.tagline}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Main content blocks divided by color ────────────── */}
      <main>

        {/* 1. INTRODUCTION */}
        <section className="py-16 bg-[#FAF6EE] border-b border-[#EAE6DF]">
          <Container className="max-w-4xl">
            <div className="space-y-4">
              <SectionLabel text="Introduction" />
              <p className="text-xl font-serif text-gray-800 leading-relaxed pl-6 border-l-2 border-[#D4A017]">
                {d.introduction}
              </p>
            </div>
          </Container>
        </section>

        {/* 2. RICH HISTORY */}
        <section className="py-16 bg-[#FFFFFF] border-b border-[#EAE6DF]">
          <Container className="max-w-4xl">
            <div className="space-y-4">
              <SectionLabel text="Rich History" />
              <p className="text-lg font-serif text-gray-700 leading-relaxed">
                {d.richHistory}
              </p>
            </div>
          </Container>
        </section>

        {/* 3. TOP TOURIST ATTRACTION */}
        <section className="py-16 bg-[#FAF6EE] border-b border-[#EAE6DF]">
          <Container className="max-w-4xl">
            <div className="space-y-4">
              <SectionLabel text="Top Tourist Attraction" />
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2">
                {d.topTouristAttraction.name}
              </h3>
              <p className="text-lg font-serif text-gray-700 leading-relaxed">
                {d.topTouristAttraction.details}
              </p>
            </div>
          </Container>
        </section>

        {/* 4. BEST TIME TO VISIT */}
        <section className="py-16 bg-[#FFFFFF] border-b border-[#EAE6DF]">
          <Container className="max-w-4xl">
            <div className="space-y-6">
              <SectionLabel text="Best Time to Visit" />

              <div className="overflow-x-auto border-t border-[#EAE6DF]">
                <table className="w-full text-base text-left border-collapse bg-white">
                  <thead>
                    <tr className="border-b border-[#EAE6DF]">
                      {["Season", "Months", "Weather", "Details"].map(col => (
                        <th
                          key={col}
                          className="py-4 pr-4 text-xs font-bold uppercase tracking-wider text-[#8C6239]"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.seasonalVisit.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[#F5EDE3] last:border-0 hover:bg-[#FAF6EE]/50 transition-colors"
                      >
                        <td className="py-4 pr-4 font-bold text-gray-900 align-top">{row.season}</td>
                        <td className="py-4 pr-4 text-gray-750 align-top whitespace-nowrap">{row.months}</td>
                        <td className="py-4 pr-4 text-gray-705 align-top">{row.weather}</td>
                        <td className="py-4 text-gray-650 align-top">{row.whyVisit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. WHY IT SHOULD BE IN YOUR TOURIST LIST */}
        <section className="py-16 bg-[#FAF6EE] border-b border-[#EAE6DF]">
          <Container className="max-w-4xl">
            <div className="space-y-6">
              <SectionLabel text="Why it should be in your Tourist List" />
              <div className="space-y-4">
                {d.whyInTouristList.map((item, idx) => (
                  <p
                    key={idx}
                    className="text-lg font-serif text-gray-700 leading-relaxed"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* 6. TOP ATTRACTIONS */}
        <section className="py-16 bg-[#FFFFFF]">
          <Container className="max-w-6xl">
            <div className="space-y-8">
              <SectionLabel text="Top Attractions" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allDistrictAttractions.map((attraction: any, idx: number) => {
                  const attractionSlug = attraction.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <Link
                      key={idx}
                      to={`/places/${attractionSlug}`}
                      className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-900 group shadow-md hover:shadow-2xl border border-gray-200/50 hover:border-[#D4A017] transition-all duration-300 block cursor-pointer"
                    >
                      {/* Image */}
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Rich Gradient Overlay for high text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent group-hover:from-black/95 group-hover:via-black/70 transition-all duration-300" />

                      {/* Content Container — positioned properly without bottom clipping */}
                      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
                        {/* Tag/Metadata */}
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4A017] block mb-1 drop-shadow">
                          {attraction.district || d.name}
                        </span>

                        {/* Title — always fully visible */}
                        <h3 className="text-lg font-serif font-bold text-white leading-snug drop-shadow-md group-hover:text-[#D4A017] transition-colors">
                          {attraction.name}
                        </h3>

                        {/* Description — expands smoothly on hover */}
                        <p className="text-xs text-white/90 leading-relaxed max-h-0 overflow-hidden opacity-0 group-hover:max-h-28 group-hover:opacity-100 group-hover:mt-2 transition-all duration-300 ease-out line-clamp-4">
                          {attraction.description || attraction.shortDescription}
                        </p>

                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#D4A017]">
                          <span>Explore Details</span>
                          <span>→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

      </main>

      <Footer />
    </div>
  );
};

/* ── Section label simple ── */
const SectionLabel = ({ text }: { text: string }) => (
  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6239] mb-4">
    {text}
  </h2>
);

export default DistrictsDetails;
