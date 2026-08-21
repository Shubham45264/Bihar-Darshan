import { useState, useEffect } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminImagePreview, AdminSelect, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import { Plus, Trash2, Info, LayoutList, Phone, Map, Image as ImageIcon, Clock, CheckCircle, XCircle, Tag, Building2, Star, MapPin, ListChecks, Eye, ExternalLink, Mail, User, Quote, Check } from 'lucide-react';
import type { TourTrip } from '../../data/tourismData';
import { auth } from '../../lib/firebase';
import { API_BASE_URL } from '../../config/api';

const CATEGORY_OPTIONS = [
  'Spiritual', 'Heritage', 'Wildlife', 'Nature',
  'Adventure', 'Cultural', 'Religious', 'Historical',
];

const BIHAR_DISTRICTS = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur',
  'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad',
  'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura',
  'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia',
  'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi',
  'Siwan', 'Supaul', 'Vaishali', 'West Champaran',
];

const BEST_TIME_OPTIONS = [
  'Winter (Oct - Mar)', 'Summer (Apr - Jun)',
  'Monsoon (Jul - Sep)', 'All Year Round',
];

const TRIP_DURATION_OPTIONS = [
  '1 Day', '2 Days / 1 Night', '3 Days / 2 Nights',
  '4 Days / 3 Nights', '5 Days / 4 Nights',
  '6 Days / 5 Nights', '7+ Days',
];

const RATING_OPTIONS = ['1', '2', '3', '4', '5'];

const emptyForm = {
  id: '', title: '', description: '', overviewText: '', image: '', quote: '',
  category: '', companyName: '', tripDuration: '', price: '',
  departureCity: '', bestTime: '', groupSize: '', googleMapsLink: '',
  rating: 5, userRating: 5,
  highlights: ['', '', ''] as string[],
  includedServices: ['', ''] as string[],
  excludedServices: ['', ''] as string[],
  galleryImages: [] as string[],
  guide: { name: '', image: '', experience: '', languages: [] as string[], intro: '', phone: '', email: '', whatsapp: '' },
  timeline: [] as { day: number; title: string; activities: { time: string; activity: string; description: string }[] }[],
  phone: '', whatsapp: '', email: '',
};

type TabType = 'hero' | 'intro' | 'guide' | 'details' | 'gallery' | 'timeline';
type AdminFormState = typeof emptyForm;

type SubView = 'packages' | 'journeys';
type JourneyTab = 'PENDING' | 'APPROVED' | 'REJECTED';

const InputField = ({ label, value, onChange, placeholder = '', required = false, type = 'text' }: any) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
    <input type={type} value={value} onChange={onChange} required={required} placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 transition-all placeholder-white/25" />
  </div>
);

const SelectField = ({ label, value, onChange, options, placeholder = 'Select...', required = false }: any) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
    <select value={value} onChange={onChange} required={required}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 transition-all">
      <option value="" className="bg-[#1a1a24] text-white">{placeholder}</option>
      {options.map((opt: string) => <option key={opt} value={opt} className="bg-[#1a1a24] text-white">{opt}</option>)}
    </select>
  </div>
);

const TextareaField = ({ label, value, onChange, rows = 3, placeholder = '' }: any) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">{label}</label>
    <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 transition-all resize-none placeholder-white/25" />
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
    <span className="w-1 h-4 bg-brand-gold rounded-full" />
    {children}
  </h4>
);

const GoldBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick}
    className="text-xs flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold px-3 py-1.5 rounded-lg hover:bg-brand-gold/20 transition-colors font-semibold">
    {children}
  </button>
);

const getParsedJourneyDetails = (j: any) => {
  if (!j) return j;
  let description = j.description || j.overviewText || '';
  let image = j.image || '';
  let guide = j.guide || {
    name: j.guideName || '',
    image: j.guideImage || '',
    experience: j.guideExperience || '',
    languages: j.guideLanguages || [],
    intro: j.guideIntro || '',
    phone: j.guidePhone || '',
    email: j.guideEmail || '',
    whatsapp: j.guideWhatsapp || ''
  };
  let timeline = j.timeline || [];
  let galleryImages = j.galleryImages || [];
  let quote = j.quote || '';
  let category = j.category || '';
  let companyName = j.companyName || j.author?.name || '';
  let tripDuration = j.duration || j.tripDuration || '';
  let highlights = j.highlights || [];
  let includedServices = j.includedServices || [];
  let excludedServices = j.excludedServices || [];
  let googleMapsLink = j.googleMapsLink || '';

  if (j.description && typeof j.description === 'string' && j.description.startsWith('{"__isImmersivePackage"')) {
    try {
      const parsed = JSON.parse(j.description);
      if (parsed.__isImmersivePackage) {
        description = parsed.realDescription || description;
        if (parsed.image) image = parsed.image;
        if (parsed.guide) guide = parsed.guide;
        if (parsed.timeline) timeline = parsed.timeline;
        if (parsed.galleryImages) galleryImages = parsed.galleryImages;
        if (parsed.quote) quote = parsed.quote;
        if (parsed.category) category = parsed.category;
        if (parsed.companyName) companyName = parsed.companyName;
        if (parsed.tripDuration) tripDuration = parsed.tripDuration;
        if (parsed.highlights) highlights = parsed.highlights;
        if (parsed.includedServices) includedServices = parsed.includedServices;
        if (parsed.excludedServices) excludedServices = parsed.excludedServices;
        if (parsed.googleMapsLink) googleMapsLink = parsed.googleMapsLink;
      }
    } catch (_) {}
  }

  return {
    ...j,
    description,
    image,
    guide,
    timeline,
    galleryImages,
    quote,
    category,
    companyName,
    tripDuration,
    highlights,
    includedServices,
    excludedServices,
    googleMapsLink,
  };
};

const AdminTourism = () => {
  const { tourism, updateTourism } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TourTrip | null>(null);
  const [formData, setFormData] = useState<AdminFormState>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<TourTrip | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('hero');

  // Journey moderation states
  const [subView, setSubView] = useState<SubView>('packages');
  const [journeys, setJourneys] = useState<any[]>([]);
  const [journeysSearch, setJourneysSearch] = useState('');
  const [journeysTab, setJourneysTab] = useState<JourneyTab>('PENDING');

  // Journey detailed view modal state
  const [viewingJourney, setViewingJourney] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewModalTab, setViewModalTab] = useState<'overview' | 'guide' | 'timeline' | 'gallery' | 'author'>('overview');

  // Expired Period Reminder Modal State
  const [isExpiryReminderOpen, setIsExpiryReminderOpen] = useState(false);

  const SUBSCRIPTION_PLANS = [
    { name: '10 Days Free Trial', days: 10, label: '10 Days Free Trial (10 Days - Free)' },
    { name: 'Monthly Plan', days: 30, label: 'Monthly Plan (30 Days - ₹200)' },
    { name: 'Quarterly Plan', days: 90, label: 'Quarterly Plan (90 Days - ₹500)' },
    { name: 'Half-Yearly Plan', days: 180, label: 'Half-Yearly Plan (180 Days - ₹800)' },
    { name: 'Yearly Plan', days: 365, label: 'Yearly Plan (365 Days - ₹1,300)' },
  ];

  const getDaysRemainingInfo = (journey: any) => {
    let endDate: Date;
    if (journey.freeDisplayEndDate) {
      endDate = new Date(journey.freeDisplayEndDate);
    } else if (journey.freeDisplayStartDate || journey.approvedAt || journey.createdAt) {
      const start = new Date(journey.freeDisplayStartDate || journey.approvedAt || journey.createdAt);
      const planDays = journey.planDays || 10;
      endDate = new Date(start.getTime() + planDays * 24 * 60 * 60 * 1000);
    } else {
      endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    }

    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      daysLeft: Math.max(0, daysLeft),
      isExpired: daysLeft <= 0,
      formattedEndDate: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      currentPlanName: journey.planName || (journey.planDays ? `${journey.planDays} Days Plan` : '10 Days Free Trial')
    };
  };

  const handlePlanChange = async (journeyId: string, planName: string, planDays: number) => {
    const now = new Date();
    const newEndDate = new Date(now.getTime() + planDays * 24 * 60 * 60 * 1000);

    // Optimistically update local state
    setJourneys(prev => prev.map(j => j.id === journeyId ? {
      ...j,
      planName,
      planDays,
      freeDisplayStartDate: now.toISOString(),
      freeDisplayEndDate: newEndDate.toISOString(),
      status: 'APPROVED',
    } : j));

    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';

      await fetch(`${API_BASE_URL}/journeys/${journeyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planName,
          planDays,
          freeDisplayStartDate: now.toISOString(),
          freeDisplayEndDate: newEndDate.toISOString(),
          status: 'APPROVED',
        })
      });
    } catch (err) {
      console.error('Failed to update plan:', err);
    }
  };

  const fetchJourneys = async () => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/journeys/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data?.journeys) {
        const fetchedJourneys = data.data.journeys;
        setJourneys(fetchedJourneys);
        // Check if any approved journey has free period ended
        const hasExpired = fetchedJourneys.some((j: any) => {
          if (j.status !== 'APPROVED') return false;
          let end: Date;
          if (j.freeDisplayEndDate) end = new Date(j.freeDisplayEndDate);
          else if (j.freeDisplayStartDate || j.approvedAt || j.createdAt) {
            end = new Date(new Date(j.freeDisplayStartDate || j.approvedAt || j.createdAt).getTime() + (j.planDays || 10) * 24 * 60 * 60 * 1000);
          } else return false;
          return (end.getTime() - Date.now()) <= 0;
        });
        if (hasExpired) setIsExpiryReminderOpen(true);
      }
    } catch (e) { console.error('Failed to fetch journeys for admin:', e); }
  };

  useEffect(() => { fetchJourneys(); }, []);

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvalFeedback, setApprovalFeedback] = useState<{ id: string; message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const handleApproveJourney = async (id: string) => {
    setApprovingId(id);
    setApprovalFeedback(null);
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/journeys/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        const isEmailSent = data.data?.emailStatus === 'SENT' || data.data?.emailStatus === 'ALREADY_SENT';
        setJourneys(prev => prev.map(j => j.id === id ? {
          ...j,
          status: 'APPROVED',
          approvalEmailSent: isEmailSent,
          approvalEmailSentAt: data.data?.journey?.approvalEmailSentAt || new Date().toISOString()
        } : j));
        setApprovalFeedback({
          id,
          message: data.message || 'Journey approved successfully',
          type: isEmailSent ? 'success' : 'warning',
        });
      } else {
        setApprovalFeedback({
          id,
          message: data.message || 'Failed to approve journey',
          type: 'error',
        });
      }
    } catch (e: any) {
      console.error(e);
      setApprovalFeedback({
        id,
        message: 'Network error during approval',
        type: 'error',
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectJourney = async (id: string) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/journeys/${id}/reject`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setJourneys(prev => prev.map(j => j.id === id ? { ...j, status: 'REJECTED' } : j));
    } catch (e) { console.error(e); }
  };

  // Merge static tourism packages + approved community journeys into one list
  const approvedJourneys: TourTrip[] = journeys
    .filter(j => j.status === 'APPROVED')
    .map(j => {
      let description = j.description || '';
      let image = j.image || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2000&auto=format&fit=crop";
      let guide = j.guide || (j.guideName ? {
        name: j.guideName || '',
        image: j.guideImage || '',
        experience: j.guideExperience || '',
        languages: j.guideLanguages || [],
        intro: j.guideIntro || '',
        phone: j.guidePhone || '',
        email: j.guideEmail || '',
        whatsapp: j.guideWhatsapp || ''
      } : {
        name: "Ramesh Kumar",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
        experience: "10+ Years",
        languages: ["English", "Hindi"],
        intro: "Verified Expert Guide for this custom trip.",
        phone: "+919876543210",
        email: "guide@example.com",
        whatsapp: "+919876543210"
      });
      let timeline = j.timeline || [];
      let galleryImages = j.galleryImages || [];
      let quote = j.quote || "Not just a holiday, but a journey aligned with the rich soil, spiritual structures, and legends.";
      let category = j.category || '';
      let companyName = j.companyName || j.author?.name || '';
      let tripDuration = j.duration || j.tripDuration || '';
      let highlights = j.highlights || [];
      let includedServices = j.includedServices || [];
      let excludedServices = j.excludedServices || [];
      let googleMapsLink = j.googleMapsLink || '';
      let userRating = j.userRating || 5;

      if (j.description && j.description.startsWith('{"__isImmersivePackage"')) {
        try {
          const parsed = JSON.parse(j.description);
          if (parsed.__isImmersivePackage) {
            description = parsed.realDescription || '';
            if (parsed.image) image = parsed.image;
            if (parsed.guide) guide = parsed.guide;
            if (parsed.timeline) timeline = parsed.timeline;
            if (parsed.galleryImages) galleryImages = parsed.galleryImages;
            if (parsed.quote) quote = parsed.quote;
            if (parsed.category) category = parsed.category;
            if (parsed.companyName) companyName = parsed.companyName;
            if (parsed.tripDuration) tripDuration = parsed.tripDuration;
            if (parsed.highlights) highlights = parsed.highlights;
            if (parsed.includedServices) includedServices = parsed.includedServices;
            if (parsed.excludedServices) excludedServices = parsed.excludedServices;
            if (parsed.googleMapsLink) googleMapsLink = parsed.googleMapsLink;
            if (parsed.userRating) userRating = parsed.userRating;
          }
        } catch (e) {
          console.error("Failed to parse immersive package description JSON:", e);
        }
      }

      return {
        id: j.id,
        title: j.title || '',
        provider: companyName || j.author?.name || 'Community',
        rating: j.rating || 5,
        duration: tripDuration || j.duration || '',
        departureCity: j.departureCity || j.district || '',
        places: j.stops || [],
        description,
        overviewText: j.overviewText || description,
        price: j.price || j.budget || 'Flexible',
        phone: j.phone || '',
        whatsapp: j.whatsapp || '',
        email: j.email || '',
        emergencyContact: '',
        image,
        difficulty: 'Easy' as const,
        bestTime: j.bestTime || '',
        groupSize: j.groupSize || '',
        transportation: '',
        startPoint: '',
        endPoint: '',
        guide,
        placesCoveredDetails: [],
        timeline,
        galleryImages,
        videos: [],
        mapMarkers: [],
        reviews: j.reviews || [],
        quote,
        category,
        companyName,
        tripDuration,
        highlights,
        includedServices,
        excludedServices,
        googleMapsLink,
        userRating,
        _isApprovedJourney: true,
      } as any;
    });

  const allPackages: TourTrip[] = [
    ...tourism,
    ...approvedJourneys.filter(aj => !tourism.some(t => t.id === aj.id)),
  ];

  const filteredData = allPackages.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setActiveTab('hero');
    setIsModalOpen(true);
  };

  const handleEdit = (item: TourTrip) => {
    setEditingItem(item);
    const fd: AdminFormState = {
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      overviewText: item.overviewText || '',
      image: item.image || '',
      quote: (item as any).quote || '',
      category: (item as any).category || '',
      companyName: (item as any).companyName || item.provider || '',
      tripDuration: (item as any).tripDuration || item.duration || '',
      price: item.price || '',
      departureCity: item.departureCity || '',
      bestTime: item.bestTime || '',
      groupSize: item.groupSize || '',
      googleMapsLink: (item as any).googleMapsLink || '',
      rating: item.rating || 5,
      userRating: (item as any).userRating || 5,
      highlights: (item as any).highlights?.length ? (item as any).highlights : ['', '', ''],
      includedServices: (item as any).includedServices?.length ? (item as any).includedServices : ['', ''],
      excludedServices: (item as any).excludedServices?.length ? (item as any).excludedServices : ['', ''],
      galleryImages: item.galleryImages || [],
      guide: item.guide ? {
        name: item.guide.name || '',
        image: item.guide.image || '',
        experience: item.guide.experience || '',
        languages: item.guide.languages || [],
        intro: item.guide.intro || '',
        phone: item.guide.phone || '',
        email: item.guide.email || '',
        whatsapp: item.guide.whatsapp || '',
      } : emptyForm.guide,
      timeline: item.timeline || [],
      phone: item.phone || '',
      whatsapp: item.whatsapp || '',
      email: item.email || '',
    };
    setFormData(fd);
    setActiveTab('hero');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: TourTrip) => { setItemToDelete(item); setIsDeleteOpen(true); };
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      
      const res = await fetch(`${API_BASE_URL}/journeys/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setJourneys(prev => prev.filter(j => j.id !== itemToDelete.id));
      }

      updateTourism(tourism.filter(t => t.id !== itemToDelete.id));
      await fetchJourneys();
    } catch (err) {
      console.error('Failed to delete journey:', err);
      setJourneys(prev => prev.filter(j => j.id !== itemToDelete.id));
      updateTourism(tourism.filter(t => t.id !== itemToDelete.id));
    } finally {
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const merged = {
      ...formData,
      provider: formData.companyName || 'Admin',
      duration: formData.tripDuration,
      rating: Number(formData.rating),
      userRating: Number(formData.userRating),
      highlights: formData.highlights.filter(h => h.trim()),
      includedServices: formData.includedServices.filter(s => s.trim()),
      excludedServices: formData.excludedServices.filter(s => s.trim()),
      // Flatten guide object to flat fields for API
      guideName: formData.guide.name,
      guideImage: formData.guide.image,
      guideExperience: formData.guide.experience,
      guideLanguages: formData.guide.languages,
      guideIntro: formData.guide.intro,
      guidePhone: formData.guide.phone,
      guideEmail: formData.guide.email,
      guideWhatsapp: formData.guide.whatsapp,
    } as unknown as TourTrip;

    if (editingItem && (editingItem as any)._isApprovedJourney) {
      // PATCH the community journey via API
      try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';
        await fetch(`${API_BASE_URL}/journeys/${editingItem.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(merged),
        });
        // Refresh journeys list to reflect changes
        await fetchJourneys();
      } catch (err) { console.error('Failed to update journey:', err); }
    } else if (editingItem) {
      updateTourism(tourism.map(t => t.id === editingItem.id ? { ...t, ...merged } : t));
    } else {
      updateTourism([{ ...merged, id: Date.now().toString() }, ...tourism]);
    }
    setIsModalOpen(false);
  };

  // ── Helper: array field editors ──────────────────────────────────────────
  const setArrayField = (key: 'highlights' | 'includedServices' | 'excludedServices', idx: number, val: string) => {
    const arr = [...formData[key]];
    arr[idx] = val;
    setFormData({ ...formData, [key]: arr });
  };
  const addArrayItem = (key: 'highlights' | 'includedServices' | 'excludedServices') =>
    setFormData({ ...formData, [key]: [...formData[key], ''] });
  const removeArrayItem = (key: 'highlights' | 'includedServices' | 'excludedServices', idx: number) =>
    setFormData({ ...formData, [key]: formData[key].filter((_, i) => i !== idx) });

  // ── Timeline helpers ─────────────────────────────────────────────────────
  const addTimelineDay = () => {
    setFormData({
      ...formData,
      timeline: [...formData.timeline, { day: formData.timeline.length + 1, title: '', activities: [] }]
    });
  };
  const removeTimelineDay = (idx: number) => {
    const arr = formData.timeline.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
    setFormData({ ...formData, timeline: arr });
  };
  const updateDayTitle = (idx: number, val: string) => {
    const arr = [...formData.timeline];
    arr[idx] = { ...arr[idx], title: val };
    setFormData({ ...formData, timeline: arr });
  };
  const addActivity = (dayIdx: number) => {
    const arr = [...formData.timeline];
    arr[dayIdx] = { ...arr[dayIdx], activities: [...arr[dayIdx].activities, { time: '', activity: '', description: '' }] };
    setFormData({ ...formData, timeline: arr });
  };
  const removeActivity = (dayIdx: number, actIdx: number) => {
    const arr = [...formData.timeline];
    arr[dayIdx] = { ...arr[dayIdx], activities: arr[dayIdx].activities.filter((_, i) => i !== actIdx) };
    setFormData({ ...formData, timeline: arr });
  };
  const updateActivity = (dayIdx: number, actIdx: number, field: string, val: string) => {
    const arr = [...formData.timeline];
    const acts = [...arr[dayIdx].activities];
    acts[actIdx] = { ...acts[actIdx], [field]: val };
    arr[dayIdx] = { ...arr[dayIdx], activities: acts };
    setFormData({ ...formData, timeline: arr });
  };

  // ── Tabs definition ──────────────────────────────────────────────────────
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'hero', label: 'Hero Banner', icon: ImageIcon },
    { id: 'intro', label: 'Introduction', icon: LayoutList },
    { id: 'guide', label: 'Guide & Contact', icon: Phone },
    { id: 'details', label: 'Journey Details', icon: Info },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'timeline', label: 'Timeline', icon: Map },
  ];


  return (
    <div className="space-y-6">
      {/* Sub-view Switcher */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button onClick={() => setSubView('packages')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all font-sans ${subView === 'packages' ? 'bg-brand-gold text-black' : 'text-white/60 hover:text-white bg-white/5'}`}>
          Tour Packages
        </button>
        <button onClick={() => setSubView('journeys')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 font-sans ${subView === 'journeys' ? 'bg-brand-gold text-black' : 'text-white/60 hover:text-white bg-white/5'}`}>
          Community Journeys
          {journeys.filter(j => j.status === 'PENDING').length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {journeys.filter(j => j.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {subView === 'packages' ? (
        <>
          <AdminTable
            title={`Tourism Packages (${filteredData.length})`}
            description={`Static packages + ${approvedJourneys.length} approved community journeys. All entries are fully editable.`}
            data={filteredData}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            columns={[
              {
                header: 'Image', accessor: (item: any) => (
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">No img</div>
                    }
                  </div>
                )
              },
              {
                header: 'Title', accessor: (item: any) => (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.title}</span>
                    {item._isApprovedJourney && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                        Community
                      </span>
                    )}
                  </div>
                )
              },
              { header: 'Provider / Author', accessor: 'provider' },
              {
                header: 'Duration', accessor: (item: any) => (
                  <span className="text-white/60 text-xs">{item.duration || item.tripDuration || '—'}</span>
                )
              },
            ]}
          />

          <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
            title={editingItem ? 'Edit Tour Package' : 'Add Tour Package'} maxWidth="max-w-5xl">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Tabs Sidebar */}
              <div className="w-full md:w-52 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}>
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 space-y-4 min-w-0">
                <div className="bg-black/20 p-6 rounded-2xl border border-white/10 min-h-[520px] overflow-y-auto max-h-[65vh]">

                  {/* ── TAB 1: HERO BANNER ─────────────────────────────────── */}
                  {activeTab === 'hero' && (
                    <div className="space-y-5">
                      <SectionLabel>Hero Banner</SectionLabel>
                      <InputField label="Journey Title" value={formData.title}
                        onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Mahabodhi Trail" required />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField label="Category" value={formData.category}
                          onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                          options={CATEGORY_OPTIONS} placeholder="Select Category" required />
                        <InputField label="Company / Provider Name" value={formData.companyName}
                          onChange={(e: any) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. Bihar Tours Pvt Ltd" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField label="Trip Duration" value={formData.tripDuration}
                          onChange={(e: any) => setFormData({ ...formData, tripDuration: e.target.value })}
                          options={TRIP_DURATION_OPTIONS} placeholder="Select Duration" required />
                        <InputField label="Estimated Budget" value={formData.price}
                          onChange={(e: any) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g. ₹15,000" />
                      </div>

                      <SelectField label="Departure District" value={formData.departureCity}
                        onChange={(e: any) => setFormData({ ...formData, departureCity: e.target.value })}
                        options={BIHAR_DISTRICTS} placeholder="Select District" required />

                      <TextareaField label="Short Description (Hook)" value={formData.description}
                        onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                        rows={2} placeholder="A one-line captivating hook for this journey…" />

                      <AdminImageUpload
                        label="Hero / Main Image"
                        value={formData.image}
                        onChange={val => setFormData({ ...formData, image: val })}
                        required
                      />
                    </div>
                  )}

                  {/* ── TAB 2: INTRODUCTION ────────────────────────────────── */}
                  {activeTab === 'intro' && (
                    <div className="space-y-6">
                      <SectionLabel>Journey Introduction</SectionLabel>

                      <InputField label="Journey Quote / Motto" value={formData.quote}
                        onChange={(e: any) => setFormData({ ...formData, quote: e.target.value })}
                        placeholder='e.g. "Not just a holiday, but a spiritual awakening…"' />

                      <TextareaField label="Overview / Detailed Description" value={formData.overviewText}
                        onChange={(e: any) => setFormData({ ...formData, overviewText: e.target.value })}
                        rows={5} placeholder="Describe the journey in detail…" />

                      {/* Highlights */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <SectionLabel>Journey Highlights</SectionLabel>
                          <GoldBtn onClick={() => addArrayItem('highlights')}><Plus size={13} /> Add</GoldBtn>
                        </div>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {formData.highlights.map((h, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input value={h} onChange={e => setArrayField('highlights', idx, e.target.value)}
                                placeholder={`Highlight ${idx + 1}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold/50 placeholder-white/25" />
                              <button type="button" onClick={() => removeArrayItem('highlights', idx)}
                                className="p-2 text-white/30 hover:text-red-400 bg-white/5 rounded-xl border border-white/10 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 3: GUIDE & CONTACT ─────────────────────────────── */}
                  {activeTab === 'guide' && (
                    <div className="space-y-6">
                      {/* Guide Profile */}
                      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
                        <SectionLabel>Tour Guide Profile</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Guide Name" value={formData.guide.name}
                            onChange={(e: any) => setFormData({ ...formData, guide: { ...formData.guide, name: e.target.value } })}
                            placeholder="e.g. Ramesh Kumar" />
                          <AdminImageUpload
                            label="Guide Photo"
                            value={formData.guide.image}
                            onChange={val => setFormData({ ...formData, guide: { ...formData.guide, image: val } })}
                          />
                          <InputField label="Experience" value={formData.guide.experience}
                            onChange={(e: any) => setFormData({ ...formData, guide: { ...formData.guide, experience: e.target.value } })}
                            placeholder="e.g. 10+ Years" />
                          <InputField label="Languages (comma-separated)" value={formData.guide.languages.join(', ')}
                            onChange={(e: any) => setFormData({ ...formData, guide: { ...formData.guide, languages: e.target.value.split(',').map((s: string) => s.trim()) } })}
                            placeholder="Hindi, English, Magahi" />
                        </div>
                        <TextareaField label="Guide Introduction / Bio" value={formData.guide.intro}
                          onChange={(e: any) => setFormData({ ...formData, guide: { ...formData.guide, intro: e.target.value } })}
                          rows={2} placeholder="A short intro about the guide…" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Guide Phone Number" value={formData.guide.phone}
                            onChange={(e: any) => setFormData({ ...formData, guide: { ...formData.guide, phone: e.target.value } })}
                            placeholder="+919876543210" />
                          <InputField label="Guide WhatsApp Number" value={formData.guide.whatsapp}
                            onChange={(e: any) => setFormData({ ...formData, guide: { ...formData.guide, whatsapp: e.target.value } })}
                            placeholder="+919876543210" />
                        </div>
                        <InputField label="Guide Email" value={formData.guide.email}
                          onChange={(e: any) => setFormData({ ...formData, guide: { ...formData.guide, email: e.target.value } })}
                          placeholder="guide@example.com" type="email" required />
                      </div>

                      {/* Ratings */}
                      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
                        <SectionLabel>Ratings</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SelectField label="Guide / Trip Rating (1–5 ★)" value={String(formData.rating)}
                            onChange={(e: any) => setFormData({ ...formData, rating: Number(e.target.value) })}
                            options={RATING_OPTIONS} placeholder="Select Rating" />
                          <SelectField label="Your Own Rating (1–5 ★)" value={String(formData.userRating)}
                            onChange={(e: any) => setFormData({ ...formData, userRating: Number(e.target.value) })}
                            options={RATING_OPTIONS} placeholder="Select Rating" />
                        </div>
                      </div>

                      {/* Agency Contact */}
                      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
                        <SectionLabel>Agency Contact Info</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Agency Phone" value={formData.phone}
                            onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+919876543210" />
                          <InputField label="Agency WhatsApp" value={formData.whatsapp}
                            onChange={(e: any) => setFormData({ ...formData, whatsapp: e.target.value })}
                            placeholder="+919876543210" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 4: JOURNEY DETAILS ─────────────────────────────── */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <SectionLabel>Journey Details</SectionLabel>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField label="Best Time to Visit" value={formData.bestTime}
                          onChange={(e: any) => setFormData({ ...formData, bestTime: e.target.value })}
                          options={BEST_TIME_OPTIONS} placeholder="Select Best Time" />
                        <InputField label="Group Size" value={formData.groupSize}
                          onChange={(e: any) => setFormData({ ...formData, groupSize: e.target.value })}
                          placeholder="e.g. 2–15 people" />
                      </div>

                      <InputField label="Google Maps Link" value={formData.googleMapsLink}
                        onChange={(e: any) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                        placeholder="https://maps.google.com/..." />

                      {/* Included Services */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <SectionLabel>Included Services ✅</SectionLabel>
                          <GoldBtn onClick={() => addArrayItem('includedServices')}><Plus size={13} /> Add</GoldBtn>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {formData.includedServices.map((s, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input value={s} onChange={e => setArrayField('includedServices', idx, e.target.value)}
                                placeholder={`Included service ${idx + 1}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold/50 placeholder-white/25" />
                              <button type="button" onClick={() => removeArrayItem('includedServices', idx)}
                                className="p-2 text-white/30 hover:text-red-400 bg-white/5 rounded-xl border border-white/10 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Excluded Services */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <SectionLabel>Excluded Services ❌</SectionLabel>
                          <GoldBtn onClick={() => addArrayItem('excludedServices')}><Plus size={13} /> Add</GoldBtn>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {formData.excludedServices.map((s, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input value={s} onChange={e => setArrayField('excludedServices', idx, e.target.value)}
                                placeholder={`Not included ${idx + 1}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold/50 placeholder-white/25" />
                              <button type="button" onClick={() => removeArrayItem('excludedServices', idx)}
                                className="p-2 text-white/30 hover:text-red-400 bg-white/5 rounded-xl border border-white/10 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 5: GALLERY ─────────────────────────────────────── */}
                  {activeTab === 'gallery' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <SectionLabel>Gallery Images</SectionLabel>
                        <GoldBtn onClick={() => setFormData({ ...formData, galleryImages: [...formData.galleryImages, ''] })}>
                          <Plus size={13} /> Add Image URL
                        </GoldBtn>
                      </div>
                      <p className="text-white/40 text-xs">Add image URLs for the gallery. The first image is used as the cover if no hero image is set.</p>
                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {formData.galleryImages.map((url, idx) => (
                          <div key={idx} className="relative group p-4 bg-white/5 rounded-xl border border-white/10">
                            <button type="button" onClick={() => { const arr = [...formData.galleryImages]; arr.splice(idx, 1); setFormData({ ...formData, galleryImages: arr }); }}
                              className="absolute top-2 right-2 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <Trash2 size={16} />
                            </button>
                            <AdminImageUpload
                              label={`Gallery Image ${idx + 1}`}
                              value={url}
                              onChange={(val) => {
                                const arr = [...formData.galleryImages];
                                arr[idx] = val;
                                setFormData({ ...formData, galleryImages: arr });
                              }}
                            />
                          </div>
                        ))}
                        {formData.galleryImages.length === 0 && (
                          <p className="text-white/30 text-sm text-center py-8">No gallery images yet. Click "Add Image URL" to start.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 6: TIMELINE ────────────────────────────────────── */}
                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <SectionLabel>Journey Timeline (Day by Day)</SectionLabel>
                        <GoldBtn onClick={addTimelineDay}><Plus size={13} /> Add Day</GoldBtn>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                        {formData.timeline.map((day, dayIdx) => (
                          <div key={dayIdx} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            {/* Day Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-9 h-9 rounded-xl bg-brand-gold flex items-center justify-center text-black font-black text-sm shrink-0">
                                {day.day}
                              </div>
                              <input value={day.title} onChange={e => updateDayTitle(dayIdx, e.target.value)}
                                placeholder={`Day ${day.day} title (e.g. Arrival & Sightseeing)`}
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold/50" />
                              <button type="button" onClick={() => removeTimelineDay(dayIdx)}
                                className="p-2 text-white/30 hover:text-red-400 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Activities */}
                            <div className="pl-3 border-l-2 border-brand-gold/30 space-y-3 ml-4">
                              {day.activities.map((act, actIdx) => (
                                <div key={actIdx} className="relative bg-black/20 rounded-xl p-3 group">
                                  <button type="button" onClick={() => removeActivity(dayIdx, actIdx)}
                                    className="absolute top-2 right-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={13} />
                                  </button>
                                  <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input value={act.time} onChange={e => updateActivity(dayIdx, actIdx, 'time', e.target.value)}
                                      placeholder="Time (e.g. 9:00 AM)"
                                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-brand-gold/50 placeholder-white/25" />
                                    <input value={act.activity} onChange={e => updateActivity(dayIdx, actIdx, 'activity', e.target.value)}
                                      placeholder="Activity name"
                                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-brand-gold/50 placeholder-white/25" />
                                  </div>
                                  <textarea value={act.description} onChange={e => updateActivity(dayIdx, actIdx, 'description', e.target.value)}
                                    placeholder="Activity description…" rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-brand-gold/50 resize-none placeholder-white/25" />
                                </div>
                              ))}
                              <button type="button" onClick={() => addActivity(dayIdx)}
                                className="text-xs text-brand-gold hover:text-yellow-400 font-semibold transition-colors">
                                + Add Activity
                              </button>
                            </div>
                          </div>
                        ))}
                        {formData.timeline.length === 0 && (
                          <p className="text-white/30 text-sm text-center py-8">No timeline days yet. Click "Add Day" to start building the itinerary.</p>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {tabs.map((t, idx) => (
                      <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
                        className={`w-2 h-2 rounded-full transition-all ${activeTab === t.id ? 'bg-brand-gold scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                        title={t.label} />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors">
                      Cancel
                    </button>
                    <button type="submit"
                      className="px-6 py-2.5 rounded-xl bg-brand-gold text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-brand-gold/20 hover:scale-[1.02]">
                      {editingItem ? 'Save Changes' : 'Add Package'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </AdminModal>

          <AdminDeleteConfirm isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}
            onConfirm={confirmDelete} itemName={itemToDelete?.title || ''} />
        </>
      ) : (
        /* ── COMMUNITY JOURNEYS MODERATION ────────────────────────────────── */
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-display tracking-tight">Community Journeys</h2>
              <p className="text-white/40 text-sm mt-1">Review and approve customer-created itineraries.</p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5">
              <Clock size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">{journeys.filter(j => j.status === 'PENDING').length} awaiting review</span>
            </div>
          </div>

          <div className="flex gap-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1.5">
            {(['PENDING', 'APPROVED', 'REJECTED'] as const).map(key => {
              const count = journeys.filter(j => j.status === key).length;
              return (
                <button key={key} onClick={() => setJourneysTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${journeysTab === key
                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                  {key === 'PENDING' && <Clock size={15} />}
                  {key === 'APPROVED' && <CheckCircle size={15} />}
                  {key === 'REJECTED' && <XCircle size={15} />}
                  <span className="hidden sm:inline">{key === 'PENDING' ? 'Pending' : key === 'APPROVED' ? 'Approved' : 'Rejected'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${journeysTab === key ? 'bg-black/20 text-black' : 'bg-white/10 text-white/60'}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <input type="text" value={journeysSearch} onChange={e => setJourneysSearch(e.target.value)} placeholder="Search journeys…"
            className="w-full bg-[#1E1E1E]/40 border border-white/10 rounded-xl pl-4 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold/40 transition-colors" />

          <div className="space-y-4">
            {journeys
              .filter(j => j.status === journeysTab && j.title.toLowerCase().includes(journeysSearch.toLowerCase()))
              .map(journey => (
                <div key={journey.id} className="bg-[#1E1E1E]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-white font-serif">{journey.title}</h3>
                        <span className="text-xs bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/20 font-bold uppercase tracking-wider">{journey.duration || 'Flexible'}</span>
                      </div>
                      {(() => {
                        let desc = journey.description || '';
                        if (desc.startsWith('{"__isImmersivePackage"')) {
                          try { const p = JSON.parse(desc); if (p.__isImmersivePackage) desc = p.realDescription || ''; } catch (_) { }
                        }
                        return <p className="text-white/75 text-sm max-w-3xl leading-relaxed">{desc}</p>;
                      })()}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-white/50 pt-1 font-mono">
                        {journey.author && <span>By: <strong className="text-white/80">{journey.author.name}</strong></span>}
                        {journey.budget && <span>Budget: <strong className="text-white/80">{journey.budget}</strong></span>}
                        {journey.district && <span>District: <strong className="text-white/80">{journey.district}</strong></span>}
                        {journey.status === 'APPROVED' && (
                          <>
                            <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded border ${
                              journey.approvalEmailSent
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                              {journey.approvalEmailSent ? '✉️ Email Sent' : '⚠️ Email Not Sent'}
                            </span>

                            {(() => {
                              const daysInfo = getDaysRemainingInfo(journey);
                              return (
                                <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded border ${
                                  daysInfo.isExpired
                                    ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                                }`}>
                                  {daysInfo.isExpired
                                    ? '🚨 Free Period Ended (0 Days Left)'
                                    : `⏳ ${daysInfo.daysLeft} Days Left (${daysInfo.currentPlanName})`}
                                </span>
                              );
                            })()}
                          </>
                        )}
                      </div>

                      {journey.status === 'APPROVED' && (
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-xs text-brand-gold/90 font-semibold">Update Plan:</span>
                          <select
                            value={journey.planName || "10 Days Free Trial"}
                            onChange={(e) => {
                              const selected = SUBSCRIPTION_PLANS.find(p => p.name === e.target.value);
                              if (selected) handlePlanChange(journey.id, selected.name, selected.days);
                            }}
                            className="bg-[#1a1a24] border border-brand-gold/40 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-brand-gold"
                          >
                            {SUBSCRIPTION_PLANS.map(plan => (
                              <option key={plan.name} value={plan.name}>
                                {plan.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => { setViewingJourney(journey); setViewModalTab('overview'); setIsViewModalOpen(true); }}
                        className="bg-white/10 border border-white/15 text-white px-3.5 py-2.5 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-semibold">
                        <Eye size={16} /> View Details
                      </button>
                      {journeysTab === 'PENDING' && (
                        <>
                          <button onClick={() => handleRejectJourney(journey.id)} disabled={approvingId === journey.id}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                            <XCircle size={16} /> Reject
                          </button>
                          <button onClick={() => handleApproveJourney(journey.id)} disabled={approvingId === journey.id}
                            className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-4 py-2.5 rounded-xl hover:bg-emerald-500/25 transition-all flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                            <CheckCircle size={16} />
                            {approvingId === journey.id ? 'Approving...' : 'Approve & Send Email'}
                          </button>
                        </>
                      )}
                      {journeysTab === 'APPROVED' && (
                        <>
                          {!journey.approvalEmailSent && (
                            <button onClick={() => handleApproveJourney(journey.id)} disabled={approvingId === journey.id}
                              className="bg-brand-gold/15 border border-brand-gold/25 text-brand-gold px-3.5 py-2.5 rounded-xl hover:bg-brand-gold/25 transition-all flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                              ✉️ {approvingId === journey.id ? 'Sending...' : 'Send Email'}
                            </button>
                          )}
                          <button onClick={() => handleRejectJourney(journey.id)} disabled={approvingId === journey.id}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                            <XCircle size={16} /> Revoke
                          </button>
                        </>
                      )}
                      {journeysTab === 'REJECTED' && (
                        <button onClick={() => handleApproveJourney(journey.id)} disabled={approvingId === journey.id}
                          className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-4 py-2.5 rounded-xl hover:bg-emerald-500/25 transition-all flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                          <CheckCircle size={16} />
                          {approvingId === journey.id ? 'Approving...' : 'Re-Approve'}
                        </button>
                      )}
                    </div>
                  </div>

                  {approvalFeedback && approvalFeedback.id === journey.id && (
                    <div className={`mt-3 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      approvalFeedback.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : approvalFeedback.type === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      <Info size={14} />
                      <span>{approvalFeedback.message}</span>
                    </div>
                  )}
                </div>
              ))}
            {journeys.filter(j => j.status === journeysTab && j.title.toLowerCase().includes(journeysSearch.toLowerCase())).length === 0 && (
              <div className="text-center py-12 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
                <Clock className="mx-auto text-white/20 mb-3" size={40} />
                <p className="text-white/40 font-medium font-sans">No journeys found in this tab.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIEW JOURNEY DETAILS MODAL ────────────────────────────────────── */}
      {isViewModalOpen && viewingJourney && (
        <AdminModal
          isOpen={isViewModalOpen}
          onClose={() => { setIsViewModalOpen(false); setViewingJourney(null); }}
          title={`Review Listing Request: ${viewingJourney.title}`}
          maxWidth="max-w-5xl"
        >
          {(() => {
            const pj = getParsedJourneyDetails(viewingJourney);
            const isApproved = pj.status === 'APPROVED';
            const isPending = pj.status === 'PENDING';
            const isRejected = pj.status === 'REJECTED';

            return (
              <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
                {/* Header Action & Status Bar */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      isRejected ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {pj.status}
                    </span>
                    {isApproved && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        pj.approvalEmailSent
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {pj.approvalEmailSent ? '✉️ Approval Email Sent' : '⚠️ Email Not Sent Yet'}
                      </span>
                    )}
                    <span className="text-white/50 text-xs font-mono">
                      Submitted: {pj.createdAt ? new Date(pj.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {(isPending || isRejected) && (
                      <>
                        <button
                          onClick={() => { handleRejectJourney(pj.id); setIsViewModalOpen(false); }}
                          disabled={approvingId === pj.id}
                          className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-50"
                        >
                          <XCircle size={15} /> Reject
                        </button>
                        <button
                          onClick={() => { handleApproveJourney(pj.id); setIsViewModalOpen(false); }}
                          disabled={approvingId === pj.id}
                          className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-500/30 transition-all flex items-center gap-2 text-xs font-bold shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                        >
                          <CheckCircle size={15} /> Approve & Send Email
                        </button>
                      </>
                    )}
                    {isApproved && (
                      <>
                        {!pj.approvalEmailSent && (
                          <button
                            onClick={() => handleApproveJourney(pj.id)}
                            disabled={approvingId === pj.id}
                            className="bg-brand-gold/20 border border-brand-gold/30 text-brand-gold px-4 py-2 rounded-xl hover:bg-brand-gold/30 transition-all flex items-center gap-2 text-xs font-bold disabled:opacity-50"
                          >
                            ✉️ Send Email
                          </button>
                        )}
                        <button
                          onClick={() => { handleRejectJourney(pj.id); setIsViewModalOpen(false); }}
                          disabled={approvingId === pj.id}
                          className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-50"
                        >
                          <XCircle size={15} /> Revoke
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Hero Banner Preview */}
                <div className="relative h-56 rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                  {pj.image ? (
                    <img src={pj.image} alt={pj.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">No Banner Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {pj.category && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2.5 py-0.5 rounded-full">
                          {pj.category}
                        </span>
                      )}
                      {pj.companyName && (
                        <span className="text-xs text-white/80 font-semibold flex items-center gap-1">
                          <Building2 size={12} /> {pj.companyName}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white font-serif">{pj.title}</h2>
                    <div className="flex items-center gap-4 text-xs text-brand-gold font-semibold mt-1">
                      <span>⏱ {pj.tripDuration || pj.duration || 'Flexible'}</span>
                      <span>📍 {pj.district || 'Bihar'}</span>
                      <span>💰 {pj.price || pj.budget || 'Flexible'}</span>
                    </div>
                  </div>
                </div>

                {/* Section Navigation Tabs inside Modal */}
                <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview & Services', icon: LayoutList },
                    { id: 'guide', label: 'Guide & Contact', icon: Phone },
                    { id: 'timeline', label: 'Itinerary Timeline', icon: Map },
                    { id: 'gallery', label: `Gallery (${pj.galleryImages?.length || 0})`, icon: ImageIcon },
                    { id: 'author', label: 'Submitter Info', icon: User },
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setViewModalTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                          viewModalTab === tab.id
                            ? 'bg-brand-gold text-black shadow-md shadow-brand-gold/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon size={14} /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* ── VIEW TAB 1: OVERVIEW & SERVICES ───────────────────────── */}
                {viewModalTab === 'overview' && (
                  <div className="space-y-5">
                    {pj.shortDesc && (
                      <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-4">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block mb-1">Tagline / Hook</span>
                        <p className="text-white text-sm italic">"{pj.shortDesc}"</p>
                      </div>
                    )}

                    {pj.quote && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3">
                        <Quote size={20} className="text-brand-gold shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Quote</span>
                          <p className="text-white/90 text-sm italic font-serif">"{pj.quote}"</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2">
                      <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">Full Description / Overview</h4>
                      <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{pj.description || 'No description provided.'}</p>
                    </div>

                    {/* Key Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span className="text-white/40 text-xs block mb-1">Best Time to Visit</span>
                        <span className="text-white font-semibold text-sm">{pj.bestTime || 'Not specified'}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span className="text-white/40 text-xs block mb-1">Group Size</span>
                        <span className="text-white font-semibold text-sm">{pj.groupSize || 'Flexible'}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span className="text-white/40 text-xs block mb-1">Google Maps</span>
                        {pj.googleMapsLink ? (
                          <a href={pj.googleMapsLink} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline text-xs flex items-center gap-1">
                            <ExternalLink size={12} /> Open Map Link
                          </a>
                        ) : (
                          <span className="text-white/30 text-xs">Not provided</span>
                        )}
                      </div>
                    </div>

                    {/* Highlights */}
                    {pj.highlights && pj.highlights.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" /> Journey Highlights
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {pj.highlights.map((h: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-white/90 bg-black/20 p-2.5 rounded-lg border border-white/5">
                              <span className="text-brand-gold">✦</span> {h}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Included & Excluded Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Included */}
                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle size={14} /> Included Services
                        </h4>
                        {pj.includedServices && pj.includedServices.length > 0 ? (
                          <ul className="space-y-1.5">
                            {pj.includedServices.map((s: string, idx: number) => (
                              <li key={idx} className="text-xs text-white/80 flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> {s}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-white/30 text-xs block">None specified</span>
                        )}
                      </div>

                      {/* Excluded */}
                      <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                          <XCircle size={14} /> Excluded Services
                        </h4>
                        {pj.excludedServices && pj.excludedServices.length > 0 ? (
                          <ul className="space-y-1.5">
                            {pj.excludedServices.map((s: string, idx: number) => (
                              <li key={idx} className="text-xs text-white/80 flex items-center gap-2">
                                <span className="text-red-400">✗</span> {s}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-white/30 text-xs block">None specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── VIEW TAB 2: GUIDE & CONTACT ──────────────────────────── */}
                {viewModalTab === 'guide' && (
                  <div className="space-y-5">
                    {/* Guide Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40 border-2 border-brand-gold/30 shrink-0">
                        {pj.guide?.image ? (
                          <img src={pj.guide.image} alt={pj.guide.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Photo</div>
                        )}
                      </div>
                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <h3 className="text-lg font-bold text-white">{pj.guide?.name || 'Community Guide'}</h3>
                          <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded font-bold uppercase">
                            Verified Guide
                          </span>
                        </div>
                        {pj.guide?.intro && <p className="text-white/70 text-xs italic">{pj.guide.intro}</p>}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-2 justify-center sm:justify-start">
                          <span>Experience: <strong className="text-white">{pj.guide?.experience || 'Not specified'}</strong></span>
                          <span>Languages: <strong className="text-white">{Array.isArray(pj.guide?.languages) ? pj.guide.languages.join(', ') : (pj.guide?.languages || 'Hindi, English')}</strong></span>
                          <span>Rating: <strong className="text-brand-gold">★ {pj.rating || 5} / 5</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Channels */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                        <span className="text-white/40 text-xs flex items-center gap-1"><Phone size={12} /> Call Phone</span>
                        <span className="text-white font-mono text-sm font-semibold">{pj.phone || pj.guide?.phone || 'Not provided'}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                        <span className="text-white/40 text-xs flex items-center gap-1"><Phone size={12} /> WhatsApp</span>
                        <span className="text-emerald-400 font-mono text-sm font-semibold">{pj.whatsapp || pj.guide?.whatsapp || 'Not provided'}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                        <span className="text-white/40 text-xs flex items-center gap-1"><Mail size={12} /> Guide Email</span>
                        <span className="text-white font-mono text-xs font-semibold block truncate">{pj.guide?.email || pj.email || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── VIEW TAB 3: TIMELINE ─────────────────────────────────── */}
                {viewModalTab === 'timeline' && (
                  <div className="space-y-4">
                    {pj.timeline && pj.timeline.length > 0 ? (
                      pj.timeline.map((day: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-gold text-black font-black text-sm flex items-center justify-center shrink-0">
                              {day.day || idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-white font-serif">{day.title || `Day ${day.day || idx + 1}`}</h4>
                          </div>
                          {day.activities && day.activities.length > 0 && (
                            <div className="pl-4 border-l-2 border-brand-gold/30 ml-4 space-y-3 pt-1">
                              {day.activities.map((act: any, aIdx: number) => (
                                <div key={aIdx} className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-white">{act.activity || act.title || 'Sightseeing'}</span>
                                    <span className="text-brand-gold font-mono">{act.time || 'Flexible'}</span>
                                  </div>
                                  {act.description && <p className="text-white/70 text-xs leading-relaxed">{act.description}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-white/30 text-sm text-center py-8">No day-by-day itinerary was provided for this journey.</p>
                    )}
                  </div>
                )}

                {/* ── VIEW TAB 4: GALLERY ──────────────────────────────────── */}
                {viewModalTab === 'gallery' && (
                  <div className="space-y-4">
                    {pj.galleryImages && pj.galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {pj.galleryImages.map((imgUrl: string, idx: number) => (
                          <div key={idx} className="h-40 rounded-xl overflow-hidden bg-black/40 border border-white/10 group relative">
                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <a href={imgUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/30 text-sm text-center py-8">No gallery images uploaded for this listing.</p>
                    )}
                  </div>
                )}

                {/* ── VIEW TAB 5: SUBMITTER INFO ───────────────────────────── */}
                {viewModalTab === 'author' && (
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                      <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Contributor / Author Metadata</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1">
                          <span className="text-white/40 block">Author Name</span>
                          <span className="text-white font-semibold text-sm">{pj.author?.name || pj.companyName || 'Anonymous'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-white/40 block">Author Email</span>
                          <span className="text-emerald-400 font-semibold text-sm">{pj.author?.email || pj.email || 'Not provided'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-white/40 block">Submission Date</span>
                          <span className="text-white/80">{pj.createdAt ? new Date(pj.createdAt).toLocaleString() : 'N/A'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-white/40 block">Journey ID</span>
                          <span className="text-white/60">{pj.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </AdminModal>
      )}

      {/* ── EXPIRED DISPLAY PERIOD REMINDER POPUP MODAL ───────────────────────── */}
      {isExpiryReminderOpen && (
        <AdminModal
          isOpen={isExpiryReminderOpen}
          onClose={() => setIsExpiryReminderOpen(false)}
          title="🚨 Free Display Period Ended - Renewal Required"
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-400">
              <Clock size={24} className="shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <h4 className="font-bold text-white text-base">Free Trial Display Period Expired</h4>
                <p className="text-white/80">
                  The 10-day free display period has ended for the following approved listings. Select a plan from the dropdown to update and start a new days counter.
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {journeys
                .filter(j => j.status === 'APPROVED' && getDaysRemainingInfo(j).isExpired)
                .map(expJourney => {
                  const info = getDaysRemainingInfo(expJourney);
                  return (
                    <div key={expJourney.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-white text-sm font-serif">{expJourney.title}</h5>
                        <p className="text-xs text-white/50 font-mono mt-0.5">Author: {expJourney.author?.name || expJourney.companyName || 'Community'} | Expired on: {info.formattedEndDate}</p>
                        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full inline-block mt-1.5 animate-pulse">
                          🚨 0 Days Left (Free Period Ended)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={expJourney.planName || "10 Days Free Trial"}
                          onChange={(e) => {
                            const selected = SUBSCRIPTION_PLANS.find(p => p.name === e.target.value);
                            if (selected) handlePlanChange(expJourney.id, selected.name, selected.days);
                          }}
                          className="bg-[#1a1a24] border border-brand-gold/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-brand-gold shadow-md"
                        >
                          {SUBSCRIPTION_PLANS.map(plan => (
                            <option key={plan.name} value={plan.name}>
                              {plan.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              {journeys.filter(j => j.status === 'APPROVED' && getDaysRemainingInfo(j).isExpired).length === 0 && (
                <p className="text-white/40 text-sm text-center py-6">All active listings have active subscription plans.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setIsExpiryReminderOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-brand-gold text-black font-bold text-xs hover:bg-yellow-400 transition-all shadow-lg"
              >
                Done / Close Reminder
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminTourism;
