import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAdminData } from '../data/AdminContext';
import { useContributions } from '../data/ContributionContext';
import { MapPin, Utensils, PartyPopper } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CardMediaGallery from '../components/media/CardMediaGallery';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CultureDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { cultureSubmissions } = useContributions();
  const { culture: cultureData } = useAdminData();

  const cultureMap = new Map();
  cultureSubmissions.forEach(item => cultureMap.set(item.id, item));
  cultureData.forEach(item => cultureMap.set(item.id, item));
  const combinedCulture = Array.from(cultureMap.values());
  const cultureItem = combinedCulture.find((item) => item.id.toString() === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!cultureItem) {
    return <Navigate to="/discover" />;
  }

  return (
    <div className="min-h-screen bg-brand-gray text-brand-dark font-sans overflow-x-hidden relative">
      <Navbar forceDarkText={true} />

      {/* Main Content Wrapper */}
      <div className="relative z-10 pt-32 pb-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/culture" className="inline-flex items-center text-gray-500 hover:text-brand-dark font-bold uppercase transition-colors text-sm tracking-wide">
            <span className="mr-2">←</span> Back to Culture
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand-gold px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 text-brand-dark shadow-sm">
                {cultureItem.type === "Festival" ? <PartyPopper size={14} /> : <Utensils size={14} />}
                {cultureItem.type}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                <MapPin size={16} />
                {cultureItem.district}
              </span>
              {cultureItem.submittedBy && (
                <span className="text-sm font-bold text-brand-gold">
                  By {cultureItem.submittedBy}
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-gray-900 mb-6 leading-tight">
              {cultureItem.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {cultureItem.longDescription || cultureItem.description}
            </p>

            {cultureItem.extendedDetails && cultureItem.extendedDetails.length > 0 && (
              <div className="space-y-4 mb-8">
                {cultureItem.extendedDetails.map((detail: string, index: number) => (
                  <p key={index} className="text-lg text-gray-600 leading-relaxed">
                    {detail}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Gallery & Interactive Media Section */}
        <CardMediaGallery
          itemId={cultureItem.id.toString()}
          itemTitle={cultureItem.title}
          initialImages={cultureItem.galleryImages || [cultureItem.image]}
          initialVideoUrl={cultureItem.videoUrl}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CultureDetails;
