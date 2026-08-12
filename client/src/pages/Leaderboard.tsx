import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Trophy, Award, Flame, Sparkles, BookOpen, MapPin, Image, Search, ChevronRight, User as UserIcon, Star, Shield, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { API_BASE_URL } from '../config/api';

interface LeaderboardUser {
  id: string;
  firebaseUid: string;
  name: string;
  email: string | null;
  avatar: string | null;
  title: string | null;
  rewardPoints: number;
  badges: number;
  role: string;
  rank: number;
  tier: string;
  totalContributions: number;
  createdAt: string;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [myRankUser, setMyRankUser] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/leaderboard`);
      const data = await res.json();
      if (data.success && data.data?.leaderboard) {
        const list: LeaderboardUser[] = data.data.leaderboard;
        setUsers(list);

        if (currentUser) {
          const match = list.find((u) => u.firebaseUid === currentUser.uid || u.email === currentUser.email);
          if (match) setMyRankUser(match);
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [currentUser]);

  const top3 = users.slice(0, 3);
  const restUsers = users.slice(3);

  const filteredRestUsers = restUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <Navbar forceWhiteText fullTransparent={false} />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#07090e]">
        {/* Background glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md animate-pulse">
            <Trophy size={14} />
            Bihar Cultural Wall of Fame
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-serif">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Leaderboard</span>
          </h1>

          <p className="max-w-2xl mx-auto text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Honoring our top heritage preservers, travel explorers, and cultural storytellers across Bihar. Earn points by sharing your stories & journeys!
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-24 space-y-12 relative z-20">

        {/* Current Logged-In User Banner */}
        {myRankUser && (
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={myRankUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(myRankUser.name)}`}
                  alt={myRankUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border border-black">
                  #{myRankUser.rank}
                </span>
              </div>
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Your Ranking</p>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {myRankUser.name}
                  <span className="text-xs bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    {myRankUser.tier}
                  </span>
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  {myRankUser.totalContributions} Contributions • {myRankUser.badges} Badges
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-amber-500/20 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <p className="text-white/40 text-xs uppercase font-bold">Total Points</p>
                <p className="text-2xl font-black text-amber-400 tracking-tight">{myRankUser.rewardPoints} Pts</p>
              </div>
              <Link
                to="/share-story"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                Earn More Pts <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* TOP 3 PODIUM */}
        {!loading && top3.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-amber-400/80">
              ✦ Top Heritage Champions ✦
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8 max-w-4xl mx-auto">
              
              {/* SECOND PLACE */}
              {top3[1] && (
                <div className="order-2 md:order-1 bg-gradient-to-b from-zinc-800/80 to-[#111622] border border-zinc-400/30 rounded-3xl p-6 text-center shadow-xl backdrop-blur-md relative transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-300 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-zinc-100 shadow-lg flex items-center gap-1">
                    🥈 2nd Place
                  </div>
                  <div className="mt-4 mb-3 flex justify-center">
                    <img
                      src={top3[1].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top3[1].name)}`}
                      alt={top3[1].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-zinc-300 shadow-lg"
                    />
                  </div>
                  <h3 className="font-bold text-white text-lg truncate">{top3[1].name}</h3>
                  <p className="text-xs text-zinc-400 font-medium mb-3">{top3[1].tier}</p>

                  <div className="bg-black/30 rounded-2xl p-3 border border-white/5 space-y-1">
                    <p className="text-2xl font-black text-zinc-200">{top3[1].rewardPoints} <span className="text-xs text-zinc-400 font-normal">Pts</span></p>
                    <p className="text-[11px] text-white/50">{top3[1].totalContributions} Contributions</p>
                  </div>
                </div>
              )}

              {/* FIRST PLACE */}
              {top3[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-900/60 via-[#1a140a] to-[#120e06] border-2 border-amber-400 rounded-3xl p-8 text-center shadow-2xl shadow-amber-500/20 backdrop-blur-md relative transform hover:-translate-y-3 transition-transform duration-300">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-300 to-amber-500 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 border-amber-200 shadow-xl flex items-center gap-1.5 animate-bounce">
                    👑 1st Champion
                  </div>
                  <div className="mt-4 mb-3 flex justify-center relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 blur-md opacity-70" />
                    <img
                      src={top3[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top3[0].name)}`}
                      alt={top3[0].name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-2xl relative z-10"
                    />
                  </div>
                  <h3 className="font-black text-amber-300 text-xl truncate">{top3[0].name}</h3>
                  <p className="text-xs text-amber-400/80 font-bold mb-4 uppercase tracking-wider">{top3[0].tier}</p>

                  <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/30 space-y-1">
                    <p className="text-3xl font-black text-amber-300">{top3[0].rewardPoints} <span className="text-xs text-amber-400 font-normal">Pts</span></p>
                    <p className="text-xs text-amber-200/60 font-medium">{top3[0].totalContributions} Contributions • {top3[0].badges} Badges</p>
                  </div>
                </div>
              )}

              {/* THIRD PLACE */}
              {top3[2] && (
                <div className="order-3 bg-gradient-to-b from-amber-950/40 to-[#14100c] border border-amber-700/30 rounded-3xl p-6 text-center shadow-xl backdrop-blur-md relative transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-800 text-amber-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-amber-600 shadow-lg flex items-center gap-1">
                    🥉 3rd Place
                  </div>
                  <div className="mt-4 mb-3 flex justify-center">
                    <img
                      src={top3[2].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top3[2].name)}`}
                      alt={top3[2].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-amber-700 shadow-lg"
                    />
                  </div>
                  <h3 className="font-bold text-white text-lg truncate">{top3[2].name}</h3>
                  <p className="text-xs text-amber-600 font-medium mb-3">{top3[2].tier}</p>

                  <div className="bg-black/30 rounded-2xl p-3 border border-white/5 space-y-1">
                    <p className="text-2xl font-black text-amber-500">{top3[2].rewardPoints} <span className="text-xs text-white/40 font-normal">Pts</span></p>
                    <p className="text-[11px] text-white/50">{top3[2].totalContributions} Contributions</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* RANKINGS TABLE (#4+) */}
        <div className="bg-[#0f1420]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-serif">All Community Rankings</h3>
              <p className="text-xs text-white/40">Updated automatically based on approved stories and contributions.</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-sm w-full sm:w-72">
              <Search size={16} className="text-white/40" />
              <input
                type="text"
                placeholder="Search member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-white/30 focus:outline-none w-full text-xs"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-white/40 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              <p className="text-xs uppercase font-bold tracking-widest text-amber-400">Loading Leaderboard...</p>
            </div>
          ) : filteredRestUsers.length === 0 ? (
            <div className="py-16 text-center text-white/40 text-sm">
              {searchQuery ? 'No community members match your search.' : 'Be the first to join the leaderboard!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="text-white/40 text-[11px] uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Honorary Title</th>
                    <th className="py-3 px-4 text-center">Contributions</th>
                    <th className="py-3 px-4 text-center">Badges</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRestUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        myRankUser?.id === user.id ? 'bg-amber-500/10 border-l-4 border-amber-400' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-bold text-white/50 text-sm">
                        #{user.rank}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <p className="font-bold text-white text-sm flex items-center gap-2">
                              {user.name}
                              {user.role === 'ADMIN' && (
                                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-bold">
                                  Admin
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-white/40">{user.email || 'Heritage Enthusiast'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-amber-300">
                          {user.tier}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-white/90">
                        {user.totalContributions}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                          <Award size={12} />
                          {user.badges}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-amber-400 text-base">
                        {user.rewardPoints} Pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* HOW TO EARN POINTS */}
        <div className="bg-gradient-to-br from-[#0c121e] to-[#080c14] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-white font-serif">How to Earn Reward Points</h3>
            <p className="text-xs text-white/50">
              Contribute authentic photos, travel itineraries, and cultural stories to level up your Bihar Darshan rank!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <BookOpen size={22} />
              </div>
              <h4 className="font-bold text-white text-sm">Share Cultural Story</h4>
              <p className="text-xs text-white/50">Write an article about Bihar’s traditions or festivals.</p>
              <span className="inline-block mt-2 font-black text-amber-400 text-xs bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">+20 Points</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                <MapPin size={22} />
              </div>
              <h4 className="font-bold text-white text-sm">Add Travel Journey</h4>
              <p className="text-xs text-white/50">Publish a travel guide or itinerary of Bihar attractions.</p>
              <span className="inline-block mt-2 font-black text-emerald-400 text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">+50 Points</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                <Image size={22} />
              </div>
              <h4 className="font-bold text-white text-sm">Upload to Gallery</h4>
              <p className="text-xs text-white/50">Share high quality photography of Bihar sights.</p>
              <span className="inline-block mt-2 font-black text-blue-400 text-xs bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">+10 Points</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                <Sparkles size={22} />
              </div>
              <h4 className="font-bold text-white text-sm">Tribal Video / Article</h4>
              <p className="text-xs text-white/50">Document indigenous tribal folklore or artisan crafts.</p>
              <span className="inline-block mt-2 font-black text-purple-400 text-xs bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">+15 Points</span>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/share-story"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold uppercase text-xs tracking-widest shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              Start Contributing Now <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
