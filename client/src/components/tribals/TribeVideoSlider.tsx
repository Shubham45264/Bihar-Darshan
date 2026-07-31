import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Upload, X, Film, CheckCircle2, AlertCircle, Video, Clock } from 'lucide-react';

export interface TribeVideoItem {
  id: string;
  caption: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  tribeId?: string;
  tribeName?: string;
  status?: string;
}

interface TribeVideoSliderProps {
  tribeId: string;
  tribeName: string;
}

// Initial curated videos per tribe
const DEFAULT_TRIBE_VIDEOS: Record<string, TribeVideoItem[]> = {
  default: [
    {
      id: 'demo-1',
      caption: 'Traditional Folk Dance & Rhythmic Drums Celebration',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      duration: '1:45',
    },
    {
      id: 'demo-2',
      caption: 'Ancient Bamboo Crafting & Handloom Artistry',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
      duration: '2:10',
    },
    {
      id: 'demo-3',
      caption: 'Sacred Grove (Sarna) Sarhul Festival Rituals',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      duration: '3:05',
    },
  ],
};

// ── Single Video Card with Hover Autoplay ────────────────────────────
interface TribeVideoCardProps {
  item: TribeVideoItem;
  idx: number;
  onClick: () => void;
}

const TribeVideoCard = ({ item, idx, onClick }: TribeVideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Autoplay prevented:', err);
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.06 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-[280px] sm:w-[320px] flex-shrink-0 group cursor-pointer"
    >
      {/* Simple Normal Video Card */}
      <div className="relative aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#D4A017]/30 hover:border-[#D4A017] transition-all duration-300">
        {/* Video element (autoplays on mouse hover) */}
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.thumbnail}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Play Icon Overlay (fades out smoothly when hovered & autoplaying) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-11 h-11 rounded-full bg-black/65 text-white flex items-center justify-center shadow border border-white/20">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        {item.duration && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-medium flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-[#D4A017]" />
            {item.duration}
          </div>
        )}

        {/* Caption Overlay ON Video Thumbnail */}
        <div className="absolute inset-x-0 bottom-0 p-3 pt-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <p className="text-xs font-medium text-white line-clamp-2 leading-snug">
            {item.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Video Slider Component ──────────────────────────────────────
const TribeVideoSlider = ({ tribeId, tribeName }: TribeVideoSliderProps) => {
  const [videos, setVideos] = useState<TribeVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<TribeVideoItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State (Video File + Caption)
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch videos from server & combine with default curated videos
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/v1/tribes/videos/approved?tribeId=${tribeId}&tribeName=${encodeURIComponent(tribeName)}`);
        const data = await res.json();
        const serverVideos: TribeVideoItem[] = data.success && data.data?.videos
          ? data.data.videos.map((v: any) => ({
              id: v.id,
              caption: v.caption || v.title || `${tribeName} Video`,
              videoUrl: v.videoUrl,
              thumbnail: v.thumbnail,
              duration: v.duration || '0:45',
            }))
          : [];

        const curatedFallback = DEFAULT_TRIBE_VIDEOS.default.map(v => ({
          ...v,
          caption: v.caption,
        }));

        setVideos([...serverVideos, ...curatedFallback]);
      } catch (err) {
        console.error('Error fetching tribe videos:', err);
        setVideos(DEFAULT_TRIBE_VIDEOS.default);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [tribeId, tribeName]);

  // Scroll controls
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Handle Video File Selection with strict 5MB limit
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadError('Invalid file format. Please upload a video file (MP4, WebM, MOV).');
      return;
    }

    // STRICT 5MB SIZE LIMIT VALIDATION
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`File size (${fileSizeMB} MB) exceeds the maximum limit of 5 MB. Please choose a smaller video file.`);
      setSelectedFile(null);
      setVideoPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
  };

  // Submit Video File + Caption for Admin Verification
  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!caption.trim()) {
      setUploadError('Please write a caption for the video.');
      return;
    }
    if (!selectedFile || !videoPreviewUrl) {
      setUploadError('Please select a video file under 5 MB.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Video = reader.result as string;

        const payload = {
          caption: caption.trim(),
          title: caption.trim(),
          videoUrl: base64Video,
          tribeId,
          tribeName,
        };

        const res = await fetch('http://localhost:5000/api/v1/tribes/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        setIsSubmitting(false);

        if (data.success) {
          setIsSuccess(true);
        } else {
          setUploadError(data.message || 'Failed to submit video. Please try again.');
        }
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setUploadError('An error occurred while uploading. Please try again.');
    }
  };

  const resetUploadForm = () => {
    setCaption('');
    setSelectedFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    setUploadError(null);
    setIsSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeUploadModal = () => {
    resetUploadForm();
    setIsUploadOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-14 px-4 lg:px-0 relative z-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-[#D4A017]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/30">
              <Film className="w-4 h-4 text-[#D4A017]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">
              Community Video Feed
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#451A03]">
            {tribeName} <span className="text-[#D4A017]">Videos</span>
          </h3>
        </div>

        {/* Upload Action Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E6B52F] to-[#D4A017] hover:from-[#F0C343] hover:to-[#E6B52F] text-[#3B2412] font-extrabold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Video className="w-4 h-4" />
          Upload Video (Max 5MB)
        </button>
      </div>

      {/* Slider Carousel Container */}
      <div className="relative group/carousel">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-10 h-10 rounded-full bg-[#FEF3C7] border-2 border-[#D4A017]/60 shadow-lg flex items-center justify-center text-[#B45309] hover:bg-[#D4A017] hover:text-[#3B2412] transition-all hover:scale-110 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-10 h-10 rounded-full bg-[#FEF3C7] border-2 border-[#D4A017]/60 shadow-lg flex items-center justify-center text-[#B45309] hover:bg-[#D4A017] hover:text-[#3B2412] transition-all hover:scale-110 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Video Cards with Hover Autoplay */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth py-2 px-1 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            <div className="w-full py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : videos.length > 0 ? (
            videos.map((item, idx) => (
              <TribeVideoCard
                key={item.id || idx}
                item={item}
                idx={idx}
                onClick={() => setSelectedVideo(item)}
              />
            ))
          ) : (
            <div className="w-full py-10 text-center bg-[#FFFBEB] rounded-2xl border border-[#D4A017]/20">
              <p className="text-[#582C12] text-sm font-medium">No videos available yet for {tribeName}. Upload the first video!</p>
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Video Lightbox Player Modal (Portalled to body)              */}
      {/* ──────────────────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl bg-[#120E0B] border border-[#D4A017]/30 rounded-2xl overflow-hidden shadow-2xl text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Video Player */}
                <div className="w-full aspect-video bg-black flex items-center justify-center">
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Caption Overlay Bar */}
                <div className="p-5 bg-[#120E0B] border-t border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#D4A017] font-bold uppercase tracking-wider">
                      {tribeName} Community Video
                    </span>
                    <p className="text-base font-serif font-bold text-white leading-snug">
                      {selectedVideo.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Upload Video Modal (Portalled to body)                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {isUploadOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={(e) => { if (e.target === e.currentTarget) closeUploadModal(); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-[#120E0B]/95 backdrop-blur-xl border border-[#D4A017]/30 rounded-3xl shadow-2xl p-6 sm:p-7 text-white"
              >
                {/* Close Button */}
                <button
                  onClick={closeUploadModal}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Success Notification */}
                {isSuccess ? (
                  <div className="py-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#D4A017] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-[#D4A017]" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">Video Submitted!</h3>
                    <p className="text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
                      Thank you! Your video clip has been sent for admin review. Once verified, it will appear directly on the video slider.
                    </p>
                    <button
                      onClick={closeUploadModal}
                      className="px-6 py-2.5 bg-[#D4A017] text-[#120E0B] font-extrabold rounded-xl hover:bg-[#E6B52F] transition-all cursor-pointer uppercase text-xs tracking-wider"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-5">
                      <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        <Video className="w-5 h-5 text-[#D4A017]" />
                        Upload Video for <span className="text-[#D4A017]">{tribeName}</span>
                      </h3>
                      <p className="text-xs text-white/60 mt-1">
                        Upload your video clip along with a short caption.
                      </p>
                    </div>

                    {/* Error Notification */}
                    {uploadError && (
                      <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmitVideo} className="space-y-4">
                      {/* Video File Picker with 5MB strict limit */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 mb-1.5 uppercase tracking-wider">
                          Video File (Max 5 MB) <span className="text-[#D4A017]">*</span>
                        </label>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                            selectedFile
                              ? 'border-[#D4A017] bg-[#D4A017]/10'
                              : 'border-[#D4A017]/30 bg-white/[0.02] hover:border-[#D4A017] hover:bg-white/[0.04]'
                          }`}
                        >
                          {videoPreviewUrl ? (
                            <div className="space-y-2">
                              <video
                                src={videoPreviewUrl}
                                className="w-full max-h-36 object-contain rounded-xl bg-black"
                                controls
                              />
                              <p className="text-xs text-[#D4A017] font-bold truncate">
                                ✓ {selectedFile?.name} ({(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB)
                              </p>
                              <p className="text-[10px] text-white/40">Click to pick a different video</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-10 h-10 rounded-full bg-[#D4A017]/15 border border-[#D4A017]/30 flex items-center justify-center text-[#D4A017]">
                                <Upload className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium text-white">
                                Click to choose video file
                              </p>
                              <p className="text-xs text-white/40">
                                MP4, WebM, MOV — <strong className="text-[#D4A017]">Under 5 MB</strong>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Caption Input */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 mb-1.5 uppercase tracking-wider">
                          Caption <span className="text-[#D4A017]">*</span>
                        </label>
                        <input
                          type="text"
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="Write a short caption for your video..."
                          className="w-full bg-white/[0.04] border border-white/10 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 text-sm placeholder:text-white/30"
                        />
                      </div>

                      <div className="text-[11px] text-white/50 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 text-center">
                        🔒 Uploaded videos go to admin review before appearing on the public slider.
                      </div>

                      {/* Submit Actions */}
                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={closeUploadModal}
                          className="px-4 py-2 text-white/70 hover:text-white font-semibold text-xs rounded-xl border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#E6B52F] to-[#D4A017] hover:from-[#F0C343] hover:to-[#E6B52F] text-[#3B2412] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#D4A017]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-[#3B2412]/30 border-t-[#3B2412] rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              Submit Video
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default TribeVideoSlider;
