import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Districts from './pages/Districts';
import Discover from './pages/Discover';
import Tourism from './pages/Tourism';
import JourneyDetails from './pages/JourneyDetails';
import CreateJourney from './pages/CreateJourney';
import Tribals from './pages/Tribals';
import TribeDetail from './pages/TribeDetail';
import Gallery from './pages/Gallery';
import DistrictsDetails from './pages/DistrictsDetails';
import LoginPage from './pages/Login';
import ForgotPasswordPage from './pages/ForgotPassword';
import Profile from './pages/Profile';
import MarketPlace from './pages/MarketPlace';
import AddProduct from './pages/AddProduct';
import ScrollToTop from "./components/ScrollToTop";
import ProductDetails from './pages/ProductDetails';
import CultureDetails from './pages/CultureDetails';
import ShareStory from './pages/ShareStory';
import Personalities from './pages/Personalities';
import PersonalityDetails from './pages/PersonalityDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { AdminDataProvider } from './data/AdminContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCulture from './pages/admin/AdminCulture';
import AdminDistricts from './pages/admin/AdminDistricts';
import AdminTourism from './pages/admin/AdminTourism';
import AdminGallery from './pages/admin/AdminGallery';
import AdminMarketplace from './pages/admin/AdminMarketplace';
import AdminTribes from './pages/admin/AdminTribes';
import AdminPersonalities from './pages/admin/AdminPersonalities';
import AdminPopularPlaces from './pages/admin/AdminPopularPlaces';
import AdminSettings from './pages/admin/AdminSettings';
import SubcategoryFeed from './pages/SubcategoryFeed';
import StoryDetails from './pages/StoryDetails';
import AdminCategories from './pages/admin/AdminCategories';
import ProtectedRoute from './components/admin/ProtectedRoute';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const isTranslated = document.cookie.includes("googtrans=/en/") && !document.cookie.includes("googtrans=/en/en");
    if (isTranslated) {
      setIsTranslating(true);
      const timer = setTimeout(() => setIsTranslating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] bg-[#0F3D2E] flex flex-col items-center justify-center pointer-events-none ${isTranslating
          ? 'opacity-100 transition-none'
          : 'opacity-0 transition-opacity duration-500'
          }`}
      >
        <div className="w-12 h-12 border-4 border-[#F4A261]/20 border-t-[#F4A261] rounded-full animate-spin" />
        <p className="text-[#F4A261] mt-4 text-sm font-semibold tracking-wider animate-pulse uppercase">Translating...</p>
      </div>
      {children}
    </>
  );
};

function App() {
  return (
    <AdminDataProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* Public User Pages */}
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/districts" element={<PageTransition><Districts /></PageTransition>} />
          <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
          <Route path="/discover/:categorySlug" element={<PageTransition><Discover /></PageTransition>} />
          <Route path="/discover/:categorySlug/:subcategorySlug" element={<PageTransition><SubcategoryFeed /></PageTransition>} />
          <Route path="/story/:storyId" element={<PageTransition><StoryDetails /></PageTransition>} />
          <Route path="/culture" element={<PageTransition><Discover /></PageTransition>} />
          <Route path="/culture/:id" element={<PageTransition><CultureDetails /></PageTransition>} />
          <Route path="/marketplace" element={<PageTransition><MarketPlace /></PageTransition>} />
          <Route path="/marketplace/add" element={<PageTransition><AddProduct /></PageTransition>} />
          <Route path="/Marketplace" element={<PageTransition><MarketPlace /></PageTransition>} />
          <Route path="/tourism" element={<PageTransition><Tourism /></PageTransition>} />
          <Route path="/tourism/create-journey" element={<PageTransition><CreateJourney /></PageTransition>} />
          <Route path="/tourism/:id" element={<PageTransition><JourneyDetails /></PageTransition>} />
          <Route path="/tribals" element={<PageTransition><Tribals /></PageTransition>} />
          <Route path="/tribals/:id" element={<PageTransition><TribeDetail /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/personalities" element={<PageTransition><Personalities /></PageTransition>} />
          <Route path="/personalities/:id" element={<PageTransition><PersonalityDetails /></PageTransition>} />
          <Route path="/districts/:name" element={<PageTransition><DistrictsDetails /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/marketplace/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
          <Route path="/share-story" element={<PageTransition><ShareStory /></PageTransition>} />
          <Route path="/about-us" element={<PageTransition><AboutUs /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactUs /></PageTransition>} />
          <Route path="/contact-us" element={<PageTransition><ContactUs /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="districts" element={<AdminDistricts />} />
              <Route path="culture" element={<AdminCulture />} />
              <Route path="tourism" element={<AdminTourism />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="marketplace" element={<AdminMarketplace />} />
              <Route path="tribes" element={<AdminTribes />} />
              <Route path="personalities" element={<AdminPersonalities />} />
              <Route path="places" element={<AdminPopularPlaces />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AdminDataProvider>
  );
}

export default App;
