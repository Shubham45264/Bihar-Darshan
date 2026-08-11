import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Tag, FileText, Upload, Send, Store, MapPin, Phone, Mail, Link as LinkIcon, ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useContributions } from "../data/ContributionContext";
import { product as initialProducts } from "../data/product";
import heroBg from "../assets/hero.png";
import "./ShareStory.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const CATEGORIES = ["Art & Craft", "Textiles", "Handicrafts", "Wood Craft", "Jewelry", "Others"];

const AddProduct = () => {
  const { addProductSubmission } = useContributions();
  const navigate = useNavigate();

  // Form Fields
  const [businessName, setBusinessName] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [mapLink, setMapLink] = useState("");

  // Media upload state
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Submission/Status state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    if (imageFiles.length + newFiles.length > 4) {
      setErrors((prev) => ({ ...prev, image: "You can upload a maximum of 4 images." }));
      return;
    }

    const validFiles = newFiles.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < newFiles.length) {
      setErrors((prev) => ({ ...prev, image: "Some files exceed the 5MB limit and were skipped." }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
    }

    validFiles.forEach(async (file) => {
      setFileNames(prev => [...prev, file.name]);
      try {
        const res = await uploadToCloudinary(file);
        setImageFiles(prev => [...prev, res.secure_url]);
      } catch (err) {
        console.error("Cloudinary product upload failed:", err);
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
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setFileNames(prev => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!businessName.trim()) newErrors.businessName = "Business Name is required";
    if (!productName.trim()) newErrors.productName = "Product Name is required";
    if (!description.trim() || description.length < 10) newErrors.description = "Description is required (min 10 chars)";
    if (!imageFiles.length) newErrors.image = "At least one product image is required";
    if (!contact.trim()) newErrors.contact = "Contact number is required";
    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      await addProductSubmission({
        businessName,
        productName,
        category,
        description,
        image: imageFiles[0] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
        images: imageFiles,
        contact,
        email,
        address,
        website,
        mapLink,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrors({ submit: "An error occurred while submitting your product. Please make sure you are logged in." });
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
        </svg>
      </div>

      <Navbar forceWhiteText={true} />

      <main className="share-story-content-container">
        <div className="share-story-card-panel">
          {isSuccess ? (
            <div className="text-center py-12 px-6 flex flex-col items-center justify-center animate-slide-down">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-[#EAB308] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/5">
                <CheckCircle size={40} className="text-[#EAB308]" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Submission <span className="text-[#EAB308]">Successful!</span>
              </h2>
              <div className="heritage-divider mb-6">
                <span className="divider-line text-white/20"></span>
                <span className="divider-motif text-[#EAB308]">✦</span>
                <span className="divider-line text-white/20"></span>
              </div>
              <p className="text-white/70 max-w-md mb-8 leading-relaxed text-sm md:text-base">
                Your product has been submitted and is currently <strong>Pending Admin Approval</strong>. It will be visible to everyone on the marketplace once approved by the moderation team.
              </p>
              <button
                type="button"
                onClick={() => navigate("/marketplace")}
                className="px-8 py-3.5 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-extrabold rounded-xl transition-all shadow-lg hover:scale-105 duration-300 uppercase tracking-wider text-xs cursor-pointer"
              >
                Go to Marketplace
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="btn-back mr-auto flex items-center gap-2 mb-8"
                onClick={() => navigate('/marketplace')}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="share-story-form-section animate-slide-down">
                <div className="form-header-center">
                  <div className="share-story-decor-badge">
                    <ShoppingBag className="gold-icon" size={20} />
                  </div>
                  <h2 className="share-story-form-title-main">
                    Add Your <span className="gold-text">Product</span>
                  </h2>
                  <div className="heritage-divider">
                    <span className="divider-line"></span>
                    <span className="divider-motif">✦</span>
                    <span className="divider-line"></span>
                  </div>
                  <p className="share-story-form-subtitle">
                    Showcase your craft, goods, and creations with the Bihar Marketplace.
                  </p>
                </div>

                {errors.submit && (
                  <div className="form-control form-control-error" style={{ marginBottom: "24px", background: "rgba(217, 56, 56, 0.1)", color: "#f78888", border: "1px solid #d93838" }}>
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="share-story-form">

                  {/* Step 1: Product Image */}
                  <div className="form-group-step">
                    <div className="step-title-row">
                      <span className="step-number">1</span>
                      <h3 className="step-title">Product Image *</h3>
                    </div>

                    <div className="upload-split-layout">
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`drag-drop-zone-split ${isDragging ? "drag-drop-active" : ""}`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          style={{ display: "none" }}
                        />
                        {imageFiles.length > 0 ? (
                          <div className="preview-media-box-split p-4 h-full flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-2 w-full h-full">
                              {imageFiles.slice(0, 4).map((img, idx) => (
                                <img key={idx} src={img} alt="Preview" className="w-full h-full object-cover rounded-md" />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="upload-icon-circle-split">
                            <Upload size={24} className="gold-icon" />
                          </div>
                        )}
                      </div>
                      <div className="upload-details-split">
                        {imageFiles.length > 0 ? (
                          <div className="uploaded-details-content w-full">
                            <p className="upload-primary-text mb-2">{imageFiles.length} image(s) selected</p>
                            <div className="flex flex-col gap-1 w-full">
                              {fileNames.map((name, idx) => (
                                <div key={idx} className="flex justify-between items-center w-full">
                                  <p className="media-filename text-xs">{name}</p>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                    className="btn-remove-media"
                                  >Remove</button>
                                </div>
                              ))}
                            </div>
                            {imageFiles.length < 4 && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                className="mt-2 text-sm text-brand-gold hover:underline"
                              >
                                + Add more (Max 4)
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            <p className="upload-primary-text">Drag & drop your product image</p>
                            <p className="upload-browse-text">or <span className="browse-link" onClick={() => fileInputRef.current?.click()}>browse files</span></p>
                            <p className="upload-secondary-text">JPG / PNG / WEBP</p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.image && <p className="form-error-msg">{errors.image}</p>}
                  </div>

                  {/* Step 2: Product Details */}
                  <div className="form-group-step">
                    <div className="step-title-row">
                      <span className="step-number">2</span>
                      <h3 className="step-title">Product Details *</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-white/70 text-sm flex items-center gap-1"><Store size={14} className="gold-icon" /> Business Name *</label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Mithila Arts"
                          className={`form-control-dark ${errors.businessName ? "form-control-error" : ""}`}
                        />
                        {errors.businessName && <p className="form-error-msg">{errors.businessName}</p>}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-white/70 text-sm flex items-center gap-1"><Tag size={14} className="gold-icon" /> Product Name *</label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g. Madhubani Painting"
                          className={`form-control-dark ${errors.productName ? "form-control-error" : ""}`}
                        />
                        {errors.productName && <p className="form-error-msg">{errors.productName}</p>}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-white/70 text-sm flex items-center gap-1"><ShoppingBag size={14} className="gold-icon" /> Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="form-control-dark font-semibold text-gold"
                          style={{ cursor: "pointer" }}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Description */}
                  <div className="form-group-step">
                    <div className="step-title-row">
                      <span className="step-number">3</span>
                      <h3 className="step-title">Description *</h3>
                      <FileText size={13} className="step-icon-indicator" />
                    </div>
                    <div className="textarea-wrapper">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your product..."
                        className={`form-control-dark ${errors.description ? "form-control-error" : ""}`}
                        rows={4}
                      />
                    </div>
                    {errors.description && <p className="form-error-msg">{errors.description}</p>}
                  </div>

                  {/* Step 4: Contact Information */}
                  <div className="form-group-step">
                    <div className="step-title-row">
                      <span className="step-number">4</span>
                      <h3 className="step-title">Contact Information</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-white/70 text-sm flex items-center gap-1"><Phone size={14} className="gold-icon" /> Contact Number *</label>
                          <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="+91 9876543210"
                            className={`form-control-dark ${errors.contact ? "form-control-error" : ""}`}
                          />
                          {errors.contact && <p className="form-error-msg">{errors.contact}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-white/70 text-sm flex items-center gap-1"><Mail size={14} className="gold-icon" /> Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="form-control-dark"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-white/70 text-sm flex items-center gap-1"><MapPin size={14} className="gold-icon" /> Full Address *</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Village/City, District, Bihar - PIN"
                          className={`form-control-dark ${errors.address ? "form-control-error" : ""}`}
                        />
                        {errors.address && <p className="form-error-msg">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-white/70 text-sm flex items-center gap-1"><LinkIcon size={14} className="gold-icon" /> Website (Optional)</label>
                          <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://"
                            className="form-control-dark"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-white/70 text-sm flex items-center gap-1"><MapPin size={14} className="gold-icon" /> Map Link (Optional)</label>
                          <input
                            type="url"
                            value={mapLink}
                            onChange={(e) => setMapLink(e.target.value)}
                            placeholder="https://maps.google.com/..."
                            className="form-control-dark"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="form-actions-bar mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-publish-gradient"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner" />
                          <span>Adding Product...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Submit Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProduct;
