import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { CultureItem } from './cultureData';
import type { CultureSection } from '../components/tribals/CulturalHighlightsGrid';
import { cultureData } from './cultureData';
import type { GalleryItem } from './galleryData';
import { galleryData as defaultGalleryItems } from './galleryData';
import type { TourTrip } from './tourismData';
import { featuredTrips } from './tourismData';
import type { Community, Discussion } from './communityData';
import { communities as defaultCommunities, discussions as defaultDiscussions } from './communityData';
import { product as defaultProducts } from './product';
import { tribalArticles } from './tribalArticlesData';
import type { TribalArticle } from './tribalArticlesData';
import { allDistricts, resolveDistrictImage } from './districtsData';
import type { District } from './districtsData';
import { staticDistrictDetails } from './districtDetailsData';
import type { DistrictDetail } from './districtDetailsData';

import { type SiteSettings, defaultSiteSettings } from './siteSettingsDefaults';
import { type PopularPlaceItem, defaultPopularPlaces } from './popularPlacesDefaults';
import { mockTribes } from './mockTribes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// ── Tribe type (extracted from Tribals.tsx inline data) ──
export interface TribeItem {
  id: string;
  hindiName: string;
  englishName: string;
  shortDesc: string;
  image: string;
  leftTitle?: string;
  leftDesc?: string;
  rightTitle?: string;
  rightDesc?: string;
  cultureSections?: CultureSection[];
}

// ── Product type ──
export interface ProductItem {
  id: string | number;
  businessName: string;
  productName: string;
  category: string;
  image: string;
  images: string[];
  description: string;
  address: string;
  website: string;
  mapLink: string;
  contact: string;
  email: string;
  status?: string;
}

// ── Site Settings (imported from siteSettingsDefaults.ts) ──
export type { SiteSettings };

// ── Storage keys ──
const KEYS = {
  districts: 'admin_districts_v2', // Updated key to flush out old schema data
  districtDetails: 'admin_district_details',
  culture: 'admin_culture',
  tourism: 'admin_tourism',
  gallery: 'admin_gallery',
  communities: 'admin_communities',
  discussions: 'admin_discussions',
  products: 'admin_products',
  tribes: 'admin_tribes_v2',
  tribalArticles: 'admin_tribal_articles',
  personalities: 'admin_personalities_v2',
  siteSettings: 'admin_site_settings',
  popularPlaces: 'admin_popular_places',
};

// ── Helper: load from localStorage or return default ──
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

// ── Context value type ──
interface AdminContextValue {
  // Data
  districts: District[];
  districtDetails: Record<string, DistrictDetail>;
  culture: CultureItem[];
  tourism: TourTrip[];
  gallery: GalleryItem[];
  communities: Community[];
  discussions: Discussion[];
  products: ProductItem[];
  tribes: TribeItem[];
  tribalArticles: TribalArticle[];
  siteSettings: SiteSettings;
  popularPlaces: PopularPlaceItem[];

  // CRUD operations (generic pattern)
  updateDistricts: (data: District[]) => void;
  updateDistrictDetails: (data: Record<string, DistrictDetail>) => void;
  updateCulture: (data: CultureItem[]) => void;
  updateTourism: (data: TourTrip[]) => void;
  updateGallery: (data: GalleryItem[]) => void;
  updateCommunities: (data: Community[]) => void;
  updateDiscussions: (data: Discussion[]) => void;
  updateProducts: (data: ProductItem[]) => void;
  updateTribes: (data: TribeItem[]) => void;
  updateTribalArticles: (data: TribalArticle[]) => void;
  updateSiteSettings: (data: SiteSettings) => void;
  updatePopularPlaces: (data: PopularPlaceItem[]) => void;

  // Reset
  resetSection: (section: keyof typeof KEYS) => void;

  // Refresh methods
  refreshCulture: () => Promise<void>;
  refreshTribes: () => Promise<void>;
  refreshTribalArticles: () => Promise<void>;
  updateArticleStatus: (id: string, status: string) => Promise<void>;
  addTribalArticle: (article: any) => Promise<void>;
  deleteTribalArticle: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  approveProduct: (id: string | number) => Promise<void>;
  rejectProduct: (id: string | number) => Promise<void>;
  deleteProductDetail: (id: string | number) => Promise<void>;
  updateProductDetail: (id: string | number, product: any) => Promise<void>;
  createProductDetail: (product: any) => Promise<void>;
  refreshDistricts: () => Promise<void>;
  createDistrictDetail: (district: any) => Promise<void>;
  updateDistrictDetail: (id: string, district: any) => Promise<void>;
  deleteDistrictDetail: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [districts, setDistricts] = useState<District[]>(() => loadFromStorage(KEYS.districts, allDistricts));
  const [districtDetails, setDistrictDetails] = useState<Record<string, DistrictDetail>>(() => loadFromStorage(KEYS.districtDetails, staticDistrictDetails));
  const [culture, setCulture] = useState<CultureItem[]>([]);
  const [tourism, setTourism] = useState<TourTrip[]>(() => loadFromStorage(KEYS.tourism, featuredTrips));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadFromStorage(KEYS.gallery, defaultGalleryItems));
  const [communitiesState, setCommunitiesState] = useState<Community[]>(() => {
    const loaded = loadFromStorage(KEYS.communities, defaultCommunities);
    const mockIds = ['bihar-travel', 'bihar-culture', 'bihari-food', 'bihar-festivals', 'bihar-photography', 'bihar-history', 'bihar-tribes', 'students-bihar', 'bihar-agriculture'];
    return loaded.filter(c => !mockIds.includes(c.id));
  });
  const [discussionsState, setDiscussionsState] = useState<Discussion[]>(() => loadFromStorage(KEYS.discussions, defaultDiscussions));
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [tribes, setTribes] = useState<TribeItem[]>(() => loadFromStorage(KEYS.tribes, mockTribes as any[]));
  const [tribalArticlesState, setTribalArticlesState] = useState<TribalArticle[]>(() => loadFromStorage(KEYS.tribalArticles, tribalArticles));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => loadFromStorage(KEYS.siteSettings, defaultSiteSettings));
  const [popularPlaces, setPopularPlaces] = useState<PopularPlaceItem[]>(() => loadFromStorage(KEYS.popularPlaces, defaultPopularPlaces));

  const fetchProducts = useCallback(async () => {
    const user = auth.currentUser;
    let productsUrl = `${API_BASE_URL}/marketplace`;
    const headers: any = {};

    if (user) {
      try {
        const token = await user.getIdToken();
        const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileResult = await profileRes.json();
        if (profileResult.success && profileResult.data?.user?.role === 'ADMIN') {
          productsUrl = `${API_BASE_URL}/marketplace?status=all`;
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('AdminContext: Failed to check user role:', err);
      }
    }

    try {
      const res = await fetch(productsUrl, { headers });
      const result = await res.json();
      if (result.success && result.data && result.data.products) {
        setProducts(result.data.products);
      }
    } catch (e) {
      console.error('AdminContext: Failed to fetch products:', e);
    }
  }, []);

  const fetchCulture = useCallback(async () => {
    const user = auth.currentUser;
    let discoverUrl = `${API_BASE_URL}/discover?status=all`;
    const headers: any = {};

    if (user) {
      try {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('AdminContext: Failed to get token:', err);
      }
    }

    try {
      const res = await fetch(discoverUrl, { headers });
      const result = await res.json();
      if (result.success && result.data && result.data.items) {
        const dbCulture: CultureItem[] = result.data.items.map((item: any) => {
          let itemType = 'Festival';
          if (item.category) {
            itemType = item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase();
          }
          if (item.extendedDetails && Array.isArray(item.extendedDetails)) {
            const customCatDetail = item.extendedDetails.find((d: string) => typeof d === 'string' && d.startsWith('Category: '));
            if (customCatDetail) {
              itemType = customCatDetail.replace('Category: ', '').trim();
            }
          }
          return {
            id: item.id,
            title: item.title,
            type: itemType,
            image: item.image,
            description: item.description,
            longDescription: item.longDescription || '',
            videoUrl: item.videoUrl || '',
            galleryImages: item.galleryImages || [],
            extendedDetails: item.extendedDetails || [],
            district: item.district,
            submittedBy: item.author || 'Admin',
            featured: item.featured,
            status: item.status
          };
        });
        setCulture(dbCulture);
      }
    } catch (e) {
      console.error('AdminContext: Failed to fetch discover items:', e);
    }
  }, []);

  const fetchTribes = useCallback(async () => {
    try {
      const user = auth.currentUser;
      const headers: any = {};
      let url = `${API_BASE_URL}/tribes`;
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;

        const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileResult = await profileRes.json();
        if (profileResult.success && profileResult.data?.user?.role === 'ADMIN') {
          url = `${API_BASE_URL}/tribes/admin/all`;
        }
      }
      const res = await fetch(url, { headers });
      const result = await res.json();
      if (result.success && result.data?.tribes) {
        setTribes(result.data.tribes);
      }
    } catch (e) {
      console.error('Failed to fetch tribes:', e);
    }
  }, []);

  const fetchTribalArticles = useCallback(async () => {
    try {
      const user = auth.currentUser;
      const headers: any = {};
      let url = `${API_BASE_URL}/tribes/articles`;
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;

        const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileResult = await profileRes.json();
        if (profileResult.success && profileResult.data?.user?.role === 'ADMIN') {
          url = `${API_BASE_URL}/tribes/admin/articles/all`;
        }
      }
      const res = await fetch(url, { headers });
      const result = await res.json();
      if (result.success && result.data?.articles) {
        setTribalArticlesState(result.data.articles);
      }
    } catch (e) {
      console.error('Failed to fetch tribal articles:', e);
    }
  }, []);

  const updateArticleStatus = async (id: string, status: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const action = status === 'APPROVED' ? 'approve' : 'reject';
      const res = await fetch(`${API_BASE_URL}/tribes/articles/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to update article status');
      await fetchTribalArticles();
    } catch (error) {
      console.error('Error updating article status:', error);
      throw error;
    }
  };

  const addTribalArticle = async (article: any) => {
    try {
      const user = auth.currentUser;
      const headers: any = { 'Content-Type': 'application/json' };
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE_URL}/tribes/articles`, {
        method: 'POST',
        headers,
        body: JSON.stringify(article)
      });
      const data = await res.json();
      if (data.success) {
        await fetchTribalArticles();
      }
    } catch (e) {
      console.error('Failed to add article:', e);
    }
  };

  const deleteTribalArticle = async (id: string) => {
    try {
      const user = auth.currentUser;
      const headers: any = {};
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE_URL}/tribes/articles/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (data.success) {
        setTribalArticlesState((prev) => {
          const updated = prev.filter((a) => a.id !== id);
          saveToStorage(KEYS.tribalArticles, updated);
          return updated;
        });
        await fetchTribalArticles();
      }
    } catch (e) {
      console.error('Failed to delete article:', e);
    }
  };

  const fetchDistricts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/districts`);
      const result = await res.json();
      if (result.success && result.data && result.data.districts && result.data.districts.length > 0) {
        const dbDistricts = result.data.districts.map((dist: any) => ({
          id: dist.id,
          name: dist.name,
          image: resolveDistrictImage(dist.image),
          tagline: dist.tagline || '',
          introduction: dist.introduction || '',
          richHistory: dist.richHistory || '',
          topTouristAttraction: {
            name: dist.topTouristName || '',
            details: dist.topTouristDetails || '',
          },
          seasonalVisit: dist.seasonalVisits || [],
          topAttractions: (dist.topAttractions || []).map((ta: any) => ({
            ...ta,
            image: resolveDistrictImage(ta.image)
          })),
          whyInTouristList: dist.whyInTouristList || [],
          howToReach: {
            air: dist.howToReachAir || '',
            rail: dist.howToReachRail || '',
            road: dist.howToReachRoad || '',
          }
        }));
        setDistricts(dbDistricts);
      } else {
        setDistricts(allDistricts);
      }
    } catch (e) {
      console.error('AdminContext: Failed to fetch districts:', e);
      setDistricts(allDistricts);
    }
  }, []);

  const createDistrictDetail = async (district: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const payload = {
        name: district.name,
        image: district.image || '/images/culture/hero-artwork.png',
        tagline: district.tagline || null,
        introduction: district.introduction || null,
        richHistory: district.richHistory || null,
        topTouristName: district.topTouristAttraction?.name || null,
        topTouristDetails: district.topTouristAttraction?.details || null,
        howToReachAir: district.howToReach?.air || null,
        howToReachRail: district.howToReach?.rail || null,
        howToReachRoad: district.howToReach?.road || null,
        whyInTouristList: (district.whyInTouristList || []).filter((s: string) => typeof s === 'string' && s.trim().length > 0),
        seasonalVisits: (district.seasonalVisit || []).filter((sv: any) => sv && (sv.season || sv.months || sv.weather || sv.whyVisit)),
        topAttractions: (district.topAttractions || []).filter((ta: any) => ta && (ta.name || ta.image || ta.description)),
      };

      const res = await fetch(`${API_BASE_URL}/districts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to create district');
      await fetchDistricts();
    } catch (error) {
      console.error('Error creating district:', error);
      throw error;
    }
  };

  const updateDistrictDetail = async (id: string, district: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const payload = {
        name: district.name,
        image: district.image || '/images/culture/hero-artwork.png',
        tagline: district.tagline || null,
        introduction: district.introduction || null,
        richHistory: district.richHistory || null,
        topTouristName: district.topTouristAttraction?.name || null,
        topTouristDetails: district.topTouristAttraction?.details || null,
        howToReachAir: district.howToReach?.air || null,
        howToReachRail: district.howToReach?.rail || null,
        howToReachRoad: district.howToReach?.road || null,
        whyInTouristList: (district.whyInTouristList || []).filter((s: string) => typeof s === 'string' && s.trim().length > 0),
        seasonalVisits: (district.seasonalVisit || []).filter((sv: any) => sv && (sv.season || sv.months || sv.weather || sv.whyVisit)),
        topAttractions: (district.topAttractions || []).filter((ta: any) => ta && (ta.name || ta.image || ta.description)),
      };

      const res = await fetch(`${API_BASE_URL}/districts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to update district');
      await fetchDistricts();
    } catch (error) {
      console.error('Error updating district:', error);
      throw error;
    }
  };

  const deleteDistrictDetail = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/districts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete district');
      setDistricts((prev) => {
        const updated = prev.filter((d) => d.id !== id);
        saveToStorage(KEYS.districts, updated);
        return updated;
      });
      await fetchDistricts();
    } catch (error) {
      console.error('Error deleting district:', error);
      throw error;
    }
  };

  const fetchSiteSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`);
      const result = await res.json();
      if (result.success && result.data?.settings) {
        const serverSettings = result.data.settings;
        setSiteSettings(prev => {
          const merged = { ...prev, ...serverSettings };
          // Preserve local custom heroVideo/heroImage if server returned empty strings
          if (!serverSettings.heroVideo && prev.heroVideo) {
            merged.heroVideo = prev.heroVideo;
          }
          if (!serverSettings.heroImage && prev.heroImage) {
            merged.heroImage = prev.heroImage;
          }
          saveToStorage(KEYS.siteSettings, merged);
          return merged;
        });
      }
    } catch (e) {
      console.error('AdminContext: Failed to fetch site settings:', e);
    }
  }, []);

  // Fetch public site settings immediately on mount
  useEffect(() => {
    fetchSiteSettings();
  }, [fetchSiteSettings]);

  // Fetch communities, discover items, and personalities from backend database on mount matching auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let communityUrl = `${API_BASE_URL}/community`;
      const headers: any = {};

      if (user) {
        try {
          const token = await user.getIdToken();
          const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const profileResult = await profileRes.json();
          if (profileResult.success && profileResult.data?.user?.role === 'ADMIN') {
            communityUrl = `${API_BASE_URL}/community/admin/all`;
            headers['Authorization'] = `Bearer ${token}`;
          }
        } catch (err) {
          console.error('AdminContext: Failed to check user role:', err);
        }
      }

      // Fetch Communities
      fetch(communityUrl, { headers })
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data && result.data.communities) {
            const dbCommunities = result.data.communities.map((c: any) => ({
              id: c.id,
              name: c.name,
              subtitle: c.shortDescription || c.description || '',
              image: c.bannerImageUrl || c.logoImageUrl || '/images/culture/hero-artwork.png',
              icon: c.logoImageUrl || '🌟',
              iconBg: 'bg-brand-gold',
              members: c.membersCount !== undefined ? c.membersCount : 1,
              posts: c.postsCount !== undefined ? c.postsCount : 0,
              verified: true,
              category: c.category || 'All Categories',
              aboutText: c.description || c.shortDescription || '',
              membersCount: c.membersCount || 0,
              postsCount: c.postsCount || 0,
              bannerImageUrl: c.bannerImageUrl,
              logoImageUrl: c.logoImageUrl,
              shortDescription: c.shortDescription,
              description: c.description,
              status: c.status || 'PENDING',
              createdBy: c.createdBy,
            }));
            setCommunitiesState(prev => {
              const combined = [...dbCommunities, ...prev];
              const seen = new Set();
              const mockIds = ['bihar-travel', 'bihar-culture', 'bihari-food', 'bihar-festivals', 'bihar-photography', 'bihar-history', 'bihar-tribes', 'students-bihar', 'bihar-agriculture'];
              return combined.filter(c => {
                if (mockIds.includes(c.id)) return false;
                const val = c.name || c.id;
                const duplicate = seen.has(val);
                seen.add(val);
                return !duplicate;
              });
            });
          }
        })
        .catch(err => console.error('AdminContext: Failed to fetch communities:', err));

      fetchCulture();
      fetchTribes();
      fetchTribalArticles();
      fetchProducts();
      fetchDistricts();
    });

    return () => unsubscribe();
  }, [fetchCulture, fetchTribes, fetchTribalArticles, fetchProducts, fetchDistricts]);

  // Auto-save on change
  const createUpdater = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>) =>
    useCallback((data: T) => {
      setter(data);
      saveToStorage(key, data);
    }, [key, setter]);

  const updateDistricts = createUpdater(KEYS.districts, setDistricts);
  const updateDistrictDetails = createUpdater(KEYS.districtDetails, setDistrictDetails);
  const updateCulture = createUpdater(KEYS.culture, setCulture);
  const updateTourism = createUpdater(KEYS.tourism, setTourism);
  const updateGallery = createUpdater(KEYS.gallery, setGallery);
  const updateCommunities = createUpdater(KEYS.communities, setCommunitiesState);
  const updateDiscussions = createUpdater(KEYS.discussions, setDiscussionsState);
  const updateProducts = createUpdater(KEYS.products, setProducts);
  const updateTribes = createUpdater(KEYS.tribes, setTribes);
  const updateTribalArticles = createUpdater(KEYS.tribalArticles, setTribalArticlesState);
  const updateSiteSettings = useCallback(async (data: SiteSettings) => {
    setSiteSettings(data);
    saveToStorage(KEYS.siteSettings, data);
    try {
      const user = auth.currentUser;
      const headers: any = { 'Content-Type': 'application/json' };
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('AdminContext: Failed to save site settings to server:', err);
    }
  }, []);
  const updatePopularPlaces = createUpdater(KEYS.popularPlaces, setPopularPlaces);

  const approveProduct = async (id: string | number) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/marketplace/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to approve product');
      await fetchProducts();
    } catch (error) {
      console.error('Error approving product:', error);
      throw error;
    }
  };

  const rejectProduct = async (id: string | number) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/marketplace/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to reject product');
      await fetchProducts();
    } catch (error) {
      console.error('Error rejecting product:', error);
      throw error;
    }
  };

  const deleteProductDetail = async (id: string | number) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/marketplace/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete product');
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const updateProductDetail = async (id: string | number, product: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const cleanProduct = {
        ...product,
        id: undefined, // remove id if sent
        email: product.email?.trim() || null,
        website: product.website?.trim() || null,
        mapLink: product.mapLink?.trim() || null,
        address: product.address?.trim() || null,
        contact: product.contact?.trim() || null,
      };

      const res = await fetch(`${API_BASE_URL}/marketplace/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanProduct)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to update product');
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const createProductDetail = async (product: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const cleanProduct = {
        ...product,
        email: product.email?.trim() || null,
        website: product.website?.trim() || null,
        mapLink: product.mapLink?.trim() || null,
        address: product.address?.trim() || null,
        contact: product.contact?.trim() || null,
      };

      const res = await fetch(`${API_BASE_URL}/marketplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanProduct)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to create product');
      await fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const resetSection = useCallback((section: keyof typeof KEYS) => {
    localStorage.removeItem(KEYS[section]);
    const defaults: Record<string, () => void> = {
      districts: () => setDistricts(allDistricts),
      districtDetails: () => setDistrictDetails(staticDistrictDetails),
      culture: () => setCulture([]),
      tourism: () => setTourism(featuredTrips),
      gallery: () => setGallery(defaultGalleryItems),
      communities: () => setCommunitiesState(defaultCommunities),
      discussions: () => setDiscussionsState(defaultDiscussions),
      products: () => setProducts(defaultProducts as ProductItem[]),
      tribes: () => setTribes(mockTribes as any[]),
      tribalArticles: () => setTribalArticlesState(tribalArticles),
      siteSettings: () => setSiteSettings(defaultSiteSettings),
      popularPlaces: () => setPopularPlaces(defaultPopularPlaces),
    };
    defaults[section]?.();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        districts,
        districtDetails,
        culture,
        tourism,
        gallery,
        communities: communitiesState,
        discussions: discussionsState,
        products,
        tribes,
        tribalArticles: tribalArticlesState,
        siteSettings,
        popularPlaces,
        updateDistricts,
        updateDistrictDetails,
        updateCulture,
        updateTourism,
        updateGallery,
        updateCommunities,
        updateDiscussions,
        updateProducts,
        updateTribes,
        updateTribalArticles,
        updateSiteSettings,
        updatePopularPlaces,
        resetSection,
        refreshCulture: fetchCulture,
        refreshTribes: fetchTribes,
        refreshTribalArticles: fetchTribalArticles,
        updateArticleStatus,
        addTribalArticle,
        deleteTribalArticle,
        refreshProducts: fetchProducts,
        approveProduct,
        rejectProduct,
        deleteProductDetail,
        updateProductDetail,
        createProductDetail,
        refreshDistricts: fetchDistricts,
        createDistrictDetail,
        updateDistrictDetail,
        deleteDistrictDetail
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};

export { defaultSiteSettings } from './siteSettingsDefaults';
