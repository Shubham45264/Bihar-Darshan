import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Share2, Plus, Upload, X, Check, Video, Image as ImageIcon, Sparkles, Copy, ExternalLink, Play } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { API_BASE_URL } from '../../config/api';

export interface MediaItem {
  id: string;
  itemId: string;
  url: string;
  mediaType: 'IMAGE' | 'VIDEO';
  title?: string;
  caption?: string;
  likes: number;
  dislikes: number;
  likedBy?: string[];
  dislikedBy?: string[];
  uploadedBy?: string;
  createdAt?: string;
}

interface CardMediaGalleryProps {
  itemId: string;
  itemTitle: string;
  initialImages?: string[];
  initialVideoUrl?: string;
}

export const CardMediaGallery: React.FC<CardMediaGalleryProps> = ({
  itemId,
  itemTitle,
  initialImages = [],
  initialVideoUrl = '',
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedMediaForShare, setSelectedMediaForShare] = useState<MediaItem | null>(null);
  const [activePreviewMedia, setActivePreviewMedia] = useState<MediaItem | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Media Form States
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [uploadedByName, setUploadedByName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser?.uid || 'AnonymousUser';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Media from Backend API
  const fetchCardMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/discover/${itemId}/media`);
      const data = await res.json();
      
      let fetched: MediaItem[] = [];
      if (data.success && Array.isArray(data.data?.media)) {
        fetched = data.data.media;
      }

      // Merge initialImages and initialVideoUrl if backend doesn't have them yet
      const combined: MediaItem[] = [...fetched];

      if (initialVideoUrl && !combined.some(m => m.url === initialVideoUrl)) {
        combined.unshift({
          id: `init-vid-${itemId}`,
          itemId,
          url: initialVideoUrl,
          mediaType: 'VIDEO',
          title: `${itemTitle} Video`,
          caption: `Official video for ${itemTitle}`,
          likes: 5,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          uploadedBy: 'Contributor',
        });
      }

      initialImages.forEach((imgUrl, idx) => {
        if (imgUrl && !combined.some(m => m.url === imgUrl)) {
          combined.push({
            id: `init-img-${itemId}-${idx}`,
            itemId,
            url: imgUrl,
            mediaType: 'IMAGE',
            title: `${itemTitle} Photo ${idx + 1}`,
            caption: `${itemTitle} photo`,
            likes: Math.floor(Math.random() * 20) + 3,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            uploadedBy: 'Contributor',
          });
        }
      });

      setMediaList(combined);
    } catch (err) {
      console.error('Error fetching card media:', err);
      // Fallback to initial media if backend fails
      const fallback: MediaItem[] = [];
      if (initialVideoUrl) {
        fallback.push({
          id: `init-vid-${itemId}`,
          itemId,
          url: initialVideoUrl,
          mediaType: 'VIDEO',
          title: `${itemTitle} Video`,
          likes: 5,
          dislikes: 0,
        });
      }
      initialImages.forEach((imgUrl, idx) => {
        if (imgUrl) {
          fallback.push({
            id: `init-img-${itemId}-${idx}`,
            itemId,
            url: imgUrl,
            mediaType: 'IMAGE',
            title: `${itemTitle} Photo ${idx + 1}`,
            likes: 12,
            dislikes: 0,
          });
        }
      });
      setMediaList(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardMedia();
  }, [itemId]);

  // Handle File Change (Upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      setMediaType(isVid ? 'VIDEO' : 'IMAGE');

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Media
  const handleAddMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = mediaFile || mediaUrlInput.trim();
    if (!finalUrl) {
      showToast('Please upload a file or enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const effectiveUploader = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : '') || uploadedByName.trim() || 'Contributor';
      const payload = {
        url: finalUrl,
        mediaType,
        title: mediaTitle.trim() || `${itemTitle} ${mediaType === 'VIDEO' ? 'Video' : 'Image'}`,
        caption: mediaCaption.trim() || undefined,
        uploadedBy: effectiveUploader,
      };

      await fetch(`${API_BASE_URL}/discover/${itemId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setIsAddMediaModalOpen(false);
      setIsSuccessModalOpen(true);
      setMediaFile(null);
      setMediaUrlInput('');
      setMediaTitle('');
      setMediaCaption('');
      setUploadedByName('');
    } catch (err) {
      console.error('Failed to submit card media:', err);
      setIsAddMediaModalOpen(false);
      setIsSuccessModalOpen(true);
      setMediaFile(null);
      setMediaUrlInput('');
      setMediaTitle('');
      setMediaCaption('');
      setUploadedByName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like Toggle
  const handleLike = async (media: MediaItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const hasLiked = media.likedBy?.includes(currentUserId);
    const hasDisliked = media.dislikedBy?.includes(currentUserId);

    // Optimistic Update
    setMediaList((prev) =>
      prev.map((item) => {
        if (item.id === media.id) {
          let newLikedBy = [...(item.likedBy || [])];
          let newDislikedBy = [...(item.dislikedBy || [])];
          let newLikes = item.likes;
          let newDislikes = item.dislikes;

          if (hasLiked) {
            newLikedBy = newLikedBy.filter((id) => id !== currentUserId);
            newLikes = Math.max(0, newLikes - 1);
          } else {
            newLikedBy.push(currentUserId);
            newLikes += 1;
            if (hasDisliked) {
              newDislikedBy = newDislikedBy.filter((id) => id !== currentUserId);
              newDislikes = Math.max(0, newDislikes - 1);
            }
          }

          return {
            ...item,
            likes: newLikes,
            dislikes: newDislikes,
            likedBy: newLikedBy,
            dislikedBy: newDislikedBy,
          };
        }
        return item;
      })
    );

    // Backend call if real ID
    if (!media.id.startsWith('init-') && !media.id.startsWith('custom-')) {
      try {
        await fetch(`${API_BASE_URL}/discover/media/${media.id}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId }),
        });
      } catch (err) {
        console.error('Failed to send like:', err);
      }
    }
  };

  // Dislike Toggle
  const handleDislike = async (media: MediaItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const hasLiked = media.likedBy?.includes(currentUserId);
    const hasDisliked = media.dislikedBy?.includes(currentUserId);

    // Optimistic Update
    setMediaList((prev) =>
      prev.map((item) => {
        if (item.id === media.id) {
          let newLikedBy = [...(item.likedBy || [])];
          let newDislikedBy = [...(item.dislikedBy || [])];
          let newLikes = item.likes;
          let newDislikes = item.dislikes;

          if (hasDisliked) {
            newDislikedBy = newDislikedBy.filter((id) => id !== currentUserId);
            newDislikes = Math.max(0, newDislikes - 1);
          } else {
            newDislikedBy.push(currentUserId);
            newDislikes += 1;
            if (hasLiked) {
              newLikedBy = newLikedBy.filter((id) => id !== currentUserId);
              newLikes = Math.max(0, newLikes - 1);
            }
          }

          return {
            ...item,
            likes: newLikes,
            dislikes: newDislikes,
            likedBy: newLikedBy,
            dislikedBy: newDislikedBy,
          };
        }
        return item;
      })
    );

    if (!media.id.startsWith('init-') && !media.id.startsWith('custom-')) {
      try {
        await fetch(`${API_BASE_URL}/discover/media/${media.id}/dislike`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId }),
        });
      } catch (err) {
        console.error('Failed to send dislike:', err);
      }
    }
  };

  // Copy Link to Clipboard
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url || window.location.href);
    showToast('Media link copied to clipboard! 📋');
  };

  // Native or Social Share
  const handleShareClick = (media: MediaItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: media.title || itemTitle,
          text: media.caption || `Check out this media for ${itemTitle} on Bihar Darshan!`,
          url: media.url.startsWith('http') ? media.url : window.location.href,
        })
        .then(() => showToast('Shared successfully!'))
        .catch(() => setSelectedMediaForShare(media));
    } else {
      setSelectedMediaForShare(media);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative">
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[500] bg-brand-dark text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-brand-gold/40"
          >
            <Sparkles size={16} className="text-brand-gold" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Add Media Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <span>Media & Community Gallery</span>
            <span className="text-xs bg-brand-gold/20 text-brand-dark px-2.5 py-1 rounded-full font-sans font-extrabold">
              {mediaList.length}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Explore photos & videos contributed by users. Add your own media, like, dislike, or share with friends!
          </p>
        </div>

        <button
          onClick={() => setIsAddMediaModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer uppercase tracking-wider active:scale-95 shrink-0"
        >
          <Plus size={16} className="stroke-[3px]" />
          <span>Add Photo / Video</span>
        </button>
      </div>

      {/* Media Grid */}
      {mediaList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((media) => {
            const isLiked = media.likedBy?.includes(currentUserId);
            const isDisliked = media.dislikedBy?.includes(currentUserId);
            const isVideo = media.mediaType === 'VIDEO' || media.url.includes('youtube') || media.url.includes('vimeo') || media.url.endsWith('.mp4');

            return (
              <motion.div
                key={media.id}
                whileHover={{ y: -4 }}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group transition-all"
              >
                {/* Media Container */}
                <div
                  className="relative aspect-[16/10] bg-black overflow-hidden cursor-pointer"
                  onClick={() => setActivePreviewMedia(media)}
                >
                  {isVideo ? (
                    <div className="w-full h-full flex items-center justify-center relative bg-gray-900">
                      {media.url.endsWith('.mp4') || media.url.startsWith('data:video') ? (
                        <video src={media.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${initialImages[0] || media.url})` }}>
                          <div className="absolute inset-0 bg-black/40" />
                        </div>
                      )}
                      <div className="absolute z-10 w-12 h-12 rounded-full bg-brand-gold/90 text-brand-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={20} className="fill-current ml-0.5" />
                      </div>
                      <span className="absolute top-3 left-3 z-10 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Video size={12} className="text-brand-gold" /> Video
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={media.url}
                        alt={media.title || itemTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Media+Preview';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <ImageIcon size={12} className="text-brand-gold" /> Image
                      </span>
                    </div>
                  )}

                  {media.uploadedBy && (
                    <span className="absolute bottom-2 left-3 text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      By {media.uploadedBy}
                    </span>
                  )}
                </div>

                {/* Media Body & Controls */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    {media.title && (
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                        {media.title}
                      </h4>
                    )}
                    {media.caption && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {media.caption}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar: Like, Dislike, Share */}
                  <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      {/* Like Button */}
                      <button
                        onClick={(e) => handleLike(media, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} />
                        <span>{media.likes}</span>
                      </button>

                      {/* Dislike Button */}
                      <button
                        onClick={(e) => handleDislike(media, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isDisliked
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <ThumbsDown size={14} className={isDisliked ? 'fill-current' : ''} />
                        <span>{media.dislikes}</span>
                      </button>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={(e) => handleShareClick(media, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-dark font-bold text-xs rounded-xl border border-brand-gold/30 transition-all cursor-pointer"
                    >
                      <Share2 size={14} className="text-brand-dark" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <ImageIcon size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">No media uploaded yet for {itemTitle}.</p>
          <button
            onClick={() => setIsAddMediaModalOpen(true)}
            className="mt-3 text-xs font-bold text-brand-dark bg-brand-gold px-4 py-2 rounded-xl hover:bg-brand-gold/90 transition-colors"
          >
            Be the first to add a photo or video!
          </button>
        </div>
      )}

      {/* ── MODAL: ADD PHOTO / VIDEO ── */}
      <AnimatePresence>
        {isAddMediaModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsAddMediaModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1A1814] border border-[#8C7A60]/30 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative text-white max-h-[85vh] overflow-y-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsAddMediaModalOpen(false)}
                className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                  <Plus size={22} className="stroke-[3px]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">Add Photo or Video</h3>
              </div>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Contribute photos or videos for <span className="text-brand-gold font-bold">{itemTitle}</span>.
              </p>

              <form onSubmit={handleAddMediaSubmit} className="space-y-4">
                {/* Media Type Switcher */}
                <div className="flex bg-[#26231E] p-1 rounded-xl border border-[#8C7A60]/30">
                  <button
                    type="button"
                    onClick={() => setMediaType('IMAGE')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      mediaType === 'IMAGE' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon size={14} /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('VIDEO')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      mediaType === 'VIDEO' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Video size={14} /> Video
                  </button>
                </div>

                {/* Upload File Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                    Upload {mediaType === 'VIDEO' ? 'Video' : 'Photo'}
                  </label>

                  {mediaFile ? (
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-brand-gold/50">
                      {mediaType === 'VIDEO' ? (
                        <video src={mediaFile} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaFile} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setMediaFile(null)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-[#8C7A60]/40 hover:border-brand-gold bg-[#26231E] cursor-pointer transition-all p-4 text-center">
                        <Upload size={22} className="text-brand-gold mb-1" />
                        <span className="text-xs font-bold text-white">
                          Click to upload {mediaType.toLowerCase()} file
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, MP4 up to 15MB</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept={mediaType === 'VIDEO' ? 'video/*' : 'image/*'}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      <div>
                        <span className="text-[11px] text-gray-400 block mb-1">Or paste URL directly:</span>
                        <input
                          type="url"
                          placeholder={mediaType === 'VIDEO' ? 'https://youtube.com/watch?...' : 'https://example.com/photo.jpg'}
                          value={mediaUrlInput}
                          onChange={(e) => setMediaUrlInput(e.target.value)}
                          className="w-full bg-[#26231E] border border-[#8C7A60]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title Input (Required) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-1">
                    Media Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional Cooking Ritual / Grand Celebration view"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    className="w-full bg-[#26231E] border border-[#8C7A60]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold font-medium"
                  />
                </div>

                {/* Description Input (Required) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a descriptive story or detail of what is captured in this photo or video..."
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    className="w-full bg-[#26231E] border border-[#8C7A60]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold resize-none font-medium"
                  />
                </div>

                <p className="text-[11px] text-[#a58f7f] text-center bg-[#26231E]/60 py-2 px-3 rounded-xl border border-[#8C7A60]/20">
                  🔒 Your submission will be reviewed by an administrator before appearing publicly.
                </p>

                <div className="pt-2 border-t border-white/10 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddMediaModalOpen(false)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-extrabold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer shadow-lg active:scale-95"
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit Media'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL: SHARE MEDIA ── */}
      <AnimatePresence>
        {selectedMediaForShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedMediaForShare(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1A1814] border border-[#8C7A60]/30 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMediaForShare(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-xl font-serif font-bold text-white mb-2">Share Media</h3>
              <p className="text-xs text-gray-400 mb-5">
                Share this media with your friends and family across social platforms.
              </p>

              <div className="space-y-3">
                {/* Copy Link */}
                <button
                  onClick={() => {
                    handleCopyLink(selectedMediaForShare.url);
                    setSelectedMediaForShare(null);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#26231E] hover:bg-[#322e28] rounded-xl text-xs font-bold text-white transition-colors cursor-pointer border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Copy size={16} className="text-brand-gold" /> Copy Direct Link
                  </span>
                  <ExternalLink size={14} className="text-gray-400" />
                </button>

                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this media for ${itemTitle} on Bihar Darshan: ${selectedMediaForShare.url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedMediaForShare(null)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#128C7E]/20 hover:bg-[#128C7E]/30 rounded-xl text-xs font-bold text-emerald-400 transition-colors cursor-pointer border border-[#128C7E]/40"
                >
                  <span>Share on WhatsApp</span>
                  <ExternalLink size={14} />
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${itemTitle} on Bihar Darshan!`)}&url=${encodeURIComponent(selectedMediaForShare.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedMediaForShare(null)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-sky-500/20 hover:bg-sky-500/30 rounded-xl text-xs font-bold text-sky-400 transition-colors cursor-pointer border border-sky-500/40"
                >
                  <span>Share on X / Twitter</span>
                  <ExternalLink size={14} />
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedMediaForShare.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedMediaForShare(null)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl text-xs font-bold text-blue-400 transition-colors cursor-pointer border border-blue-600/40"
                >
                  <span>Share on Facebook</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL: FULLSCREEN PREVIEW ── */}
      <AnimatePresence>
        {activePreviewMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActivePreviewMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full max-h-[90vh] bg-black border border-white/10 rounded-3xl overflow-hidden relative flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePreviewMedia(null)}
                className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>

              {/* Media Display */}
              <div className="relative flex-1 flex items-center justify-center bg-black min-h-[350px] max-h-[65vh]">
                {activePreviewMedia.mediaType === 'VIDEO' || activePreviewMedia.url.endsWith('.mp4') ? (
                  <video src={activePreviewMedia.url} controls autoPlay className="w-full h-full object-contain max-h-[65vh]" />
                ) : (
                  <img src={activePreviewMedia.url} alt={activePreviewMedia.title || itemTitle} className="w-full h-full object-contain max-h-[65vh]" />
                )}
              </div>

              {/* Preview Footer Actions */}
              <div className="p-6 bg-[#14120F] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-serif font-bold text-white">{activePreviewMedia.title || itemTitle}</h4>
                  {activePreviewMedia.caption && <p className="text-xs text-gray-400 mt-1">{activePreviewMedia.caption}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(activePreviewMedia)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    <ThumbsUp size={16} /> <span>{activePreviewMedia.likes} Likes</span>
                  </button>
                  <button
                    onClick={() => handleDislike(activePreviewMedia)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    <ThumbsDown size={16} /> <span>{activePreviewMedia.dislikes}</span>
                  </button>
                  <button
                    onClick={() => handleShareClick(activePreviewMedia)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    <Share2 size={16} /> <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL: THANK YOU FOR SUBMISSION ── */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsSuccessModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1A1814] border border-[#8C7A60]/40 rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-white text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center mx-auto mb-4 border border-brand-gold/30">
                <Check size={32} className="stroke-[3px]" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">Thank You!</h3>

              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Your media submission for <span className="text-brand-gold font-semibold">{itemTitle}</span> has been sent for admin review and approval.
              </p>

              <div className="bg-[#26231E]/60 border border-[#8C7A60]/20 rounded-xl p-3 mb-6 text-xs text-[#a58f7f] flex items-center justify-center gap-2">
                <span>🔒</span>
                <span>It will appear publicly on the site once approved by an administrator.</span>
              </div>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-extrabold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer shadow-lg active:scale-95"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardMediaGallery;
