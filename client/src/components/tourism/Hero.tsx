import { motion } from "framer-motion";
import tourismMain from "../../assets/tourism main.png";

const Hero = () => {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex flex-col pt-28 sm:pt-36 pb-16 md:pb-0 justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={tourismMain}
          alt="Bihar Tourism"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10 flex flex-col h-full justify-center mt-0 md:mt-[-8vh]">
        {/* Main Content */}
        <div className="w-full md:w-3/5 lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-gold uppercase tracking-[0.25em] text-xs font-bold mb-4 sm:mb-6 block font-sans">
              EXPLORE THE SOUL OF BIHAR
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-4 sm:mb-6">
              Discover Bihar's <span className="text-[#EAB308]">Tourism</span>
            </h1>

            <p className="text-white/85 text-base sm:text-lg md:text-xl max-w-md mb-8 sm:mb-10 font-medium leading-relaxed">
              From ancient temples to peaceful riversides, Bihar welcomes you with stories, spirituality and culture.
            </p>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
