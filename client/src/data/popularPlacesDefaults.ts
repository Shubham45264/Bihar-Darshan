import bodhGayaImg from "../assets/bodh-gaya.png";
import nalandaImg from "../assets/nalanda.png";
import rajgirImg from "../assets/rajgir.png";
import vaishaliImg from "../assets/vaishali.png";
import patnaSahibImg from "../assets/patna-sahib.png";
import pawapuriImg from "../assets/pawapuri.png";

export interface PopularPlaceItem {
  id: string;
  name: string;
  district: string;
  image: string;
  description: string;
  images?: string[];
  overview?: string;
  highlights?: string[];
  bestTimeToVisit?: string;
  districtSlug?: string;
  rating?: number;
  category?: string;
}

export const defaultPopularPlaces: PopularPlaceItem[] = [
  {
    id: "bodh-gaya",
    name: "Bodh Gaya",
    district: "Gaya District",
    districtSlug: "gaya",
    image: bodhGayaImg,
    images: [bodhGayaImg],
    description:
      "The sacred site where Siddhartha Gautama attained enlightenment under the Bodhi Tree. Home to the magnificent Mahabodhi Temple, a UNESCO World Heritage Site drawing pilgrims from across the globe.",
    overview:
      "Bodh Gaya is the most revered Buddhist pilgrimage center in the world. Located on the banks of the River Falgu in Gaya district, this holy city is where Prince Siddhartha Gautama sat in deep meditation under a sacred peepal tree and attained Supreme Enlightenment (Bodhi) to become Gautama Buddha around 500 BCE.\n\nThe Mahabodhi Temple Complex features the iconic 55-meter tall pyramidal temple spire built during the Gupta empire period, the sacred Vajrasana (Diamond Throne) marking the exact spot of enlightenment, and the descendant of the original Bodhi Tree. International Buddhist monasteries built by Japan, Thailand, Bhutan, Tibet, and Sri Lanka surround the sanctuary, reflecting diverse architectural traditions unified by faith.",
    highlights: [
      "Mahabodhi Temple Complex (UNESCO World Heritage Site)",
      "Sacred Bodhi Tree & Vajrasana (Diamond Throne)",
      "80-Foot Great Buddha Statue",
      "International Buddhist Monasteries (Thai, Japanese, Tibetan)",
      "Muchalinda Lake & Meditation Gardens"
    ],
    bestTimeToVisit: "October to March (Peak Spiritual Season)",
    rating: 4.9,
    category: "Spiritual & UNESCO World Heritage"
  },
  {
    id: "nalanda",
    name: "Nalanda",
    district: "Nalanda District",
    districtSlug: "nalanda",
    image: nalandaImg,
    images: [nalandaImg],
    description:
      "Once the world's greatest centre of learning, Nalanda University flourished from the 5th to 12th century AD. Its sprawling ruins and ancient manuscripts tell the story of a golden era of knowledge.",
    overview:
      "Nalanda Mahavihara is one of the world's oldest residential universities, established in the 5th century CE under the patronage of the Gupta Empire and later rulers like Emperor Harsha and the Pala Dynasty. At its peak, Nalanda accommodated over 10,000 students and 2,000 teachers from across ancient Asia, including China, Korea, Japan, Tibet, Mongolia, and Sri Lanka.\n\nThe archaeological site spans over 14 hectares of red-brick ruins featuring stupas, lecture halls, dormitories, shrines, and a famous multi-story library called 'Dharmaganja'. Renowned Chinese scholar Xuanzang (Hiuen Tsang) studied and taught here for years, leaving detailed accounts of its academic rigor and architectural grandeur.",
    highlights: [
      "Great Stupa of Sariputra (Monument 3)",
      "Monastery Excavation Complexes 1 through 11",
      "Nalanda Archaeological Museum",
      "Hiuen Tsang Memorial Hall",
      "Ancient Brick Viharas & Brick Sculptures"
    ],
    bestTimeToVisit: "October to March",
    rating: 4.8,
    category: "Ancient Education & UNESCO World Heritage"
  },
  {
    id: "rajgir",
    name: "Rajgir",
    district: "Nalanda District",
    districtSlug: "nalanda",
    image: rajgirImg,
    images: [rajgirImg],
    description:
      "Nestled among lush green hills, Rajgir was the first capital of the Magadha Empire. Famous for its hot springs, the Vishwa Shanti Stupa, and its deep Buddhist and Jain heritage.",
    overview:
      "Rajgir (ancient Rajagriha, meaning 'City of Kings') is encircled by five majestic hills - Ratnagiri, Vepulagiri, Vaibharagiri, Songiri, and Udayagiri. As the original capital of the ancient Magadha Kingdom, Rajgir holds sacred ties to both Lord Buddha and Lord Mahavira.\n\nLord Buddha spent many monsoon retreats here at Griddhakuta (Gridhrakuta Peak or Vulture's Peak), delivering famous discourses including the Heart Sutra and Lotus Sutra. Visitors can ascend Ratnagiri Hill via an aerial ropeway to view the gleaming white Vishwa Shanti Stupa (World Peace Pagoda). Rajgir is also world-renowned for its medicinal sulfur hot springs at Brahma Kund.",
    highlights: [
      "Vishwa Shanti Stupa & Chairlift Ropeway",
      "Griddhakuta (Vulture's Peak)",
      "Brahma Kund Mineral Hot Springs",
      "Cyclopean Wall of Ancient Rajgir",
      "Venu Vana Bamboo Grove & Bimbisara Jail"
    ],
    bestTimeToVisit: "October to March",
    rating: 4.7,
    category: "Heritage, Nature & Pilgrimage"
  },
  {
    id: "vaishali",
    name: "Vaishali",
    district: "Vaishali District",
    districtSlug: "vaishali",
    image: vaishaliImg,
    images: [vaishaliImg],
    description:
      "One of the world's earliest republics and the birthplace of Lord Mahavira. Vaishali's ancient pillars, stupas, and serene excavated sites transport visitors back to a remarkable civilisation.",
    overview:
      "Vaishali is historically celebrated as one of the world's first republics (Lichchhavi Democracy) governed by an elected assembly during the 6th century BCE. It is the holy birthplace of Lord Mahavira, the 24th Tirthankara of Jainism, born in nearby Kundalpur.\n\nFor Buddhists, Vaishali is where Lord Buddha delivered his last sermon before his Mahaparinirvana and announced his impending departure. The archaeological site features the remarkably preserved Ashokan Pillar with a single polished lion capital, the Buddha Relic Stupa, and the sacred Coronation Tank (Abhishek Pushkarni) where elected Lichchhavi rulers were anointed.",
    highlights: [
      "Ashokan Lion Pillar & Ananda Stupa",
      "Buddha Relic Stupa Site",
      "Abhishek Pushkarni (Sacred Coronation Tank)",
      "Vishwa Shanti Stupa Vaishali",
      "Kundalpur (Birthplace of Lord Mahavira)"
    ],
    bestTimeToVisit: "October to March",
    rating: 4.7,
    category: "Republic History & Ancient Heritage"
  },
  {
    id: "patna-sahib",
    name: "Patna Sahib",
    district: "Patna District",
    districtSlug: "patna",
    image: patnaSahibImg,
    images: [patnaSahibImg],
    description:
      "The revered birthplace of Guru Gobind Singh Ji, the tenth Sikh Guru. Patna Sahib's golden Gurudwara stands as a beacon of devotion, attracting thousands of Sikh pilgrims every year.",
    overview:
      "Takht Sri Harmandir Ji Patna Sahib is one of the five Takhts (seats of temporal and spiritual authority) in Sikhism. Built in the old quarters of Patna along the Ganges, it marks the exact birthplace of Tenth Sikh Guru, Guru Gobind Singh Ji, born here in 1666 CE.\n\nThe majestic white and gold Gurudwara was originally built by Maharaja Ranjit Singh and holds precious relics including Guru Gobind Singh Ji's iron arrows, wooden sandals, royal cradle (Pangura), and holy swords. Lakhs of devotees gather here annually during Prakash Parv celebrations.",
    highlights: [
      "Takht Sri Harmandir Sahib Shrine & Golden Spire",
      "Preserved Sacred Relics of Tenth Sikh Guru",
      "Langar Sahib (Community Kitchen Serving Thousands Daily)",
      "Ganga River Ghats of Old Patna",
      "Heritage Museum Inside Gurudwara Complex"
    ],
    bestTimeToVisit: "All year round (Special during Prakash Parv in Dec-Jan)",
    rating: 4.9,
    category: "Spiritual Takht & Sikh Heritage"
  },
  {
    id: "pawapuri",
    name: "Pawapuri",
    district: "Nalanda District",
    districtSlug: "nalanda",
    image: pawapuriImg,
    images: [pawapuriImg],
    description:
      "The sacred Jain pilgrimage town where Lord Mahavira attained nirvana. The stunning Jal Mandir, a marble temple set in the middle of a lotus-filled pond, is its most iconic landmark.",
    overview:
      "Pawapuri (also known as Apapuri, meaning 'The Sinless Town') is one of the most holy pilgrimage destinations for followers of Jainism. It is the sacred site where Lord Mahavira, the 24th and last Tirthankara, attained Moksha (Nirvana) in 527 BCE.\n\nThe breathtaking Jal Mandir ('Water Temple') is constructed in pure white marble in the center of a large tank filled with blooming red lotus flowers. Legend states that the pond was formed when millions of devotees collected ashes and soil from the site of Lord Mahavira's cremation.",
    highlights: [
      "Jal Mandir (White Marble Lotus Pond Temple)",
      "Samosaran Mandir (Site of Final Sermons)",
      "Gaon Mandir (Ancient Village Shrine)",
      "Lotus Tank & Tranquil Sanctuary Gardens"
    ],
    bestTimeToVisit: "October to March (Special during Diwali Mahavira Nirvana Day)",
    rating: 4.8,
    category: "Jain Sacred Heritage & Lake Temple"
  },
];

