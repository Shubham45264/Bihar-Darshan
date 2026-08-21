import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CultureItem } from './cultureData';
import type { GalleryItem } from './galleryData';
import type { TourTrip } from './tourismData';

import type { Community } from './communityData';
import { auth } from '../lib/firebase';
import { API_BASE_URL } from '../config/api';

export interface JourneySubmissionItem extends TourTrip {
  desc: string;
  authorId?: string;
}

export interface ProductItem {
  id: string | number;
  businessName: string;
  productName: string;
  category: string;
  image: string;
  images: string[];
  description: string;
  address?: string;
  website?: string;
  mapLink?: string;
  contact?: string;
  email?: string;
  status?: string;
  planName?: string;
  planDays?: number;
  freeDisplayStartDate?: string;
  freeDisplayEndDate?: string;
}

interface ContributionContextValue {
  cultureSubmissions: CultureItem[];
  gallerySubmissions: GalleryItem[];
  journeySubmissions: JourneySubmissionItem[];
  communitySubmissions: Community[];
  productSubmissions: ProductItem[];
  addCultureSubmission: (submission: Omit<CultureItem, 'id' | 'featured'>) => void;
  addGallerySubmission: (submission: Omit<GalleryItem, 'id' | 'likes' | 'views' | 'comments' | 'uploadDate'>) => void;
  addJourneySubmission: (submission: any) => void;
  updateJourneySubmission: (id: string, submission: any) => Promise<void>;
  addCommunitySubmission: (submission: Omit<Community, 'id' | 'members' | 'posts' | 'online' | 'verified' | 'createdOn'>) => void;
  addProductSubmission: (submission: Omit<ProductItem, 'id'>) => Promise<void>;
  refreshJourneys: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ContributionContext = createContext<ContributionContextValue>({
  cultureSubmissions: [],
  gallerySubmissions: [],
  journeySubmissions: [],
  communitySubmissions: [],
  productSubmissions: [],
  addCultureSubmission: () => { },
  addGallerySubmission: () => { },
  addJourneySubmission: () => { },
  updateJourneySubmission: async () => { },
  addCommunitySubmission: () => { },
  addProductSubmission: async () => { },
  refreshJourneys: async () => { },
  refreshProducts: async () => { },
});

export const ContributionProvider = ({ children }: { children: React.ReactNode }) => {
  const [cultureSubmissions, setCultureSubmissions] = useState<CultureItem[]>([]);
  const [gallerySubmissions, setGallerySubmissions] = useState<GalleryItem[]>([]);
  const [journeySubmissions, setJourneySubmissions] = useState<JourneySubmissionItem[]>([]);
  const [communitySubmissions, setCommunitySubmissions] = useState<Community[]>([]);
  const [productSubmissions, setProductSubmissions] = useState<ProductItem[]>([]);

  const fetchApprovedJourneys = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/journeys`);
      const result = await res.json();
      if (result.success && result.data && result.data.journeys) {
        const dbJourneys = result.data.journeys.map((j: any) => {
          let description = j.description || j.overviewText || '';
          let image = j.image || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2000&auto=format&fit=crop";

          let guide = {
            name: j.guideName || "Ramesh Kumar",
            image: j.guideImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
            experience: j.guideExperience || "10+ Years",
            languages: j.guideLanguages || ["English", "Hindi"],
            intro: j.guideIntro || "Verified Expert Guide for this custom trip.",
            phone: j.guidePhone || "+919876543210",
            email: j.guideEmail || "guide@example.com",
            whatsapp: j.guideWhatsapp || "+919876543210"
          };

          return {
            id: j.id,
            title: j.title,
            desc: j.shortDesc || description.slice(0, 100) + '...',
            description,
            image,
            duration: j.tripDuration || j.duration || "1 Day Trip",
            authorId: j.authorId,
            overviewText: j.overviewText || description,
            provider: j.companyName || "Community Contributor",
            providerLogo: "https://cdn-icons-png.flaticon.com/512/3233/3233481.png",
            departureCity: j.district || "Patna",
            places: j.stops || [],
            price: j.price || j.budget || "Flexible",
            phone: j.phone || "+919876543210",
            whatsapp: j.whatsapp || "+919876543210",
            difficulty: j.difficulty || "Easy",
            bestTime: j.bestTime || "October to March",
            groupSize: j.groupSize || "Flexible",
            transportation: j.transportation || "Custom Arranged",
            startPoint: j.startPoint || "Patna",
            endPoint: j.endPoint || "Patna",
            emergencyContact: j.emergencyContact || "+919876543210",
            email: j.email || "contributor@example.com",
            guide,
            placesCoveredDetails: [],
            timeline: j.timeline || [],
            galleryImages: j.galleryImages || [],
            videos: [],
            mapMarkers: [],
            reviews: [],
            quote: j.quote || "Not just a holiday, but a journey aligned with the rich soil, spiritual structures, and legends.",
            category: j.category || '',
            companyName: j.companyName || '',
            tripDuration: j.tripDuration || j.duration || '',
            highlights: j.highlights || [],
            includedServices: j.includedServices || [],
            excludedServices: j.excludedServices || [],
            googleMapsLink: j.googleMapsLink || '',
            rating: j.rating || 5,
            userRating: j.userRating || 5
          };
        });
        setJourneySubmissions(dbJourneys);
      }
    } catch (err) {
      console.error('Failed to fetch journeys:', err);
      // Set empty array on failure instead of loading from local storage
      setJourneySubmissions([]);
    }
  }, []);

  const fetchApprovedProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/marketplace`);
      const result = await res.json();
      if (result.success && result.data && result.data.products) {
        setProductSubmissions(result.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProductSubmissions([]);
    }
  }, []);

  // Load submissions from localStorage on mount
  useEffect(() => {
    try {
      // Clear local storage for culture and personality submissions to prevent old/unapproved cached items from displaying
      localStorage.removeItem('bihar_culture_submissions');
      localStorage.removeItem('bihar_personality_submissions');

      const storedGallery = localStorage.getItem('bihar_gallery_submissions');
      if (storedGallery) setGallerySubmissions(JSON.parse(storedGallery));

      localStorage.removeItem('bihar_journey_submissions');
      fetchApprovedJourneys();

      const storedCommunities = localStorage.getItem('bihar_community_submissions');
      if (storedCommunities) setCommunitySubmissions(JSON.parse(storedCommunities));

      localStorage.removeItem('bihar_product_submissions');
      fetchApprovedProducts();

      // Clear old local storage to prevent conflicts with the new API
      localStorage.removeItem('bihar_community_submissions');

      // Fetch communities from backend
      fetch(`${API_BASE_URL}/community`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data && result.data.communities) {
            setCommunitySubmissions(result.data.communities);
          }
        })
        .catch(err => console.error('Failed to fetch communities:', err));
    } catch (error) {
      console.error('Failed to load contributions:', error);
    }
  }, []);

  // Save to localStorage/Backend when submissions change
  const addCultureSubmission = useCallback(async (submission: Omit<CultureItem, 'id' | 'featured'>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to submit content");

      const token = await user.getIdToken();
      const mappedCategory = submission.type || "Food";

      const payload = {
        title: submission.title,
        category: mappedCategory,
        image: submission.image,
        description: submission.description,
        longDescription: submission.longDescription || '',
        videoUrl: submission.videoUrl || '',
        galleryImages: submission.galleryImages || [],
        extendedDetails: submission.extendedDetails || [],
        district: submission.district || 'Bihar',
        author: user.displayName || user.email || 'User',
        status: 'PENDING'
      };

      const response = await fetch(`${API_BASE_URL}/discover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to create culture item: ${await response.text()}`);
      }

      const result = await response.json();
      const createdItem: CultureItem = {
        id: result.data.item.id,
        title: result.data.item.title,
        type: submission.type,
        image: result.data.item.image,
        description: result.data.item.description,
        longDescription: result.data.item.longDescription,
        videoUrl: result.data.item.videoUrl,
        galleryImages: result.data.item.galleryImages,
        extendedDetails: result.data.item.extendedDetails,
        district: result.data.item.district,
        submittedBy: result.data.item.author,
        featured: result.data.item.featured,
        status: result.data.item.status
      };

      setCultureSubmissions((prev) => [createdItem, ...prev]);
    } catch (error) {
      console.error('Failed to submit culture item to backend:', error);
      throw error;
    }
  }, []);

  const addGallerySubmission = useCallback((submission: Omit<GalleryItem, 'id' | 'likes' | 'views' | 'comments' | 'uploadDate'>) => {
    setGallerySubmissions((prev) => {
      const newItem: GalleryItem = {
        ...submission,
        id: Date.now(),
        likes: Math.floor(Math.random() * 50) + 10,
        views: Math.floor(Math.random() * 200) + 100,
        comments: Math.floor(Math.random() * 10),
        uploadDate: new Date().toISOString().split('T')[0],
      };
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('bihar_gallery_submissions', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save:', error);
      }
      return updated;
    });
  }, []);

  const addJourneySubmission = useCallback(async (submission: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to submit a journey");

      const token = await user.getIdToken();

      // The API uses 'description' as the main field; if the frontend passes 'desc' or 'overviewText', we'll map it to 'description'.
      // The CreateJourney form passes both. Let's pass the whole payload directly.
      const response = await fetch(`${API_BASE_URL}/journeys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error(`Failed to create journey: ${await response.text()}`);
      }

      const result = await response.json();
      setJourneySubmissions((prev) => [result.data.journey, ...prev]);

    } catch (error) {
      console.error('Failed to submit journey to backend:', error);
      throw error;
    }
  }, []);

  const updateJourneySubmission = useCallback(async (id: string, submission: any) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';

      const response = await fetch(`${API_BASE_URL}/journeys/${id}`, {
        method: 'PUT', // The backend currently expects PUT for author updates
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error(`Failed to update journey: ${await response.text()}`);
      }

      const result = await response.json();

      setJourneySubmissions((prev) => {
        return prev.map((j) => {
          if (j.id === id) {
            return result.data.journey;
          }
          return j;
        });
      });

    } catch (error) {
      console.error('Failed to update journey on backend:', error);
      throw error;
    }
  }, []);

  const addCommunitySubmission = useCallback(async (submission: Omit<Community, 'id' | 'members' | 'posts' | 'online' | 'verified' | 'createdOn'>) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const response = await fetch(`${API_BASE_URL}/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: submission.name,
          category: submission.category,
          shortDescription: submission.shortDescription,
          description: submission.description,
          bannerImageUrl: submission.bannerImageUrl,
          logoImageUrl: submission.logoImageUrl,
          rules: submission.rules
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to create community: ${await response.text()}`);
      }
      const result = await response.json();
      setCommunitySubmissions((prev) => [result.data.community, ...prev]);
    } catch (error) {
      console.error('Failed to save to backend:', error);
      throw error;
    }
  }, []);

  const addProductSubmission = useCallback(async (submission: Omit<ProductItem, 'id'>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to submit a product");

      const token = await user.getIdToken();

      // Clean optional fields: empty string to null to pass backend Zod validation
      const cleanSubmission = {
        ...submission,
        email: submission.email?.trim() || null,
        website: submission.website?.trim() || null,
        mapLink: submission.mapLink?.trim() || null,
        address: submission.address?.trim() || null,
        contact: submission.contact?.trim() || null,
      };

      const response = await fetch(`${API_BASE_URL}/marketplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanSubmission)
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${await response.text()}`);
      }

      await fetchApprovedProducts();
    } catch (error) {
      console.error('Failed to submit product to backend:', error);
      throw error;
    }
  }, [fetchApprovedProducts]);

  return (
    <ContributionContext.Provider
      value={{
        cultureSubmissions,
        gallerySubmissions,
        journeySubmissions,
        communitySubmissions,
        productSubmissions,
        addCultureSubmission,
        addGallerySubmission,
        addJourneySubmission,
        updateJourneySubmission,
        addCommunitySubmission,
        addProductSubmission,
        refreshJourneys: fetchApprovedJourneys,
        refreshProducts: fetchApprovedProducts,
      }}
    >
      {children}
    </ContributionContext.Provider>
  );
};

export const useContributions = () => useContext(ContributionContext);
