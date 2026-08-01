import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Image as ImageIcon, Video, Users, MapPin } from "lucide-react";
import heroImg from "../../assets/gallery-hero.png";

interface GalleryHeroProps {
  stats?: {
    images: number;
    videos: number;
    contributors: number;
    districts: number;
  };
}

const GalleryHero = ({ stats = { images: 0, videos: 0, contributors: 0, districts: 0 } }: GalleryHeroProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] md:min-h-[85vh] w-full flex flex-col pt-32 pb-24 md:pb-0 justify-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src={heroImg}
          alt="Bihar Heritage Gallery"
          className="absolute inset-0 w-full h-full object-cover scale-110"
          loading="eager"
        />
      </motion.div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Soft golden vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(212,160,23,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Decorative top line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-14 h-px bg-brand-gold mx-auto mb-6"
          />

          {/* Heading */}
          <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white tracking-tight mb-4">
            Visual Archive of <span className="text-[#EAB308]">Bihar</span>
          </h1>

          {/* Ornament */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mt-5 mb-7"
          >
            <div className="w-10 h-px bg-brand-gold/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/70" />
            <div className="w-10 h-px bg-brand-gold/50" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10 drop-shadow"
          >
            A visual ode to sacred monuments, timeless architecture, and the everyday beauty of Bihar.
          </motion.p>

          {/* Stats — warm card style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 w-full max-w-2xl mx-auto"
          >
            {[
              { icon: ImageIcon, label: "Images", value: stats.images },
              { icon: Video, label: "Videos", value: stats.videos },
              { icon: Users, label: "Contributors", value: stats.contributors },
              { icon: MapPin, label: "Districts", value: stats.districts },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-brand-gold/20 shadow-sm hover:bg-white/90 transition-colors"
              >
                <stat.icon size={18} className="text-brand-gold mb-2" />
                <span className="text-xl font-bold text-gray-900 mb-0.5">{stat.value}+</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GalleryHero;
