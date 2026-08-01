import { motion } from "framer-motion";
import { Landmark, Map, Compass, Hourglass, Sparkles, BookOpen } from "lucide-react";
import heroVideo from "../../assets/hero-video.mp4";
import type { SiteSettings } from "../../data/AdminContext";

interface HeroSectionProps {
  settings?: SiteSettings;
}

const HeroSection = ({ settings }: HeroSectionProps) => {
  return (
    <section id="home" className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-28 lg:pt-36 pb-12 bg-black">
      {/* Background Video with Enhanced Brightness & Saturation */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.88] contrast-[1.08] saturate-[1.12]"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Lightweight Cinematic Gradient (Left Text Readability without Pitch Darkness) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-[1]" />

      {/* ── Radiant Golden Sunbeam Glow Overlay (Right Side) ── */}
      <div className="absolute top-[-5%] right-[5%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#F59E0B]/25 via-[#D4A017]/15 to-transparent blur-[140px] pointer-events-none z-[2]" />

      {/* ── Soft Atmospheric Smoky Vignette on Left Corner ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse at 10% 45%, rgba(0,0,0,0.65) 0%, rgba(15,11,8,0.4) 40%, transparent 80%)'
        }}
      />

      {/* Animated Floating Golden Smoke Aura behind Left Text */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1.05, 1],
          opacity: [0.4, 0.65, 0.45, 0.4],
          x: [-15, 25, -10, -15],
          y: [-10, 15, -5, -10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[18%] left-[-5%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-[#D4A017]/30 via-[#EAB308]/20 to-transparent blur-[100px] pointer-events-none z-[3]"
      />

      {/* Soft Whispering White Smoke Mist Overlay */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1.1, 1, 1.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[8%] left-[2%] w-[480px] h-[480px] rounded-full bg-white/10 blur-[120px] mix-blend-overlay pointer-events-none z-[3]"
      />

      {/* Hero Content Container */}
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-5xl text-left"
        >
          {/* Eyebrow Header */}
          <div className="flex items-center gap-2.5 text-[#D4A017] uppercase tracking-[0.2em] text-xs sm:text-sm font-bold font-sans mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Landmark size={18} className="text-[#D4A017] shrink-0" />
            <span>The Cradle of Enlightenment. The Soul of Heritage.</span>
          </div>

          {/* Main Title (Strict 2-Line Arrangement with Crisp Shadow) */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[76px] text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
            <span className="block whitespace-nowrap">
              {settings ? settings.heroTitle : "Unveil the Eternal Heritage of"}
            </span>
            <span className="block text-[#D4A017] text-5xl sm:text-7xl md:text-8xl lg:text-[105px] font-extrabold mt-1 font-display drop-shadow-[0_4px_20px_rgba(212,160,23,0.4)]">
              {settings ? settings.heroSubtitle : "Bihar"}
            </span>
          </h1>

          {/* Decorative Divider */}
          <div className="flex items-center gap-3 my-6 max-w-sm">
            <div className="h-[1px] w-24 bg-gradient-to-r from-[#D4A017] to-transparent" />
            <div className="text-[#D4A017] text-xs opacity-90">❖</div>
            <div className="h-[1px] w-24 bg-gradient-to-l from-[#D4A017] to-transparent" />
          </div>

          {/* Description */}
          <p className="text-white/90 text-base sm:text-lg max-w-xl font-sans leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
            {settings ? settings.heroDescription : "Step into a timeless realm of sacred landmarks, living traditions, authentic flavors, and enduring stories."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12 sm:mb-16">
            <a
              href="/discover"
              className="px-7 py-3.5 rounded-xl bg-[#D4A017] hover:bg-[#E6B52F] text-[#1A110B] font-extrabold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(212,160,23,0.45)] hover:shadow-[0_0_35px_rgba(212,160,23,0.7)] flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <Compass size={18} /> Begin the Journey
            </a>
            <a
              href="/districts"
              className="px-7 py-3.5 rounded-xl border border-white/50 hover:border-white text-white hover:bg-white/15 font-semibold text-sm tracking-wide transition-all backdrop-blur-md shadow-lg flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <Map size={18} /> Explore Districts
            </a>
          </div>

          {/* Bottom Floating Stats Bar */}
          <div className="pt-6 border-t border-white/20 max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017] shrink-0 backdrop-blur-sm">
                <Landmark size={20} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white leading-tight drop-shadow">38</p>
                <p className="text-white/70 text-xs font-sans">Districts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017] shrink-0 backdrop-blur-sm">
                <Hourglass size={20} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white leading-tight drop-shadow">5000+</p>
                <p className="text-white/70 text-xs font-sans">Years of History</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017] shrink-0 backdrop-blur-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white leading-tight drop-shadow">100+</p>
                <p className="text-white/70 text-xs font-sans">Festivals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017] shrink-0 backdrop-blur-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white leading-tight drop-shadow">Countless</p>
                <p className="text-white/70 text-xs font-sans">Stories</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
