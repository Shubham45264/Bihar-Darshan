import bodhGayaImg from "../assets/bodh-gaya.png";
import nalandaImg from "../assets/nalanda.png";
import rajgirImg from "../assets/rajgir.png";
import patnaSahibImg from "../assets/patna-sahib.png";
import pawapuriImg from "../assets/pawapuri.png";
import vaishaliImg from "../assets/vaishali.png";
import heritageImg from "../assets/bihar-heritage.png";
import templeImg from "../assets/bihar-temple.png";
import folkDanceImg from "../assets/bihar-folk-dance.png";

export type MediaType = "photo" | "video";

export type GalleryCategory =
  | "Food"
  | "Culture"
  | "Politicians"
  | "Places"
  | "Heritage"
  | "Festivals"
  | "Agriculture"
  | "Art & Craft"
  | "Wildlife"
  | "Community"
  | "Tourism"
  | "Architecture"
  | "Religion";

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  mediaType: MediaType;
  category: GalleryCategory;
  photographer: string;
  likes: number;
  views: number;
  comments: number;
  uploadDate: string;
  location: string;
  description?: string;
  duration?: string;
  aspectRatio: "square" | "portrait" | "landscape";
  source?: string;
  link?: string;
}

export const galleryCategories: GalleryCategory[] = [
  "Food",
  "Culture",
  "Politicians",
  "Places",
  "Heritage",
  "Festivals",
  "Agriculture",
  "Art & Craft",
  "Wildlife",
  "Community",
  "Tourism",
  "Architecture",
  "Religion",
];

export const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "Mahabodhi Temple - Bodh Gaya",
    image: bodhGayaImg,
    mediaType: "photo",
    category: "Heritage",
    photographer: "Official Bihar Tourism",
    likes: 1240,
    views: 8520,
    comments: 142,
    uploadDate: "2026-03-15",
    location: "Gaya District",
    description: "The sacred site where Lord Buddha attained enlightenment under the Bodhi tree.",
    aspectRatio: "landscape"
  },
  {
    id: 2,
    title: "Ancient Ruins of Nalanda University",
    image: nalandaImg,
    mediaType: "photo",
    category: "Places",
    photographer: "Archaeological Survey of India",
    likes: 980,
    views: 6410,
    comments: 88,
    uploadDate: "2026-03-10",
    location: "Nalanda District",
    description: "One of the world's ancient residential universities, flourishing from 5th to 12th century CE.",
    aspectRatio: "landscape"
  },
  {
    id: 3,
    title: "Vishwa Shanti Stupa - Rajgir",
    image: rajgirImg,
    mediaType: "photo",
    category: "Religion",
    photographer: "Bihar Tourism",
    likes: 850,
    views: 5120,
    comments: 65,
    uploadDate: "2026-03-08",
    location: "Rajgir",
    description: "A striking white peace pagoda situated atop Ratnagiri Hill in Rajgir.",
    aspectRatio: "landscape"
  },
  {
    id: 4,
    title: "Takht Sri Patna Sahib",
    image: patnaSahibImg,
    mediaType: "photo",
    category: "Religion",
    photographer: "Bihar Darshan",
    likes: 1120,
    views: 7300,
    comments: 94,
    uploadDate: "2026-03-05",
    location: "Patna",
    description: "The birthplace of Guru Gobind Singh Ji, one of the five Takhts of Sikhism.",
    aspectRatio: "landscape"
  },
  {
    id: 5,
    title: "Pawapuri Jal Mandir",
    image: pawapuriImg,
    mediaType: "photo",
    category: "Heritage",
    photographer: "Heritage Photography",
    likes: 740,
    views: 4890,
    comments: 52,
    uploadDate: "2026-02-28",
    location: "Nalanda",
    description: "Holy pilgrimage site where Lord Mahavira attained Nirvana in 527 BCE.",
    aspectRatio: "landscape"
  },
  {
    id: 6,
    title: "Ashokan Pillar - Vaishali",
    image: vaishaliImg,
    mediaType: "photo",
    category: "Heritage",
    photographer: "ASI Archive",
    likes: 890,
    views: 5670,
    comments: 73,
    uploadDate: "2026-02-20",
    location: "Vaishali",
    description: "Well-preserved Lion Pillar erected by Emperor Ashoka in ancient Vaishali.",
    aspectRatio: "landscape"
  },
  {
    id: 7,
    title: "Cultural Heritage of Bihar",
    image: heritageImg,
    mediaType: "photo",
    category: "Culture",
    photographer: "Bihar Darshan",
    likes: 670,
    views: 4210,
    comments: 41,
    uploadDate: "2026-02-15",
    location: "Bihar",
    description: "Rich traditional art, Madhubani paintings, and ancient architecture.",
    aspectRatio: "landscape"
  },
  {
    id: 8,
    title: "Sacred Temple Architecture",
    image: templeImg,
    mediaType: "photo",
    category: "Architecture",
    photographer: "Bihar Tourism",
    likes: 810,
    views: 5040,
    comments: 59,
    uploadDate: "2026-02-10",
    location: "Bodh Gaya",
    description: "Intricate stone carvings and timeless architecture of ancient temples.",
    aspectRatio: "landscape"
  },
  {
    id: 9,
    title: "Folk Dance and Musical Heritage",
    image: folkDanceImg,
    mediaType: "photo",
    category: "Festivals",
    photographer: "Culture Dep. Bihar",
    likes: 930,
    views: 6180,
    comments: 82,
    uploadDate: "2026-02-01",
    location: "Patna",
    description: "Vibrant traditional folk performance reflecting the rich cultural tapestry of Bihar.",
    aspectRatio: "landscape"
  }
];
