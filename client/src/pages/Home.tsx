import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import PopularPlaces from "../components/places/PopularPlaces";
import BiharMapSection from "../components/map/BiharMapSection";
import GallerySection from "../components/gallery/GallerySection";
import ShareStorySection from "../components/cta/ShareStorySection";
import Footer from "../components/layout/Footer";
import { useAdminData } from "../data/AdminContext";

const Home = () => {
  const { siteSettings } = useAdminData();

  return (
    <main className="min-h-screen">
      {/* Navbar - Fixed, transparent over hero */}
      <Navbar />

      {/* 1. Hero Section */}
      <HeroSection settings={siteSettings} />

      {/* 2. Popular Places */}
      <PopularPlaces />

      {/* 4. Interactive Bihar Map */}
      <BiharMapSection />

      {/* 7. Photo Gallery */}
      <GallerySection />

      {/* 8. Share Your Story CTA */}
      <ShareStorySection />

      {/* 9. Footer */}
      <Footer />
    </main>
  );
};

export default Home;