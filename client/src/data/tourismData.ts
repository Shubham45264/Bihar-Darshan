export interface PlaceDetail {
  name: string;
  description: string;
  image: string;
  duration: string;
  importance: string;
}

export interface TimelineActivity {
  time: string;
  activity: string;
  description: string;
}

export interface TimelineDay {
  day: number;
  title: string;
  activities: TimelineActivity[];
}

export interface TeacherOrGuide {
  name: string;
  image: string;
  experience: string;
  languages: string[];
  intro: string;
  phone: string;
  email: string;
  whatsapp: string;
}

export interface ReviewDetail {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  comment: string;
}

export interface VideoDetail {
  title: string;
  thumbnail: string;
  url: string; // YouTube embed URL
  type: 'youtube' | 'local';
}

export interface MapMarker {
  name: string;
  x: number; // Percentage X for SVG canvas map (0-100)
  y: number; // Percentage Y for SVG canvas map (0-100)
  description: string;
  type: 'start' | 'waypoint' | 'end';
}

export interface TourTrip {
  id: string;
  title: string;
  provider: string;
  providerLogo: string;
  rating: number;
  duration: string;
  departureCity: string;
  places: string[];
  description: string;
  price: string;
  phone: string;
  whatsapp: string;
  image: string;
  hasVideo?: boolean;

  // New Rich Details
  overviewText: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  bestTime: string;
  groupSize: string;
  transportation: string;
  startPoint: string;
  endPoint: string;
  guide: TeacherOrGuide;
  placesCoveredDetails: PlaceDetail[];
  timeline: TimelineDay[];
  galleryImages: string[];
  videos: VideoDetail[];
  mapMarkers: MapMarker[];
  reviews: ReviewDetail[];
  emergencyContact: string;
  email: string;
  quote?: string;
  desc?: string;

  // Extended fields for community journeys
  category?: string;
  companyName?: string;
  tripDuration?: string;
  highlights?: string[];
  includedServices?: string[];
  excludedServices?: string[];
  googleMapsLink?: string;
  planName?: string;
  planDays?: number;
  freeDisplayStartDate?: string;
  freeDisplayEndDate?: string;
  status?: string;
  approvedAt?: string;
  createdAt?: string;
}

export const featuredTrips: TourTrip[] = [
  {
    id: "1",
    title: "Maha Bodhi Spiritual Retreat",
    provider: "Nirvana Travels",
    providerLogo: "https://cdn-icons-png.flaticon.com/512/3233/3233481.png",
    rating: 4.9,
    duration: "3 Days, 2 Nights",
    departureCity: "Patna",
    places: ["Mahabodhi Temple", "Dungeshwari Cave", "Great Buddha Statue"],
    description: "Follow the footsteps of Lord Buddha. A premium spiritual journey with 5-star accommodation and expert historians.",
    price: "₹18,500",
    phone: "+91 9876543210",
    whatsapp: "+91 9876543210",
    image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2000&auto=format&fit=crop",
    hasVideo: true,

    // Rich details
    overviewText: "Embark on an inspiring pilgrimage designed to soothe the soul and enrich the mind. The Maha Bodhi Spiritual Retreat takes you on a historical and transcendental journey through Bodh Gaya, the sacred ground where Prince Siddhartha attained supreme enlightenment under the Bodhi Tree to become the Buddha. Walk through sacred ruins, meditate in tranquil stone gardens, and immerse yourself in the rich spiritual legacy that has drawn travelers from across the globe for over two millennia. This meticulously curated experience features luxuriously appointed Heritage stays, personalized history walks led by senior archaeologists, and daily guided meditation sessions at dawn.",
    difficulty: "Easy",
    bestTime: "October to March",
    groupSize: "10 - 15 Travelers",
    transportation: "Premium Air-Conditioned SUV",
    startPoint: "Patna Airport / Railway Station",
    endPoint: "Gaya Junction / Airport",
    emergencyContact: "+91 98765 99999",
    email: "customercare@nirvanatravels.in",
    guide: {
      name: "Acharya Vinay Pathak",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
      experience: "12+ Years",
      languages: ["English", "Hindi", "Pali", "Sanskrit"],
      intro: "Vinay Pathak is a distinguished scholar in Buddhist Archeology and Ancient Indian History. He has spent over a decade documenting monastic ruins in Bihar and Guiding spiritual seekers on routes of inner exploration.",
      phone: "+91 9876543210",
      email: "vinay.pathak@nirvanatravels.in",
      whatsapp: "+91 9876543210"
    },
    placesCoveredDetails: [
      {
        name: "Mahabodhi Temple",
        description: "The UNESCO World Heritage Site housing the Vajrasana stone throne and the sacred Bodhi Tree where Lord Buddha attained enlightenment.",
        image: "https://images.unsplash.com/photo-1609137144813-7d5a57077f52?q=80&w=1000&auto=format&fit=crop",
        duration: "Half Day",
        importance: "The birth site of Buddhism and global center for spiritual pilgrimage."
      },
      {
        name: "Dungeshwari Cave Temples",
        description: "Cliffside caves where Siddhartha practiced strict asceticism and self-mortification for six years before descending to the river.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
        duration: "3 Hours",
        importance: "Symbolizes the transition from extreme asceticism to the Middle Path."
      },
      {
        name: "Great Buddha Statue",
        description: "An awe-inspiring 80-foot stone statue portraying Lord Buddha seated in meditation, surrounded by his ten principal disciples.",
        image: "https://images.unsplash.com/photo-1590053132185-1998375c3f30?q=80&w=1000&auto=format&fit=crop",
        duration: "2 Hours",
        importance: "A landmark monument symbolizing universal peace and spiritual harmony."
      }
    ],
    timeline: [
      {
        day: 1,
        title: "Departure & Spirit of Gaya",
        activities: [
          { time: "08:00 AM", activity: "Departure from Patna", description: "Board your private luxury transport from Patna to Gaya with scenic countryside views." },
          { time: "01:00 PM", activity: "Hotel Check-in & Traditional Lunch", description: "Check in at the Bodhgaya Heritage Resort and enjoy an local organic lunch." },
          { time: "04:30 PM", activity: "Introduction at Mahabodhi Temple", description: "A quiet walking introduction to the shrine complex, observing prayers under the Bodhi tree." }
        ]
      },
      {
        day: 2,
        title: "Ascetic Caves & Giant Monoliths",
        activities: [
          { time: "06:00 AM", activity: "Zen Dawn Meditation Session", description: "Participate in a peaceful guided meditation within the Outer Temple grounds." },
          { time: "10:00 AM", activity: "Excursion to Dungeshwari Hill", description: "Short trek and guided historic exploration of the mountain caves." },
          { time: "03:30 PM", activity: "Great Buddha & Indosan Sect Monasteries", description: "Visit the stunning Japanese, Thai, and Bhutanese temples showcasing varied Buddhist artwork." }
        ]
      },
      {
        day: 3,
        title: "Reflecting on Enlightenment",
        activities: [
          { time: "08:30 AM", activity: "Archaeological Museum Tour", description: "Discover ancient relics, stone railings, and ancient sculptures from the Mauryan era." },
          { time: "11:30 AM", activity: "Sujata Kuti & River Falgu Walk", description: "Visit the memorial dedicated to Sujata, the milkmaid who offered rice-kheer to Siddhartha." },
          { time: "03:00 PM", activity: "Return Journey to Patna", description: "Transfer back to Patna with beautiful memories and a peaceful mind." }
        ]
      }
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609137144813-7d5a57077f52?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590053132185-1998375c3f30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517670868065-9491d6dd8169?q=80&w=1000&auto=format&fit=crop"
    ],
    videos: [
      {
        title: "Exploring spiritual Bodh Gaya",
        thumbnail: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=500&auto=format&fit=crop",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube"
      }
    ],
    mapMarkers: [
      { name: "Patna Starting Point", x: 45, y: 15, description: "Assemble and board comfortable luxury cruisers.", type: "start" },
      { name: "Sujata Kuti, Falgu River", x: 48, y: 55, description: "Historical monument mapping the charity of raw milk rice.", type: "waypoint" },
      { name: "Mahabodhi Temple complex", x: 50, y: 80, description: "Ultimate destination of enlightenment.", type: "end" }
    ],
    reviews: [
      {
        id: "r1",
        userName: "Elena Rostova",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        date: "Nov 2025",
        comment: "This retreat was life-changing. Vinay was exceptionally knowledgeable and the hotels selected were absolute oases of comfort and history."
      },
      {
        id: "r2",
        userName: "Aarav Mehta",
        userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        rating: 4.8,
        date: "Dec 2025",
        comment: "Highly professional service. The guided meditations at dawn under the ancient branches were incredibly serene. Highly recommend it."
      }
    ]
  },
  {
    id: "2",
    title: "The Nalanda Heritage Walk",
    provider: "Bihar Heritage Guild",
    providerLogo: "https://cdn-icons-png.flaticon.com/512/3233/3233497.png",
    rating: 4.8,
    duration: "2 Days, 1 Night",
    departureCity: "Gaya",
    places: ["Nalanda University Ruins", "Hiuen Tsang Memorial", "Pawapuri Jal Mandir"],
    description: "Uncover the secrets of the world's first residential university. Includes private museum tour and authentic Maithili lunch.",
    price: "₹12,000",
    phone: "+91 8765432109",
    whatsapp: "+91 8765432109",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2000&auto=format&fit=crop",
    hasVideo: false,

    // Rich details
    overviewText: "Step back into the Golden Age of learning. The Nalanda Heritage Walk guides you through the red-brick ruins of the historical Nalanda Mahavihara, the world's first residential university which hosted 10,000 students and 2,000 teachers from all across Asia. Walk along the ancient multi-story classrooms, monastic cells, and the legendary libraries that preserved global knowledge systems. Understand the structural marvels of ancient drainage and bricklaying. Together, we will also explore the serene Hiuen Tsang Memorial Hall, capturing the journey of China's most famous traveler-monk, and conclude at the magical marble Jal Mandir in Pawapuri, which floats symmetrically in the middle of a lotus pond.",
    difficulty: "Moderate",
    bestTime: "September to April",
    groupSize: "12 - 20 Travelers",
    transportation: "Air-Conditioned Comfort Coach",
    startPoint: "Gaya Heritage Office / Junction",
    endPoint: "Patna / Gaya Airport",
    emergencyContact: "+91 87654 88888",
    email: "info@biharheritageguild.org",
    guide: {
      name: "Dr. Arundhati Sen",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop",
      experience: "15+ Years",
      languages: ["English", "Hindi", "Bengali"],
      intro: "Dr. Sen is a retired Archaeologist and author of 'Monuments of Magadha'. Her deep analytical skills bring the static bricks of Nalanda alive with amazing historical tales.",
      phone: "+91 8765432109",
      email: "arundhati.sen@biharheritageguild.org",
      whatsapp: "+91 8765432109"
    },
    placesCoveredDetails: [
      {
        name: "Nalanda University Ruins",
        description: "The historical 5th-century Mahavihara ruins consisting of 11 distinct monasteries and 6 major brick temples.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
        duration: "4 Hours",
        importance: "The intellectual epicenter of ancient Asia and birthplace of Buddhist logic."
      },
      {
        name: "Hiuen Tsang Memorial Hall",
        description: "A gorgeous artistic structure built as a joint Indo-Chinese effort honoring the travels and scholastic achievements of Xuanzang.",
        image: "https://images.unsplash.com/photo-1517670868065-9491d6dd8169?q=80&w=1000&auto=format&fit=crop",
        duration: "2 Hours",
        importance: "An architectural wonder storing fine manuscript paintings and a bronze statue of the monk."
      },
      {
        name: "Pawapuri Jal Mandir",
        description: "The sublime marble temple floating over a massive water tank filled with pink lotuses, commemorating Lord Mahavira's nirvana.",
        image: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1000&auto=format&fit=crop",
        duration: "2 Hours",
        importance: "The most sacred site of Jainism, reflecting extreme cosmic peace."
      }
    ],
    timeline: [
      {
        day: 1,
        title: "The Heart of Knowledge",
        activities: [
          { time: "07:30 AM", activity: "Gaya Departure to Nalanda", description: "Enjoy premium transport with interactive trivia about ancient Magadha from our expert guide." },
          { time: "10:30 AM", activity: "Ruins Exploration", description: "Walk through the colossal stupas, water wells, and chambers of the historic campus." },
          { time: "01:00 PM", activity: "Traditional Maithili Lunch", description: "Savor a traditional banana-leaf thali consisting of organic grains and regional lentils." },
          { time: "03:00 PM", activity: "Hiuen Tsang Hall & Museum", description: "Browse ancient sculptures, terracotta seals, and historical travel accounts." }
        ]
      },
      {
        day: 2,
        title: "Spiritual Lotus & Return",
        activities: [
          { time: "08:30 AM", activity: "Visit at Pawapuri Jal Mandir", description: "Cross the red sandstone bridge to access the floating marble temple and witness quiet prayers." },
          { time: "12:00 PM", activity: "Souvenir Shopping & Handloom Meet", description: "Meet local weavers producing Bhagalpuri silk and traditional handicrafts." },
          { time: "03:30 PM", activity: "Final Transfer to Airport/Station", description: "Safe return to Gaya or Patna terminal for onwards destinations." }
        ]
      }
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517670868065-9491d6dd8169?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590053132185-1998375c3f30?q=80&w=1000&auto=format&fit=crop"
    ],
    videos: [
      {
        title: "Nalanda Heritage Documentary",
        thumbnail: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=500&auto=format&fit=crop",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube"
      }
    ],
    mapMarkers: [
      { name: "Gaya Junction Start Point", x: 15, y: 75, description: "Assemble and travel through the scenic agricultural valleys.", type: "start" },
      { name: "Nalanda University Ruins", x: 55, y: 40, description: "Ancient brick halls.", type: "waypoint" },
      { name: "Pawapuri Jal Mandir", x: 80, y: 80, description: "Lotus temple and final stop.", type: "end" }
    ],
    reviews: [
      {
        id: "r2-1",
        userName: "Marc Henderson",
        userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        rating: 4.9,
        date: "Oct 2025",
        comment: "Dr. Arundhati has an incredible talent. History felt as alive and vibrant as a story-tale. The authentic lunch was delicious!"
      }
    ]
  },
  {
    id: "3",
    title: "Royal Patna River Cruise",
    provider: "Ganga Voyages",
    providerLogo: "https://cdn-icons-png.flaticon.com/512/3233/3233501.png",
    rating: 4.7,
    duration: "Full Day",
    departureCity: "Patna",
    places: ["Ganga Ghats", "Har Mandir Sahib", "Golghar", "Bihar Museum"],
    description: "Experience the sunset over the holy Ganges. A luxury cruise experience with gourmet catering and live Sufi music.",
    price: "₹6,500",
    phone: "+91 7654321098",
    whatsapp: "+91 7654321098",
    image: "https://images.unsplash.com/photo-1517670868065-9491d6dd8169?q=80&w=2000&auto=format&fit=crop",
    hasVideo: true,

    // Rich details
    overviewText: "Witness Patna's timeless history unfold from the waters of the sacred Ganges. The Royal Patna River Cruise combines luxury hospitality with cultural storytelling. Boarding a premium double-decker river vessel, you will cruise past historical ghats, witnessing ancient architectures, and experiencing a dramatic sunset. The day journey commences with guided inland visits to the unique architecture of Golghar, the stunning relics at the world-class Bihar Museum, and the spiritual Takht Sri Patna Sahib, concluding with dinner on the cruise boat accompanied by live semi-classical Sufi music.",
    difficulty: "Easy",
    bestTime: "Year-Round (Best during sunsets)",
    groupSize: "15 - 30 Travelers",
    transportation: "Luxury Motor Cruiser & Air-Conditioned Coach",
    startPoint: "Gandhi Ghat Marina, Patna",
    endPoint: "Gandhi Ghat Marina, Patna",
    emergencyContact: "+91 76543 77777",
    email: "bookings@gangavoyages.com",
    guide: {
      name: "Sarmad Al-Husaini",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
      experience: "8+ Years",
      languages: ["English", "Hindi", "Urdu"],
      intro: "Sarmad has hosted hundreds of private luxury tours down the Ganga river. He is specialized in the Sufi literature, architecture and oral history of Patna City.",
      phone: "+91 7654321098",
      email: "sarmad@gangavoyages.com",
      whatsapp: "+91 7654321098"
    },
    placesCoveredDetails: [
      {
        name: "Historical Ganga Ghats",
        description: "Vibrant river banks alive with devotees, classical architecture, and the beautiful evening Ganga Aarti.",
        image: "https://images.unsplash.com/photo-1517670868065-9491d6dd8169?q=80&w=1000&auto=format&fit=crop",
        duration: "3 Hours (Onboard)",
        importance: "The spiritual spine of Patna city, providing panoramic urban views."
      },
      {
        name: "Takht Sri Patna Sahib",
        description: "The magnificent white-domed Gurdwara built to commemorate the birthplace of the tenth Sikh Guru, Guru Gobind Singh Ji.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
        duration: "2 Hours",
        importance: "One of the five main takhts of Sikhism, representing extreme piety and community kitchen pride."
      },
      {
        name: "Bihar Museum",
        description: "A world-class contemporary museum hosting 2,000+ years of archaeological treasures, sculptures, and kinetic arts.",
        image: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1000&auto=format&fit=crop",
        duration: "3 Hours",
        importance: "Showcases the iconic 2300-year-old Didarganj Yakshi and historic Mauryan relics."
      }
    ],
    timeline: [
      {
        day: 1,
        title: "City Echoes & Waterway Sunset",
        activities: [
          { time: "09:00 AM", activity: "Bihar Museum Guided Tour", description: "Behold the masterpieces of ancient Indian sculpture with historical interpretations." },
          { time: "12:30 PM", activity: "Visit to Golghar & Traditional Lunch", description: "Inspect the colossal beehive grain granary and enjoy delicious Bihari Litti Chokha." },
          { time: "02:30 PM", activity: "Prayer Walk at Takht Sri Patna Sahib", description: "Experience deep calmness and volunteer at the historical community kitchen." },
          { time: "04:30 PM", activity: "Check-in at Royal Cruise Liner", description: "Board at Gandhi Ghat. Sip traditional tea as the vessel sails downstream during sunset." },
          { time: "07:00 PM", activity: "Sufi Music & Festive Dinner", description: "A multi-course gourmet dinner with live strings and magical Sufi compositions on deck." }
        ]
      }
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1517670868065-9491d6dd8169?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1000&auto=format&fit=crop"
    ],
    videos: [
      {
        title: "Ganga Cruise Experience",
        thumbnail: "https://images.unsplash.com/photo-1517670868065-9491d6dd8169?q=80&w=500&auto=format&fit=crop",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube"
      }
    ],
    mapMarkers: [
      { name: "Patna Museum Assembly", x: 15, y: 15, description: "Historical start in city center.", type: "start" },
      { name: "Patna Sahib Gurdwara", x: 45, y: 35, description: "Spiritual holy shrine.", type: "waypoint" },
      { name: "Gandhi Ghat Marina Boarding", x: 80, y: 80, description: "Sunset cruise line ending point.", type: "end" }
    ],
    reviews: [
      {
        id: "r3-1",
        userName: "Vikram Kadam",
        userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        rating: 4.8,
        date: "Jan 2026",
        comment: "Excellent food, gentle cruise path, and beautiful music! Watching the sunset over the Ganges was worth every rupee."
      }
    ]
  },
  {
    id: "4",
    title: "Vaishali Peace Expedition",
    provider: "Licchavi Tours",
    providerLogo: "https://cdn-icons-png.flaticon.com/512/3233/3233515.png",
    rating: 4.9,
    duration: "2 Days",
    departureCity: "Vaishali",
    places: ["Ashoka Pillar", "Vishwa Shanti Stupa", "Coronation Tank"],
    description: "Explore the birthplace of Lord Mahavira and the world's first republic. A peaceful retreat for history lovers.",
    price: "₹9,800",
    phone: "+91 6543210987",
    whatsapp: "+91 6543210987",
    image: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=2000&auto=format&fit=crop",
    hasVideo: false,

    // Rich details
    overviewText: "Immerse yourself in Vaishali, a timeless crucible of democracy and ancient spirituality. Vaishali, the capital of the ancient Licchavi republic, is regarded as the world's first democratic republic. It is deeply sacred to both Buddhism—as the site where Lord Buddha preached his last sermon—and Jainism, as the holy birthplace of Lord Mahavira. Discover the meticulously designed Ashoka Pillar, capped with an iconic single-lion capital overlooking a brick stupa. We will walk past the ancient Coronation Tank (Abhishek Pushkarini), whose waters anointed local elected leaders, and climb to the serene heights of the massive Vishwa Shanti Stupa, radiating messages of peace across global contours.",
    difficulty: "Easy",
    bestTime: "October to April",
    groupSize: "8 - 15 Travelers",
    transportation: "Premium Air-Conditioned Coach",
    startPoint: "Vaishali Heritage Gate / Hotel",
    endPoint: "Patna Airport / Station",
    emergencyContact: "+91 65432 66666",
    email: "bookings@licchavitours.com",
    guide: {
      name: "Vidya Prakash",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop",
      experience: "10+ Years",
      languages: ["English", "Hindi", "French"],
      intro: "Vidya Prakash is a regional guide recognized by the Ministry of Tourism. She has a deep love for Licchavi coins, ancient republican relics, and forest meditation structures.",
      phone: "+91 6543210987",
      email: "vidya.prakash@licchavitours.com",
      whatsapp: "+91 6543210987"
    },
    placesCoveredDetails: [
      {
        name: "Ashoka Pillar at Kolhua",
        description: "A monolithic polished sandstone pillar topped by a spectacular seated lion capital, situated next to a brick stupa.",
        image: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1000&auto=format&fit=crop",
        duration: "3 Hours",
        importance: "Stands exactly at the site of Lord Buddha's last monastery sermon."
      },
      {
        name: "Vishwa Shanti Stupa",
        description: "A modern, massive white-colored peace pagoda containing golden images of Buddha depicting major lifecycle scenes.",
        image: "https://images.unsplash.com/photo-1590053132185-1998375c3f30?q=80&w=1000&auto=format&fit=crop",
        duration: "2 Hours",
        importance: "Built by Japan's Nipponzan Myohoji, it is a magnificent modern icon of global pacification."
      },
      {
        name: "Abhishek Pushkarini (Coronation Tank)",
        description: "The historical holy tank containing water that ancient representatives of the Licchavi republic used to consecrate themselves.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
        duration: "2 Hours",
        importance: "An ancient public utility representing the earliest democracy systems of mankind."
      }
    ],
    timeline: [
      {
        day: 1,
        title: "Monolithic Wonders & Water Tanks",
        activities: [
          { time: "09:00 AM", activity: "Assembly & Kolhua Park Site", description: "Enter the Kolhua excavation ruins, marvel at the Ashoka pillar, and sit by the monkey tank." },
          { time: "01:00 PM", activity: "Gourmet Picnic Lunch", description: "Enjoy a premium picnic lunch in the manicured gardens surrounding the ruins." },
          { time: "03:30 PM", activity: "Abhishek Pushkarini & Museum Visit", description: "Stroll around the holy tank, then inspect antiquity items dating 600 BC." }
        ]
      },
      {
        day: 2,
        title: "Pagodas of Peace & Ancient Soils",
        activities: [
          { time: "07:30 AM", activity: "Sunrise Walk around Shanti Stupa", description: "Appreciate the golden light illuminating the white dome and enjoy the calm bells." },
          { time: "11:00 AM", activity: "Expedition to Raja Vishal Ka Garh", description: "Witness the historical mud fort ramparts representing where first assemblies voted." },
          { time: "03:00 PM", activity: "Patna Return Transit", description: "Drive back across the Mahatma Gandhi Setu bridge to Patna for onward connections." }
        ]
      }
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590053132185-1998375c3f30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1000&auto=format&fit=crop"
    ],
    videos: [
      {
        title: "Vaishali - Cradle of Democracy",
        thumbnail: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=500&auto=format&fit=crop",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube"
      }
    ],
    mapMarkers: [
      { name: "Vaishali Entrance Block", x: 15, y: 15, description: "Rally point for incoming coaches.", type: "start" },
      { name: "Ashokan Kolhua Park", x: 45, y: 40, description: "Monolithic pillar place.", type: "waypoint" },
      { name: "Vishwa Shanti Stupa", x: 80, y: 80, description: "Peace stupa final node.", type: "end" }
    ],
    reviews: [
      {
        id: "r4-1",
        userName: "Claire Dubois",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        date: "Feb 2026",
        comment: "Vaishali is a hidden gem, and the tour guide Vidya made every detail shine. I loved the peaceful sunrise walk."
      }
    ]
  }
];
