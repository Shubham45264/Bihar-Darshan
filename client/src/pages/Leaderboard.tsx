import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Trophy, Award, Search, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { API_BASE_URL } from '../config/api';
import { getBadgeFromPoints, type BadgeInfo } from '../utils/badgeUtils';

interface LeaderboardUser {
  id: string;
  firebaseUid: string;
  name: string;
  email: string | null;
  avatar: string | null;
  title: string | null;
  rewardPoints: number;
  badges: number;
  badge?: BadgeInfo;
  currentBadge?: string;
  role: string;
  rank: number;
  tier: string;
  totalContributions: number;
  createdAt: string;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
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
        const list: LeaderboardUser[] = data.data.leaderboard || [];
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
    <div className="min-h-screen bg-[#F8F5EF] text-brand-dark flex flex-col font-sans selection:bg-brand-gold selection:text-brand-dark">
      <Navbar forceDarkText={true} />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F8F5EF] text-brand-dark border-b border-gray-200/60">
        {/* Background glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          {/* Back Navigation Button */}
          <div className="flex items-center justify-between sm:justify-start">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-brand-gold text-brand-dark hover:text-black border border-gray-200/80 hover:border-brand-gold text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-amber-900 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
              <Trophy size={14} className="text-brand-gold" />
              Bihar Cultural Wall of Fame
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-brand-dark tracking-tight leading-tight">
              Community <span className="text-brand-gold">Leaderboard</span>
            </h1>

            <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
              Honoring our top heritage preservers, travel explorers, and cultural storytellers across Bihar. Earn points by sharing your stories & journeys!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-12 relative z-20">

        {/* Current Logged-In User Banner */}
        {myRankUser && (
          <div className="bg-white/90 border border-brand-gold/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={myRankUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(myRankUser.name)}`}
                  alt={myRankUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-dark text-[10px] font-black px-1.5 py-0.5 rounded-full border border-brand-dark">
                  #{myRankUser.rank}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Your Ranking</p>
                <h3 className="font-display text-lg font-bold text-brand-dark flex items-center gap-2 flex-wrap">
                  {myRankUser.name}
                  <span className="text-xs bg-amber-100/90 border border-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full font-extrabold shadow-xs">
                    {myRankUser.currentBadge || getBadgeFromPoints(myRankUser.rewardPoints).fullName}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {myRankUser.totalContributions} Contributions • {myRankUser.rewardPoints} Pts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase font-bold">Total Points</p>
                <p className="text-2xl font-black text-brand-gold tracking-tight">{myRankUser.rewardPoints} Pts</p>
              </div>
              <Link
                to="/share-story"
                className="px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                Earn More Pts <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* TOP 3 PODIUM */}
        {!loading && top3.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display inline-block text-xs font-bold uppercase tracking-[0.2em] text-amber-900 bg-brand-gold/10 border border-brand-gold/30 px-4 py-1.5 rounded-full shadow-sm">
                ✦ Top Heritage Champions ✦
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8 max-w-4xl mx-auto">
              
              {/* SECOND PLACE */}
              {top3[1] && (
                <div className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-3xl p-6 text-center shadow-md backdrop-blur-md relative transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-slate-300 shadow-sm flex items-center gap-1">
                    🥈 2nd Place
                  </div>
                  <div className="mt-4 mb-3 flex justify-center">
                    <img
                      src={top3[1].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top3[1].name)}`}
                      alt={top3[1].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 shadow-md"
                    />
                  </div>
                  <h3 className="font-display font-bold text-brand-dark text-lg truncate">{top3[1].name}</h3>
                  <div className="my-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800">
                      {top3[1].currentBadge || getBadgeFromPoints(top3[1].rewardPoints).fullName}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 space-y-1">
                    <p className="text-2xl font-black text-slate-800">{top3[1].rewardPoints} <span className="text-xs text-slate-500 font-normal">Pts</span></p>
                    <p className="text-[11px] text-gray-500">{top3[1].totalContributions} Contributions</p>
                  </div>
                </div>
              )}

              {/* FIRST PLACE */}
              {top3[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border-2 border-brand-gold rounded-3xl p-8 text-center shadow-xl shadow-amber-500/10 backdrop-blur-md relative transform hover:-translate-y-3 transition-transform duration-300">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-brand-dark px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-amber-300 shadow-md flex items-center gap-1.5 animate-bounce">
                    👑 1st Champion
                  </div>
                  <div className="mt-4 mb-3 flex justify-center relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 blur-md opacity-50" />
                    <img
                      src={top3[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top3[0].name)}`}
                      alt={top3[0].name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-brand-gold shadow-xl relative z-10"
                    />
                  </div>
                  <h3 className="font-display font-extrabold text-amber-950 text-xl truncate">{top3[0].name}</h3>
                  <div className="my-2">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 border border-brand-gold text-amber-900 shadow-sm">
                      {top3[0].currentBadge || getBadgeFromPoints(top3[0].rewardPoints).fullName}
                    </span>
                  </div>

                  <div className="bg-brand-gold/10 rounded-2xl p-4 border border-brand-gold/30 space-y-1">
                    <p className="text-3xl font-black text-amber-900">{top3[0].rewardPoints} <span className="text-xs text-amber-800 font-normal">Pts</span></p>
                    <p className="text-xs text-amber-900/70 font-medium">{top3[0].totalContributions} Contributions</p>
                  </div>
                </div>
              )}

              {/* THIRD PLACE */}
              {top3[2] && (
                <div className="order-3 bg-gradient-to-b from-amber-50/40 to-white border border-amber-800/20 rounded-3xl p-6 text-center shadow-md backdrop-blur-md relative transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-200 shadow-sm flex items-center gap-1">
                    🥉 3rd Place
                  </div>
                  <div className="mt-4 mb-3 flex justify-center">
                    <img
                      src={top3[2].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top3[2].name)}`}
                      alt={top3[2].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-amber-700/40 shadow-md"
                    />
                  </div>
                  <h3 className="font-display font-bold text-brand-dark text-lg truncate">{top3[2].name}</h3>
                  <div className="my-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900">
                      {top3[2].currentBadge || getBadgeFromPoints(top3[2].rewardPoints).fullName}
                    </span>
                  </div>

                  <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-800/10 space-y-1">
                    <p className="text-2xl font-black text-amber-900">{top3[2].rewardPoints} <span className="text-xs text-gray-500 font-normal">Pts</span></p>
                    <p className="text-[11px] text-gray-500">{top3[2].totalContributions} Contributions</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* RANKINGS TABLE (#4+) */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-dark tracking-tight">All Community Rankings</h3>
              <p className="text-xs text-gray-500">Updated automatically based on approved stories and contributions.</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl text-sm w-full sm:w-72 focus-within:ring-2 focus-within:ring-brand-gold/40 focus-within:border-brand-gold transition-all">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-brand-dark placeholder-gray-400 focus:outline-none w-full text-xs"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-gray-400 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
              <p className="text-xs uppercase font-bold tracking-widest text-brand-gold">Loading Leaderboard...</p>
            </div>
          ) : filteredRestUsers.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              {searchQuery ? 'No community members match your search.' : 'Be the first to join the leaderboard!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-800">
                <thead className="bg-gray-50/80 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4 text-center">Contributions</th>
                    <th className="py-3 px-4 text-center">Current Badge</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRestUsers.map((user) => {
                    const badgeInfo = user.badge || getBadgeFromPoints(user.rewardPoints);
                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-amber-50/30 transition-colors ${
                          myRankUser?.id === user.id ? 'bg-amber-50/60 border-l-4 border-brand-gold' : ''
                        }`}
                      >
                        <td className="py-4 px-4 font-bold text-gray-400 text-sm">
                          #{user.rank}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <p className="font-bold text-brand-dark text-sm flex items-center gap-2">
                                {user.name}
                                {user.role === 'ADMIN' && (
                                  <span className="text-[9px] bg-brand-gold/15 text-amber-900 border border-brand-gold/30 px-1.5 py-0.5 rounded uppercase font-bold">
                                    Admin
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400">{user.email || 'Heritage Enthusiast'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-gray-700">
                          {user.totalContributions}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-extrabold shadow-xs">
                            {badgeInfo.fullName}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-black text-brand-gold text-base">
                          {user.rewardPoints} Pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
