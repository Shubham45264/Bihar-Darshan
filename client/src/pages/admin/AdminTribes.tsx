import { useState, useEffect } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { auth } from '../../lib/firebase';
import type { TribeItem } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminImagePreview, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import type { CultureSection } from '../../components/tribals/CulturalHighlightsGrid';
import { getTribeCulturalSections } from '../../data/tribeCulturalData';
import { useArticles } from '../../data/ArticlesContext';
import type { TribalArticle } from '../../data/tribalArticlesData';
import { User, Palette, BookOpen, Utensils, Mic2, AlignLeft, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown, Newspaper, Calendar, Clock, MapPin, Shield, PenLine, Eye, Film, Check, X } from 'lucide-react';

// ── Tab definitions ──────────────────────────────────────────────

const TABS = [
  { key: 'hero', label: 'Hero Section', icon: AlignLeft },
  { key: 'videos', label: 'Videos & Moderation', icon: Film },
  { key: 'traditions', label: 'Traditions & Culture', icon: BookOpen },
  { key: 'personalities', label: 'Famous Personalities', icon: User },
  { key: 'arts', label: 'Arts & Handicrafts', icon: Palette },
  { key: 'food', label: 'Food', icon: Utensils },
  { key: 'folklore', label: 'Oral Stories & Folklore', icon: Mic2 },
  { key: 'articles', label: 'Articles', icon: Newspaper },
] as const;

type TabKey = typeof TABS[number]['key'];

const TAB_HEADING_MAP: Record<string, string> = {
  traditions: 'Traditions & Culture',
  personalities: 'Famous Personalities',
  arts: 'Arts & Handicrafts',
  food: 'Food',
  folklore: 'Oral Stories & Folklore',
};

const CONTENT_TABS = TABS.filter(t => t.key !== 'hero' && t.key !== 'articles' && t.key !== 'videos');




const emptyForm: Partial<TribeItem> = {
  id: '',
  hindiName: 'आदिवासी',
  englishName: '',
  shortDesc: '',
  image: '',
  leftTitle: '',
  leftDesc: '',
  rightTitle: '',
  rightDesc: '',
  bottomDesc: '',
  cultureSections: [],
};

// ── Helpers ──────────────────────────────────────────────────────

const getSectionByTab = (tabKey: string, sections: CultureSection[]): CultureSection | undefined =>
  sections.find(s => s.heading === TAB_HEADING_MAP[tabKey]);

const updateSectionInArray = (sections: CultureSection[], tabKey: string, updated: CultureSection): CultureSection[] => {
  const heading = TAB_HEADING_MAP[tabKey];
  const exists = sections.some(s => s.heading === heading);
  if (exists) return sections.map(s => s.heading === heading ? updated : s);
  return [...sections, updated];
};

// ── SingleSectionEditor ──────────────────────────────────────────

interface SingleSectionEditorProps {
  section: CultureSection;
  onChange: (updated: CultureSection) => void;
}

const SingleSectionEditor = ({ section, onChange }: SingleSectionEditorProps) => {
  const addCard = () => onChange({ ...section, cards: [...section.cards, { image: '', title: '', description: '' }] });
  const updateCard = (idx: number, field: string, value: string) =>
    onChange({ ...section, cards: section.cards.map((c, i) => i === idx ? { ...c, [field]: value } : c) });
  const removeCard = (idx: number) =>
    onChange({ ...section, cards: section.cards.filter((_, i) => i !== idx) });
  const moveCard = (idx: number, dir: -1 | 1) => {
    const newCards = [...section.cards];
    const target = idx + dir;
    if (target < 0 || target >= newCards.length) return;
    [newCards[idx], newCards[target]] = [newCards[target], newCards[idx]];
    onChange({ ...section, cards: newCards });
  };

  return (
    <div className="space-y-3">
      {section.cards.length === 0 && (
        <div className="py-10 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
          <p className="text-white/40 text-sm mb-3">No cards yet. Click &quot;Add Card&quot; or &quot;Load Mock Data&quot; to populate this section.</p>
          <button type="button" onClick={addCard}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors font-medium">
            <span className="flex items-center gap-2"><Plus size={14} /> Add First Card</span>
          </button>
        </div>
      )}

      {section.cards.map((card, idx) => (
        <div key={idx} className="border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Card #{idx + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveCard(idx, -1)} disabled={idx === 0}
                className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20 transition-colors" title="Move up">
                <ChevronUp size={14} />
              </button>
              <button type="button" onClick={() => moveCard(idx, 1)} disabled={idx === section.cards.length - 1}
                className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20 transition-colors" title="Move down">
                <ChevronDown size={14} />
              </button>
              <button type="button" onClick={() => removeCard(idx)}
                className="p-1 rounded text-red-400 hover:text-red-300 transition-colors" title="Remove card">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Card Title" value={card.title}
              onChange={e => updateCard(idx, 'title', e.target.value)} placeholder="e.g. Karam Festival" />
            <div className="md:col-span-2">
              <AdminImageUpload
                label="Card Image"
                value={card.image}
                onChange={val => updateCard(idx, 'image', val)}
              />
            </div>
            <div className="md:col-span-2">
              <AdminTextarea label="Description" value={card.description}
                onChange={e => updateCard(idx, 'description', e.target.value)} rows={2}
                placeholder="Short description shown on the card..." />
            </div>
          </div>
        </div>
      ))}

      {section.cards.length > 0 && (
        <button type="button" onClick={addCard}
          className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 transition-all text-sm font-medium flex items-center justify-center gap-2">
          <Plus size={15} /> Add Another Card
        </button>
      )}
    </div>
  );
};

// ── ArticleAdminRow ─────────────────────────────────────────────

interface ArticleAdminRowProps {
  article: TribalArticle;
  isUserArticle: boolean;
  onDelete: () => void;
  onPreview: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const ArticleAdminRow = ({ article, isUserArticle, onDelete, onPreview, onApprove, onReject }: ArticleAdminRowProps) => (
  <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${isUserArticle
    ? 'border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10'
    : 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'
    }`}>
    {/* Thumbnail */}
    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
      <img src={article.image || '/images/tribals/generic.png'} alt={article.headline}
        className="w-full h-full object-cover"
        onError={e => { e.currentTarget.src = '/images/tribals/generic.png'; }} />
    </div>
    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        {isUserArticle
          ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1"><User size={8} />User</span>
          : <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1"><Shield size={8} />Admin</span>
        }
        <span className="text-[10px] text-white/40">{article.publishedDate}</span>
        <span className="text-[10px] text-white/40">• {article.readTime} min read</span>
      </div>
      <p className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1">{article.headline}</p>
      <div className="flex items-center gap-3 text-[10px] text-white/40">
        <span className="flex items-center gap-1"><User size={9} />{article.author}</span>
        {article.location && <span className="flex items-center gap-1"><MapPin size={9} />{article.location}</span>}
        {article.tags?.slice(0, 2).map(tag => <span key={tag} className="px-1.5 py-0.5 rounded bg-white/10">{tag}</span>)}
      </div>
    </div>
    {/* Actions */}
    <div className="flex flex-col gap-1.5 flex-shrink-0">
      <button type="button" onClick={onPreview}
        className="p-1.5 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors" title="Preview article">
        <Eye size={13} />
      </button>
      {article.status === 'PENDING' && onApprove && onReject && (
        <>
          <button type="button" onClick={onApprove}
            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-colors" title="Approve article">
            <User size={13} />
          </button>
          <button type="button" onClick={onReject}
            className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-colors" title="Reject article">
            <Trash2 size={13} />
          </button>
        </>
      )}
      <button type="button" onClick={onDelete}
        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors" title="Delete article">
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// ── AdminTribes ──────────────────────────────────────────────────

const AdminTribes = () => {
  const { tribes, updateTribes, refreshTribes, tribalArticles: allArticles, deleteTribalArticle: deleteArticle, addTribalArticle: addArticle, updateArticleStatus } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TribeItem | null>(null);
  const [formData, setFormData] = useState<Partial<TribeItem>>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<TribeItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  // Article delete confirm state
  const [articleToDelete, setArticleToDelete] = useState<TribalArticle | null>(null);
  const [isArticleDeleteOpen, setIsArticleDeleteOpen] = useState(false);

  // Admin create article form state
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [articleForm, setArticleForm] = useState({
    headline: '', description: '', images: ['', '', '', '', ''],
    author: 'Bihar Darshan Editorial', location: '', tags: '',
  });
  const [previewArticle, setPreviewArticle] = useState<TribalArticle | null>(null);

  // Video Moderation State
  const [adminPendingVideos, setAdminPendingVideos] = useState<any[]>([]);
  const [isFetchingPendingVideos, setIsFetchingPendingVideos] = useState(false);
  const [rejectingVideo, setRejectingVideo] = useState<any | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  const loadPendingVideos = async () => {
    try {
      setIsFetchingPendingVideos(true);
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('http://localhost:5000/api/v1/tribes/admin/videos/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data?.videos) {
        setAdminPendingVideos(data.data.videos);
      }
    } catch (err) {
      console.error('Failed to load pending videos:', err);
    } finally {
      setIsFetchingPendingVideos(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'videos') {
      loadPendingVideos();
    }
  }, [activeTab]);

  const handleApproveAdminVideo = async (videoId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:5000/api/v1/tribes/admin/videos/${videoId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAdminPendingVideos(prev => prev.filter(v => v.id !== videoId));
        alert('Video approved successfully! It is now live on the public video slider.');
      }
    } catch (err) {
      console.error('Failed to approve video:', err);
    }
  };

  const handleConfirmRejectAdminVideo = async () => {
    if (!rejectingVideo) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:5000/api/v1/tribes/admin/videos/${rejectingVideo.id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason: rejectionReasonText.trim() || 'Content does not meet site community guidelines.' })
      });
      if (res.ok) {
        setAdminPendingVideos(prev => prev.filter(v => v.id !== rejectingVideo.id));
        setRejectingVideo(null);
        setRejectionReasonText('');
        alert('Video rejected. The rejection status and reason have been sent to the user profile.');
      }
    } catch (err) {
      console.error('Failed to reject video:', err);
    }
  };

  const filteredData = tribes.filter(item =>
    item.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hindiName.includes(searchTerm)
  );

  const ensureAllSections = (sections: CultureSection[]): CultureSection[] => {
    const allHeadings = Object.values(TAB_HEADING_MAP);
    const existingHeadings = new Set(sections.map(s => s.heading));
    const missing = allHeadings.filter(h => !existingHeadings.has(h)).map(heading => ({ heading, cards: [] }));
    return [...sections, ...missing];
  };

  const handleAdd = () => {
    setEditingItem(null);
    setActiveTab('hero');
    const defaultSections = Object.values(TAB_HEADING_MAP).map(heading => ({ heading, cards: [] }));
    setFormData({ ...emptyForm, cultureSections: defaultSections });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TribeItem) => {
    setEditingItem(item);
    setActiveTab('hero');
    let sections = item.cultureSections;
    // Auto-populate from mock data if tribe has no custom sections saved
    if (!sections || sections.length === 0) {
      sections = getTribeCulturalSections(item.id, item.englishName);
    }
    setFormData({ ...item, cultureSections: ensureAllSections(sections) });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: TribeItem) => { setItemToDelete(item); setIsDeleteOpen(true); };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:5000/api/v1/tribes/${itemToDelete.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          await refreshTribes();
          setIsDeleteOpen(false);
          setItemToDelete(null);
        }
      } catch (err) {
        console.error('Failed to delete tribe:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser?.getIdToken();
      if (editingItem) {
        await fetch(`http://localhost:5000/api/v1/tribes/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        const newId = formData.englishName?.toLowerCase().replace(/\s+/g, '') || `tribe-${Date.now()}`;
        await fetch(`http://localhost:5000/api/v1/tribes`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: newId })
        });
      }
      await refreshTribes();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save tribe:', err);
    }
  };

  const getCurrentSection = (tabKey: string): CultureSection =>
    getSectionByTab(tabKey, formData.cultureSections || []) ?? { heading: TAB_HEADING_MAP[tabKey], cards: [] };

  const handleSectionChange = (tabKey: string, updated: CultureSection) => {
    const newSections = updateSectionInArray(formData.cultureSections || [], tabKey, updated);
    setFormData({ ...formData, cultureSections: newSections });
  };

  const handleLoadMockData = (tabKey: string) => {
    const tribeId = formData.id || editingItem?.id || '';
    const tribeName = formData.englishName || editingItem?.englishName || 'Tribe';
    const mockSections = getTribeCulturalSections(tribeId, tribeName);
    const mockSection = mockSections.find(s => s.heading === TAB_HEADING_MAP[tabKey]);
    if (mockSection) handleSectionChange(tabKey, mockSection);
  };

  const getSectionCardCount = (tabKey: string) => getCurrentSection(tabKey).cards.length;

  // ── Articles helpers ─────────────────────────────────────────────
  const tribeArticles = allArticles.filter(
    a => a.tribe.toLowerCase() === (editingItem?.englishName || '').toLowerCase()
  );
  const pendingArticles = tribeArticles.filter(a => a.status === 'PENDING');
  const publishedArticles = tribeArticles.filter(a => a.status === 'APPROVED');
  const userArticles = tribeArticles.filter(a => a.status === 'APPROVED' && a.author !== 'Bihar Darshan Editorial' && a.author !== 'Admin');
  const adminArticles = tribeArticles.filter(a => a.status === 'APPROVED' && (a.author === 'Bihar Darshan Editorial' || a.author === 'Admin'));

  const handleDeleteArticleClick = (article: TribalArticle) => {
    setArticleToDelete(article);
    setIsArticleDeleteOpen(true);
  };

  const confirmDeleteArticle = () => {
    if (articleToDelete) deleteArticle(articleToDelete.id);
    setArticleToDelete(null);
  };

  const resetArticleForm = () => {
    setArticleForm({ headline: '', description: '', images: ['', '', '', '', ''], author: 'Bihar Darshan Editorial', location: '', tags: '' });
    setIsCreatingArticle(false);
  };

  const handleCreateArticle = () => {
    if (!articleForm.headline.trim() || !articleForm.description.trim()) return;
    const filledImages = articleForm.images.map(i => i.trim()).filter(Boolean);
    const coverImage = filledImages[0] || '/images/articles/article_1.png';
    const newArticle: TribalArticle = {
      id: `art-admin-${Date.now()}`,
      headline: articleForm.headline.trim(),
      description: articleForm.description.trim(),
      image: coverImage,
      images: filledImages.length > 1 ? filledImages : undefined,
      author: articleForm.author.trim() || 'Bihar Darshan Editorial',
      tribe: editingItem?.englishName || '',
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: Math.max(1, Math.round(articleForm.description.trim().split(/\s+/).length / 200)) || 3,
      tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      location: articleForm.location.trim(),
      status: 'APPROVED'
    };
    addArticle(newArticle);
    resetArticleForm();
  };

  return (
    <div className="space-y-6">
      <AdminTable
        title="Tribal Groups"
        description="Manage information about indigenous tribes — hero section, all 5 cultural sections, and more."
        data={filteredData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        columns={[
          {
            header: 'Image',
            accessor: (item) => (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0 p-1">
                <img src={item.image} alt={item.englishName} className="w-full h-full object-contain filter invert" />
              </div>
            )
          },
          { header: 'English Name', accessor: 'englishName', className: 'font-semibold text-white' },
          { header: 'Hindi Name', accessor: 'hindiName' },
          {
            header: 'Sections',
            accessor: (item) => {
              const n = item.cultureSections?.length || 0;
              return (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${n >= 5 ? 'bg-green-500/20 text-green-400' : n > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/40'}`}>
                  {n >= 5 ? '✓ All sections' : n > 0 ? `${n}/5 sections` : 'Mock data'}
                </span>
              );
            }
          },
          { header: 'Description', accessor: (item) => <span className="truncate max-w-xs block">{item.shortDesc}</span> },
        ]}
      />

      {/* ── Edit / Add Modal ── */}
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit: ${editingItem.englishName}` : 'Add New Tribe'}
        maxWidth="max-w-5xl">
        <form onSubmit={handleSubmit}>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isSection = !['hero', 'articles'].includes(tab.key);
              const isArticles = tab.key === 'articles';
              const count = isSection ? getSectionCardCount(tab.key) : isArticles ? tribeArticles.length : null;
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key as TabKey)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${isActive ? 'bg-[#EAB308] text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}>
                  <Icon size={13} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {(isSection || isArticles) && (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${count && count > 0
                      ? isActive
                        ? isArticles ? 'bg-blue-900/60 text-blue-200' : 'bg-black/30 text-black'
                        : isArticles ? 'bg-blue-500/30 text-blue-300' : 'bg-green-500/30 text-green-400'
                      : isActive ? 'bg-black/20 text-black/50' : 'bg-white/10 text-white/30'
                      }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── HERO TAB ── */}
          {activeTab === 'hero' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl">
                <p className="text-xs text-[#EAB308] font-semibold">Hero Section — The main infographic displayed at the top of the tribe detail page (title, central illustration, left/right columns, and bottom quote).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput label="English Name" value={formData.englishName || ''}
                  onChange={e => setFormData({ ...formData, englishName: e.target.value })} required placeholder="e.g. Santhal Tribe" />
                <AdminInput label="Hindi Name" value={formData.hindiName || ''}
                  onChange={e => setFormData({ ...formData, hindiName: e.target.value })} required placeholder="e.g. संथाल" />
              </div>

              <AdminTextarea label="Short Description (Listing Page Card)" value={formData.shortDesc || ''}
                onChange={e => setFormData({ ...formData, shortDesc: e.target.value })} required rows={2}
                placeholder="Brief description shown on the tribes listing page..." />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <AdminImageUpload
                  label="Image / Icon"
                  value={formData.image || ''}
                  onChange={val => setFormData({ ...formData, image: val })}
                  required
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Infographic Panel — Left & Right Columns</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput label="Left Column Title" value={formData.leftTitle || ''}
                    onChange={e => setFormData({ ...formData, leftTitle: e.target.value })} placeholder="e.g. Cultural Roots" />
                  <AdminTextarea label="Left Column Description" value={formData.leftDesc || ''}
                    onChange={e => setFormData({ ...formData, leftDesc: e.target.value })} rows={4}
                    placeholder="Describe the left panel content..." />
                  <AdminInput label="Right Column Title" value={formData.rightTitle || ''}
                    onChange={e => setFormData({ ...formData, rightTitle: e.target.value })} placeholder="e.g. Attire & Art" />
                  <AdminTextarea label="Right Column Description" value={formData.rightDesc || ''}
                    onChange={e => setFormData({ ...formData, rightDesc: e.target.value })} rows={4}
                    placeholder="Describe the right panel content..." />
                </div>
                <div className="mt-4">
                  <AdminTextarea label="Bottom Quote / Key Fact" value={formData.bottomDesc || ''}
                    onChange={e => setFormData({ ...formData, bottomDesc: e.target.value })} rows={3}
                    placeholder='"A memorable quote or key fact shown at the bottom of the hero section..."' />
                </div>
              </div>
            </div>
          )}

          {/* ── VIDEOS MODERATION TAB ── */}
          {activeTab === 'videos' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-3 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Film size={16} className="text-[#EAB308]" />
                  <span className="text-sm font-semibold text-white">Video Moderation for {editingItem?.englishName || 'this tribe'}</span>
                  <span className="text-xs text-white/50 hidden md:inline">— verify video content & publish/reject</span>
                </div>
                <button
                  type="button"
                  onClick={loadPendingVideos}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                >
                  <RefreshCw size={12} /> Refresh Submissions
                </button>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                    <Film size={14} className="text-[#EAB308]" />
                    Pending Video Submissions ({adminPendingVideos.length})
                  </h4>
                  <span className="text-xs text-[#EAB308] bg-[#EAB308]/10 px-2.5 py-0.5 rounded-full font-bold">
                    Inline Video Verification Enabled
                  </span>
                </div>

                <div className="text-xs text-white/60 bg-white/5 p-3 rounded-xl border border-white/5">
                  🎥 Watch and verify each user video below. Click <strong>Approve Video</strong> to publish it live to the public Tribe Video Slider. Click <strong>Reject</strong> to attach a rejection reason for the user's profile.
                </div>

                {isFetchingPendingVideos ? (
                  <div className="py-12 text-center text-white/50 text-sm">
                    Loading video submissions...
                  </div>
                ) : adminPendingVideos.length === 0 ? (
                  <div className="py-12 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-xl">
                    <Film size={28} className="mx-auto mb-2 text-white/20" />
                    <p className="text-white/40 text-sm">No pending videos awaiting moderation for this tribe.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {adminPendingVideos.map((vid) => (
                      <div key={vid.id} className="border border-white/10 rounded-2xl bg-white/[0.03] p-4 flex flex-col justify-between space-y-3">
                        {/* Inline Video Player for Admin Verification */}
                        <div className="w-full aspect-video rounded-xl bg-black overflow-hidden relative border border-white/10">
                          <video
                            src={vid.videoUrl}
                            controls
                            preload="metadata"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Pending Approval
                            </span>
                            <span className="text-[11px] text-white/40">Tribe: {vid.tribeName}</span>
                          </div>
                          <h5 className="font-serif font-bold text-white text-sm leading-snug">
                            {vid.caption || vid.title || 'Untitled Video'}
                          </h5>
                          <p className="text-xs text-white/60">Uploaded by {vid.uploaderName || 'Community Member'}</p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handleApproveAdminVideo(vid.id)}
                            className="px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-green-500/30"
                          >
                            <Check size={14} /> Approve Video
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingVideo(vid);
                              setRejectionReasonText('');
                            }}
                            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-red-500/30"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rejection Reason Modal */}
              {rejectingVideo && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-[#120E0B] border border-[#D4A017]/40 rounded-2xl p-6 w-full max-w-md space-y-4 text-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="text-base font-bold text-red-400 flex items-center gap-2">
                        <X size={16} /> Reject Video Submission
                      </h4>
                      <button type="button" onClick={() => setRejectingVideo(null)} className="text-white/40 hover:text-white text-xs">✕</button>
                    </div>

                    <p className="text-xs text-white/70">
                      Specify the reason for rejecting <strong className="text-white">&quot;{rejectingVideo.caption || rejectingVideo.title}&quot;</strong>. This reason will be displayed to the user under their profile&apos;s <strong>Rejected Posts</strong>.
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-white/90 mb-1.5 uppercase tracking-wider">
                        Rejection Reason <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={rejectionReasonText}
                        onChange={(e) => setRejectionReasonText(e.target.value)}
                        placeholder="e.g. Inappropriate content, video quality is too low, or not related to tribal heritage."
                        className="w-full bg-white/[0.04] border border-white/10 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-red-400 text-sm placeholder:text-white/30 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setRejectingVideo(null)}
                        className="px-4 py-2 text-white/60 hover:text-white font-semibold text-xs rounded-xl border border-white/10 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmRejectAdminVideo}
                        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CONTENT SECTION TABS ── */}
          {CONTENT_TABS.map(tab => activeTab === tab.key && (
            <div key={tab.key} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <tab.icon size={16} className="text-[#EAB308]" />
                  <span className="text-sm font-semibold text-white">{tab.label}</span>
                  <span className="text-xs text-white/40 hidden md:inline">— edit cards in this section</span>
                </div>
                <button type="button" onClick={() => handleLoadMockData(tab.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAB308]/10 text-[#EAB308] hover:bg-[#EAB308]/20 border border-[#EAB308]/20 text-xs font-semibold transition-all"
                  title="Replace current cards with the default mock data for this section">
                  <RefreshCw size={12} /> Load Mock Data
                </button>
              </div>

              <SingleSectionEditor
                section={getCurrentSection(tab.key)}
                onChange={updated => handleSectionChange(tab.key, updated)}
              />
            </div>
          ))}

          {/* ── ARTICLES TAB ── */}
          {activeTab === 'articles' && (
            <div className="space-y-5 animate-in fade-in duration-200">

              {/* Header */}
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Newspaper size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold text-white">Articles for {editingItem?.englishName || 'this tribe'}</span>
                  <span className="text-xs text-white/40 hidden md:inline">— manage user submissions & publish your own</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />{adminArticles.length} Admin</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" />{userArticles.length} User</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" />{pendingArticles.length} Pending</span>
                </div>
              </div>

              {/* ── Create Article Panel ── */}
              {isCreatingArticle ? (
                <div className="border border-[#EAB308]/30 rounded-xl bg-[#EAB308]/5 p-4 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[#EAB308] flex items-center gap-2"><PenLine size={14} /> Create Admin Article</h4>
                    <button type="button" onClick={resetArticleForm} className="text-white/40 hover:text-white text-xs">✕ Cancel</button>
                  </div>
                  <AdminInput label="Headline *" value={articleForm.headline}
                    onChange={e => setArticleForm({ ...articleForm, headline: e.target.value })}
                    placeholder="Article headline..." />
                  <AdminTextarea label="Description / Body *" value={articleForm.description}
                    onChange={e => setArticleForm({ ...articleForm, description: e.target.value })}
                    rows={3} placeholder="Article content..." />

                  {/* Images — up to 5 URLs */}
                  <div>
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      Images (up to 5)
                      <span className="text-white/30 font-normal normal-case tracking-normal">— first image is the cover</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {articleForm.images.map((img, idx) => (
                        <div key={idx} className="space-y-1">
                          <AdminImageUpload
                            label={idx === 0 ? 'Cover Image (Required)' : `Article Image ${idx + 1}`}
                            value={img}
                            onChange={val => {
                              const updated = [...articleForm.images];
                              updated[idx] = val;
                              setArticleForm({ ...articleForm, images: updated });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput label="Author Name" value={articleForm.author}
                      onChange={e => setArticleForm({ ...articleForm, author: e.target.value })}
                      placeholder="Bihar Darshan Editorial" />
                    <AdminInput label="Location" value={articleForm.location}
                      onChange={e => setArticleForm({ ...articleForm, location: e.target.value })}
                      placeholder="e.g. Ranchi, Bihar" />
                  </div>
                  <AdminInput label="Tags (comma-separated)" value={articleForm.tags}
                    onChange={e => setArticleForm({ ...articleForm, tags: e.target.value })}
                    placeholder="Art, Culture, Revival" />
                  <div className="flex justify-end">
                    <button type="button" onClick={handleCreateArticle}
                      disabled={!articleForm.headline.trim() || !articleForm.description.trim()}
                      className="px-5 py-2 rounded-xl bg-[#EAB308] text-black font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      Publish Article
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setIsCreatingArticle(true)}
                  className="w-full py-2.5 border border-dashed border-[#EAB308]/30 rounded-xl text-[#EAB308]/70 hover:text-[#EAB308] hover:border-[#EAB308]/60 hover:bg-[#EAB308]/5 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                  <PenLine size={14} /> Write & Publish a New Article
                </button>
              )}

              {/* ── Article List ── */}
              {tribeArticles.length === 0 ? (
                <div className="py-10 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
                  <Newspaper size={28} className="mx-auto mb-3 text-white/20" />
                  <p className="text-white/40 text-sm">No articles yet for this tribe.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Pending Submissions */}
                  {pendingArticles.length > 0 && (
                    <>
                      <p className="text-[11px] font-bold text-yellow-400/80 uppercase tracking-widest px-1 flex items-center gap-2">
                        <User size={11} /> Pending User Submissions ({pendingArticles.length})
                        <span className="text-white/30 font-normal normal-case tracking-normal">— Awaiting your approval.</span>
                      </p>
                      {pendingArticles.map(article => (
                        <ArticleAdminRow
                          key={article.id}
                          article={article}
                          onDelete={() => handleDeleteArticleClick(article)}
                          onPreview={() => setPreviewArticle(article)}
                          onApprove={() => updateArticleStatus(article.id, 'APPROVED')}
                          onReject={() => updateArticleStatus(article.id, 'REJECTED')}
                          isUserArticle={true}
                        />
                      ))}
                    </>
                  )}

                  {/* User articles first */}
                  {userArticles.length > 0 && (
                    <>
                      <p className="text-[11px] font-bold text-orange-400/80 uppercase tracking-widest px-1 flex items-center gap-2 mt-4">
                        <User size={11} /> Published User Submissions ({userArticles.length})
                        <span className="text-white/30 font-normal normal-case tracking-normal">— Read-only. Delete only.</span>
                      </p>
                      {userArticles.map(article => (
                        <ArticleAdminRow
                          key={article.id}
                          article={article}
                          onDelete={() => handleDeleteArticleClick(article)}
                          onPreview={() => setPreviewArticle(article)}
                          isUserArticle={true}
                        />
                      ))}
                    </>
                  )}

                  {/* Admin articles */}
                  {adminArticles.length > 0 && (
                    <>
                      <p className="text-[11px] font-bold text-blue-400/80 uppercase tracking-widest px-1 flex items-center gap-2 mt-4">
                        <Shield size={11} /> Admin Published ({adminArticles.length})
                      </p>
                      {adminArticles.map(article => (
                        <ArticleAdminRow
                          key={article.id}
                          article={article}
                          onDelete={() => handleDeleteArticleClick(article)}
                          onPreview={() => setPreviewArticle(article)}
                          isUserArticle={false}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/10 mt-6">
            {/* Section completion badges */}
            <div className="flex flex-wrap gap-1.5">
              {CONTENT_TABS.map(tab => {
                const count = getSectionCardCount(tab.key);
                return (
                  <span key={tab.key} className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${count > 0 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30'
                    }`}>
                    <tab.icon size={9} />{tab.label.split(' ')[0]} ({count})
                  </span>
                );
              })}
            </div>
            <div className="flex gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors text-sm">
                Cancel
              </button>
              <button type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-yellow-400 transition-colors text-sm">
                {editingItem ? 'Save Changes' : 'Add Tribe'}
              </button>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Tribe delete confirm */}
      <AdminDeleteConfirm
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.englishName || ''}
      />

      {/* Article delete confirm */}
      <AdminDeleteConfirm
        isOpen={isArticleDeleteOpen}
        onClose={() => { setIsArticleDeleteOpen(false); setArticleToDelete(null); }}
        onConfirm={confirmDeleteArticle}
        itemName={articleToDelete?.headline ? `"${articleToDelete.headline.substring(0, 60)}${articleToDelete.headline.length > 60 ? '...' : ''}"` : 'this article'}
      />

      {/* Article preview modal (read-only) */}
      {previewArticle && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewArticle(null)}>
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-[#0f0f18] rounded-2xl border border-white/10 shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewArticle(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
            <div className="flex items-center gap-2 mb-3">
              {previewArticle.source === 'user'
                ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold uppercase tracking-wider">User Submission</span>
                : <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider">Admin Article</span>
              }
              <span className="text-[10px] text-white/40">{previewArticle.tribe}</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-3 leading-snug">{previewArticle.headline}</h2>
            {previewArticle.image && (
              <img src={previewArticle.image} alt={previewArticle.headline} className="w-full h-40 object-cover rounded-xl mb-4" onError={e => { e.currentTarget.style.display = 'none'; }} />
            )}
            <p className="text-white/70 text-sm leading-relaxed mb-4">{previewArticle.description}</p>
            <div className="flex flex-wrap gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1"><User size={11} />{previewArticle.author}</span>
              <span className="flex items-center gap-1"><Calendar size={11} />{previewArticle.publishedDate}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{previewArticle.readTime} min read</span>
              {previewArticle.location && <span className="flex items-center gap-1"><MapPin size={11} />{previewArticle.location}</span>}
            </div>
            {previewArticle.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {previewArticle.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">{tag}</span>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTribes;
