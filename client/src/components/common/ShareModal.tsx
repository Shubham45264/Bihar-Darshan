import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Copy, Check, Share2, Send, MessageCircle, Facebook, Twitter, Linkedin, Sparkles
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { API_BASE_URL } from '../../config/api';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  storyId?: string;
  onShareRecorded?: (updatedStory?: any) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  url,
  imageUrl,
  storyId,
  onShareRecorded,
}) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser ? currentUser.uid : 'guest';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const recordShareInBackend = async () => {
    if (!storyId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/stories/${storyId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success && data.data?.story) {
        if (onShareRecorded) {
          onShareRecorded(data.data.story);
        }
      }
    } catch (err) {
      console.error('Failed to record share:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Link copied to clipboard!');
    recordShareInBackend();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSocialClick = (shareUrl: string) => {
    recordShareInBackend();
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramClick = () => {
    navigator.clipboard.writeText(url);
    showToast('Link copied! Open Instagram to paste in DMs or Stories.');
    recordShareInBackend();
    setTimeout(() => {
      window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
    }, 800);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || `Check out this post on Bihar Darshan: ${title}`,
          url,
        });
        recordShareInBackend();
        showToast('Shared successfully!');
      } catch (err) {
        console.error('Native share aborted or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\nRead full post: ${url}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        {/* Toast Popup */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[10000] bg-[#1F1C18] text-[#D4A017] border border-[#D4A017]/40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold"
          >
            <Sparkles size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#191613] border border-[#D4A017]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white my-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D4A017]/15 border border-[#D4A017]/30 flex items-center justify-center text-[#D4A017]">
                <Send size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Share Post</h3>
                <p className="text-xs text-gray-400">Share with friends across social media</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Post Preview Snippet */}
          <div className="bg-[#24201A] border border-white/5 rounded-2xl p-3 mb-5 flex items-center gap-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 bg-neutral-800"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#D4A017]/20 flex items-center justify-center text-[#D4A017] shrink-0 font-bold text-xl">
                📖
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-gray-200 line-clamp-1">{title}</h4>
              {description && (
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{description}</p>
              )}
              <span className="text-[10px] text-[#D4A017] font-semibold block mt-1">
                Bihar Darshan
              </span>
            </div>
          </div>

          {/* Social Share Grid */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {/* WhatsApp */}
            <button
              onClick={() => handleSocialClick(whatsappUrl)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle size={20} className="fill-current" />
              </div>
              <span className="text-[11px] font-bold text-gray-300">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialClick(facebookUrl)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Facebook size={20} className="fill-current" />
              </div>
              <span className="text-[11px] font-bold text-gray-300">Facebook</span>
            </button>

            {/* X / Twitter */}
            <button
              onClick={() => handleSocialClick(twitterUrl)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Twitter size={20} className="fill-current" />
              </div>
              <span className="text-[11px] font-bold text-gray-300">X / Twitter</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleSocialClick(linkedinUrl)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Linkedin size={20} className="fill-current" />
              </div>
              <span className="text-[11px] font-bold text-gray-300">LinkedIn</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleSocialClick(telegramUrl)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Send size={18} className="fill-current ml-0.5" />
              </div>
              <span className="text-[11px] font-bold text-gray-300">Telegram</span>
            </button>

            {/* Instagram */}
            <button
              onClick={handleInstagramClick}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform font-bold text-xs">
                IG
              </div>
              <span className="text-[11px] font-bold text-gray-300">Instagram</span>
            </button>

            {/* Native Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="col-span-2 flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#D4A017]/10 hover:bg-[#D4A017]/20 border border-[#D4A017]/30 text-[#D4A017] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Share2 size={18} />
                  <span className="text-xs font-bold text-[#D4A017]">More Options</span>
                </div>
              </button>
            )}
          </div>

          {/* Copy Link Input Bar */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Direct Post URL
            </label>
            <div className="flex items-center gap-2 bg-[#24201A] border border-white/10 rounded-2xl p-1.5 pl-3">
              <input
                type="text"
                readOnly
                value={url}
                className="bg-transparent text-xs text-gray-300 w-full focus:outline-none font-mono truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[#D4A017] hover:bg-[#B8860B] text-black shadow-md'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareModal;
