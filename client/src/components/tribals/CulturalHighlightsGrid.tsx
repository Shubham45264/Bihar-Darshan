import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/* ────────────────────────────────────────────────────────────── */
/*  Types                                                        */
/* ────────────────────────────────────────────────────────────── */

export interface CultureCard {
  image: string;
  title: string;
  description: string;
}

export interface CultureSection {
  /** Section heading e.g. "Traditions & Culture" */
  heading: string;
  cards: CultureCard[];
}

interface TribeCulturalSectionsProps {
  sections: CultureSection[];
}

/* ────────────────────────────────────────────────────────────── */
/*  Horizontal Carousel                                          */
/* ────────────────────────────────────────────────────────────── */

const CardCarousel = ({ cards, onCardClick }: { cards: CultureCard[], onCardClick: (card: CultureCard) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  return (
    <div className="relative group/carousel px-2 py-4 -my-4">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-12 h-12 rounded-full bg-[#FEF3C7] border-2 border-[#D4A017]/60 shadow-[0_4px_20px_rgba(212,160,23,0.25)] flex items-center justify-center text-[#B45309] hover:bg-[#D4A017] hover:text-[#3B2412] hover:border-[#D4A017] hover:scale-110 transition-all duration-300 ${
          canScrollLeft ? 'opacity-100 md:opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-12 h-12 rounded-full bg-[#FEF3C7] border-2 border-[#D4A017]/60 shadow-[0_4px_20px_rgba(212,160,23,0.25)] flex items-center justify-center text-[#B45309] hover:bg-[#D4A017] hover:text-[#3B2412] hover:border-[#D4A017] hover:scale-110 transition-all duration-300 ${
          canScrollRight ? 'opacity-100 md:opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      {/* Cards row */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth py-4 px-2 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ y: -8 }}
            onClick={() => onCardClick(card)}
            className="min-w-[280px] max-w-[300px] flex-shrink-0 group cursor-pointer relative rounded-2xl bg-[#FFFBEB]/90 backdrop-blur-md border border-[#D4A017]/25 p-3 pb-5 shadow-sm hover:shadow-[0_15px_35px_rgba(212,160,23,0.25)] hover:bg-[#FFFBEB] hover:border-[#D4A017] transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FEF3C7] border border-[#D4A017]/20 mb-5 shadow-inner">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => { e.currentTarget.src = '/images/tribals/generic.png'; }}
              />
              {/* Subtle overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#451A03]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Text Content */}
            <div className="px-2 relative z-10">
              <h5 className="text-[1.05rem] font-bold text-[#451A03] mb-2 font-serif leading-snug group-hover:text-[#D4A017] transition-colors duration-300">
                {card.title}
              </h5>
              <p className="text-[0.9rem] text-[#582C12] leading-relaxed line-clamp-3 font-medium">
                {card.description}
              </p>
            </div>
            
            {/* Decorative hover glow line at the bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-gradient-to-r from-transparent via-[#D4A017] to-transparent group-hover:w-4/5 transition-all duration-500 rounded-b-2xl opacity-0 group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────── */
/*  Main Component                                                */
/* ────────────────────────────────────────────────────────────── */

const TribeCulturalSections = ({ sections }: TribeCulturalSectionsProps) => {
  const [selectedCard, setSelectedCard] = useState<CultureCard | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedCard]);

  return (
    <>
      <div className="space-y-16">
        {sections.map((section, idx) => (
          <motion.div
            key={section.heading}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            {/* Section heading */}
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-lg font-serif font-bold text-[#451A03] uppercase tracking-[0.2em] whitespace-nowrap">
                {section.heading}
              </h3>
              <div className="flex-1 h-px bg-[#D4A017]/30" />
            </div>

            {/* Carousel */}
            <CardCarousel cards={section.cards} onCardClick={setSelectedCard} />
          </motion.div>
        ))}
      </div>

      {/* Modal / Lightbox */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-[#FFFBEB] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#D4A017]/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-3/5 aspect-square md:aspect-auto md:min-h-[60vh] bg-[#FEF3C7] relative">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/tribals/generic.png'; }}
                />
              </div>

              {/* Content Section */}
              <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center bg-[url('/images/tribals/parchment_bg.png')] bg-cover bg-center">
                <div className="w-12 h-1 bg-[#D4A017] mb-6 rounded-full" />
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#451A03] mb-4 leading-tight">
                  {selectedCard.title}
                </h2>
                <p className="text-lg text-[#582C12] leading-relaxed font-medium">
                  {selectedCard.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TribeCulturalSections;
