import { useEffect, useState } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { API_BASE_URL } from '../../config/api';
import {
  MapPin, Palette, Plane, Image as ImageIcon,
  Users, Store, Mountain, UserCircle, Settings,
  Activity, ArrowRight, LayoutDashboard, Sparkles, Trophy, Award, Flame, Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string | null;
  avatar: string | null;
  rewardPoints: number;
  badges: number;
  rank: number;
  tier: string;
  totalContributions: number;
}

const AdminDashboard = () => {
  const data = useAdminData();
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/leaderboard?limit=5`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data?.leaderboard) {
          setTopUsers(resData.data.leaderboard);
        }
      })
      .catch((err) => console.error('Error fetching admin dashboard leaderboard:', err))
      .finally(() => setLoadingLeaderboard(false));
  }, []);

  const contentStats = [
    { label: 'Categories & Subcategories', count: 'Explore', icon: Sparkles, path: '/admin/categories', color: 'from-amber-500/30 to-amber-500/5', glow: 'bg-amber-500', textColor: 'text-amber-400', desc: 'Categories, subcategories & stories' },
    { label: 'Districts', count: data.districts.length, icon: MapPin, path: '/admin/districts', color: 'from-blue-500/30 to-blue-500/5', glow: 'bg-blue-500', textColor: 'text-blue-400', desc: 'Manage district profiles' },
    { label: 'Tribal Groups', count: data.tribes.length, icon: Mountain, path: '/admin/tribes', color: 'from-emerald-500/30 to-[#10B981]/5', glow: 'bg-emerald-500', textColor: 'text-emerald-400', desc: 'Indigenous heritage' },
    { label: 'Popular Places', count: data.popularPlaces.length, icon: Sparkles, path: '/admin/places', color: 'from-yellow-500/30 to-[#EAB308]/5', glow: 'bg-yellow-500', textColor: 'text-yellow-400', desc: 'Manage showcase cards' },
  ];

  const communityStats = [
    { label: 'Leaderboard & Rewards', count: topUsers.length > 0 ? `${topUsers[0].rewardPoints} Pts` : 'Top Rank', icon: Trophy, path: '/admin/leaderboard', color: 'from-amber-500/30 to-amber-500/5', glow: 'bg-amber-500', textColor: 'text-amber-400', desc: 'Manage rankings & award points' },
    { label: 'Tourism Packages', count: data.tourism.length, icon: Plane, path: '/admin/tourism', color: 'from-cyan-500/30 to-cyan-500/5', glow: 'bg-cyan-500', textColor: 'text-cyan-400', desc: 'Journeys & itineraries' },
    { label: 'Gallery Media', count: data.gallery.length, icon: ImageIcon, path: '/admin/gallery', color: 'from-pink-500/30 to-pink-500/5', glow: 'bg-pink-500', textColor: 'text-pink-400', desc: 'Photos and videos' },
    { label: 'Market Products', count: data.products.length, icon: Store, path: '/admin/marketplace', color: 'from-teal-500/30 to-teal-500/5', glow: 'bg-teal-500', textColor: 'text-teal-400', desc: 'Local artisan goods' },
  ];

  const systemStats = [
    { label: 'Site Settings', count: 'Global', icon: Settings, path: '/admin/settings', color: 'from-slate-500/30 to-slate-500/5', glow: 'bg-slate-400', textColor: 'text-slate-300', desc: 'General configurations' },
  ];

  const StatCard = ({ stat }: { stat: any }) => {
    const Icon = stat.icon;
    return (
      <Link
        to={stat.path}
        className="group relative bg-[#1E1E1E]/40 border border-white/5 rounded-2xl p-6 overflow-hidden hover:bg-[#2A2A2A]/60 transition-all duration-300 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1"
      >
        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.color} blur-[40px] opacity-40 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none`} />

        <div className="relative z-10 flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center ${stat.textColor} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} strokeWidth={2} />
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-display font-bold text-white tracking-tight">{stat.count}</h3>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <h4 className="text-white font-medium text-lg mb-1 group-hover:text-white transition-colors">{stat.label}</h4>
          <p className="text-white/40 text-sm mb-4 font-light">{stat.desc}</p>

          <div className="flex items-center text-sm font-semibold text-white/40 group-hover:text-white/90 transition-colors uppercase tracking-wider">
            Manage <ArrowRight size={14} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 ${stat.glow}`} />
      </Link>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2A2A2A] to-[#1E1E1E] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#EAB308]/20 to-transparent blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-transparent blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <LayoutDashboard className="text-[#EAB308]" size={20} />
              </div>
              <h1 className="font-display font-bold text-3xl text-white tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-white/60 text-base max-w-2xl leading-relaxed mt-3">
              Welcome back. Monitor your platform's content, review community contributions, and manage global settings from this central hub.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <Activity className="text-emerald-400" size={24} />
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">System Status</p>
              <p className="text-white font-medium">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Content Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-display font-bold text-white">Core Content</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {contentStats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>
      </section>

      {/* User Engagement Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-display font-bold text-white">Engagement & Contributions</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {communityStats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>
      </section>

      {/* Leaderboard Top Champions Widget */}
      <section className="bg-[#141420] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Top Community Leaderboard</h2>
              <p className="text-xs text-white/40">Rankings based on user reward points & contributions.</p>
            </div>
          </div>

          <Link
            to="/admin/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold transition-all"
          >
            Manage Leaderboard →
          </Link>
        </div>

        {loadingLeaderboard ? (
          <div className="py-8 text-center text-white/40 text-xs">Loading Top Champions...</div>
        ) : topUsers.length === 0 ? (
          <div className="py-8 text-center text-white/40 text-xs">No ranked users found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topUsers.map((u) => (
              <div key={u.id} className="bg-[#0a0a0f] border border-white/[0.08] rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
                <div className="absolute top-2 left-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                  #{u.rank}
                </div>
                <img
                  src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10 mx-auto"
                />
                <div>
                  <h4 className="font-bold text-white text-sm truncate">{u.name}</h4>
                  <p className="text-[11px] text-amber-300/80 font-semibold">{u.tier}</p>
                </div>
                <div className="pt-1">
                  <span className="text-amber-400 font-extrabold text-sm block">{u.rewardPoints} Pts</span>
                  <span className="text-[10px] text-white/40">{u.totalContributions} Contributions</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* System Settings Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-display font-bold text-white">System Administration</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {systemStats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

