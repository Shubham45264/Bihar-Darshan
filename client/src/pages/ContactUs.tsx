import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  Send,
  User,
  AtSign,
  Phone,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShareStorySection from "../components/cta/ShareStorySection";
import biharHeritage from "../assets/bihar-heritage.png";
import bodhGaya from "../assets/bodh-gaya.png";
import biharTemple from "../assets/bihar-temple.png";
import "./ContactUs.css";

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || (user.email ? user.email.split('@')[0] : prev.name),
          email: user.email || prev.email,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/bihardarshanofficial@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone || "Not provided",
          Subject: formData.subject,
          Message: formData.message,
          _subject: `New Contact Message [${formData.subject}] from ${formData.name} - Bihar Darshan`,
          _replyto: formData.email,
          _template: "table"
        })
      });

      const data = await response.json();

      if (response.ok || data.success === "true" || data.success === true) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: ""
        });
        setTimeout(() => setIsSubmitted(false), 7000);
      } else {
        setErrorMessage("Failed to send message. Please try again or email us directly at bihardarshanofficial@gmail.com.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setErrorMessage("Network error. Please try again or email us directly at bihardarshanofficial@gmail.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      {/* Header Navigation */}
      <Navbar forceWhiteText={true} />

      {/* 1. HERO SECTION */}
      <section
        className="contact-hero-section"
        style={{ backgroundImage: `url(${biharHeritage})` }}
      >
        <div className="contact-hero-overlay" />
        <div className="contact-hero-glow" />

        <div className="contact-hero-content">
          <div className="contact-hero-badge">
            <span>✦</span> CONNECT & REACH OUT <span>✦</span>
          </div>
          <h1 className="contact-hero-title">
            Get in Touch with <span className="contact-gold-accent">Bihar Darshan</span>
          </h1>
          <p className="contact-hero-subtitle">
            Have questions about tourist destinations, cultural heritage, or community contributions?
            Our team is here to guide you through the heart of Bihar.
          </p>

          <div className="heritage-divider-line" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: '24px auto 0', maxWidth: '280px' }}>
            <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />
            <span style={{ color: '#D4A017', fontSize: '14px' }}>✦</span>
            <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />
          </div>
        </div>
      </section>

      {/* 3. MAIN SECTION (SHOWCASE + FORM) */}
      <section className="contact-main-section">
        <div className="contact-main-grid">
          {/* Left Column: Visual Showcase Card */}
          <div className="contact-showcase-card">
            <img
              src={bodhGaya}
              alt="Bodh Gaya Bihar Heritage"
              className="contact-showcase-img"
            />
            <div className="contact-showcase-overlay" />
            <div className="contact-showcase-body">
              <span className="contact-showcase-tag">CULTURAL HERITAGE & TOURISM</span>
              <h2 className="contact-showcase-heading">
                Your Gateway to Discovering Bihar
              </h2>
              <p className="contact-showcase-text">
                Whether you are planning your journey across Bodh Gaya, Nalanda, and Rajgir, or wish to contribute authentic stories and photographs, we are always ready to assist.
              </p>

              <div className="contact-highlights-list">
                <div className="contact-highlight-item">
                  <CheckCircle2 size={18} className="contact-highlight-icon" />
                  <span>District-wise travel guides & heritage itineraries</span>
                </div>
                <div className="contact-highlight-item">
                  <CheckCircle2 size={18} className="contact-highlight-icon" />
                  <span>Community story & photograph submission support</span>
                </div>
                <div className="contact-highlight-item">
                  <CheckCircle2 size={18} className="contact-highlight-icon" />
                  <span>Festival, cuisine, and cultural event inquiries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="contact-form-card">
            <div className="contact-form-header">
              <span className="contact-form-tag">SEND US A MESSAGE</span>
              <h2 className="contact-form-title">We'd Love to Hear from You</h2>
              <p className="contact-form-sub">
                Fill out the details below and our team will respond to your inquiry shortly.
              </p>
            </div>

            {isSubmitted && (
              <div className="contact-success-msg">
                <CheckCircle2 size={22} className="text-[#D4A017]" />
                <span>Thank you! Your message has been sent to bihardarshanofficial@gmail.com. We will respond to you shortly!</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200 flex items-center gap-2">
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="contact-input-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="contact-form-input"
                />
                <User size={18} className="contact-input-icon" />
              </div>

              {/* Email */}
              <div className="contact-input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="contact-form-input"
                />
                <AtSign size={18} className="contact-input-icon" />
              </div>

              {/* Phone */}
              <div className="contact-input-group">
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="contact-form-input"
                />
                <Phone size={18} className="contact-input-icon" />
              </div>

              {/* Subject Dropdown */}
              <div className="contact-select-wrapper">
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="contact-form-select"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Tourism & Travel Guides">Tourism & Travel Guides</option>
                  <option value="Story & Photo Submissions">Story & Photo Submissions</option>
                  <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                  <option value="Media & Collaborations">Media & Collaborations</option>
                </select>
                <HelpCircle size={18} className="contact-input-icon" />
                <ChevronDown size={18} className="contact-select-arrow" />
              </div>

              {/* Message */}
              <textarea
                placeholder="How can we help you? Share your details or questions..."
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="contact-form-textarea"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="contact-submit-btn"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="contact-faq-section">
        <div className="contact-faq-container">
          <div className="contact-faq-header">
            <span className="about-section-tag" style={{ color: "#D4A017" }}>QUICK ANSWERS</span>
            <h2 className="about-section-heading">Frequently Asked Questions</h2>
          </div>

          <div className="contact-faq-grid">
            <div className="contact-faq-card">
              <h3 className="contact-faq-q">
                <Sparkles size={18} className="contact-faq-q-icon" />
                How can I submit my photos or stories?
              </h3>
              <p className="contact-faq-a">
                You can easily share your stories, travel photos, and video clips by visiting our 'Share Your Story' section or contacting our community desk.
              </p>
            </div>

            <div className="contact-faq-card">
              <h3 className="contact-faq-q">
                <Sparkles size={18} className="contact-faq-q-icon" />
                Where can I find tourist itineraries?
              </h3>
              <p className="contact-faq-a">
                Explore our Tourism and District sections for comprehensive details on Bodh Gaya, Rajgir, Nalanda, Vaishali, and historic monuments.
              </p>
            </div>

            <div className="contact-faq-card">
              <h3 className="contact-faq-q">
                <Sparkles size={18} className="contact-faq-q-icon" />
                Is Bihar Darshan free to explore?
              </h3>
              <p className="contact-faq-a">
                Yes! Bihar Darshan is a public digital initiative created to celebrate and preserve the rich culture, history, and tourism of Bihar for everyone.
              </p>
            </div>

            <div className="contact-faq-card">
              <h3 className="contact-faq-q">
                <Sparkles size={18} className="contact-faq-q-icon" />
                How do I report an issue or suggest a feature?
              </h3>
              <p className="contact-faq-a">
                Select 'Feedback & Suggestions' or 'General Inquiry' in the contact form above, and our technical team will address it promptly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER BEFORE FOOTER */}
      <ShareStorySection />

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
};

export default ContactPage;