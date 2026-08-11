import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, FileText, Clock, Edit3, X, LogOut, Eye, Trash2, XCircle, Shield, Award, Trophy, ChevronRight } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import { signOut, onAuthStateChanged, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface UserPostItem {
  id: string | number;
  title: string;
  date: string;
  views?: string;
  category: string;
  status: 'published' | 'pending' | 'rejected';
  image: string;
  videoUrl?: string;
  type: 'story' | 'journey' | 'gallery' | 'culture' | 'tribe_video' | 'article' | 'community_post';
  rejectionReason?: string;
}

const PREDEFINED_AVATARS = [
  "/images/culture/avatar-man1.png",
  "/images/culture/avatar-woman1.png",
  "/images/culture/avatar-man2.png",
  "/images/culture/avatar-girl1.png",
  "/images/culture/avatar-boy1.png",
];

const PREDEFINED_BACKGROUNDS = [
  "/images/culture/hero-artwork.png",
  "/images/culture/sonepur-mela.png",
  "/images/culture/sama-chakeva.png",
  "/images/culture/rajgir-mahotsav.png"
];

const Profile = () => {
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams();
  const [searchParams] = useSearchParams();
  const targetId = routeUserId || searchParams.get('id') || searchParams.get('userId');

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<UserPostItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [profileUserId, setProfileUserId] = useState<string>('');
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(true);

  // Profile State
  const [profile, setProfile] = useState({
    name: "User",
    title: "Cultural Enthusiast",
    bio: "Explore and discover the rich culture & destinations of Bihar!",
    avatar: "/images/culture/avatar-man1.png",
    background: "/images/culture/hero-artwork.png",
    rewardPoints: 0,
    totalPosts: 0,
    communitiesJoined: 0,
    pendingPosts: 0,
    rejectedPosts: 0,
    badgesEarned: 0,
  });
  const [leaderboardPreview, setLeaderboardPreview] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  const fetchProfile = async (firebaseUser: FirebaseUser | null, isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

      // Fetch leaderboard preview
      fetch(`${API_BASE_URL}/users/leaderboard?limit=5`)
        .then(r => r.json())
        .then(lbData => {
          if (lbData.success && lbData.data?.leaderboard) {
            setLeaderboardPreview(lbData.data.leaderboard);
            const myUid = firebaseUser?.uid;
            if (myUid) {
              const found = lbData.data.leaderboard.find((u: any) => u.firebaseUid === myUid);
              if (found) setUserRank(found.rank);
            }
          }
        })
        .catch(() => null);


      let dbUser: any = null;
      let isOwn = true;

      if (targetId) {
        const publicRes = await fetch(`${API_BASE_URL}/users/public/${targetId}`).then(r => r.json()).catch(() => null);
        if (publicRes?.success && publicRes.data?.user) {
          dbUser = publicRes.data.user;
          if (firebaseUser) {
            isOwn = (firebaseUser.uid === dbUser.firebaseUid || firebaseUser.uid === dbUser.id || targetId === firebaseUser.uid);
          } else {
            isOwn = false;
          }
        } else if (firebaseUser) {
          const token = await firebaseUser.getIdToken().catch(() => null);
          const headers: Record<string, string> = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const profileRes = await fetch(`${API_BASE_URL}/users/profile`, { headers }).then(r => r.json()).catch(() => null);
          dbUser = profileRes?.success && profileRes.data?.user ? profileRes.data.user : null;
          isOwn = true;
        }
      } else if (firebaseUser) {
        const token = await firebaseUser.getIdToken().catch(() => null);
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const profileRes = await fetch(`${API_BASE_URL}/users/profile`, { headers }).then(r => r.json()).catch(() => null);
        dbUser = profileRes?.success && profileRes.data?.user ? profileRes.data.user : null;
        isOwn = true;
      }

      setIsOwnProfile(isOwn);

      const userIdToStore = dbUser?.id || dbUser?.firebaseUid || targetId || firebaseUser?.uid || '';
      setProfileUserId(userIdToStore);

      const userName = (dbUser?.name || firebaseUser?.displayName || "").toLowerCase().trim();
      const userEmail = (dbUser?.email || firebaseUser?.email || "").toLowerCase().trim();
      const userUid = dbUser?.firebaseUid || dbUser?.id || firebaseUser?.uid || targetId;

      const isUserAdmin = isOwn && (userEmail === 'bihardarshanofficial@gmail.com' || dbUser?.role === 'ADMIN');
      setIsAdmin(isUserAdmin);

      // Fetch all post collections concurrently
      const [storiesData, discoverData, videoData, articlesData] = await Promise.all([
        fetch(`${API_BASE_URL}/stories?status=all`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/discover?status=all`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/tribes/videos/all`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/tribes/articles?status=all`).then(r => r.json()).catch(() => null)
      ]);

      const matchUser = (authorNameOrEmail: string | null | undefined, authorId?: string | null) => {
        if (authorId && (authorId === userUid || authorId === dbUser?.id || authorId === dbUser?.firebaseUid || authorId === targetId)) return true;
        if (!authorNameOrEmail) return false;
        const authorStr = authorNameOrEmail.toLowerCase().trim();
        if (!authorStr) return false;
        return authorStr === userName || authorStr === userEmail || (userEmail && authorStr.includes(userEmail)) || (userName && (authorStr.includes(userName) || userName.includes(authorStr)));
      };

      // 1. Stories
      let storyPosts: UserPostItem[] = [];
      if (storiesData?.success && Array.isArray(storiesData.data?.stories)) {
        const matchedStories = storiesData.data.stories.filter((s: any) => matchUser(s.authorName, s.authorId));
        storyPosts = matchedStories.map((s: any) => ({
          id: s.id,
          title: s.title,
          date: new Date(s.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          views: `${s.views ?? 0} Views`,
          category: s.category?.title || s.district || "Story",
          status: s.status === "APPROVED" ? "published" : s.status === "REJECTED" ? "rejected" : "pending",
          image: s.mediaUrl || (Array.isArray(s.mediaFiles) && s.mediaFiles[0]?.url) || "/images/culture/hero-artwork.png",
          type: "story",
          rejectionReason: s.rejectionReason || ""
        }));
      }

      // 2. Discover Items
      let culturePosts: UserPostItem[] = [];
      if (discoverData?.success && discoverData.data?.items) {
        const matchedDiscover = discoverData.data.items.filter((d: any) => matchUser(d.author));
        culturePosts = matchedDiscover.map((d: any) => ({
          id: d.id,
          title: d.title,
          date: new Date(d.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          views: `${d.views ?? 0} Views`,
          category: d.category ? (d.category.charAt(0) + d.category.slice(1).toLowerCase()) : "Culture",
          status: d.status === "APPROVED" ? "published" : d.status === "REJECTED" ? "rejected" : "pending",
          image: d.image || "/images/culture/hero-artwork.png",
          type: "culture",
          rejectionReason: d.rejectionReason || ""
        }));
      }

      // 3. Tribe Videos
      let videoPosts: UserPostItem[] = [];
      if (videoData?.success && videoData.data?.videos) {
        const matchedVideos = videoData.data.videos.filter((v: any) => matchUser(v.uploaderName, v.userId));
        videoPosts = matchedVideos.map((v: any) => ({
          id: v.id,
          title: v.caption || v.title || `${v.tribeName} Video`,
          date: new Date(v.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          views: `${v.views ?? 0} Views`,
          category: `${v.tribeName} Video`,
          status: v.status === "APPROVED" ? "published" : v.status === "REJECTED" ? "rejected" : "pending",
          image: v.thumbnail || "/images/culture/hero-artwork.png",
          videoUrl: v.videoUrl,
          type: "tribe_video",
          rejectionReason: v.rejectionReason || "",
        }));
      }

      // 5. Tribal Articles
      let tribalArticles: UserPostItem[] = [];
      if (articlesData?.success && Array.isArray(articlesData.data?.articles)) {
        const matchedArticles = articlesData.data.articles.filter((art: any) => matchUser(art.author));
        tribalArticles = matchedArticles.map((art: any) => ({
          id: art.id,
          title: art.headline || art.title,
          date: art.publishedDate || new Date(art.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          views: `${art.views ?? 0} Views`,
          category: art.tribe || "Article",
          status: art.status === "APPROVED" ? "published" : art.status === "REJECTED" ? "rejected" : "pending",
          image: art.image || art.images?.[0] || "/images/culture/hero-artwork.png",
          type: "article",
          rejectionReason: art.rejectionReason || ""
        }));
      }

      // 6. Direct User Relations from DB Profile
      const journeys = dbUser?.journeys || [];
      const galleryItems = dbUser?.galleryItems || [];
      const userCategoryStories = dbUser?.categoryStories || [];

      const mappedJourneys: UserPostItem[] = journeys.map((j: any) => ({
        id: j.id,
        title: j.title,
        date: new Date(j.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        views: `${j.views ?? 0} Views`,
        category: j.category || "Tourism",
        status: j.status === "APPROVED" ? "published" : j.status === "REJECTED" ? "rejected" : "pending",
        image: j.image || "/images/culture/hero-artwork.png",
        type: "journey",
        rejectionReason: j.rejectionReason
      }));

      const mappedGallery: UserPostItem[] = galleryItems.map((g: any) => ({
        id: g.id,
        title: g.title,
        date: new Date(g.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        views: `${g.views ?? 0} Views`,
        category: g.category || "Gallery",
        status: g.status === "APPROVED" ? "published" : g.status === "REJECTED" ? "rejected" : "pending",
        image: g.image || "/images/culture/hero-artwork.png",
        type: "gallery",
        rejectionReason: g.rejectionReason
      }));



      const mappedUserCategoryStories: UserPostItem[] = userCategoryStories.map((cs: any) => ({
        id: cs.id,
        title: cs.title,
        date: new Date(cs.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        views: `${cs.views ?? 0} Views`,
        category: cs.district || "Story",
        status: cs.status === "APPROVED" ? "published" : cs.status === "REJECTED" ? "rejected" : "pending",
        image: cs.mediaUrl || (Array.isArray(cs.mediaFiles) && cs.mediaFiles[0]?.url) || "/images/culture/hero-artwork.png",
        type: "story",
        rejectionReason: cs.rejectionReason
      }));

      // 7. Check Local Storage Submissions as backup
      let localPosts: UserPostItem[] = [];
      try {
        const storedArticlesStr = localStorage.getItem('bihar_community_submissions');
        if (storedArticlesStr) {
          const storedArticles = JSON.parse(storedArticlesStr);
          if (Array.isArray(storedArticles)) {
            const matched = storedArticles.filter((art: any) => matchUser(art.author));
            localPosts = matched.map((art: any) => ({
              id: art.id,
              title: art.headline || art.title,
              date: art.publishedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              views: `${art.views ?? 0} Views`,
              category: art.tribe || "Community",
              status: art.status === "APPROVED" ? "published" : art.status === "REJECTED" ? "rejected" : "pending",
              image: art.image || art.images?.[0] || "/images/culture/hero-artwork.png",
              type: "article",
              rejectionReason: art.rejectionReason
            }));
          }
        }
      } catch (e) {
        console.error('Failed reading local community submissions:', e);
      }

      // Combine all posts and deduplicate by string ID
      const rawAllCombined = [
        ...storyPosts,
        ...mappedUserCategoryStories,
        ...mappedJourneys,
        ...mappedGallery,
        ...culturePosts,
        ...videoPosts,
        ...tribalArticles,
        ...localPosts
      ];

      const seenIds = new Set<string>();
      const deduplicatedPosts: UserPostItem[] = [];
      for (const post of rawAllCombined) {
        const stringId = String(post.id);
        if (!seenIds.has(stringId)) {
          seenIds.add(stringId);
          deduplicatedPosts.push(post);
        }
      }

      setUserPosts(deduplicatedPosts);

      const publishedCount = deduplicatedPosts.filter(p => p.status === 'published').length;
      const pendingCount = deduplicatedPosts.filter(p => p.status === 'pending').length;
      const rejectedCount = deduplicatedPosts.filter(p => p.status === 'rejected').length;

      // Award 15 points for every accepted tribal article, and 10 points for other approved contributions
      const publishedArticlesCount = deduplicatedPosts.filter(p => p.status === 'published' && p.type === 'article').length;
      const publishedOtherCount = deduplicatedPosts.filter(p => p.status === 'published' && p.type !== 'article').length;
      const acceptedPoints = (publishedArticlesCount * 15) + (publishedOtherCount * 10);
      const totalRewardPoints = Math.max(dbUser?.rewardPoints || 0, acceptedPoints);

      setProfile({
        name: dbUser?.name || firebaseUser?.displayName || "User",
        title: dbUser?.title || "Cultural Enthusiast",
        bio: dbUser?.bio || "Explore and discover the rich culture & destinations of Bihar!",
        avatar: dbUser?.avatar || firebaseUser?.photoURL || "/images/culture/avatar-man1.png",
        background: dbUser?.background || "/images/culture/hero-artwork.png",
        rewardPoints: totalRewardPoints,
        totalPosts: publishedCount,
        pendingPosts: pendingCount,
        rejectedPosts: rejectedCount,
        communitiesJoined: 0,
        badgesEarned: dbUser?.badges || 0,
      });

    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setAuthChecking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
      fetchProfile(user, true);
    });

    // Real-time polling interval (every 4 seconds)
    const interval = setInterval(() => {
      fetchProfile(auth.currentUser, false);
    }, 4000);

    // Sync on window focus and storage/submission events
    const handleRefresh = () => {
      fetchProfile(auth.currentUser, false);
    };

    window.addEventListener('focus', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    window.addEventListener('submissionCreated', handleRefresh);
    window.addEventListener('userAvatarChanged', handleRefresh);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('submissionCreated', handleRefresh);
      window.removeEventListener('userAvatarChanged', handleRefresh);
    };
  }, [targetId]);

  const [activeTab, setActiveTab] = useState<'published' | 'pending' | 'rejected'>('published');

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [customAvatarInput, setCustomAvatarInput] = useState("");
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);

  // If not authenticated and check is done and no targetId is requested, redirect to login page
  if (!authChecking && !currentUser && !targetId) {
    return <Navigate to="/login" replace />;
  }

  if (authChecking || loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B3E2F]/20 border-t-[#8B3E2F] rounded-full animate-spin" />
        <p className="text-[#8B3E2F] mt-4 text-sm font-semibold tracking-wider animate-pulse uppercase">Loading Profile...</p>
      </div>
    );
  }

  const handleShare = async () => {
    const shareId = profileUserId || targetId || currentUser?.uid;
    const shareUrl = shareId ? `${window.location.origin}/profile/${shareId}` : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Bihar Darshan Profile`,
          text: `Check out ${profile.name}'s profile on Bihar Darshan!`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert(`Profile link copied to clipboard!\n${shareUrl}`);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('isAuthenticated');
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  const openEditModal = () => {
    setEditForm(profile);
    setIsCustomAvatar(!PREDEFINED_AVATARS.includes(profile.avatar));
    if (!PREDEFINED_AVATARS.includes(profile.avatar)) {
      setCustomAvatarInput(profile.avatar);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    const finalAvatar = isCustomAvatar && customAvatarInput.trim() !== "" ? customAvatarInput : editForm.avatar;

    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const payload = {
          name: editForm.name,
          title: editForm.title || null,
          bio: editForm.bio || null,
          background: editForm.background || null,
          avatar: finalAvatar || null,
        };

        const res = await fetch('http://localhost:5000/api/v1/users/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data?.user) {
            const dbUser = result.data.user;
            setProfile(prev => ({
              ...prev,
              name: dbUser.name,
              title: dbUser.title || "Cultural Enthusiast",
              bio: dbUser.bio || "Explore and discover the rich culture & destinations of Bihar!",
              avatar: dbUser.avatar || user.photoURL || "/images/culture/avatar-man1.png",
              background: dbUser.background || "/images/culture/hero-artwork.png",
              badgesEarned: dbUser.badges || 0,
            }));
            localStorage.setItem('userAvatar', finalAvatar);
            window.dispatchEvent(new Event('userAvatarChanged'));
          }
        }
      }
    } catch (err) {
      console.error('Error saving profile to backend:', err);
    }

    setIsEditing(false);

    if (currentUser) {
      updateProfile(currentUser, { displayName: editForm.name, photoURL: finalAvatar }).catch(console.error);
    }
  };

  const handleDeletePost = async (id: string | number, type: string) => {
    if (!confirm("Are you sure you want to delete this contribution?")) return;

    // Optimistically remove from state
    setUserPosts((prev) => {
      const updated = prev.filter((p) => String(p.id) !== String(id));
      const pubCount = updated.filter((x) => x.status === 'published').length;
      const pendCount = updated.filter((x) => x.status === 'pending').length;
      const rejCount = updated.filter((x) => x.status === 'rejected').length;
      setProfile((p) => ({
        ...p,
        totalPosts: pubCount,
        pendingPosts: pendCount,
        rejectedPosts: rejCount,
      }));
      return updated;
    });

    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const stringId = String(id);

      if (type === 'story') {
        await fetch(`http://localhost:5000/api/v1/stories/${stringId}`, { method: 'DELETE', headers });
      } else if (type === 'culture') {
        await fetch(`http://localhost:5000/api/v1/discover/${stringId}`, { method: 'DELETE', headers });
      } else if (type === 'tribe_video') {
        await fetch(`http://localhost:5000/api/v1/tribes/videos/${stringId}`, { method: 'DELETE', headers });
      } else if (type === 'journey') {
        await fetch(`http://localhost:5000/api/v1/tourism/${stringId}`, { method: 'DELETE', headers });
      } else if (type === 'gallery') {
        await fetch(`http://localhost:5000/api/v1/gallery/${stringId}`, { method: 'DELETE', headers });
      }

      // Clean local storage submissions if present
      try {
        const localStr = localStorage.getItem('bihar_community_submissions');
        if (localStr) {
          const items = JSON.parse(localStr);
          if (Array.isArray(items)) {
            const filtered = items.filter((x: any) => String(x.id) !== stringId);
            localStorage.setItem('bihar_community_submissions', JSON.stringify(filtered));
          }
        }
      } catch (e) {}

    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const activePosts = userPosts.filter(post => !isOwnProfile ? post.status === 'published' : post.status === activeTab);

  return (
    <div className="min-h-screen font-sans bg-[#FDFBF7]">
      <Navbar forceDarkText={true} />

      <div className="pt-24 pb-12">
        <Container>
          {/* Top Banner */}
          <div className="bg-[#FFF6E9] rounded-2xl p-8 border border-[#F4A261]/30 relative overflow-hidden mb-6">
            {/* Background pattern overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `url("${profile.background}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'sepia(80%) hue-rotate(5deg) saturate(150%)'
              }}
            ></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar */}
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0 ring-2 ring-[#F4A261]/30 bg-white">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left pt-2">
                <h1 className="font-display font-bold text-4xl lg:text-5xl text-[#8B3E2F] flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <span className="text-[#F4A261] text-3xl">★</span> {profile.name} <span className="text-[#F4A261] text-3xl">★</span>
                </h1>
                <p className="text-[#F4A261] uppercase tracking-[0.15em] font-bold text-sm mb-4">{profile.title}</p>
                <p className="text-gray-700 text-sm mb-6 max-w-xl">{profile.bio}</p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  {!isAdmin && (
                    <div className="flex items-center gap-2 bg-white/70 border border-[#F4A261]/30 px-4 py-2 rounded-lg text-sm text-[#8B3E2F] font-bold shadow-sm">
                      <Award className="w-4 h-4 text-[#D97706]" /> {profile.rewardPoints} Points
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/70 border border-[#F4A261]/30 px-4 py-2 rounded-lg text-sm text-[#8B3E2F] font-bold shadow-sm">
                    <FileText className="w-4 h-4 text-[#8B3E2F]" /> {profile.totalPosts} Posts
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-4 lg:mt-0">
                {isOwnProfile && isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-5 py-2.5 bg-[#8B3E2F] text-white rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-[#7a3528] transition shadow-sm border border-[#F4A261]/40 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-[#F4A261]" /> Admin Dashboard
                  </button>
                )}
                {isOwnProfile && (
                  <button onClick={openEditModal} className="px-5 py-2.5 bg-white border border-[#8B3E2F]/20 text-[#8B3E2F] rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-gray-50 transition shadow-sm">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
                <button onClick={handleShare} className="px-5 py-2.5 bg-[#8B3E2F] text-white rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-[#7a3528] transition shadow-sm">
                  <Share2 className="w-4 h-4" /> Share Profile
                </button>
                {isOwnProfile ? (
                  <button onClick={handleLogout} className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-red-50 transition shadow-sm">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  currentUser && (
                    <button onClick={() => navigate('/profile')} className="px-5 py-2.5 bg-white border border-[#8B3E2F]/20 text-[#8B3E2F] rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-gray-50 transition shadow-sm">
                      My Profile
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className={`grid grid-cols-2 ${isOwnProfile && !isAdmin ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3 sm:gap-4 mb-8`}>
            {[
              ...(!isAdmin ? [{ icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#D97706]" />, label: 'Contribution Points', value: profile.rewardPoints, bg: 'bg-[#FEF3C7]' }] : []),
              { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B3E2F]" />, label: 'Published Posts', value: profile.totalPosts, bg: 'bg-[#FFF3E5]' },
              ...(isOwnProfile ? [{ icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#B45309]" />, label: 'Pending Posts', value: profile.pendingPosts, bg: 'bg-[#FFEDD5]' }] : []),
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 hover:shadow-md transition">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="font-bold text-xl sm:text-2xl text-gray-800">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs text-gray-500 font-semibold leading-tight mt-0.5">{stat.label.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard & Rewards Widget on Profile */}
          <div className="bg-gradient-to-br from-[#1E1B18] to-[#120F0D] border border-amber-500/30 rounded-2xl p-6 text-white shadow-xl mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    Bihar Cultural Leaderboard
                    {userRank && (
                      <span className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded-full font-black">
                        Your Rank: #{userRank}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-white/50">Top community guardians preserving Bihar's heritage and stories.</p>
                </div>
              </div>

              <Link
                to="/leaderboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                View Full Leaderboard <ChevronRight size={14} />
              </Link>
            </div>

            {leaderboardPreview.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {leaderboardPreview.map((u) => (
                  <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center relative">
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
                      #{u.rank}
                    </span>
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40 mx-auto mb-1.5 mt-1"
                    />
                    <p className="font-bold text-xs text-white truncate">{u.name}</p>
                    <p className="text-amber-400 text-xs font-black mt-0.5">{u.rewardPoints} Pts</p>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Main Content Area */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="space-y-6">

              {/* Tabs */}
              <div className="flex flex-wrap border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('published')}
                  className={`flex-1 min-w-[150px] py-4 flex justify-center items-center gap-2 font-bold text-sm transition ${activeTab === 'published' ? 'border-b-2 border-[#8B3E2F] text-[#8B3E2F]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <FileText className="w-4 h-4" /> Published Posts
                </button>
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`flex-1 min-w-[150px] py-4 flex justify-center items-center gap-2 font-bold text-sm transition ${activeTab === 'pending' ? 'border-b-2 border-[#8B3E2F] text-[#8B3E2F]' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <Clock className="w-4 h-4" /> Pending Review
                    </button>
                    <button
                      onClick={() => setActiveTab('rejected')}
                      className={`flex-1 min-w-[150px] py-4 flex justify-center items-center gap-2 font-bold text-sm transition ${activeTab === 'rejected' ? 'border-b-2 border-[#8B3E2F] text-[#8B3E2F]' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <XCircle className="w-4 h-4" /> Rejected Posts
                    </button>
                  </>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800 pt-2">
                {activeTab === 'published' && 'Published Posts'}
                {activeTab === 'pending' && 'Pending Posts'}
                {activeTab === 'rejected' && 'Rejected Posts'}
              </h2>

              {activePosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {activePosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition">
                      <div className="h-44 relative overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute bottom-3 left-3 bg-[#FFF6E9] text-[#8B3E2F] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                          {post.category}
                        </div>
                        <div className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${post.status === 'published'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : post.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-250'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          {post.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">{post.title}</h3>

                        {post.status === 'rejected' && (
                          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 font-medium">
                            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block text-red-800 text-[11px] uppercase tracking-wider mb-0.5">Reason for Rejection:</span>
                              <span>{post.rejectionReason || 'Content does not meet site community guidelines.'}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4 mt-auto font-medium">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 pt-4">
                          <button
                            onClick={() => {
                              if (post.type === 'story') {
                                navigate(`/story/${post.id}`);
                              } else if (post.type === 'journey') {
                                navigate(`/tourism/${post.id}`);
                              } else if (post.type === 'gallery') {
                                navigate('/gallery');
                              } else if (post.type === 'culture') {
                                navigate('/discover');
                              } else if (post.type === 'tribe_video') {
                                navigate('/tribals');
                              } else {
                                navigate('/discover');
                              }
                            }}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-xs font-bold transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          {isOwnProfile && (
                            <button
                              onClick={() => handleDeletePost(post.id, post.type)}
                              className="flex items-center gap-1.5 text-red-400 hover:text-red-600 text-xs font-bold transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-500 font-medium">No posts found in this category.</p>
                </div>
              )}

            </div>

          </div>
        </Container>
      </div>

      <Footer />

      {/* Edit Profile Modal Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FCEBD3] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative border-4 border-[#FCEBD3] p-8 md:p-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 hover:bg-white text-[#8B3E2F] rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <Edit3 className="w-8 h-8 text-[#F4A261]" />
                <h2 className="text-3xl font-bold text-[#8B3E2F] font-serif">Edit Profile</h2>
              </div>

              <div className="space-y-8">
                {/* Name Input */}
                <div>
                  <label className="block text-[#8B3E2F] font-bold uppercase tracking-wider text-sm mb-2">Display Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white border-2 border-[#FCEBD3] rounded-xl px-4 py-3 text-[#8B3E2F] font-bold focus:outline-none focus:border-[#F4A261] transition-colors shadow-sm"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-[#8B3E2F] font-bold uppercase tracking-wider text-sm mb-2">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-white border-2 border-[#FCEBD3] rounded-xl px-4 py-3 text-[#8B3E2F] focus:outline-none focus:border-[#F4A261] transition-colors shadow-sm"
                      placeholder="e.g. Cultural Ambassador"
                    />
                  </div>

                  {/* Bio Input */}
                  <div>
                    <label className="block text-[#8B3E2F] font-bold uppercase tracking-wider text-sm mb-2">Short Bio</label>
                    <input
                      type="text"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full bg-white border-2 border-[#FCEBD3] rounded-xl px-4 py-3 text-[#8B3E2F] focus:outline-none focus:border-[#F4A261] transition-colors shadow-sm"
                      placeholder="Write a short bio..."
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-[#8B3E2F] font-bold uppercase tracking-wider text-sm mb-3">Choose Avatar</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {PREDEFINED_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsCustomAvatar(false);
                          setEditForm({ ...editForm, avatar });
                        }}
                        className={`w-16 h-16 rounded-full overflow-hidden border-4 transition-all duration-300 ${!isCustomAvatar && editForm.avatar === avatar ? 'border-[#F4A261] scale-110 shadow-lg ring-2 ring-[#8B3E2F]' : 'border-white shadow-sm opacity-70 hover:opacity-100'}`}
                      >
                        <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Selection */}
                <div>
                  <label className="block text-[#8B3E2F] font-bold uppercase tracking-wider text-sm mb-3">Cultural Background Overlay</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PREDEFINED_BACKGROUNDS.map((bg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setEditForm({ ...editForm, background: bg })}
                        className={`h-20 rounded-xl overflow-hidden border-4 transition-all duration-300 relative ${editForm.background === bg ? 'border-[#F4A261] shadow-lg ring-2 ring-[#8B3E2F]' : 'border-white shadow-sm opacity-70 hover:opacity-100'}`}
                      >
                        <img src={bg} alt={`Background ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#8B3E2F] mix-blend-color opacity-30"></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#FCEBD3] flex justify-end gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="border-2 border-[#8B3E2F] text-[#8B3E2F] hover:bg-[#8B3E2F] hover:text-white font-bold py-3 px-8 rounded-full tracking-widest uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-[#F4A261] hover:bg-[#F4A261] text-[#8B3E2F] font-bold py-3 px-8 rounded-full tracking-widest uppercase transition-colors shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
