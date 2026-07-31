import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Newspaper, PenLine } from 'lucide-react';
import type { TribalArticle } from '../../data/tribalArticlesData';
import { useArticles } from '../../data/ArticlesContext';
import ShareStoryModal from './ShareStoryModal';
import ArticleDetailModal from './ArticleDetailModal';

interface LatestArticlesSectionProps {
  tribeName?: string;
}

/* ── Helpers ─────────────────────────────────────────────────────── */

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const formatDateShort = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
};

/* ── Shimmer Skeleton Card ───────────────────────────────────────── */

const SkeletonCard = () => (
  <div className="bg-[#FCEBD3]/60 rounded-2xl overflow-hidden border border-[#8B3E2F]/10 animate-pulse">
    <div className="flex justify-between items-center px-4 py-2 border-b border-[#8B3E2F]/10">
      <div className="h-3 w-24 bg-[#8B3E2F]/10 rounded" />
      <div className="h-3 w-16 bg-[#8B3E2F]/10 rounded" />
    </div>
    <div className="h-44 bg-[#8B3E2F]/8" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-full bg-[#8B3E2F]/10 rounded" />
      <div className="h-4 w-3/4 bg-[#8B3E2F]/10 rounded" />
      <div className="h-3 w-full bg-[#8B3E2F]/8 rounded" />
      <div className="h-3 w-5/6 bg-[#8B3E2F]/8 rounded" />
      <div className="flex justify-between pt-2">
        <div className="h-3 w-20 bg-[#8B3E2F]/8 rounded" />
        <div className="h-3 w-16 bg-[#8B3E2F]/8 rounded" />
      </div>
    </div>
  </div>
);

/* ── Article Card ────────────────────────────────────────────────── */

const ArticleCard = ({
  article,
  index,
  onReadMore,
}: {
  article: TribalArticle;
  index: number;
  onReadMore: (article: TribalArticle) => void;
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.article
      onClick={() => onReadMore(article)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: "50px" }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
      className="group bg-[#FFFBEB]/90 rounded-2xl overflow-hidden border border-[#D4A017]/25 hover:border-[#D4A017] transition-all duration-500 flex flex-col hover:-translate-y-1.5 hover:shadow-[0_8px_30px_-8px_rgba(212,160,23,0.3)] cursor-pointer"
    >
      {/* Top Source Bar */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#D4A017]/20 bg-[#FEF3C7]/80">
        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-[#B45309]">
          {article.author}
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-[#B45309]/80 uppercase">
          {formatDate(article.publishedDate)}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[#FEF3C7]">
        {!imgLoaded && (
          <div className="absolute inset-0 tribal-articles-shimmer" />
        )}
        <img
          src={article.image}
          alt={article.headline}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = '/images/tribals/generic.png';
            setImgLoaded(true);
          }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-[15px] leading-snug font-serif font-bold text-[#451A03] group-hover:text-[#D4A017] transition-colors mb-2 line-clamp-3">
          {article.headline}
        </h3>

        <p className="text-[13px] text-[#582C12] leading-relaxed line-clamp-3 mb-4 flex-grow font-medium">
          {article.description}
        </p>

        {/* Meta Row */}
        <div className="flex items-center gap-3 text-[11px] text-[#B45309]/80 mb-3 font-medium border-t border-[#D4A017]/15 pt-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#D4A017]" />
            {formatDateShort(article.publishedDate)}
          </span>
          <span className="text-[#D4A017]/30">|</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D4A017]" />
            {article.readTime} min read
          </span>
        </div>

        {/* Read More */}
        <span
          className="inline-flex items-center text-[#B45309] group-hover:text-[#D4A017] text-sm font-bold tracking-wide transition-all group/link"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
        </span>
      </div>
    </motion.article>
  );
};

/* ── Empty State ─────────────────────────────────────────────────── */

const EmptyState = ({ tribeName, onContribute }: { tribeName?: string, onContribute: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 px-6 bg-[#FFFBEB]/90 rounded-3xl border border-[#D4A017]/30"
  >
    <div className="w-16 h-16 rounded-full bg-[#D4A017]/15 border border-[#D4A017]/30 flex items-center justify-center mx-auto mb-4">
      <Newspaper className="w-7 h-7 text-[#D4A017]" />
    </div>
    <h3 className="text-xl font-serif font-bold text-[#451A03] mb-2">No Articles Yet</h3>
    <p className="text-[#582C12] text-sm max-w-md mx-auto mb-6 font-medium">
      {tribeName
        ? `Stories and articles about the ${tribeName} will appear here. Be the first to share!`
        : "Stories and articles about Bihar's tribal communities will appear here soon."}
    </p>
    <button
      onClick={onContribute}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E6B52F] to-[#D4A017] hover:from-[#F0C343] hover:to-[#E6B52F] text-[#3B2412] font-extrabold text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <PenLine className="w-4 h-4" />
      Contribute an Article
    </button>
  </motion.div>
);

/* ── Main Section ────────────────────────────────────────────────── */

const LatestArticlesSection = ({ tribeName }: LatestArticlesSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<TribalArticle | null>(null);
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  const { articles: globalArticles } = useArticles();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const articles: TribalArticle[] = useMemo(() => {
    if (tribeName) {
      // Filter the global state rather than the static file
      const filtered = globalArticles.filter(
        (article) => article.tribe.toLowerCase() === tribeName.toLowerCase()
      );
      return filtered;
    }
    return globalArticles;
  }, [tribeName, globalArticles]);

  const displayArticles = articles.slice(0, 4);
  const subtitle = tribeName
    ? `Stories, news & insights about the ${tribeName.replace(' Tribe', '')} tribe and their way of life.`
    : "Stories, news & insights about Bihar's indigenous tribes and their way of life.";

  const handleReadMore = (article: TribalArticle) => {
    setSelectedArticle(article);
    setIsArticleOpen(true);
  };

  return (
    <>
      <section className="px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto py-16 sm:py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Decorative Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 border border-[#D4A017]/30 flex items-center justify-center shadow-sm">
              <Newspaper className="w-5 h-5 text-[#D4A017]" />
            </div>
          </div>

          {/* Title with decorative lines */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
              <div className="w-12 sm:w-20 h-px bg-[#D4A017]/40" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#451A03] tracking-[0.12em] uppercase font-bold">
              Latest Articles
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-12 sm:w-20 h-px bg-[#D4A017]/40" />
              <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#582C12] max-w-2xl mx-auto italic font-medium">
            {subtitle}
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayArticles.length === 0 ? (
          <EmptyState tribeName={tribeName} onContribute={() => setIsModalOpen(true)} />
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
            >
              {/* View All Articles */}
              <button className="group inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-[#D4A017] text-[#B45309] font-bold text-sm tracking-wider uppercase hover:bg-[#D4A017] hover:text-[#3B2412] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                View All Articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Contribute an Article */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E6B52F] to-[#D4A017] hover:from-[#F0C343] hover:to-[#E6B52F] text-[#3B2412] font-extrabold text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                Contribute an Article
              </button>
            </motion.div>
          </>
        )}
      </section>

      {/* Write Article Modal */}
      <ShareStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTribe={tribeName}
      />

      {/* Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={isArticleOpen}
        onClose={() => {
          setIsArticleOpen(false);
          setSelectedArticle(null);
        }}
      />
    </>
  );
};

export default LatestArticlesSection;
