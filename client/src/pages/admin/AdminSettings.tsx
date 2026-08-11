import { useState, useEffect } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import { Upload, Video, Image as ImageIcon, Loader2, Play, Trash2, RotateCcw, Check } from 'lucide-react';
import defaultHeroVideo from '../../assets/hero-video.mp4';

const AdminSettings = () => {
  const { siteSettings, updateSiteSettings, resetSection } = useAdminData();
  const [formData, setFormData] = useState(siteSettings);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hasLoadedInitial && siteSettings && (siteSettings.heroTitle || siteSettings.heroVideo || siteSettings.heroEyebrow)) {
      setFormData(siteSettings);
      setHasLoadedInitial(true);
    }
  }, [siteSettings, hasLoadedInitial]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(formData);
      showToast('Site settings updated successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showToast('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset site settings to default?")) {
      resetSection('siteSettings');
      showToast('Settings reset to default values.');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, WebM, etc.).');
      return;
    }

    try {
      setIsUploadingVideo(true);
      const res = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, heroVideo: res.secure_url }));
      showToast('Background video uploaded successfully!');
    } catch (err) {
      console.error('Video upload failed:', err);
      alert('Failed to upload video. Please check your network or paste a direct video URL.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const res = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, heroImage: res.secure_url }));
      showToast('Hero image poster uploaded successfully!');
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const currentVideoSrc = formData.heroVideo || defaultHeroVideo;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#EAB308] text-black font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="font-display font-bold text-3xl text-white tracking-tight">Site & Hero Customization</h1>
        <p className="text-white/50 mt-1 text-sm">
          Customize the background video, landing page text, eyebrow heading, title, description, statistics, and footer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Background Video Settings */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                <Video size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Hero Background Video</h2>
                <p className="text-xs text-white/50">Upload a custom MP4 video or paste a video URL to change the main hero background.</p>
              </div>
            </div>
            {formData.heroVideo && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, heroVideo: '' })}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 transition-all"
              >
                <Trash2 size={14} /> Clear Custom Video
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Controls / Inputs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Video Direct URL (MP4 / Cloudinary)</label>
                <input
                  type="text"
                  placeholder="https://example.com/video.mp4 or leave empty for default"
                  value={formData.heroVideo || ''}
                  onChange={e => setFormData({ ...formData, heroVideo: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EAB308]/50 placeholder:text-white/20"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#121216] px-3 text-white/40 font-medium">Or Upload Video File</span>
                </div>
              </div>

              <div>
                <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-[#EAB308]/60 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-6 text-center cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={isUploadingVideo}
                    className="hidden"
                  />
                  {isUploadingVideo ? (
                    <div className="flex flex-col items-center gap-2 text-[#EAB308]">
                      <Loader2 size={32} className="animate-spin" />
                      <span className="text-sm font-semibold">Uploading Video to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/70">
                      <div className="p-3 rounded-full bg-white/5 border border-white/10 text-[#EAB308]">
                        <Upload size={22} />
                      </div>
                      <span className="text-sm font-medium">Click to select video file</span>
                      <span className="text-xs text-white/40">Supports MP4, WebM, MOV</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Live Video Preview Box */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center justify-between">
                <span>Live Video Preview</span>
                <span className="text-[#EAB308] text-[10px] bg-[#EAB308]/10 px-2 py-0.5 rounded border border-[#EAB308]/20">
                  {formData.heroVideo ? 'Custom Video' : 'Default Asset'}
                </span>
              </label>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/80 border border-white/15 shadow-2xl group">
                <video
                  key={currentVideoSrc}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={currentVideoSrc} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Hero Section Copy & Text Settings */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2.5 rounded-xl bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
              <Play size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Hero Copy & Text Elements</h2>
              <p className="text-xs text-white/50">Edit the eyebrow tag, main title, highlighted subtitle, and main description paragraph.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Eyebrow Header Text</label>
              <input
                type="text"
                placeholder="The Cradle of Enlightenment. The Soul of Heritage."
                value={formData.heroEyebrow || ''}
                onChange={e => setFormData({ ...formData, heroEyebrow: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Main Hero Title (White Line)</label>
                <input
                  type="text"
                  placeholder="Unveil the Eternal Heritage of"
                  value={formData.heroTitle}
                  onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Hero Subtitle (Golden Highlight Text)</label>
                <input
                  type="text"
                  placeholder="Bihar"
                  value={formData.heroSubtitle}
                  onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAB308] font-bold focus:outline-none focus:border-[#EAB308]/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Hero Description Paragraph</label>
              <textarea
                value={formData.heroDescription}
                onChange={e => setFormData({ ...formData, heroDescription: e.target.value })}
                rows={3}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EAB308]/50 leading-relaxed resize-y"
              />
            </div>

            {/* Poster / Fallback Image */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon size={16} className="text-[#EAB308]" />
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Hero Poster Image (Fallback)</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Poster image URL (optional)"
                    value={formData.heroImage || ''}
                    onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white cursor-pointer transition-all">
                    <Upload size={14} />
                    <span>Upload Poster</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              {formData.heroImage && (
                <div className="mt-3 w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-black">
                  <img src={formData.heroImage} alt="Hero Poster Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Global Statistics */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
            Global Statistics & Counters
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Districts Count</label>
              <input
                type="text"
                value={formData.statDistricts}
                onChange={e => setFormData({ ...formData, statDistricts: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Years of History</label>
              <input
                type="text"
                value={formData.statPlaces}
                onChange={e => setFormData({ ...formData, statPlaces: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Festivals Count</label>
              <input
                type="text"
                value={formData.statFestivals}
                onChange={e => setFormData({ ...formData, statFestivals: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Stories Count</label>
              <input
                type="text"
                value={formData.statTourists}
                onChange={e => setFormData({ ...formData, statTourists: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
              />
            </div>
          </div>
        </div>

        {/* 4. Footer Section */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
            Footer Copy
          </h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">About Platform Text</label>
            <textarea
              value={formData.footerAbout}
              onChange={e => setFormData({ ...formData, footerAbout: e.target.value })}
              rows={3}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#EAB308]/50"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-red-400 font-semibold hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <RotateCcw size={16} /> Reset Defaults
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#EAB308] hover:bg-[#d9a307] text-black font-bold text-sm tracking-wide transition-all shadow-xl shadow-[#EAB308]/20 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
