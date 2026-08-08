import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, Mail } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

import logo from '../../assets/new-logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() !== 'bihardarshanofficial@gmail.com') {
      setError('Access denied: Unauthorized email address.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      setError('');
      setIsUnlocking(true);
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => navigate('/admin'), 600);
    } catch (err: any) {
      setIsUnlocking(false);
      setError('Invalid credentials. Access denied.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#EAB308]/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(212,160,23,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className={`relative w-full max-w-md transition-all duration-700 ${isUnlocking ? 'scale-95 opacity-0 translate-y-8' : ''}`}>
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Bihar Darshan"
            className={`h-24 w-auto object-contain mb-4 drop-shadow-[0_4px_12px_rgba(234,179,8,0.2)] transition-all duration-500 ${isUnlocking ? 'scale-0' : ''}`}
            style={{
              filter: "brightness(0) saturate(100%) invert(84%) sepia(25%) saturate(700%) hue-rotate(350deg) brightness(96%) contrast(90%)"
            }}
          />
          <h1 className="font-display font-bold text-white text-2xl tracking-tight">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Bihar Darshan Content Management</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl">
          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
            Admin Email
          </label>
          <div className="relative mb-4">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-[#D4A017]/50 focus:ring-1 focus:ring-[#D4A017]/20 transition-all text-sm"
              autoFocus
              required
            />
          </div>

          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
            Admin Password
          </label>
          <div className="relative mb-6">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-[#EAB308]/50 focus:ring-1 focus:ring-[#EAB308]/20 transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#EAB308] text-black font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#EAB308]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Unlock Dashboard
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Protected area • Authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
