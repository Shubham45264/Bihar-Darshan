import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Camera, MapPin, Sparkles, User, Tag, FileText, Upload, CheckCircle2, Heart, Send, X, Plus, ArrowLeft } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import heroBg from "../assets/hero.png";
import "./ShareStory.css";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const BIHAR_DISTRICTS = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur",
  "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad",
  "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura",
  "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia",
  "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi",
  "Siwan", "Supaul", "Vaishali", "West Champaran"
].sort();

interface SubCategory {
  id: string;
  title: string;
  slug: string;
  image?: string;
}

interface Category {
  id: string;
  title: string;
  slug: string;
  image?: string;
  subcategories: SubCategory[];
}

interface MediaItem {
  id: string;
  url: string;
  type: 'photo' | 'video';
  name: string;
}

const ShareStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic Categories from Backend
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string>('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [personName, setPersonName] = useState('');
  const [district, setDistrict] = useState('Patna');

  // Media upload state (Up to 3 photos/videos)
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill logged in user account name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || user.email?.split('@')[0] || '';
        setPersonName(name);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Categories from Backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/categories?status=APPROVED');
        const data = await res.json();
        if (data.success && data.data?.categories) {
          const cats = data.data.categories as Category[];
          setCategoriesList(cats);

          // Check if category is passed via URL or state
          const searchParams = new URLSearchParams(location.search);
          const catParam = searchParams.get('category');
          if (catParam) {
            const matched = cats.find(
              (c) => c.title.toLowerCase() === catParam.toLowerCase() || c.slug === catParam
            );
            if (matched) {
              setSelectedCatId(matched.id);
              if (matched.subcategories.length > 0) {
                setSelectedSubId(matched.subcategories[0].id);
              }
              return;
            }
          }

          if (cats.length > 0) {
            setSelectedCatId(cats[0].id);
            if (cats[0].subcategories.length > 0) {
              setSelectedSubId(cats[0].id ? cats[0].subcategories[0]?.id || '' : '');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching categories in ShareStory:', err);
      }
    };

    fetchCategories();
  }, [location]);

  // Selected Category & Available Subcategories
  const selectedCategoryObj = categoriesList.find((c) => c.id === selectedCatId);
  const availableSubcategories = selectedCategoryObj ? selectedCategoryObj.subcategories : [];

  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = categoriesList.find((c) => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubId(cat.subcategories[0].id);
    } else {
      setSelectedSubId('');
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (mediaList.length >= 3) {
      setErrors((prev) => ({ ...prev, media: "Maximum 3 media files can be uploaded." }));
      return;
    }

    const availableSlots = 3 - mediaList.length;
    const filesToProcess = fileArray.slice(0, availableSlots);

    if (fileArray.length > availableSlots) {
      setErrors((prev) => ({ ...prev, media: `Only up to 3 files allowed. Processed first ${availableSlots} files.` }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.media;
        return copy;
      });
    }

    filesToProcess.forEach(async (file) => {
      const isVideo = file.type.startsWith("video/");
      try {
        const uploadRes = await uploadToCloudinary(file);
        const newMediaItem: MediaItem = {
          id: uploadRes.public_id || Math.random().toString(36).substring(2, 9),
          url: uploadRes.secure_url,
          type: isVideo ? "video" : "photo",
          name: file.name,
        };
        setMediaList((prev) => {
          if (prev.length >= 3) return prev;
          return [...prev, newMediaItem];
        });
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        alert("Failed to upload file to Cloudinary");
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value to allow re-uploading same file if removed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeMediaItem = (id: string) => {
    setMediaList((prev) => prev.filter((item) => item.id !== id));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.media;
      return copy;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedCatId) newErrors.category = "Please select a Category";
    if (!selectedSubId && availableSubcategories.length > 0) newErrors.subcategory = "Please select a Subcategory";
    if (!caption.trim() && !title.trim()) newErrors.caption = "Title or description is required";
    if (mediaList.length === 0) newErrors.media = "Please upload at least 1 photo or video (max 3)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formattedMediaFiles = mediaList.map((item) => ({
        url: item.url,
        type: item.type === 'video' ? 'VIDEO' : 'IMAGE',
      }));

      const userAvatar = localStorage.getItem('userAvatar') || null;
      const currentUser = auth.currentUser;
      const effectiveAuthorName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : '') || personName.trim() || 'Bihar Explorer';

      const payload = {
        title: title.trim() || caption.trim().slice(0, 60),
        content: caption.trim() || title.trim(),
        mediaUrl: formattedMediaFiles[0]?.url || '',
        mediaType: formattedMediaFiles[0]?.type || 'IMAGE',
        mediaFiles: formattedMediaFiles,
        authorName: effectiveAuthorName,
        authorAvatar: userAvatar || null,
        district,
        categoryId: selectedCatId,
        subcategoryId: selectedSubId,
      };

      const res = await fetch('http://localhost:5000/api/v1/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitting(false);
        setIsSuccess(true);
        window.dispatchEvent(new Event('submissionCreated'));
        window.dispatchEvent(new Event('storage'));
      } else {
        setIsSubmitting(false);
        setErrors({ submit: data.message || "Failed to submit story. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrors({ submit: "An error occurred while saving your submission. Please try again." });
    }
  };

  return (
    <div className="share-story-page-wrapper" style={{ backgroundImage: `url(${heroBg})` }}>
      {/* Decorative Heritage Background Mandalas */}
      <div className="bg-decor bg-decor-left">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="45" strokeWidth="0.3" strokeDasharray="1,1" />
          <circle cx="50" cy="50" r="35" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="22" strokeWidth="0.6" />
          <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18 18 L 82 82 M 18 82 L 82 18" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="bg-decor bg-decor-right">
        <svg viewBox="0 0 100 120" fill="none" stroke="currentColor">
          <path d="M 10 110 L 90 110 L 80 80 L 20 80 Z" strokeWidth="0.4" />
          <path d="M 25 80 L 75 80 L 65 50 L 35 50 Z" strokeWidth="0.4" />
          <path d="M 38 50 L 62 50 L 50 15 Z" strokeWidth="0.4" />
          <line x1="50" y1="15" x2="50" y2="5" strokeWidth="0.8" />
          <circle cx="50" cy="5" r="2.5" fill="currentColor" />
        </svg>
      </div>

      <Navbar forceWhiteText={true} />

      <main className="share-story-content-container">
        <div className="share-story-card-panel relative">
          {/* Back Navigation Button */}
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-[#D4A017] hover:border-[#D4A017]/30 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer mb-6 sm:absolute sm:top-8 sm:left-8 sm:mb-0 group shadow-md"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <div className="share-story-form-section animate-slide-down">
            <div className="form-header-center">
              <div className="share-story-decor-badge">
                <Camera className="gold-icon" size={20} />
              </div>
              <h2 className="share-story-form-title-main">
                Share Your <span className="gold-text">Story</span>
              </h2>
              <div className="heritage-divider">
                <span className="divider-line"></span>
                <span className="divider-motif">✦</span>
                <span className="divider-line"></span>
              </div>
              <p className="share-story-form-subtitle">
                Showcase the beauty, flavours and traditions of Bihar through your lens. <Heart size={13} fill="#D4A017" className="gold-heart-inline" />
              </p>
            </div>

            {errors.submit && (
              <div className="form-control form-control-error" style={{ marginBottom: "24px", background: "rgba(217, 56, 56, 0.1)", color: "#f78888", border: "1px solid #d93838", padding: "12px", borderRadius: "12px" }}>
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="share-story-form">
              {/* Category Step */}
              <div className="form-group-step">
                <div className="step-title-row">
                  <span className="step-number">★</span>
                  <h3 className="step-title">Category *</h3>
                </div>
                <select
                  value={selectedCatId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={`form-control-dark font-semibold text-gold ${errors.category ? "form-control-error" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                      {cat.title}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="form-error-msg">{errors.category}</p>}
              </div>

              {/* Subcategory Step (Cascading) */}
              <div className="form-group-step">
                <div className="step-title-row">
                  <span className="step-number">★</span>
                  <h3 className="step-title">Subcategory *</h3>
                </div>
                <select
                  value={selectedSubId}
                  onChange={(e) => setSelectedSubId(e.target.value)}
                  className={`form-control-dark font-semibold text-gold ${errors.subcategory ? "form-control-error" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  {availableSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id} className="bg-neutral-900 text-white">
                      {sub.title}
                    </option>
                  ))}
                </select>
                {errors.subcategory && <p className="form-error-msg">{errors.subcategory}</p>}
              </div>

              {/* Step 1: Upload Photos or Videos (Max 3 items, mix supported) */}
              <div className="form-group-step">
                <div className="step-title-row flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="step-number">1</span>
                    <h3 className="step-title">Upload Photos or Videos</h3>
                    <span className="step-subtitle-icon hidden sm:inline-flex">
                      <Camera size={14} className="gold-icon" /> Mix of up to 3 files
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full">
                    {mediaList.length}/3 Uploaded
                  </span>
                </div>

                <div className="upload-split-layout">
                  {/* File Upload Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    multiple
                    style={{ display: "none" }}
                  />

                  {/* Dropzone & Preview Box */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (mediaList.length < 3) fileInputRef.current?.click();
                    }}
                    className={`drag-drop-zone-split ${isDragging ? "drag-drop-active" : ""} ${
                      mediaList.length >= 3 ? "cursor-not-allowed opacity-90" : "cursor-pointer"
                    }`}
                  >
                    {mediaList.length > 0 ? (
                      <div className="w-full grid grid-cols-3 gap-2 p-2" onClick={(e) => e.stopPropagation()}>
                        {mediaList.map((item, idx) => (
                          <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10 bg-black/60">
                            {item.type === 'video' ? (
                              <video src={item.url} className="w-full h-full object-cover" />
                            ) : (
                              <img src={item.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeMediaItem(item.id)}
                              className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full hover:bg-red-700 transition-all shadow"
                              title="Remove media"
                            >
                              <X size={12} />
                            </button>
                            <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              {item.type} {idx + 1}
                            </span>
                          </div>
                        ))}

                        {mediaList.length < 3 && (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border border-dashed border-[#D4A017]/50 hover:border-[#D4A017] flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/5 hover:bg-white/10"
                          >
                            <Plus size={20} className="gold-icon mb-1" />
                            <span className="text-[10px] text-gold font-bold">+ Add ({3 - mediaList.length})</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="upload-icon-circle-split">
                        <Upload size={24} className="gold-icon" />
                      </div>
                    )}
                  </div>

                  <div className="upload-details-split">
                    {mediaList.length > 0 ? (
                      <div className="uploaded-details-content space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="media-filename text-gold font-bold text-sm">
                            {mediaList.length} of 3 Media Files Selected
                          </p>
                          <button
                            type="button"
                            onClick={() => setMediaList([])}
                            className="text-xs text-red-400 hover:text-red-300 underline font-semibold"
                          >
                            Clear All
                          </button>
                        </div>

                        <ul className="space-y-1 text-xs text-gray-300 max-h-24 overflow-y-auto">
                          {mediaList.map((m, i) => (
                            <li key={m.id} className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                              <span className="truncate max-w-[180px]">{i + 1}. {m.name}</span>
                              <span className="text-[10px] text-gold uppercase font-bold">{m.type}</span>
                            </li>
                          ))}
                        </ul>

                        {mediaList.length < 3 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-bold mt-1"
                          >
                            <Plus size={14} /> Add another photo or video ({3 - mediaList.length} remaining)
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="upload-primary-text">
                          Drag & drop photos or videos here
                        </p>
                        <p className="upload-browse-text">
                          or <span className="browse-link" onClick={() => fileInputRef.current?.click()}>browse files</span>
                        </p>
                        <p className="upload-secondary-text">
                          Upload up to 3 photos or videos (JPG, PNG, MP4, WebM - Max 5MB each)
                        </p>
                      </>
                    )}

                    <div className="upload-tip-box mt-3">
                      <Sparkles size={14} className="gold-icon" />
                      <span>Tip: You can upload up to 3 items (mix photos and videos)!</span>
                    </div>
                  </div>
                </div>
                {errors.media && <p className="form-error-msg">{errors.media}</p>}
              </div>

              {/* Step 2: Story Title & Caption */}
              <div className="form-group-step">
                <div className="step-title-row">
                  <span className="step-number">2</span>
                  <h3 className="step-title">Story Title & Description</h3>
                  <FileText size={13} className="step-icon-indicator" />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Story Title (e.g. Sunset at Mahabodhi Temple)"
                  className="form-control-dark mb-3"
                  style={{ marginBottom: "12px" }}
                />
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a detailed description or story about this moment..."
                  className={`form-control-dark ${errors.caption ? "form-control-error" : ""}`}
                  style={{ resize: "none" }}
                />
                {errors.caption && <p className="form-error-msg">{errors.caption}</p>}
              </div>

              {/* Step 3: District Selection */}
              <div className="form-group-step">
                <div className="step-title-row">
                  <span className="step-number">3</span>
                  <h3 className="step-title">District</h3>
                  <MapPin size={13} className="step-icon-indicator" />
                </div>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="form-control-dark font-semibold text-white"
                  style={{ cursor: "pointer" }}
                >
                  {BIHAR_DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-neutral-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Action button */}
              <div className="form-actions-bar">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-publish-gradient"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Story</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="form-review-notice" style={{ marginTop: "24px", textAlign: "center", fontSize: "0.85rem", color: "#a58f7f" }}>
              <span>🔒</span> Your content will be reviewed by an admin before it appears on the site.
            </div>
          </div>

        </div>
      </main>

      {/* Success Modal Card overlay */}
      {isSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#1A3A2F] border border-[#EAB308]/25 max-w-sm w-full rounded-[2rem] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-[#EAB308] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/5">
              <CheckCircle2 size={40} className="text-[#EAB308]" />
            </div>
            <h3 className="font-display text-3xl font-bold text-white mb-4">
              Submission <span className="text-[#EAB308]">Successful!</span>
            </h3>
            <div className="heritage-divider mb-6">
              <span className="divider-line text-white/20"></span>
              <span className="divider-motif text-[#EAB308]">✦</span>
              <span className="divider-line text-white/20"></span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Thank you for sharing your story! Your submission has been successfully received and is currently in the moderation queue. It will be showcased on the website once approved by the admin.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                if (selectedCategoryObj && selectedSubId) {
                  const subObj = availableSubcategories.find((s) => s.id === selectedSubId);
                  if (subObj) {
                    navigate(`/discover/${selectedCategoryObj.slug}/${subObj.slug}`);
                    return;
                  }
                }
                navigate('/discover');
              }}
              className="w-full py-3.5 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-extrabold rounded-xl transition-all cursor-pointer uppercase tracking-wider text-xs shadow-lg hover:scale-105 duration-300"
            >
              Okay, Got it
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ShareStory;
