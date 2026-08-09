import { motion } from "framer-motion";
import { User, ShieldCheck, Heart, Leaf, Calendar, Navigation, Bus, Briefcase } from "lucide-react";
import bodhGayaImage from "../../assets/bodh-gaya.png";

const TravelGuide = () => {
  return (
    <section className="py-12 sm:py-20 bg-[#F8F5EF]">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 items-start">
          
          {/* Left Side: Why Visit Bihar? */}
          <div className="w-full lg:w-[35%]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-3 sm:mb-4"
            >
              <span className="text-[#c19a5b] text-[11px] font-bold uppercase tracking-[0.2em]">
                WHY VISIT BIHAR?
              </span>
              <div className="hidden md:block h-[2px] w-12 bg-[#c19a5b]" />
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base text-[#4e342e] mb-6 sm:mb-8 leading-relaxed max-w-sm"
            >
              Bihar is not just a destination, it's an emotion. 
              A blend of spirituality, heritage, nature, and warm hospitality.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-4 sm:gap-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 flex items-center justify-center text-[#c19a5b] mt-0.5">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[#3e2723] font-medium text-sm">Ancient heritage & spiritual sites</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 flex items-center justify-center text-[#c19a5b] mt-0.5">
                  <User size={20} />
                </div>
                <span className="text-[#3e2723] font-medium text-sm">Rich culture and festivals</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 flex items-center justify-center text-[#c19a5b] mt-0.5">
                  <Leaf size={20} />
                </div>
                <span className="text-[#3e2723] font-medium text-sm">Peaceful rivers & scenic beauty</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 flex items-center justify-center text-[#c19a5b] mt-0.5">
                  <Heart size={20} />
                </div>
                <span className="text-[#3e2723] font-medium text-sm">Warm, respectful local communities</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Travel Guide Card */}
          <div className="w-full lg:w-[65%]">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[#f2ece1] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm"
            >
              {/* Guide Content */}
              <div className="p-6 sm:p-10 md:w-1/2 flex flex-col">
                <h3 className="text-2xl font-serif text-[#3e2723] mb-8">Travel Guide</h3>
                
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-[#c19a5b]/40 flex items-center justify-center text-[#c19a5b] shrink-0 mt-1">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3e2723]">Best Time to Visit</h4>
                      <p className="text-[11px] text-[#5d4037] mt-1">October to March is ideal for pleasant weather.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-[#c19a5b]/40 flex items-center justify-center text-[#c19a5b] shrink-0 mt-1">
                      <Navigation size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3e2723]">How to Reach</h4>
                      <p className="text-[11px] text-[#5d4037] mt-1">Well connected by air, train and road.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-[#c19a5b]/40 flex items-center justify-center text-[#c19a5b] shrink-0 mt-1">
                      <Bus size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3e2723]">Local Transport</h4>
                      <p className="text-[11px] text-[#5d4037] mt-1">Taxis, auto-rickshaws and guided tours available.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-[#c19a5b]/40 flex items-center justify-center text-[#c19a5b] shrink-0 mt-1">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3e2723]">Travel Tips</h4>
                      <p className="text-[11px] text-[#5d4037] mt-1">Carry comfortable clothes and respect local culture.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide Image */}
              <div className="h-64 md:h-auto md:w-1/2 relative p-4 pl-0">
                <img 
                  src={bodhGayaImage} 
                  alt="Buddha Statue Bodh Gaya" 
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x500?text=Travel+Guide'; }}
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TravelGuide;
