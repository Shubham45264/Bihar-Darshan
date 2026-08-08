import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Image as ImageIcon, Layers, FileText, RefreshCw, Eye, Upload } from 'lucide-react';
import { AdminModal } from '../../components/admin/AdminModal';
import { auth } from '../../lib/firebase';

interface SubCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
}

interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  subcategories: SubCategory[];
  _count?: { stories: number };
}

interface Story {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaFiles?: any;
  authorName: string;
  district: string;
  createdAt: string;
  status: string;
  category?: { title: string };
  subcategory?: { title: string };
}

const AdminImageUploader = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-white/70">{label}</label>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#EAB308] bg-[#EAB308]/10'
            : 'border-white/15 hover:border-[#EAB308]/50 bg-white/5'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {value ? (
          <div className="relative group max-h-36 overflow-hidden rounded-lg">
            <img src={value} alt="Cover Preview" className="w-full h-32 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-xs font-bold bg-[#EAB308] text-black px-3 py-1 rounded-full">
                Change Image
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="text-white text-xs font-bold bg-red-600 px-3 py-1 rounded-full hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3 flex flex-col items-center justify-center space-y-1">
            <Upload className="text-[#EAB308] mb-1" size={24} />
            <p className="text-xs text-white/80 font-medium">
              Drag & drop image here, or <span className="text-[#EAB308] underline font-bold">browse from device</span>
            </p>
            <p className="text-[10px] text-white/40">Supports PNG, JPG, WEBP, GIF</p>
          </div>
        )}
      </div>

      {/* Or Paste Image URL Input */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider shrink-0">or Image URL:</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#EAB308]"
        />
      </div>
    </div>
  );
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingStories, setPendingStories] = useState<Story[]>([]);
  const [pendingArticles, setPendingArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'pendingStories'>('categories');

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  // Subcategory Modal State
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedCatIdForSub, setSelectedCatIdForSub] = useState<string>('');
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [subTitle, setSubTitle] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subImage, setSubImage] = useState('');

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : '';
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/categories?status=ALL&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingStories = async () => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/stories?status=PENDING`, {
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setPendingStories(data.data.stories || []);
      }
    } catch (err) {
      console.error('Error fetching pending stories:', err);
    }
  };

  const fetchPendingArticles = async () => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/tribes/admin/articles/pending`, {
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setPendingArticles(data.data.articles || []);
      }
    } catch (err) {
      console.error('Error fetching pending articles:', err);
    }
  };

  const handleApproveArticle = async (articleId: string) => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/tribes/articles/${articleId}/approve`, {
        method: 'PUT',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setPendingArticles((prev) => prev.filter((a) => a.id !== articleId));
        fetchPendingArticles();
        alert('✅ Article approved! Author awarded +15 points.');
      } else {
        alert(data.message || 'Failed to approve article');
      }
    } catch (err) {
      console.error('Error approving article:', err);
      alert('An error occurred while approving the article.');
    }
  };

  const handleRejectArticle = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to reject this article?')) return;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/tribes/articles/${articleId}/reject`, {
        method: 'PUT',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setPendingArticles((prev) => prev.filter((a) => a.id !== articleId));
        fetchPendingArticles();
        alert('Article rejected.');
      } else {
        alert(data.message || 'Failed to reject article');
      }
    } catch (err) {
      console.error('Error rejecting article:', err);
      alert('An error occurred while rejecting the article.');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPendingStories();
    fetchPendingArticles();
  }, []);

  // Category Handlers
  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatTitle(cat.title);
      setCatDesc(cat.description || '');
      setCatImage(cat.image);
    } else {
      setEditingCategory(null);
      setCatTitle('');
      setCatDesc('');
      setCatImage('');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim() || !catImage.trim()) {
      alert('Category title and cover image are required.');
      return;
    }

    try {
      const authHeaders = await getAuthHeaders();
      const url = editingCategory
        ? `${API_BASE_URL}/categories/${editingCategory.id}`
        : `${API_BASE_URL}/categories`;
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          title: catTitle.trim(),
          description: catDesc.trim(),
          image: catImage.trim(),
          status: 'APPROVED',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCatModalOpen(false);
        await fetchCategories();
      } else {
        alert(data.message || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      alert('An error occurred while saving the category.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category and all its subcategories?')) return;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        fetchCategories();
      } else {
        alert(data.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('An error occurred while deleting the category.');
    }
  };

  // Subcategory Handlers
  const handleOpenSubModal = (categoryId: string, sub?: SubCategory) => {
    setSelectedCatIdForSub(categoryId);
    if (sub) {
      setEditingSub(sub);
      setSubTitle(sub.title);
      setSubDesc(sub.description || '');
      setSubImage(sub.image);
    } else {
      setEditingSub(null);
      setSubTitle('');
      setSubDesc('');
      setSubImage('');
    }
    setIsSubModalOpen(true);
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTitle.trim() || !subImage.trim() || !selectedCatIdForSub) {
      alert('Subcategory title and cover image are required.');
      return;
    }

    try {
      const authHeaders = await getAuthHeaders();
      const url = editingSub
        ? `${API_BASE_URL}/categories/subcategories/${editingSub.id}`
        : `${API_BASE_URL}/categories/${selectedCatIdForSub}/subcategories`;
      const method = editingSub ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          title: subTitle.trim(),
          description: subDesc.trim(),
          image: subImage.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubModalOpen(false);
        await fetchCategories();
      } else {
        alert(data.message || 'Failed to save subcategory');
      }
    } catch (err) {
      console.error('Error saving subcategory:', err);
      alert('An error occurred while saving the subcategory.');
    }
  };

  const handleDeleteSubcategory = async (subId: string) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/categories/subcategories/${subId}`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            subcategories: cat.subcategories.filter((s) => s.id !== subId),
          }))
        );
        fetchCategories();
      } else {
        alert(data.message || 'Failed to delete subcategory');
      }
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      alert('An error occurred while deleting the subcategory.');
    }
  };

  // Story Handlers
  const handleApproveStory = async (storyId: string) => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/stories/${storyId}/approve`, {
        method: 'PUT',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setPendingStories((prev) => prev.filter((s) => s.id !== storyId));
        fetchPendingStories();
        fetchCategories();
        alert('✅ Story approved and published to website successfully!');
      } else {
        alert(data.message || 'Failed to approve story');
      }
    } catch (err) {
      console.error('Error approving story:', err);
      alert('An error occurred while approving the story.');
    }
  };

  const handleRejectStory = async (storyId: string) => {
    if (!window.confirm('Are you sure you want to reject this story?')) return;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/stories/${storyId}/reject`, {
        method: 'PUT',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setPendingStories((prev) => prev.filter((s) => s.id !== storyId));
        fetchPendingStories();
        alert('Story rejected.');
      } else {
        alert(data.message || 'Failed to reject story');
      }
    } catch (err) {
      console.error('Error rejecting story:', err);
      alert('An error occurred while rejecting the story.');
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subcategories.some((sub) => sub.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Categories & Story Verification</h1>
          <p className="text-white/60 text-sm mt-1">Manage categories, subcategories, and approve user-submitted stories</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenCatModal()}
            className="flex items-center gap-2 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#EAB308]/20 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={16} />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pendingStories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all relative cursor-pointer ${
            activeTab === 'pendingStories'
              ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={16} />
          <span>Pending Verifications</span>
          {(pendingStories.length + pendingArticles.length) > 0 && (
            <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full ml-1 animate-pulse">
              {pendingStories.length + pendingArticles.length}
            </span>
          )}
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search categories or subcategories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#EAB308]"
        />
      </div>

      {/* CONTENT */}
      {activeTab === 'categories' && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-white/60">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/10">
              No categories found matching "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all"
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-white">{cat.title}</h2>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/30">
                            {cat.subcategories.length} Subcategories
                          </span>
                        </div>
                        <p className="text-white/60 text-xs mt-1">{cat.description || 'No description provided.'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenSubModal(cat.id)}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all border border-white/10 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Add Subcategory</span>
                      </button>
                      <button
                        onClick={() => handleOpenCatModal(cat)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all border border-white/10 cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories Grid */}
                  <div>
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                      Subcategories
                    </h3>
                    {cat.subcategories.length === 0 ? (
                      <div className="text-white/30 text-xs py-3 px-4 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
                        No subcategories added yet. Click "Add Subcategory" to add one.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {cat.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-[#EAB308]/50 transition-all shadow-sm"
                          >
                            <img
                              src={sub.image}
                              alt={sub.title}
                              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                              <span className="text-white text-xs font-semibold leading-tight line-clamp-1">{sub.title}</span>
                            </div>
                            <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1 rounded-lg">
                              <button
                                onClick={() => handleOpenSubModal(cat.id, sub)}
                                className="text-white/80 hover:text-white p-0.5 cursor-pointer"
                                title="Edit Subcategory"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteSubcategory(sub.id)}
                                className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                                title="Delete Subcategory"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pendingStories' && (
        <div className="space-y-6">
          {pendingStories.length === 0 && pendingArticles.length === 0 ? (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <Check className="mx-auto text-emerald-400 mb-2" size={32} />
              <p className="text-white font-medium">All caught up!</p>
              <p className="text-white/50 text-xs mt-1">No user stories or articles waiting for verification.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Tribal Articles Section */}
              {pendingArticles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Pending Tribal Articles ({pendingArticles.length}) — (+15 Points to Author on Approval)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingArticles.map((article) => (
                      <div key={article.id} className="bg-white/5 border border-yellow-500/30 rounded-2xl overflow-hidden p-5 space-y-4">
                        {article.image && (
                          <img
                            src={article.image}
                            alt={article.headline}
                            className="w-full h-44 object-cover rounded-xl border border-white/10"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-yellow-500/20 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-yellow-500/30">
                              Tribal Article → {article.tribe}
                            </span>
                            {article.location && <span className="text-white/40 text-xs ml-auto">{article.location}</span>}
                          </div>
                          <h3 className="text-lg font-bold text-white leading-snug">{article.headline}</h3>
                          <p className="text-white/70 text-xs mt-2 line-clamp-3 leading-relaxed">{article.description}</p>
                          <div className="mt-3 flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-3">
                            <span>Submitted by: <strong className="text-white">{article.author}</strong></span>
                            <span>{article.publishedDate || 'Recently'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => handleApproveArticle(article.id)}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
                          >
                            <Check size={16} />
                            <span>Approve & Award +15 Points</span>
                          </button>
                          <button
                            onClick={() => handleRejectArticle(article.id)}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-red-500/30 cursor-pointer"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Category Stories Section */}
              {pendingStories.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} /> Pending Category Stories ({pendingStories.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingStories.map((story) => (
                      <div key={story.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-5 space-y-4">
                        {Array.isArray((story as any).mediaFiles) && (story as any).mediaFiles.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {(story as any).mediaFiles.map((m: any, idx: number) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black">
                                {m.type === 'VIDEO' || m.type === 'video' ? (
                                  <video src={m.url} className="w-full h-full object-cover" />
                                ) : (
                                  <img src={m.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                                )}
                                <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded uppercase">
                                  {m.type || 'Media'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : story.mediaUrl ? (
                          <img
                            src={story.mediaUrl}
                            alt={story.title}
                            className="w-full h-48 object-cover rounded-xl border border-white/10"
                          />
                        ) : null}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-[#EAB308]/20 text-[#EAB308] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-[#EAB308]/30">
                              {story.category?.title || 'Category'} → {story.subcategory?.title || 'Subcategory'}
                            </span>
                            <span className="text-white/40 text-xs ml-auto">{story.district}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white">{story.title}</h3>
                          <p className="text-white/70 text-xs mt-2 line-clamp-3 leading-relaxed">{story.content}</p>
                          <div className="mt-3 flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-3">
                            <span>Submitted by: <strong className="text-white">{story.authorName}</strong></span>
                            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => handleApproveStory(story.id)}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Check size={16} />
                            <span>Approve & Publish</span>
                          </button>
                          <button
                            onClick={() => handleRejectStory(story.id)}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-red-500/30 cursor-pointer"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      <AdminModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">Category Title *</label>
            <input
              type="text"
              required
              value={catTitle}
              onChange={(e) => setCatTitle(e.target.value)}
              placeholder="e.g. Heritage & History"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#EAB308]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">Description</label>
            <textarea
              rows={3}
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Brief summary of this category..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#EAB308]"
            />
          </div>
          
          {/* Drag and Drop Cover Image Uploader */}
          <AdminImageUploader
            label="Cover Image *"
            value={catImage}
            onChange={(val) => setCatImage(val)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCatModalOpen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold rounded-xl text-sm cursor-pointer"
            >
              Save Category
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Subcategory Modal */}
      <AdminModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        title={editingSub ? 'Edit Subcategory' : 'Add New Subcategory'}
      >
        <form onSubmit={handleSaveSubcategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">Subcategory Title *</label>
            <input
              type="text"
              required
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="e.g. Ancient Monuments"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#EAB308]"
            />
          </div>

          {/* Drag and Drop Cover Image Uploader */}
          <AdminImageUploader
            label="Cover Image *"
            value={subImage}
            onChange={(val) => setSubImage(val)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsSubModalOpen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold rounded-xl text-sm cursor-pointer"
            >
              Save Subcategory
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminCategories;
