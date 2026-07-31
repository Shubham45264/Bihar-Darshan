import 'dotenv/config';
import { prisma as db } from '../db';

const CATEGORIES_DATA = [
  {
    title: 'Heritage & History',
    slug: 'heritage-and-history',
    description: "Explore Bihar's rich heritage, ancient monuments, historic sites and timeless stories.",
    image: 'https://images.unsplash.com/photo-1627894043065-45617300c8b9?q=80&w=1200&auto=format&fit=crop',
    icon: 'Landmark',
    subcategories: [
      { title: 'Ancient Monuments', slug: 'ancient-monuments', image: 'https://images.unsplash.com/photo-1627894043065-45617300c8b9?q=80&w=800&auto=format&fit=crop' },
      { title: 'Archaeological Sites', slug: 'archaeological-sites', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop' },
      { title: 'Forts & Palaces', slug: 'forts-and-palaces', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop' },
      { title: 'Museums', slug: 'museums', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800&auto=format&fit=crop' },
      { title: 'Memorials', slug: 'memorials', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop' },
      { title: 'Historic Cities', slug: 'historic-cities', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop' },
      { title: 'UNESCO Heritage Sites', slug: 'unesco-heritage-sites', image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=800&auto=format&fit=crop' },
      { title: 'Ancient Universities', slug: 'ancient-universities', image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Spiritual Tourism',
    slug: 'spiritual-tourism',
    description: 'Immerse in the holy pilgrimage circuits of Buddhism, Jainism, Hinduism, and Sikhism.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
    icon: 'Flame',
    subcategories: [
      { title: 'Buddhist Circuit', slug: 'buddhist-circuit', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
      { title: 'Jain Circuit', slug: 'jain-circuit', image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=800&auto=format&fit=crop' },
      { title: 'Hindu Temples', slug: 'hindu-temples', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sufi & Islamic Sites', slug: 'sufi-and-islamic-sites', image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sikh Heritage', slug: 'sikh-heritage', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Nature & Wildlife',
    slug: 'nature-and-wildlife',
    description: 'Discover lush national parks, serene bird sanctuaries, rivers, and tiger reserves.',
    image: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    icon: 'Trees',
    subcategories: [
      { title: 'National Parks', slug: 'national-parks', image: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sanctuaries', slug: 'sanctuaries', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop' },
      { title: 'Waterfalls', slug: 'waterfalls', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800&auto=format&fit=crop' },
      { title: 'Lakes & Rivers', slug: 'lakes-and-rivers', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop' },
      { title: 'Eco Tourism', slug: 'eco-tourism', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Adventure',
    slug: 'adventure',
    description: 'Thrilling outdoor activities, hill trekking, river rafting, and sky-high adventures.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    icon: 'Compass',
    subcategories: [
      { title: 'Trekking', slug: 'trekking', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
      { title: 'Water Sports', slug: 'water-sports', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop' },
      { title: 'Camping', slug: 'camping', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' },
      { title: 'Aerial Sports', slug: 'aerial-sports', image: 'https://images.unsplash.com/photo-1516592673884-4a382d1124c2?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Food & Cuisine',
    slug: 'food-and-cuisine',
    description: 'Savor legendary Litti Chokha, Khaja, Tilkut, Anarsa, and regional Bihari flavors.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
    icon: 'Utensils',
    subcategories: [
      { title: 'Traditional Dishes', slug: 'traditional-dishes', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop' },
      { title: 'Street Food', slug: 'street-food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sweets & Desserts', slug: 'sweets-and-desserts', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop' },
      { title: 'Seasonal Delicacies', slug: 'seasonal-delicacies', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Festivals & Events',
    slug: 'festivals-and-events',
    description: 'Experience grand celebrations like Chhath Puja, Sonepur Mela, and Rajgir Mahotsav.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    icon: 'PartyPopper',
    subcategories: [
      { title: 'Chhath Puja', slug: 'chhath-puja', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sonepur Mela', slug: 'sonepur-mela', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop' },
      { title: 'Pitrapaksha Mela', slug: 'pitrapaksha-mela', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' },
      { title: 'Rajgir Mahotsav', slug: 'rajgir-mahotsav', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop' },
      { title: 'Folk Festivals', slug: 'folk-festivals', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Culture & Traditions',
    slug: 'culture-and-traditions',
    description: 'Folk dances, traditional music, rituals, and vibrant age-old customs of Bihar.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    icon: 'Music',
    subcategories: [
      { title: 'Folk Music', slug: 'folk-music', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop' },
      { title: 'Traditional Dance', slug: 'traditional-dance', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop' },
      { title: 'Local Crafts', slug: 'local-crafts', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop' },
      { title: 'Rituals & Customs', slug: 'rituals-and-customs', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Arts & Crafts',
    slug: 'arts-and-crafts',
    description: 'World-renowned Madhubani painting, Manjusha art, Sikki grass crafts, and stone art.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    icon: 'Palette',
    subcategories: [
      { title: 'Madhubani Painting', slug: 'madhubani-painting', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop' },
      { title: 'Manjusha Art', slug: 'manjusha-art', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sikki Grass Craft', slug: 'sikki-grass-craft', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop' },
      { title: 'Stone Carving', slug: 'stone-carving', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
      { title: 'Woodcraft', slug: 'woodcraft', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Famous Personalities',
    slug: 'famous-personalities',
    description: 'Honoring ancient scholars, visionaries, freedom fighters, and icons born in Bihar.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    icon: 'UserCheck',
    subcategories: [
      { title: 'Ancient Scholars', slug: 'ancient-scholars', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop' },
      { title: 'Freedom Fighters', slug: 'freedom-fighters', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop' },
      { title: 'Literary Figures', slug: 'literary-figures', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop' },
      { title: 'Modern Icons', slug: 'modern-icons', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Villages & Rural Life',
    slug: 'villages-and-rural-life',
    description: 'Authentic village tourism, agricultural beauty, organic farms, and rural hamlets.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    icon: 'Home',
    subcategories: [
      { title: 'Rural Experience', slug: 'rural-experience', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop' },
      { title: 'Organic Farms', slug: 'organic-farms', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop' },
      { title: 'Craft Villages', slug: 'craft-villages', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop' },
      { title: 'Heritage Hamlets', slug: 'heritage-hamlets', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Shopping',
    slug: 'shopping',
    description: 'Bustling handicraft bazaars, Bhagalpuri silk, brassware, and traditional souvenirs.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    icon: 'ShoppingBag',
    subcategories: [
      { title: 'Handicraft Bazaars', slug: 'handicraft-bazaars', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' },
      { title: 'Traditional Textiles', slug: 'traditional-textiles', image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop' },
      { title: 'Local Markets', slug: 'local-markets', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop' },
      { title: 'Souvenirs', slug: 'souvenirs', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Photography Spots',
    slug: 'photography-spots',
    description: 'Picturesque sunrise viewpoints, architectural wonders, and river landscapes.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    icon: 'Camera',
    subcategories: [
      { title: 'Sunrise & Sunset Points', slug: 'sunrise-and-sunset-points', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop' },
      { title: 'Architectural Wonders', slug: 'architectural-wonders', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop' },
      { title: 'Landscape Vistas', slug: 'landscape-vistas', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Stay',
    slug: 'stay',
    description: 'Heritage hotels, luxury eco-resorts, homestays, and spiritual ashram lodges.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    icon: 'Hotel',
    subcategories: [
      { title: 'Heritage Hotels', slug: 'heritage-hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
      { title: 'Eco Resorts', slug: 'eco-resorts', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' },
      { title: 'Homestays', slug: 'homestays', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop' },
      { title: 'Budget Lodges', slug: 'budget-lodges', image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Experiences',
    slug: 'experiences',
    description: 'Unforgettable cultural performances, culinary food walks, and heritage tours.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    icon: 'Sparkles',
    subcategories: [
      { title: 'Cultural Performances', slug: 'cultural-performances', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop' },
      { title: 'Culinary Tours', slug: 'culinary-tours', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop' },
      { title: 'Village Walks', slug: 'village-walks', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Tourist Circuits',
    slug: 'tourist-circuits',
    description: 'Curated travel itineraries across Buddha, Ramayana, Sufi, and Gandhi circuits.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
    icon: 'Map',
    subcategories: [
      { title: 'Buddha Circuit', slug: 'buddha-circuit', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
      { title: 'Ramayana Circuit', slug: 'ramayana-circuit', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sufi Circuit', slug: 'sufi-circuit', image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop' },
      { title: 'Gandhi Circuit', slug: 'gandhi-circuit', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Transport',
    slug: 'transport',
    description: 'Complete guide on tourist circuit buses, car rentals, express trains, and local auto.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    icon: 'Bus',
    subcategories: [
      { title: 'Circuit Buses', slug: 'circuit-buses', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop' },
      { title: 'Rental Cars', slug: 'rental-cars', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop' },
      { title: 'Railway Hubs', slug: 'railway-hubs', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop' },
      { title: 'Local Auto & Rickshaw', slug: 'local-auto-and-rickshaw', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Hidden Gems',
    slug: 'hidden-gems',
    description: 'Offbeat trails, secret waterfalls, lesser-known ruins, and undiscovered places.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
    icon: 'Eye',
    subcategories: [
      { title: 'Offbeat Trails', slug: 'offbeat-trails', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
      { title: 'Unexplored Ruins', slug: 'unexplored-ruins', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop' },
      { title: 'Secret Waterfalls', slug: 'secret-waterfalls', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    title: 'Travel by Interest',
    slug: 'travel-by-interest',
    description: 'Tailored travel recommendations for solo wanderers, families, pilgrims & photographers.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
    icon: 'Heart',
    subcategories: [
      { title: 'Solo Travelers', slug: 'solo-travelers', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop' },
      { title: 'Family Vacations', slug: 'family-vacations', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop' },
      { title: 'Pilgrims', slug: 'pilgrims', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
      { title: 'Photographers', slug: 'photographers', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop' },
    ],
  },
];

export async function seedCategories() {
  console.log('Seeding categories and subcategories...');

  for (const cat of CATEGORIES_DATA) {
    const category = await db.category.upsert({
      where: { slug: cat.slug },
      update: {
        title: cat.title,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
        status: 'APPROVED',
      },
      create: {
        title: cat.title,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
        status: 'APPROVED',
      },
    });

    for (const sub of cat.subcategories) {
      await db.subCategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: sub.slug,
          },
        },
        update: {
          title: sub.title,
          image: sub.image,
        },
        create: {
          title: sub.title,
          slug: sub.slug,
          image: sub.image,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Categories and Subcategories seeded successfully!');
}

if (require.main === module) {
  seedCategories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
