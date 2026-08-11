import React, { useEffect, useState } from 'react';
import { Trophy, Award, Gift, Search, Sparkles, UserCheck, Flame, RefreshCw, X } from 'lucide-react';
import { auth } from '../../lib/firebase';

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

const AdminLeaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [awardPoints, setAwardPoints] = useState<number>(50);
  const [awardBadges, setAwardBadges] = useState<number>(1);
  const [awardReason, setAwardReason] = useState<string>('Exceptional Community Contribution');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/users/leaderboard');
      const data = await res.json();
      if (data.success && data.data?.leaderboard) {
        setUsers(data.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : '';

      const res = await fetch(`http://localhost:5000/api/v1/admin/users/${selectedUser.id}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          points: awardPoints,
          badges: awardBadges,
          reason: awardReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ type: 'success', text: `Successfully awarded +${awardPoints} points to ${selectedUser.name}!` });
        setSelectedUser(null);
        fetchLeaderboard();
      } else {
        setFeedbackMsg({ type: 'error', text: data.message || 'Failed to award points' });
      }
    } catch (err) {
      console.error('Error awarding points:', err);
      setFeedbackMsg({ type: 'error', text: 'Network error awarding points' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPointsAwarded = users.reduce((sum, u) => sum + (u.rewardPoints || 0), 0);
  const totalBadgesAwarded = users.reduce((sum, u) => sum + (u.badges || 0), 0);
  const topContributor = users[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#141420] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Leaderboard & User Points</h1>
          </div>
          <p className="text-white/40 text-sm">
            Monitor top contributors, community reward points, and manually award bonus achievements.
          </p>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 hover:text-white border border-white/10 text-sm font-medium transition-all"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh Rankings
        </button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-white/40 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141420] border border-white/[0.08] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Ranked Users</p>
            <p className="text-2xl font-bold text-white mt-0.5">{users.length}</p>
          </div>
        </div>

        <div className="bg-[#141420] border border-white/[0.08] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Flame size={22} />
          </div>
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Points Distributed</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">{totalPointsAwarded.toLocaleString()} Pts</p>
          </div>
        </div>

        <div className="bg-[#141420] border border-white/[0.08] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Badges Awarded</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totalBadgesAwarded}</p>
          </div>
        </div>

        <div className="bg-[#141420] border border-white/[0.08] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles size={22} />
          </div>
          <div className="overflow-hidden">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Top Leader</p>
            <p className="text-lg font-bold text-white truncate mt-0.5">{topContributor ? topContributor.name : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-[#141420] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3 bg-[#0a0a0f] border border-white/[0.08] px-4 py-2.5 rounded-xl max-w-md">
          <Search size={18} className="text-white/40" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none w-full placeholder-white/30"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-white/40">
            <RefreshCw size={28} className="animate-spin mb-3 text-amber-400" />
            <p className="text-sm">Loading Leaderboard rankings...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-white/40 text-sm">No users found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-[#0a0a0f] text-white/40 text-xs uppercase tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Rank</th>
                  <th className="py-3.5 px-4 font-semibold">User</th>
                  <th className="py-3.5 px-4 font-semibold">Tier Title</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Contributions</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Badges</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Points</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredUsers.map((user) => {
                  const rankColor =
                    user.rank === 1
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : user.rank === 2
                      ? 'bg-zinc-300/20 text-zinc-200 border-zinc-300/30'
                      : user.rank === 3
                      ? 'bg-amber-700/20 text-amber-500 border-amber-700/30'
                      : 'bg-white/5 text-white/50 border-white/10';

                  return (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Rank */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs border ${rankColor}`}
                        >
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                        </span>
                      </td>

                      {/* User Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <p className="text-white font-semibold flex items-center gap-1.5">
                              {user.name}
                              {user.role === 'ADMIN' && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                  Admin
                                </span>
                              )}
                            </p>
                            <p className="text-white/40 text-xs">{user.email || 'No email registered'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Tier Title */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-amber-300/90">
                          {user.tier}
                        </span>
                      </td>

                      {/* Contributions */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-white/90">{user.totalContributions}</span>
                        <span className="text-white/30 text-xs block">items</span>
                      </td>

                      {/* Badges */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold text-xs">
                          <Award size={13} />
                          {user.badges}
                        </span>
                      </td>

                      {/* Reward Points */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-amber-400 font-bold text-base tracking-wide">{user.rewardPoints} Pts</span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setAwardPoints(50);
                            setAwardBadges(1);
                            setAwardReason('Community Contribution Award');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold transition-all active:scale-95"
                        >
                          <Gift size={14} />
                          Award Points
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Award Points Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141420] border border-white/[0.12] w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Gift size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Award Bonus Points</h3>
                <p className="text-white/40 text-xs">For {selectedUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleAwardPoints} className="space-y-4 mt-4">
              {/* Quick Select Buttons */}
              <div>
                <label className="block text-white/60 text-xs font-semibold mb-2">Quick Select Points</label>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 50, 100, 250].map((pts) => (
                    <button
                      type="button"
                      key={pts}
                      onClick={() => setAwardPoints(pts)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        awardPoints === pts
                          ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      +{pts} Pts
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Points */}
              <div>
                <label className="block text-white/60 text-xs font-semibold mb-1">Custom Reward Points</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={awardPoints}
                  onChange={(e) => setAwardPoints(Number(e.target.value))}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Badges Increment */}
              <div>
                <label className="block text-white/60 text-xs font-semibold mb-1">Bonus Badges</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={awardBadges}
                  onChange={(e) => setAwardBadges(Number(e.target.value))}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-white/60 text-xs font-semibold mb-1">Reason / Note to User</label>
                <textarea
                  rows={3}
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="e.g. For publishing an outstanding journey guide on Rajgir Heritage"
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 placeholder-white/30 resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-xs border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Gift size={14} />}
                  Confirm Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaderboard;
