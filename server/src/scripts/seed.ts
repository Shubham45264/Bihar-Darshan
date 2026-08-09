import 'dotenv/config';
import { prisma as db } from '../db';
import { DiscoverCategory, ApprovalStatus } from '../db';

const cultureSeedData = [
  {
    title: "Chhath Puja",
    category: DiscoverCategory.FESTIVAL,
    district: "Patna",
    image: "/images/culture/chhath-puja.png",
    description: "The most significant festival of Bihar dedicated to the Sun God.",
    longDescription: "A four-day ancient Vedic festival dedicated to Lord Surya and Chhathi Maiya. Devotees offer prayers to the setting and rising sun while standing in rivers and ponds.",
    featured: true,
    videoUrl: "https://www.youtube.com/embed/R28M5rXg2pQ",
    galleryImages: [
      "/images/culture/chhath-puja.png",
      "/images/culture/sonepur-mela.png",
      "/images/culture/buddha-jayanti.png"
    ],
    extendedDetails: [
      "Day 1 (Nahay Khay): Devotees take a holy dip and consume a single meal of kaddu-bhat.",
      "Day 2 (Kharna): Fasting for the entire day, broken after sunset with kheer and chapati.",
      "Day 3 (Sandhya Arghya): A day-long waterless fast culminating in offerings to the setting sun.",
      "Day 4 (Usha Arghya): The final offering to the rising sun, followed by breaking the fast."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Litti Chokha",
    category: DiscoverCategory.FOOD,
    district: "Gaya",
    image: "/images/culture/litti-chokha.png",
    description: "The iconic traditional dish of Bihar loved across the country.",
    longDescription: "Roasted wheat balls stuffed with sattu and served with mashed vegetables flavored with mustard oil.",
    featured: true,
    videoUrl: "https://www.youtube.com/embed/4H9GmbZ3Otw",
    galleryImages: [
      "/images/culture/litti-chokha.png",
      "/images/culture/sattu-paratha.png"
    ],
    extendedDetails: [
      "Litti: Made of whole wheat flour and stuffed with roasted gram flour (sattu), herbs, and spices.",
      "Chokha: A smoky mash of roasted eggplants, tomatoes, and potatoes mixed with mustard oil and garlic.",
      "Traditionally baked over cow dung cakes or charcoal for an authentic smoky flavor."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Sonepur Mela",
    category: DiscoverCategory.FESTIVAL,
    district: "Sonepur",
    image: "/images/culture/sonepur-mela.png",
    description: "One of Asia's largest and most historic fairs held annually.",
    longDescription: "A centuries-old fair attracting traders, pilgrims, tourists, and cultural enthusiasts from across India.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/6qT0L9hBngw",
    galleryImages: [
      "/images/culture/sonepur-mela.png",
      "/images/culture/rajgir-mahotsav.png",
      "/images/culture/vaishali-mahotsav.png"
    ],
    extendedDetails: [
      "Origin: Historically traced back to the rule of Chandragupta Maurya.",
      "Venue: Confluence of the sacred Ganges and Gandak rivers.",
      "Attractions: The legendary elephant and horse trade, rural sports, and folk performances.",
      "Significance: Marks the auspicious day of Kartik Purnima."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Shahi Lychee",
    category: DiscoverCategory.FOOD,
    district: "Muzaffarpur",
    image: "/images/culture/shahi-lychee.png",
    description: "Juicy and aromatic lychee with GI tag recognition.",
    longDescription: "Muzaffarpur's Shahi Lychee is famous for its sweetness, fragrance, and superior quality.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/8-q9g1uQ7Gk",
    galleryImages: [
      "/images/culture/shahi-lychee.png"
    ],
    extendedDetails: [
      "Status: Granted the Geographical Indication (GI) tag in 2018.",
      "Harvesting: Plucked between mid-May and mid-June.",
      "Taste: Exceptionally sweet and known for its distinct rose-like aroma.",
      "Economy: Drives a major portion of Muzaffarpur's agricultural exports."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Buddha Jayanti",
    category: DiscoverCategory.FESTIVAL,
    district: "Bodh Gaya",
    image: "/images/culture/buddha-jayanti.png",
    description: "Celebration of the birth, enlightenment, and teachings of Buddha.",
    longDescription: "Observed with prayers, cultural events, and ceremonies at the sacred Mahabodhi Temple.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/g2f_3z5L5j4",
    galleryImages: [
      "/images/culture/buddha-jayanti.png",
      "/images/culture/rajgir-mahotsav.png"
    ],
    extendedDetails: [
      "Observed by Buddhists and Hindus worldwide.",
      "The Mahabodhi Temple is decorated with colorful flags and flowers.",
      "Devotees perform the 'Sujata Kheer' offering ceremony.",
      "Also known as Vesak or Buddha Purnima."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Sama Chakeva",
    category: DiscoverCategory.FESTIVAL,
    district: "Mithila",
    image: "/images/culture/sama-chakeva.png",
    description: "Traditional Mithila festival celebrating sibling bonds.",
    longDescription: "Women and girls celebrate with clay idols, songs, and rituals symbolizing affection between brothers and sisters.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/3A542z4q70A",
    galleryImages: [
      "/images/culture/sama-chakeva.png"
    ],
    extendedDetails: [
      "Rooted in ancient folklore of Sama and her brother Chakeva.",
      "Begins as winter sets in and migratory birds arrive from the Himalayas.",
      "Features handmade clay idols of Sama, Chakeva, and other characters.",
      "Concludes with the immersion of idols in agricultural fields for good harvest."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Jitiya Festival",
    category: DiscoverCategory.FESTIVAL,
    district: "Patna",
    image: "/images/culture/jitiya-festival.png",
    description: "Sacred fasting festival observed by mothers.",
    longDescription: "Women observe rigorous fasting and prayers for the health and prosperity of their children.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/F4qR9_HkZ5k",
    galleryImages: [
      "/images/culture/jitiya-festival.png"
    ],
    extendedDetails: [
      "Also known as Jivitputrika Vrat.",
      "Observed as a 'Nirjala' (waterless) fast lasting an entire day and night.",
      "Celebrated during the waning phase of the moon in the month of Ashwin.",
      "Involves listening to the legendary story of Jimutavahana."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Rajgir Mahotsav",
    category: DiscoverCategory.FESTIVAL,
    district: "Nalanda",
    image: "/images/culture/rajgir-mahotsav.png",
    description: "A grand cultural festival showcasing Bihar's heritage.",
    longDescription: "Features folk music, dance performances, handicrafts, and local cuisine in the historic city of Rajgir.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/A8U5Z1pQh8M",
    galleryImages: [
      "/images/culture/rajgir-mahotsav.png",
      "/images/culture/vaishali-mahotsav.png"
    ],
    extendedDetails: [
      "Organized jointly by the Department of Tourism, Bihar, and the District Administration.",
      "Showcases classical and folk art forms performed by artists of national and international repute.",
      "Includes a vibrant 'Gram Shree' mela featuring indigenous handicrafts.",
      "Also hosts competitions like tonga races and martial arts displays."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Vaishali Mahotsav",
    category: DiscoverCategory.FESTIVAL,
    district: "Vaishali",
    image: "/images/culture/vaishali-mahotsav.png",
    description: "Celebration of Bihar's ancient republican heritage.",
    longDescription: "Held to commemorate the birth anniversary of Lord Mahavira with cultural programs and exhibitions.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/5-j7Wn2C1k8",
    galleryImages: [
      "/images/culture/vaishali-mahotsav.png",
      "/images/culture/rajgir-mahotsav.png"
    ],
    extendedDetails: [
      "Celebrates Vaishali as the world's first republic.",
      "Organized around Chaitra Shukla Trayodashi (April/May).",
      "Features profound spiritual discourses and colorful processions.",
      "Promotes unity through shared heritage of Jainism and ancient democratic values."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Thekua",
    category: DiscoverCategory.FOOD,
    district: "Patna",
    image: "/images/culture/thekua.png",
    description: "Traditional sweet delicacy associated with Chhath Puja.",
    longDescription: "Prepared using wheat flour, jaggery, and ghee, Thekua is an essential offering during Chhath celebrations.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/tF8tNqG4bMw",
    galleryImages: [
      "/images/culture/thekua.png",
      "/images/culture/khurma.png"
    ],
    extendedDetails: [
      "A dry, crunchy cookie-like sweet that acts as the primary 'prasad' for Chhath Puja.",
      "Made by deep-frying a dough of wheat flour, melted jaggery, and dried coconut.",
      "Can be stored for several weeks without refrigeration.",
      "Often molded into distinctive leaf or floral shapes using wooden blocks (sancha)."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Makhana Kheer",
    category: DiscoverCategory.FOOD,
    district: "Darbhanga",
    image: "/images/culture/makhana-kheer.png",
    description: "Creamy dessert made from Bihar's famous fox nuts.",
    longDescription: "A delicious and nutritious dessert prepared using milk, sugar, and roasted makhana.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/E7bX5O0N2J8",
    galleryImages: [
      "/images/culture/makhana-kheer.png"
    ],
    extendedDetails: [
      "Makhana (Fox Nuts) are an essential crop in the Mithila region.",
      "The dessert is made by simmering roasted makhana in thickened sweetened milk.",
      "Often flavored with cardamom, saffron, and garnished with dry fruits.",
      "Highly popular during fasting days like Navratri."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Silao Khaja",
    category: DiscoverCategory.FOOD,
    district: "Nalanda",
    image: "/images/culture/silao-khaja.png",
    description: "Layered crispy sweet famous across Bihar.",
    longDescription: "A GI-tagged sweet from Silao known for its flaky texture and rich taste.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/6YpW6Q_F7zM",
    galleryImages: [
      "/images/culture/silao-khaja.png"
    ],
    extendedDetails: [
      "Has up to 12-15 wafer-thin layers that easily melt in the mouth.",
      "Dipped in sugar syrup for a perfect balance of sweetness and crunch.",
      "Associated with local legends dating back to King Vikramaditya.",
      "Granted a GI tag in 2018 for its unique traditional method of preparation."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Tilkut",
    category: DiscoverCategory.FOOD,
    district: "Bhagalpur",
    image: "/images/culture/tilkut.png",
    description: "Popular winter sweet made from sesame seeds and jaggery.",
    longDescription: "A traditional delicacy especially enjoyed during Makar Sankranti.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/Q0P9X6Q8-L8",
    galleryImages: [
      "/images/culture/tilkut.png"
    ],
    extendedDetails: [
      "Made by pounding roasted sesame seeds and boiling jaggery or sugar.",
      "The constant pounding gives it a unique flaky, biscuit-like texture.",
      "Gaya is historically renowned for producing the finest quality of Tilkut.",
      "Served prominently during the Makar Sankranti harvest festival."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Sattu Paratha",
    category: DiscoverCategory.FOOD,
    district: "Gaya",
    image: "/images/culture/sattu-paratha.png",
    description: "Nutritious stuffed flatbread of Bihar.",
    longDescription: "Prepared using roasted gram flour and spices, served with curd and pickles.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/L1Wb8qB8fQ4",
    galleryImages: [
      "/images/culture/sattu-paratha.png",
      "/images/culture/litti-chokha.png"
    ],
    extendedDetails: [
      "Sattu (roasted gram flour) is known as the 'poor man's protein' for its high nutritional value.",
      "The stuffing mixes sattu with mustard oil, chopped onions, garlic, and 'achaar' (pickle) masala.",
      "Cooked on a griddle with ghee or oil until golden and crispy.",
      "Typically served with a side of baingan chokha or tangy yogurt."
    ],
    author: "Admin",
    status: ApprovalStatus.APPROVED
  },
  {
    title: "Khurma",
    category: DiscoverCategory.FOOD,
    district: "Patna",
    image: "/images/culture/khurma.png",
    description: "Crunchy sweet snack enjoyed during festivals.",
    longDescription: "Made from flour, sugar, and ghee, Khurma is a beloved traditional sweet.",
    featured: false,
    videoUrl: "https://www.youtube.com/embed/9B8A4R4_3H4",
    galleryImages: [
      "/images/culture/khurma.png",
      "/images/culture/thekua.png"
    ],
    extendedDetails: [
      "Also known as Shakarpara in other parts of India.",
      "Made by frying diamond-shaped pieces of dough until crispy.",
      "Coated in a thick crystallized sugar syrup that forms a sweet outer crust.",
      "A staple sweet stored in households for guests and festive occasions."
    ],
  }
];

async function seed() {
  console.log("Seeding Culture / Discover Items...");
  for (const item of cultureSeedData) {
    const existing = await db.discoverItem.findFirst({
      where: { title: item.title, category: item.category }
    });
    if (!existing) {
      await db.discoverItem.create({ data: item });
      console.log(`Created DiscoverItem: ${item.title}`);
    } else {
      console.log(`DiscoverItem already exists: ${item.title}`);
    }
  }

  console.log("Seeding Completed Successfully!");
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
