import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/new-logo.png";
import templeBg from "../../assets/bihar-temple.png";

import { useAdminData } from "../../data/AdminContext";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Districts", href: "/districts" },
  { label: "Tourism", href: "/tourism" },
  { label: "Gallery", href: "/gallery" },
];

const connectLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
  const { siteSettings } = useAdminData();

  return (
    <footer className="relative bg-[#1A1814] text-[#C4B59D] overflow-hidden border-b-[5px] border-[#5b7a66]">
      {/* Faint Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url(${templeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />



      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <div className="mb-3">
              <img
                src={logo}
                alt="Bihar Darshan"
                className="h-14 sm:h-18 lg:h-20 w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,160,23,0.25)]"
                style={{
                  filter: "brightness(0) saturate(100%) invert(84%) sepia(25%) saturate(700%) hue-rotate(350deg) brightness(96%) contrast(90%)"
                }}
              />
            </div>
            <p className="text-[#AFA28F] text-xs sm:text-sm leading-relaxed max-w-xs">
              {siteSettings?.footerAbout || "Your portal to the timeless heritage, sacred landscapes, and living traditions of Bihar."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-[#E8DCC4] font-serif font-bold text-sm sm:text-[16px] tracking-wide mb-3">
              Explore Bihar
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-xs sm:text-[14px] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-xs sm:text-[14px] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
            <h3 className="text-[#E8DCC4] font-serif font-bold text-sm sm:text-[16px] tracking-wide mb-3">
              Information
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-xs sm:text-[14px] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-xs sm:text-[14px] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[#E8DCC4] font-serif font-bold text-sm sm:text-[16px] tracking-wide mb-3">
              Connect With Us
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#8C7A60] border-opacity-50 flex items-center justify-center text-[#E8DCC4] hover:bg-[#D4A017] hover:border-[#D4A017] hover:text-[#1A1814] transition-all duration-300"
                >
                  <social.icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#312B22] relative z-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-3.5 flex items-center justify-center">
          <p className="text-center text-[#978C79] text-xs">
            © 2026 Bihar Darshan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
