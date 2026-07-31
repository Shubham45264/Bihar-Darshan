import { useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Database,
  UserCheck,
  Cookie,
  Share2,
  HelpCircle,
  Mail,
  CheckCircle2,
  List,
  Server,
  Globe,
  RefreshCw,
  Award
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShareStorySection from "../components/cta/ShareStorySection";
import biharHeritage from "../assets/bihar-heritage.png";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tocItems = [
    { id: "sec-1", title: "1. Introduction" },
    { id: "sec-2", title: "2. Information We Collect" },
    { id: "sec-3", title: "3. How We Use Information" },
    { id: "sec-4", title: "4. Cookies & Tracking" },
    { id: "sec-5", title: "5. Community Content" },
    { id: "sec-6", title: "6. Sharing of Information" },
    { id: "sec-7", title: "7. Data Security" },
    { id: "sec-8", title: "8. Data Retention" },
    { id: "sec-9", title: "9. Your Rights" },
    { id: "sec-10", title: "10. Children's Privacy" },
    { id: "sec-11", title: "11. Third-Party Links" },
    { id: "sec-12", title: "12. Data Transfers" },
    { id: "sec-13", title: "13. Changes to Policy" },
    { id: "sec-14", title: "14. Contact Us" },
    { id: "sec-15", title: "15. Consent" },
  ];

  return (
    <div className="privacy-page-container">
      {/* Navigation Header */}
      <Navbar forceWhiteText={true} />

      {/* 1. HERO SECTION */}
      <section
        className="privacy-hero-section"
        style={{ backgroundImage: `url(${biharHeritage})` }}
      >
        <div className="privacy-hero-overlay" />
        <div className="privacy-hero-glow" />

        <div className="privacy-hero-content">
          <div className="privacy-hero-badge">
            <span>✦</span> LEGAL & GOVERNANCE <span>✦</span>
          </div>
          <h1 className="privacy-hero-title">Privacy Policy</h1>
          <div className="privacy-hero-dates">
            <span className="privacy-date-item">
              <strong>Effective Date:</strong> July 31, 2026
            </span>
            <span>•</span>
            <span className="privacy-date-item">
              <strong>Last Updated:</strong> July 31, 2026
            </span>
          </div>

          <div
            className="heritage-divider-line"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              margin: "24px auto 0",
              maxWidth: "280px",
            }}
          >
            <span
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, #D4A017, transparent)",
              }}
            />
            <span style={{ color: "#D4A017", fontSize: "14px" }}>✦</span>
            <span
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, #D4A017, transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. MAIN LAYOUT (TOC SIDEBAR + PRIVACY CONTENT) */}
      <section className="privacy-main-section">
        <div className="privacy-layout-grid">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="privacy-sidebar">
            <h3 className="privacy-toc-title">
              <List size={18} className="text-[#D4A017]" /> Table of Contents
            </h3>
            <ul className="privacy-toc-list">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="privacy-toc-link"
                    style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Privacy Content Card */}
          <main className="privacy-content-card">
            {/* 1. Introduction */}
            <div id="sec-1" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="privacy-section-title">1. Introduction</h2>
              </div>
              <div className="privacy-section-body">
                <p>
                  Welcome to <strong>Bihar Darshan</strong> ("Bihar Darshan", "we", "our", or "us"). Bihar Darshan is an independent digital platform dedicated to showcasing the tourism, heritage, culture, cuisine, festivals, destinations, and communities of Bihar while enabling users to discover places, share experiences, and participate in community discussions.
                </p>
                <p>
                  We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy describes how we collect, use, disclose, store, and safeguard your information when you access or use our website, applications, and related services (collectively, the "Services").
                </p>
                <p>
                  By accessing or using our Services, you acknowledge that you have read and understood this Privacy Policy.
                </p>
              </div>
            </div>

            {/* 2. Information We Collect */}
            <div id="sec-2" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Database size={22} />
                </div>
                <h2 className="privacy-section-title">2. Information We Collect</h2>
              </div>
              <div className="privacy-section-body">
                <p>
                  We collect information necessary to provide, maintain, improve, and secure our Services.
                </p>

                <h3 className="privacy-subtitle">2.1 Information You Provide</h3>
                <p>Depending on how you use Bihar Darshan, we may collect:</p>
                <ul className="privacy-list">
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Full name and Username</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Email address and Profile photograph</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Password (encrypted through our authentication provider)</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Contact information voluntarily provided by you</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Posts, reviews, comments, replies, ratings, and other community contributions</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Images and other media uploaded to the platform</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Messages submitted through contact forms</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Any additional information you choose to provide</span>
                  </li>
                </ul>
                <p style={{ fontStyle: "italic", fontSize: "14px", color: "#7D7364" }}>
                  You are solely responsible for ensuring that information you publish publicly does not contain confidential or sensitive personal information.
                </p>

                <h3 className="privacy-subtitle">2.2 Information Collected Automatically</h3>
                <p>When you visit our Services, we may automatically collect technical information, including:</p>
                <ul className="privacy-list">
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>IP address, Browser type and version</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Device information & Operating system</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Language preferences, Date and time of access</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Pages viewed, Referring website, and Clickstream data</span>
                  </li>
                  <li className="privacy-list-item">
                    <CheckCircle2 size={16} className="privacy-bullet" />
                    <span>Session information, Cookies, and similar tracking technologies</span>
                  </li>
                </ul>
                <p>This information helps us improve performance, maintain security, and understand how users interact with our platform.</p>

                <h3 className="privacy-subtitle">2.3 Location Information</h3>
                <p>
                  Certain features may request your approximate location to improve search results, nearby attractions, maps, or location-based recommendations.
                </p>
                <p>Location access is optional and can be disabled through your device or browser settings.</p>
              </div>
            </div>

            {/* 3. How We Use Your Information */}
            <div id="sec-3" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <UserCheck size={22} />
                </div>
                <h2 className="privacy-section-title">3. How We Use Your Information</h2>
              </div>
              <div className="privacy-section-body">
                <p>We process your information for legitimate business purposes, including to:</p>
                <ul className="privacy-list">
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Create and manage user accounts</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Authenticate users securely</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Provide access to platform features</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Publish community-generated content</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Display user profiles and contributions</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Improve website functionality and performance</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Personalize user experiences</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Respond to inquiries and support requests</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Monitor, prevent, and investigate fraud, spam, abuse, or security incidents</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Enforce our Terms of Service and Community Guidelines</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Generate analytics and usage insights</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Comply with applicable legal obligations</span></li>
                </ul>
                <p>We only process personal information where we have an appropriate legal basis to do so.</p>
              </div>
            </div>

            {/* 4. Cookies and Similar Technologies */}
            <div id="sec-4" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Cookie size={22} />
                </div>
                <h2 className="privacy-section-title">4. Cookies and Similar Technologies</h2>
              </div>
              <div className="privacy-section-body">
                <p>Bihar Darshan uses cookies and similar technologies to:</p>
                <ul className="privacy-list">
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Maintain secure login sessions</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Remember user preferences</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Improve website functionality & measure performance</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Analyze visitor behavior and enhance security</span></li>
                </ul>
                <p>You may manage or disable cookies through your browser settings. Certain features may not function properly if cookies are disabled.</p>
              </div>
            </div>

            {/* 5. Community Content */}
            <div id="sec-5" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Eye size={22} />
                </div>
                <h2 className="privacy-section-title">5. Community Content</h2>
              </div>
              <div className="privacy-section-body">
                <p>Bihar Darshan includes community features that allow users to publish content.</p>
                <p>Information you voluntarily make public, including posts, reviews, comments, replies, photographs, and public profile information, may be visible to other users and search engines.</p>
                <p style={{ fontStyle: "italic", color: "#7D7364" }}>We encourage users not to publish personal, confidential, or sensitive information within publicly accessible areas of the platform.</p>
              </div>
            </div>

            {/* 6. Sharing of Information */}
            <div id="sec-6" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Share2 size={22} />
                </div>
                <h2 className="privacy-section-title">6. Sharing of Information</h2>
              </div>
              <div className="privacy-section-body">
                <p>We do <strong>not sell, rent, or trade</strong> your personal information.</p>
                <p>We may share information only under the following circumstances:</p>

                <h3 className="privacy-subtitle">Service Providers</h3>
                <p>We may share information with trusted third-party service providers that help us operate our Services, including providers for user authentication, cloud storage, image hosting, website hosting, analytics, mapping services, and email delivery.</p>

                <h3 className="privacy-subtitle">Legal Requirements</h3>
                <p>We may disclose information if required to do so by law or when reasonably necessary to comply with legal obligations, respond to lawful requests, protect legal rights, or investigate fraud.</p>

                <h3 className="privacy-subtitle">Business Transfers</h3>
                <p>If Bihar Darshan undergoes a merger, acquisition, restructuring, or sale of assets, user information may be transferred as part of that transaction, subject to applicable law.</p>
              </div>
            </div>

            {/* 7. Data Security */}
            <div id="sec-7" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Lock size={22} />
                </div>
                <h2 className="privacy-section-title">7. Data Security</h2>
              </div>
              <div className="privacy-section-body">
                <p>
                  We implement appropriate administrative, technical, and organizational safeguards designed to protect personal information against unauthorized access, disclosure, alteration, misuse, or destruction.
                </p>
                <p>
                  These measures include secure authentication, encrypted communications (HTTPS), access controls, routine monitoring, and other industry-standard security practices.
                </p>
                <p style={{ fontSize: "14px", color: "#7D7364" }}>
                  Despite our efforts, no method of electronic transmission or storage can be guaranteed to be completely secure. Accordingly, we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* 8. Data Retention */}
            <div id="sec-8" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Server size={22} />
                </div>
                <h2 className="privacy-section-title">8. Data Retention</h2>
              </div>
              <div className="privacy-section-body">
                <p>We retain personal information only for as long as necessary to provide our Services, maintain user accounts, resolve disputes, enforce our policies, and meet legal, accounting, or regulatory obligations.</p>
                <p>When information is no longer required, it will be securely deleted or anonymized where reasonably practicable.</p>
              </div>
            </div>

            {/* 9. Your Rights */}
            <div id="sec-9" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Award size={22} />
                </div>
                <h2 className="privacy-section-title">9. Your Rights</h2>
              </div>
              <div className="privacy-section-body">
                <p>Subject to applicable law, you may have the right to:</p>
                <ul className="privacy-list">
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Access your personal information</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Correct inaccurate or incomplete information</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Request deletion of your account and personal information</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Request a copy of your personal data</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Withdraw consent where processing is based on consent</span></li>
                  <li className="privacy-list-item"><CheckCircle2 size={16} className="privacy-bullet" /><span>Object to certain forms of data processing</span></li>
                </ul>
                <p>Requests may be submitted through our official contact channels. We may verify your identity before processing such requests.</p>
              </div>
            </div>

            {/* 10. Children's Privacy */}
            <div id="sec-10" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <FileText size={22} />
                </div>
                <h2 className="privacy-section-title">10. Children's Privacy</h2>
              </div>
              <div className="privacy-section-body">
                <p>Our Services are not directed toward children under the age of 13.</p>
                <p>We do not knowingly collect personal information from children. If we become aware that such information has been collected without appropriate consent, we will take reasonable steps to delete it promptly.</p>
              </div>
            </div>

            {/* 11. Third-Party Services and Links */}
            <div id="sec-11" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Globe size={22} />
                </div>
                <h2 className="privacy-section-title">11. Third-Party Services and Links</h2>
              </div>
              <div className="privacy-section-body">
                <p>Our Services may contain links to third-party websites, applications, or services that operate independently from Bihar Darshan.</p>
                <p>We are not responsible for the privacy practices, security, or content of third-party services. We encourage users to review their respective privacy policies before providing personal information.</p>
              </div>
            </div>

            {/* 12. International Data Transfers */}
            <div id="sec-12" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Server size={22} />
                </div>
                <h2 className="privacy-section-title">12. International Data Transfers</h2>
              </div>
              <div className="privacy-section-body">
                <p>Your information may be processed or stored on servers located outside your jurisdiction through trusted cloud infrastructure providers.</p>
                <p>Where applicable, we take appropriate measures to ensure that personal information receives an adequate level of protection consistent with this Privacy Policy.</p>
              </div>
            </div>

            {/* 13. Changes to this Privacy Policy */}
            <div id="sec-13" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <RefreshCw size={22} />
                </div>
                <h2 className="privacy-section-title">13. Changes to this Privacy Policy</h2>
              </div>
              <div className="privacy-section-body">
                <p>We reserve the right to modify or update this Privacy Policy at any time.</p>
                <p>Material changes will be reflected by updating the "Last Updated" date at the top of this page. Continued use of the Services after any changes become effective constitutes acceptance of the revised Privacy Policy.</p>
              </div>
            </div>

            {/* 14. Contact Us */}
            <div id="sec-14" className="privacy-section-block">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Mail size={22} />
                </div>
                <h2 className="privacy-section-title">14. Contact Us</h2>
              </div>
              <div className="privacy-section-body">
                <p>If you have any questions, requests, or concerns regarding this Privacy Policy or our privacy practices, please contact us:</p>
                <div className="privacy-contact-box">
                  <h4 style={{ fontFamily: 'var(--font-serif, "Marcellus", serif)', fontSize: "18px", color: "#1A1814", marginBottom: "8px", fontWeight: "700" }}>
                    Bihar Darshan Privacy Desk
                  </h4>
                  <p style={{ margin: "4px 0", fontSize: "14px" }}>
                    Email:{" "}
                    <a href="mailto:support@bihardarshan.com" className="privacy-contact-link">
                      support@bihardarshan.com
                    </a>
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "14px" }}>
                    Website:{" "}
                    <a href="https://www.bihardarshan.com" target="_blank" rel="noopener noreferrer" className="privacy-contact-link">
                      https://www.bihardarshan.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* 15. Consent */}
            <div id="sec-15" className="privacy-section-block">
              <div className="privacy-consent-box">
                <h3 className="privacy-consent-title">15. Consent</h3>
                <p className="privacy-consent-text">
                  By accessing or using Bihar Darshan, you acknowledge that you have read, understood, and agreed to the collection, use, storage, and disclosure of your information as described in this Privacy Policy.
                </p>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* Footer CTA Banner & Footer */}
      <ShareStorySection />
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
