export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  statPlaces: string;
  statDistricts: string;
  statCulturalSites: string;
  statFestivals: string;
  statTourists: string;
  footerAbout: string;
}

export const defaultSiteSettings: SiteSettings = {
  heroTitle: "Explore the Rich Heritage of",
  heroSubtitle: "Bihar",
  heroDescription: "Step into a timeless realm of sacred landmarks, living traditions, authentic flavors, and enduring stories.",
  heroImage: "",
  statPlaces: "500+",
  statDistricts: "38",
  statCulturalSites: "100+",
  statFestivals: "50+",
  statTourists: "1000+",
  footerAbout: "Bihar Darshan is a digital platform to explore the rich cultural heritage, historical landmarks, and vibrant communities of Bihar.",
};
