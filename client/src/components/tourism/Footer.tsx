import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, Send, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-brand-gray border-t border-brand-dark/5 relative overflow-hidden">
      {/* Madhubani Line Art Decorative Overlay (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-5 pointer-events-none grayscale brightness-0">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply" />
        {/* Placeholder for Madhubani art styling if actual SVG existed, using a decorative border instead */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-gold via-accent-brown to-brand-gold shadow-[0_-10px_20px_rgba(212,160,23,0.2)]" />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Logo & Vision */}
          <div className="lg:col-span-1">
            <img src={logo} alt="Bihar Darshan" className="h-20 lg:h-24 w-auto object-contain mb-6 drop-shadow-sm" />
            <p className="text-brand-dark/60 text-sm leading-relaxed mb-8 max-w-xs font-medium">
              Defining the future of luxury heritage tourism in Bihar. Our mission is to preserve tradition while delivering excellence.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61592901971612" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "https://www.instagram.com/bihar_darshanofficial/" },
                { icon: Youtube, href: "https://www.youtube.com/@BiharDarshanOfficial2026" }
              ].map((item, idx) => (


                <motion.a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, color: '#F4A261' }}
                  className="w-10 h-10 rounded-full border border-brand-dark/10 flex items-center justify-center text-brand-dark/40 hover:border-brand-gold transition-colors"
                >
                  <item.icon size={18} />
                </motion.a>
              ))}
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-dark mb-10">Explore</h4>
            <ul className="space-y-4">
              {["Destricts", "Culture", "Tribal Heritage", "Marketplace", "Photo Gallery"].map((link) => (
                <li key={link}>
                  <a href="#" className="group flex items-center justify-between text-brand-dark/60 text-sm hover:text-brand-gold transition-colors font-medium">
                    {link}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-dark mb-10">Experience</h4>
            <ul className="space-y-4">
              {["Verified Providers", "Luxury Stays", "Private Guides", "Secure Booking", "Travel Insurance"].map((link) => (
                <li key={link}>
                  <a href="#" className="group flex items-center justify-between text-brand-dark/60 text-sm hover:text-brand-gold transition-colors font-medium">
                    {link}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-dark mb-10">Newsletter</h4>
            <p className="text-brand-dark/60 text-sm mb-8 font-medium">
              Join our exclusive list for early access to boutique tours.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white border border-brand-dark/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-gold transition-colors shadow-sm"
              />
              <button className="absolute right-2 top-2 bottom-2 w-12 rounded-xl bg-brand-dark text-brand-gold flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-brand-dark/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-brand-dark/30 text-[10px] uppercase font-bold tracking-[0.2em]">
            © 2026 Bihar Darshan. All Rights Reserved. Crafted with <span className="text-brand-gold italic">Heritage</span> & Excellence.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="text-brand-dark/30 text-[10px] uppercase font-bold tracking-[0.2em] hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <a href="#" className="text-brand-dark/30 text-[10px] uppercase font-bold tracking-[0.2em] hover:text-brand-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
