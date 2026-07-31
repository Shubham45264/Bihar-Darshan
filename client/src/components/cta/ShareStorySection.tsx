import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import bgImg from "../../assets/cta-bg.png";

const ShareStorySection = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ marginBottom: 0 }}>
      {/* Full-width background — user-provided image with photographer and temple */}
      <img
        src={bgImg}
        alt="Share Your Story"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center" }}
        loading="lazy"
      />

      {/* Overlay to ensure text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Content wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center min-h-[220px] sm:min-h-[260px]">
          {/* Text + buttons */}
          <div className="w-full lg:w-1/2 py-10 sm:py-12 pl-0 lg:pl-48">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.2rem] text-white font-bold leading-snug mb-5 drop-shadow-md">
              Share Your Bihar Story
              <br />
              With the World
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/share-story" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-gold hover:bg-gold-dark text-black font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 cursor-pointer shadow-md">
                <PenLine size={15} />
                Share Your Story
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ShareStorySection;
