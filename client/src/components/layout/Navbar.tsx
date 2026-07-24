import { useState, useEffect } from "react";
import { Globe, Menu, X, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/new-logo.png";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../../lib/firebase";

type NavItem = {
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Districts", path: "/districts" },
  { label: "Discover", path: "/discover" },
  { label: "Community", path: "/community" },
  { label: "Tourism", path: "/tourism" },
  { label: "Tribes", path: "/tribals" },
  { label: "MarketPlace", path: "/marketplace" },
  { label: "Gallery", path: "/gallery" }
];

interface NavbarProps {
  forceDarkText?: boolean;
  forceWhiteText?: boolean;
  fullTransparent?: boolean;
}

const Navbar = ({ forceDarkText = false, forceWhiteText = false, fullTransparent = true }: NavbarProps = {}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const getInitialLang = () => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      if (match[1] === "hi") return "Hindi";
    }
    return "English";
  };
  const [lang, setLang] = useState(getInitialLang());
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(localStorage.getItem('userAvatar'));

  useEffect(() => {
    const handleAvatarChange = () => {
      setUserAvatar(localStorage.getItem('userAvatar'));
    };
    window.addEventListener('userAvatarChanged', handleAvatarChange);
    return () => window.removeEventListener('userAvatarChanged', handleAvatarChange);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && !localStorage.getItem('userAvatar') && user.photoURL) {
        setUserAvatar(user.photoURL);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLanguageChange = (l: string) => {
    setLang(l);
    setLangOpen(false);

    const langMap: Record<string, string> = {
      "English": "en",
      "Hindi": "hi"
    };
    const langCode = langMap[l] || "en";

    // Set the cookie used by Google Translate
    const cookieVal = langCode === "en" ? "/en/en" : `/en/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/`;
    document.cookie = `googtrans=${cookieVal}; domain=.${window.location.host}; path=/`;

    // Reload the page to apply the translation natively
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (item: NavItem) => {
    if (item.label === "Home" && location.pathname === "/") return true;
    if (item.label === "About Us" && location.pathname === "/about-us") return true;
    if (item.label === "Districts" && location.pathname === "/districts") return true;
    if (item.label === "Discover" && (location.pathname === "/discover" || location.pathname === "/culture" || location.pathname === "/personalities")) return true;
    if (item.label === "Community" && (location.pathname === "/community" || location.pathname === "/Community")) return true;
    if (item.label === "MarketPlace" && (location.pathname === "/marketplace" || location.pathname === "/Marketplace")) return true;
    if (item.label === "Tourism" && location.pathname === "/tourism") return true;
    if (item.label === "Tribes" && location.pathname === "/tribals") return true;
    if (item.label === "Gallery" && location.pathname === "/gallery") return true;
    return false;
  };

  // Text/logo colour logic
  const useDarkText = scrolled || forceDarkText;

  return (
    <header className={`fixed top-0 left-0 w-full z-[200] transition-all duration-500 ${scrolled
        ? "bg-white/80 backdrop-blur-2xl shadow-md border-b border-black/5 py-2"
        : fullTransparent
          ? "bg-transparent py-3"
          : forceWhiteText
            ? "bg-black/30 backdrop-blur-sm py-3"
            : "bg-transparent py-3"
      }`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/">
            <img
              src={logo}
              alt="Bihar Darshan"
              className={`h-9 lg:h-11 w-auto object-contain transition-all duration-500 drop-shadow-md ${!scrolled && (forceWhiteText || !forceDarkText) ? "brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : ""
                }`}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-6">
          {navItems.map((item) => (
            <div key={item.label} className="relative shrink-0">
              <Link
                to={item.path}
                className={`relative flex items-center gap-1 text-[13px] 2xl:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${useDarkText
                    ? "text-black/70 hover:text-gold"
                    : "text-white/90 hover:text-gold"
                  } ${isActive(item) ? "text-gold" : ""}`}
              >
                {item.label}
                {isActive(item) && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-gold rounded-full" />
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Share Your Story Button */}
          <Link
            to="/share-story"
            className="hidden lg:block px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-95 duration-200 whitespace-nowrap"
          >
            Share your story
          </Link>

          {/* Language Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-2 px-4 h-9 rounded-xl border transition-all duration-300 font-semibold text-[11px] uppercase tracking-wider ${useDarkText
                  ? "border-black/10 text-black hover:bg-black/5"
                  : "border-white/15 text-white hover:bg-white/5"
                }`}
            >
              <Globe size={14} />
              {lang}
              <span className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}>▼</span>
            </button>

            {langOpen && (
              <div className="absolute top-full mt-2 right-0 w-32 bg-white dark:bg-zinc-900 border border-black/5 shadow-xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {["English", "Hindi"].map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={`w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${lang === l
                      ? "bg-gold text-black"
                      : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentUser ? (
            <Link
              to="/profile"
              className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${scrolled || forceDarkText
                ? "border-black/20 hover:border-black/40"
                : "border-white/20 hover:border-white/40"
                }`}
            >
              {userAvatar || currentUser.photoURL ? (
                <img src={(userAvatar || currentUser.photoURL)!} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className={scrolled || forceDarkText ? "text-black" : "text-white"} />
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className={`hidden lg:block px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-[11px] uppercase tracking-wider ${useDarkText ? "text-black hover:bg-black/5" : "text-white hover:bg-white/5"
                }`}
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`xl:hidden p-1 transition-colors ${useDarkText ? "text-black" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="xl:hidden absolute top-full left-4 right-4 mt-3 rounded-3xl bg-white dark:bg-black shadow-2xl border border-black/5 p-8 max-h-[80vh] overflow-y-auto z-[250]">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-bold transition-colors ${isActive(item) ? "text-gold" : "text-black/80 dark:text-white/90"
                    }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
              {currentUser ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-[#b8860b] text-black font-bold uppercase tracking-wider text-sm mt-4 shadow-lg shadow-gold/20"
                >
                  {userAvatar || currentUser.photoURL ? (
                    <img src={(userAvatar || currentUser.photoURL)!} alt="Profile" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User size={18} />
                  )}
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-[#b8860b] text-black font-bold uppercase tracking-wider text-sm mt-4 shadow-lg shadow-gold/20"
                >
                  Login
                </Link>
              )}

            <Link
              to="/share-story"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 rounded-2xl bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold text-center text-[15px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98] mt-2 block"
            >
              Share your story
            </Link>

            <div className="h-px bg-black/5 dark:bg-white/5 my-2" />
            <div className="flex gap-4">
              {["English", "Hindi"].map((l) => (
                <button
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  className={`text-sm font-bold uppercase tracking-wider ${lang === l ? "text-gold" : "text-black/40 dark:text-white/40"
                    }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
