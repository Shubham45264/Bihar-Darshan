import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Sparkles,
  Utensils,
  Landmark,
  Users,
  Award,
  Image as ImageIcon,
  MessageSquareHeart,
  Target,
  Eye,
  ArrowRight,
  Heart,
  ShieldCheck,
  Globe,
  Share2,
  BookmarkCheck,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import biharHeritage from "../assets/bihar-heritage.png";
import biharTemple from "../assets/bihar-temple.png";
import ctaBg from "../assets/cta-bg.png";
import "./AboutUs.css";

const exploreItems = [
  {
    title: "Districts",
    description: "Explore the history, geography, and distinct culture of all 38 districts of Bihar.",
    icon: Compass,
    link: "/districts",
  },
  {
    title: "Culture & Traditions",
    description: "Delve into ancient Madhubani art, folk music, rituals, and living heritage.",
    icon: Sparkles,
    link: "/discover",
  },
  {
    title: "Food & Festivals",
    description: "Discover traditional culinary delicacies like Litti Chokha and grand festivals like Chhath Puja.",
    icon: Utensils,
    link: "/discover",
  },
  {
    title: "Tourism",
    description: "Plan journeys across Bodh Gaya, Nalanda, Rajgir, Vaishali, and historic monuments.",
    icon: Landmark,
    link: "/tourism",
  },
  {
    title: "Tribes",
    description: "Learn about indigenous tribal communities, heritage, and artistic craftsmanship.",
    icon: Users,
    link: "/tribals",
  },
  {
    title: "Personalities",
    description: "Discover historical icons, visionary scholars, leaders, and artists who shaped Bihar.",
    icon: Award,
    link: "/personalities",
  },
  {
    title: "Gallery",
    description: "Immerse yourself in high-definition visual stories capturing Bihar's timeless beauty.",
    icon: ImageIcon,
    link: "/gallery",
  },
  {
    title: "Community Stories",
    description: "Connect with local voices and read authentic personal experiences from across the state.",
    icon: MessageSquareHeart,
    link: "/community",
  },
];

const whyCards = [
  {
    number: "01",
    title: "Authentic Cultural Information",
    description: "Carefully curated, verified historical insights into Bihar's rich heritage and traditions.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Community Participation",
    description: "Empowering locals and global travelers to share authentic photos, food tales, and memories.",
    icon: Share2,
  },
  {
    number: "03",
    title: "Tourism Awareness",
    description: "Promoting responsible eco-tourism and highlighting hidden heritage gems across all districts.",
    icon: Globe,
  },
  {
    number: "04",
    title: "Preservation of Heritage",
    description: "Digitizing and safeguarding ancient folklore, tribal art forms, and monumental legacies.",
    icon: BookmarkCheck,
  },
];

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="about-page-container">
      {/* Navbar - Reuse existing header with white text transparent top */}
      <Navbar forceWhiteText={true} />

      {/* 1. HERO SECTION */}
      <section
        className="about-hero-section"
        style={{ backgroundImage: `url(${biharHeritage})` }}
      >
        <div className="about-hero-overlay" />
        <div className="about-hero-glow" />

        <div className="about-hero-content">
          <div className="about-hero-badge">
            <span>✦</span> CULTURAL & TOURISM HERITAGE <span>✦</span>
          </div>
          <h1 className="about-hero-title">
            About <span className="about-gold-accent">Bihar Darshan</span>
          </h1>
          <p className="about-hero-subtitle">
            A digital journey through the culture, heritage, traditions and stories of Bihar.
          </p>

          <div className="heritage-divider-line">
            <span />
            <span className="motif">✦</span>
            <span />
          </div>
        </div>
      </section>

      {/* 2 & 3. OUR PURPOSE AND OUR VISION */}
      <section className="about-section about-section-pattern">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-tag">WHO WE ARE</span>
            <h2 className="about-section-heading">
              Preserving Legacy, Empowering Discovery
            </h2>
          </div>

          <div className="purpose-vision-grid">
            {/* Our Purpose */}
            <div className="purpose-card">
              <div className="pv-icon-box">
                <Target size={28} />
              </div>
              <h3 className="pv-title">Our Purpose</h3>
              <p className="pv-text">
                Bihar Darshan is a cultural and tourism platform created to present the rich identity of Bihar to people across the world. The website brings together information about districts, traditions, festivals, food, tribal communities, tourism, personalities and local stories in one accessible digital space.
              </p>
            </div>

            {/* Our Vision */}
            <div className="vision-card">
              <div className="pv-icon-box">
                <Eye size={28} />
              </div>
              <h3 className="pv-title">Our Vision</h3>
              <p className="pv-text">
                Our vision is to preserve Bihar’s cultural heritage, promote responsible tourism, support local communities and help users discover the diversity of the state through authentic information and shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT USERS CAN EXPLORE */}
      <section className="about-section" style={{ backgroundColor: "#F2EDE4" }}>
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-tag">DISCOVER THE STATE</span>
            <h2 className="about-section-heading">What You Can Explore</h2>
          </div>

          <div className="explore-grid">
            {exploreItems.map((item) => {
              const IconComp = item.icon;
              return (
                <Link key={item.title} to={item.link} className="explore-card">
                  <div className="explore-card-top">
                    <div className="explore-icon-wrapper">
                      <IconComp size={24} />
                    </div>
                    <h3 className="explore-title">{item.title}</h3>
                    <p className="explore-desc">{item.description}</p>
                  </div>
                  <span className="explore-link-btn">
                    Explore Now <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY CONTRIBUTION */}
      <section className="about-section">
        <div className="about-container">
          <div className="community-contrib-section">
            <img src={biharTemple} alt="" className="contrib-bg-image" />
            <div className="contrib-content">
              <span className="about-section-tag" style={{ color: "#D4A017" }}>
                COMMUNITY PARTICIPATION
              </span>
              <h2 className="contrib-title">
                Share Your Story & Celebrate Bihar
              </h2>
              <p className="contrib-text">
                Bihar Darshan is not only an information platform. It also allows people to contribute photographs, food stories, festival experiences and information about notable personalities through the Share Your Story feature.
              </p>
              <Link to="/share-story" className="btn-gold-primary">
                Share Your Story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY BIHAR DARSHAN */}
      <section className="about-section about-section-pattern">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-tag">CORE VALUES</span>
            <h2 className="about-section-heading">Why Bihar Darshan?</h2>
          </div>

          <div className="why-grid">
            {whyCards.map((card) => {
              return (
                <div key={card.title} className="why-card">
                  <div className="why-number">{card.number}</div>
                  <h3 className="why-title">{card.title}</h3>
                  <p className="why-desc">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. OPTIONAL TEAM SECTION */}
      <section className="about-section" style={{ paddingTop: 0 }}>
        <div className="about-container">
          <div className="team-banner">
            <div className="team-badge">
              <Heart size={24} />
            </div>
            <h2 className="team-title">Built with Passion</h2>
            <p className="team-text">
              Bihar Darshan is developed as a collaborative digital initiative to celebrate the golden history, vibrant cultural expressions, and living heritage of Bihar for audiences across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="about-cta-section">
        <div
          className="about-cta-overlay"
          style={{ backgroundImage: `url(${ctaBg})` }}
        />
        <div className="about-cta-content">
          <h2 className="about-cta-heading">
            Begin Your Journey Through Bihar
          </h2>
          <p className="about-cta-sub">
            Discover ancient monuments, sacred pilgrimage sites, mouthwatering cuisine, and inspiring grassroots stories.
          </p>
          <div className="about-cta-buttons">
            <Link to="/" className="btn-cta-gold">
              Explore Bihar
            </Link>
            <Link to="/discover" className="btn-cta-outline">
              Discover
            </Link>
            <Link to="/share-story" className="btn-cta-outline">
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Reuse existing footer with working About Us link */}
      <Footer />
    </div>
  );
};

export default AboutUs;
