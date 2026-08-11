# 🪔 Bihar Darshan (बिहार दर्शन)

> **The Cradle of Enlightenment. The Soul of Heritage.**  
> A comprehensive, modern web portal celebrating the rich cultural heritage, sacred landmarks, indigenous tribal traditions, historic legends, and vibrant tourism of Bihar, India.

---

## 🌟 Overview

**Bihar Darshan** is a full-stack digital platform designed to preserve, promote, and showcase the cultural and historical legacy of Bihar. From ancient centers of learning like Nalanda and Vikramshila to the sacred grounds of Bodh Gaya and Vaishali, Bihar Darshan provides immersive travel guides, curated itineraries, community contributions, and an integrated marketplace for local artisans.

---

## 🚀 Tech Stack

### **Frontend (`client/`)**
- **Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Styled Components
- **Animations & Effects**: Framer Motion, Glassmorphism, Micro-interactions
- **Icons & UI**: Lucide React, Swiper.js
- **Routing**: React Router DOM v7
- **Authentication**: Firebase Client SDK v12

### **Backend (`server/`)**
- **Runtime**: Node.js, TypeScript
- **Web Framework**: Express.js v5
- **Database & ORM**: PostgreSQL, Prisma ORM v7 (`@prisma/adapter-pg`)
- **Authentication**: Firebase Admin SDK v13 (Bearer Token JWT verification)
- **Media & File Storage**: Cloudinary, Multer
- **Validation**: Zod schema validation
- **Security & Utilities**: Helmet, CORS, Express Rate Limit, Compression, Cookie Parser
- **Logging**: Winston logger with daily file rotation & Morgan

---

## Key Features

- 📍 **38 Districts Exploration**: Detailed travel guides for all 38 districts of Bihar with rich history, top attractions, seasonal recommendations, and travel routes (Air, Rail, Road).
- 🏹 **Tribal Bihar Showcase**: Dedicated section spotlighting Bihar's indigenous tribes (Santhal, Oraon, Munda, Kharia, Birhor), featuring articles, cultural sections, and video submissions.
- 📜 **Category Stories & Discover**: Rich multimedia articles categorized under Food, Festivals, Crafts, Heritage, and Wildlife.
- 🧭 **Journeys & Travel Guides**: Community and admin-curated itineraries complete with timelines, price estimates, maps integration, and tour guide contacts.
- 🖼️ **Interactive Media Gallery**: Community photo & video sharing with dynamic likes, views counter, and category filtering.
- 👑 **Bihar's Legendary Personalities**: Dedicated showcase of historical rulers, independence fighters, literary icons, politicians, and cinema figures from Bihar.
- 🛍️ **Artisan & Craft Marketplace**: Digital platform connecting users with local Bihari handicrafts (Madhubani painting, Manjusha art, Bhagalpuri silk, brassware).
- 🔒 **Admin Portal & Moderation Workflow**: Full admin dashboard for approving/rejecting user contributions, managing site configuration, categories, and site statistics.

---

## 📁 Repository Structure

```
Bihar-Darshan/
├── client/                      # React 19 Frontend (Vite)
│   ├── public/                  # Static assets & images
│   ├── src/
│   │   ├── assets/              # Compressed UI assets & media
│   │   ├── components/          # Reusable UI components
│   │   │   ├── admin/           # Admin Dashboard components
│   │   │   ├── gallery/         # Gallery components
│   │   │   ├── layout/          # Layouts, Navbar, Footer
│   │   │   ├── shared/          # Floating Socials, Modals
│   │   │   ├── tourism/         # Destination & Hero sections
│   │   │   └── tribals/         # Tribal heritage components
│   │   ├── data/                # Context API providers & mock fallbacks
│   │   ├── pages/               # React Page Views & Admin routes
│   │   ├── utils/               # Helper utilities & API callers
│   │   ├── App.tsx              # Application Routing
│   │   └── main.tsx             # Entry Point
│   ├── package.json
│   ├── vercel.json              # SPA rewrite routing for Vercel
│   └── vite.config.ts
│
├── server/                      # Express.js Backend
│   ├── api/                     # Vercel serverless function entrypoint
│   ├── prisma/                  # Database Schema & Migration files
│   │   └── schema.prisma        # PostgreSQL Data Models
│   ├── src/
│   │   ├── config/              # Environment & Cloudinary configuration
│   │   ├── errors/              # Custom AppError & Exception Handlers
│   │   ├── helpers/             # API Response formatting helpers
│   │   ├── middlewares/         # Auth, Upload, Rate limiters, Error middleware
│   │   ├── modules/             # Feature Modules (Auth, User, District, Journey, etc.)
│   │   ├── scripts/             # Database seed scripts
│   │   ├── utils/               # Logger & Async wrappers
│   │   ├── app.ts               # Express App initialization & routes
│   │   └── server.ts            # Server entry point
│   ├── package.json
│   └── vercel.json              # Backend Vercel deployment configuration
│
└── deployment_guide.md          # Step-by-step deployment guide
```

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: Local database instance or cloud URL (Supabase/Neon)

### 1. Clone the Repository
```bash
git clone https://github.com/Shubham45264/Bihar-Darshan.git
cd Bihar-Darshan
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/bihar_darshan?schema=public"
CORS_ORIGIN=http://localhost:5173

# Cloudinary Setup (Optional for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase Admin Credentials (Optional for production JWT auth)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

Initialize Prisma database:
```bash
npx prisma db push
npm run seed  # (Optional) Seed initial categories & districts data
```

Start the backend dev server:
```bash
npm run dev
```
*(Server will run at `http://localhost:5000`)*

---

### 3. Frontend Setup
Open a new terminal tab:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend dev server:
```bash
npm run dev
```
*(Client will run at `http://localhost:5173`)*

---

## 📡 API Architecture

| Endpoint Prefix | Description | Auth Required |
| :--- | :--- | :--- |
| `/api/v1/districts` | District travel guides & attractions | Public |
| `/api/v1/categories` | Unified categories & subcategory stories | Public / Admin |
| `/api/v1/culture` | Heritage, festivals, & crafts | Public |
| `/api/v1/tribes` | Tribal profiles & community video showcasing | Public / User |
| `/api/v1/journeys` | Travel itineraries & guide contacts | Public / User |
| `/api/v1/gallery` | Community photo gallery & likes | Public / User |
| `/api/v1/marketplace` | Local Bihari products & artisan listings | Public / User |
| `/api/v1/admin` | Content moderation & site statistics | Admin Only |
| `/api/v1/upload` | Media upload handler (Cloudinary) | Authenticated |

---

## 🌐 Deployment

The project is pre-configured for seamless deployment to **Vercel** and cloud database providers (Supabase / Neon / Render):

- **Frontend Hosting**: Vercel (SPA routing configured via `client/vercel.json`).
- **Backend Hosting**: Render / Railway or Vercel Serverless (configured via `server/api/index.ts` and `server/vercel.json`).

Refer to the complete [Deployment Guide](./deployment_guide.md) for step-by-step instructions.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the cultural coverage, add new district details, or enhance UI components:

1. Fork the project repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
