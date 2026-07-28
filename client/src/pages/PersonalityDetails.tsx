import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAdminData } from '../data/AdminContext';
import { useContributions } from '../data/ContributionContext';
import { MapPin, Star, User } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CardMediaGallery from '../components/media/CardMediaGallery';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PersonalityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { personalities: staticPersonalities } = useAdminData();
  const { personalitySubmissions } = useContributions();

  // Combine both static and submitted personalities
  const combinedPersonalities = [...personalitySubmissions, ...staticPersonalities];
  const personality = combinedPersonalities.find(
    (p: any) => p.id.toString() === id
  ) as any;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!personality) {
    return <Navigate to="/discover" />;
  }

  // Support multiline biography paragraphs
  const paragraphs = (personality.fullBio || personality.description)
    .split('\n')
    .filter((p: string) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-brand-gray text-brand-dark font-sans overflow-x-hidden relative">
      <Navbar forceDarkText={true} />

      {/* Main Content Wrapper */}
      <div className="relative z-10 pt-32 pb-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/discover"
            className="inline-flex items-center text-gray-500 hover:text-brand-dark font-bold uppercase transition-colors text-sm tracking-wide"
          >
            <span className="mr-2">←</span> Back to Discover
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand-gold px-3 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 text-brand-dark shadow-sm uppercase tracking-wider">
                <Star size={12} className="fill-current" />
                {personality.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                <MapPin size={16} />
                {personality.district}
              </span>
              {('author' in personality) && (
                <span className="text-xs font-bold text-brand-gold flex items-center gap-1">
                  <User size={12} />
                  Shared by {(personality.author) || 'Contributor'}
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
              {personality.name}
            </h1>

            <div className="space-y-4 mb-8">
              {paragraphs.map((para: string, index: number) => (
                <p key={index} className="text-lg text-gray-600 leading-relaxed font-normal">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Media & Gallery Section */}
        <CardMediaGallery
          itemId={personality.id.toString()}
          itemTitle={personality.name}
          initialImages={[personality.imageUrl || personality.image]}
        />
      </div>

      <Footer />
    </div>
  );
};

export default PersonalityDetails;
