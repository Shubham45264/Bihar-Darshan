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
import Community from './pages/Community';
import CreateCommunity from './pages/CreateCommunity';
import MarketPlace from './pages/MarketPlace';
import AddProduct from './pages/AddProduct';
import ScrollToTop from "./components/ScrollToTop";
import ProductDetails from './pages/ProductDetails';
import CultureDetails from './pages/CultureDetails';
import ShareStory from './pages/ShareStory';
import Personalities from './pages/Personalities';
import PersonalityDetails from './pages/PersonalityDetails';
import AboutUs from './pages/AboutUs';
import { AdminDataProvider } from './data/AdminContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCulture from './pages/admin/AdminCulture';
import AdminDistricts from './pages/admin/AdminDistricts';
import AdminTourism from './pages/admin/AdminTourism';
import AdminGallery from './pages/admin/AdminGallery';
import AdminCommunity from './pages/admin/AdminCommunity';
import AdminMarketplace from './pages/admin/AdminMarketplace';
import AdminTribes from './pages/admin/AdminTribes';
import AdminPersonalities from './pages/admin/AdminPersonalities';
import AdminPopularPlaces from './pages/admin/AdminPopularPlaces';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';
import FloatingSocials from './components/shared/FloatingSocials';
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
        <FloatingSocials />

        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/districts" element={<Districts />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/culture" element={<Discover />} />
            <Route path="/culture/:id" element={<CultureDetails />} />
            <Route path="/community/create" element={<CreateCommunity />} />
            <Route path="/community" element={<Community />} />
            <Route path="/Community" element={<Community />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/marketplace/add" element={<AddProduct />} />
            <Route path="/Marketplace" element={<MarketPlace />} />
            <Route path="/tourism" element={<Tourism />} />
            <Route path="/tourism/create-journey" element={<CreateJourney />} />
            <Route path="/tourism/:id" element={<JourneyDetails />} />
            <Route path="/tribals" element={<Tribals />} />
            <Route path="/tribals/:id" element={<TribeDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/personalities" element={<Personalities />} />
            <Route path="/personalities/:id" element={<PersonalityDetails />} />
            <Route path="/districts/:name" element={<DistrictsDetails />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/marketplace/:id" element={<ProductDetails />} />
            <Route path="/share-story" element={<ShareStory />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </PageTransition>

        {/* Admin Routes (outside PageTransition to avoid translation interference) */}
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="districts" element={<AdminDistricts />} />
              <Route path="culture" element={<AdminCulture />} />
              <Route path="tourism" element={<AdminTourism />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="community" element={<AdminCommunity />} />
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
