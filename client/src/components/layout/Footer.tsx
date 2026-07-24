import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/new-logo.png";
import templeBg from "../../assets/bihar-temple.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Districts", href: "/districts" },
  { label: "Tourism", href: "/tourism" },
  { label: "Community", href: "/community" },
  { label: "Gallery", href: "/gallery" },
];

const connectLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
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



      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <div className="mb-5">
              <img
                src={logo}
                alt="Bihar Darshan"
                className="h-[60px] w-auto object-contain"
                style={{
                  filter: "brightness(0) saturate(100%) invert(81%) sepia(19%) saturate(452%) hue-rotate(352deg) brightness(91%) contrast(87%)"
                }}
              />
            </div>
            <p className="text-[#AFA28F] text-[14px] leading-[1.7] max-w-[280px]">
              Your gateway to explore, experience
              and contribute to the rich heritage
              and culture of Bihar.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:ml-4">
            <h3 className="text-[#E8DCC4] font-serif font-bold text-[16px] tracking-wide mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-[15px] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-[15px] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[#E8DCC4] font-serif font-bold text-[16px] tracking-wide mb-6">
              Connect
            </h3>
            <ul className="space-y-4">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-[15px] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-[#AFA28F] hover:text-[#E8DCC4] text-[15px] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-[#E8DCC4] font-serif font-bold text-[16px] tracking-wide mb-6">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-[42px] h-[42px] rounded-full border border-[#8C7A60] border-opacity-50 flex items-center justify-center text-[#E8DCC4] hover:bg-[#D4A017] hover:border-[#D4A017] hover:text-[#1A1814] transition-all duration-300"
                >
                  <social.icon size={17} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#312B22] relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-5 flex items-center justify-center">
          <p className="text-center text-[#978C79] text-[13px]">
            © 2026 Bihar Darshan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
