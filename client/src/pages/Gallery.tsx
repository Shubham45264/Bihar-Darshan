import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShareStorySection from "../components/cta/ShareStorySection";
import GalleryHero from "../components/gallery/GalleryHero";
import GalleryFilters from "../components/gallery/GalleryFilters";
import GalleryGrid from "../components/gallery/GalleryGrid";
import GalleryLightbox from "../components/gallery/GalleryLightbox";
import UploadBanner from "../components/gallery/UploadBanner";
import { galleryData } from "../data/galleryData";
import type { GalleryItem } from "../data/galleryData";
import { useContributions } from "../data/ContributionContext";
import { useAdminData } from "../data/AdminContext";
import type {
  MediaFilter,
  SortOption,
} from "../components/gallery/GalleryFilters";

export interface ExtendedGalleryItem extends GalleryItem {
  source: "official" | "community";
  link?: string;
}

const Gallery = () => {
  const { gallerySubmissions } = useContributions();
  const {
    gallery: galleryData,
    districts: allDistricts,
    tourism: featuredTrips,
    culture: cultureData,
    tribalArticles,
    communities
  } = useAdminData();
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedItem, setSelectedItem] = useState<ExtendedGalleryItem | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Combine and map data
  const allItems: ExtendedGalleryItem[] = useMemo(() => {
    const community: ExtendedGalleryItem[] = gallerySubmissions.map(item => ({
      ...item,
      source: "community"
    }));

    let baseId = 1000;

    // Map Gallery Data
    const officialGallery: ExtendedGalleryItem[] = galleryData.map(item => ({
      ...item,
      source: "official"
    }));

    // Map Districts
    const districtItems: ExtendedGalleryItem[] = allDistricts.map(d => ({
      id: baseId++,
      title: d.name,
      image: d.image,
      mediaType: "photo",
      category: "Places",
      photographer: "Official Bihar Darshan",
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 100),
      uploadDate: new Date().toISOString(),
      location: d.name,
      aspectRatio: "landscape",
      source: "official",
      link: "/districts"
    }));

    // Map Tourism
    const tourismItems: ExtendedGalleryItem[] = featuredTrips.filter(t => t.image).map(t => ({
      id: baseId++,
      title: t.title,
      image: t.image,
      mediaType: "photo",
      category: "Tourism",
      photographer: "Official Bihar Darshan",
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 100),
      uploadDate: new Date().toISOString(),
      location: t.departureCity,
      aspectRatio: "landscape",
      source: "official",
      link: "/tourism"
    }));

    // Map Culture
    const cultureItems: ExtendedGalleryItem[] = cultureData.filter(c => c.image).map(c => ({
      id: baseId++,
      title: c.title,
      image: c.image,
      mediaType: "photo",
      category: "Culture",
      photographer: "Official Bihar Darshan",
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 100),
      uploadDate: new Date().toISOString(),
      location: c.district || "Bihar",
      aspectRatio: "portrait",
      source: "official",
      link: "/culture"
    }));

    // Map Tribes
    const tribeItems: ExtendedGalleryItem[] = tribalArticles.filter(t => t.image).map(t => ({
      id: baseId++,
      title: t.headline,
      image: t.image,
      mediaType: "photo",
      category: "Community",
      photographer: t.author,
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 100),
      uploadDate: t.publishedDate,
      location: t.location,
      aspectRatio: "square",
      source: "official",
      link: `/tribe/${t.tribe.toLowerCase().replace(/\\s+/g, '-')}`
    }));

    return [
      ...community,
      ...officialGallery,
      ...districtItems,
      ...tourismItems,
      ...cultureItems,
      ...tribeItems
    ];
  }, [gallerySubmissions, galleryData, allDistricts, featuredTrips, cultureData, tribalArticles]);

  // Filter + Sort logic
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.photographer.toLowerCase().includes(q)
      );
    }

    // Media filter
    if (mediaFilter !== "all") {
      result = result.filter((item) => item.mediaType === mediaFilter);
    }

    // Category filter
    if (categoryFilter !== "All Categories") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "latest":
        result.sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
        break;
      case "popular": // Most Liked
        result.sort((a, b) => b.likes - a.likes);
        break;
      case "most-viewed":
        result.sort((a, b) => b.views - a.views);
        break;
      case "trending":
        result.sort(
          (a, b) =>
            (b.likes + b.comments) / (b.views || 1) -
            (a.likes + a.comments) / (a.views || 1)
        );
        break;
    }

    return result;
  }, [allItems, searchQuery, mediaFilter, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-white gallery-page">
      <Navbar />

      {/* Hero */}
      <GalleryHero
        stats={{
          images: allItems.filter(i => i.mediaType === "photo").length,
          videos: allItems.filter(i => i.mediaType === "video").length,
          contributors: new Set(allItems.filter(i => i.source === "community").map(i => i.photographer)).size,
          districts: 38 // Static or derived if we extract districts
        }}
      />

      {/* Filter Bar */}
      <div className="py-5">
        <GalleryFilters
          mediaFilter={mediaFilter}
          categoryFilter={categoryFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onMediaChange={setMediaFilter}
          onCategoryChange={setCategoryFilter}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          totalResults={filteredItems.length}
        />
      </div>

      {/* Gallery Grid */}
      <div className="pb-16 pt-4">
        <GalleryGrid
          items={filteredItems}
          onItemClick={(item) => setSelectedItem(item as ExtendedGalleryItem)}
        />
      </div>


      {/* CTA Banner */}
      <ShareStorySection />

      {/* Footer */}
      <Footer />

      {/* Lightbox Modal */}
      <GalleryLightbox
        item={selectedItem}
        items={filteredItems}
        onClose={() => setSelectedItem(null)}
        onNavigate={(item) => setSelectedItem(item as ExtendedGalleryItem)}
      />
    </div>
  );
};

export default Gallery;
