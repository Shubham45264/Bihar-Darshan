import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

import bgImage from '../assets/background.jpg';

const BACKEND_URL = 'http://localhost:5000';

/** Attempt to sync user with the backend. Does NOT throw — returns success flag. */
const syncWithBackend = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch {
    // Backend is unreachable — log but don't block the user
    console.warn('Backend sync unavailable; proceeding with Firebase auth only.');
    return false;
  }
};

/** Map Firebase error codes to friendly messages */
const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return '';
    default:
      return 'Authentication failed. Please try again.';
  }
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !acceptedPrivacy) {
      setError('Please accept the Privacy Policy and Terms & Conditions to create an account.');
      return;
    }

    if (!isLogin && formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.newPassword);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.newPassword);
        const displayName = `${formData.firstName} ${formData.lastName}`.trim();
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
      }

      // Firebase auth succeeded — get token and sync with backend
      const token = await userCredential.user.getIdToken();
      await syncWithBackend(token); // non-blocking: failure is logged, not thrown

      localStorage.setItem('isAuthenticated', 'true');
      navigate('/profile');
    } catch (err: any) {
      console.error('Auth error:', err);
      const message = err.code ? getFirebaseErrorMessage(err.code) : (err.message || 'Authentication failed.');
      if (message) setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    if (!isLogin && !acceptedPrivacy) {
      setError('Please accept the Privacy Policy and Terms & Conditions to create an account.');
      return;
    }
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Firebase auth succeeded — sync with backend (non-blocking)
      const token = await userCredential.user.getIdToken();
      await syncWithBackend(token);

      localStorage.setItem('isAuthenticated', 'true');
      navigate('/profile');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      const message = err.code ? getFirebaseErrorMessage(err.code) : (err.message || 'Google sign-in failed. Please try again.');
      if (message) setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0f] flex flex-col items-center justify-center pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20 font-sans overflow-x-hidden">
      <Navbar forceWhiteText={true} />

      {/* BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
          transform: 'scale(1.15)'
        }}
      />

      <div className="fixed inset-0 bg-black/50 pointer-events-none" />

      {/* MAIN INTERFACE CARD */}
      <div className="relative z-10 w-full max-w-lg md:max-w-[520px] p-4 sm:p-6 mx-auto my-auto">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.25rem] shadow-2xl px-6 py-7 sm:px-10 sm:py-9 text-white transition-all duration-500">

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Journey'}
            </h2>
            <p className="text-gray-300 mt-1.5 text-xs sm:text-sm">
              {isLogin ? 'Sign in to your account' : 'Create an account to explore Bihar'}
            </p>
          </div>

          {/* Inline Error Banner */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/15 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-2.5 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 ml-1 text-brand-gold">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all placeholder:text-gray-500 text-white text-sm"
                    placeholder="Rahul"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 ml-1 text-brand-gold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all placeholder:text-gray-500 text-white text-sm"
                    placeholder="Kumar"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 ml-1 text-brand-gold">Email Address</label>
              <input
                type="email"
                name="email"
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all placeholder:text-gray-500 text-white text-sm"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* NEW PASSWORD FIELDS */}
            <div className={`${!isLogin ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5' : 'space-y-3.5'}`}>
              <div className="w-full relative">
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 ml-1 text-brand-gold">
                  {isLogin ? 'Password' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    onChange={handleInputChange}
                    className="w-full px-4 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all placeholder:text-gray-500 text-white text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black transition-all focus:outline-none cursor-pointer shadow-sm"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="w-full relative animate-in fade-in slide-in-from-right-2 duration-300">
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 ml-1 text-brand-gold">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      onChange={handleInputChange}
                      className="w-full px-4 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all placeholder:text-gray-500 text-white text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black transition-all focus:outline-none cursor-pointer shadow-sm"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isLogin ? (
              <div className="flex items-center justify-end text-xs pt-0.5">
                <Link to="/forgot-password" className="text-brand-gold hover:text-amber-300 transition-colors font-medium">Forgot password?</Link>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 pt-1 pb-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <input
                  type="checkbox"
                  id="acceptPrivacy"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 accent-amber-500 cursor-pointer shrink-0"
                />
                <label htmlFor="acceptPrivacy" className="text-xs leading-snug text-gray-300 select-none cursor-pointer">
                  I accept the{' '}
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gold hover:text-amber-300 underline font-semibold transition-colors"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and Terms &amp; Conditions
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLogin && !acceptedPrivacy)}
              className="w-full py-3.5 px-4 bg-gold-dark hover:bg-accent-brown text-white font-bold rounded-2xl shadow-xl shadow-amber-950/40 transition-all active:scale-[0.97] mt-3 uppercase tracking-widest text-xs sm:text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> {isLogin ? 'Signing In...' : 'Creating Account...'}</>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <div className="relative flex items-center py-3.5">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-3 text-white/40 text-[11px] font-semibold uppercase tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || (!isLogin && !acceptedPrivacy)}
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-2.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setAcceptedPrivacy(false); }}
              className="text-brand-gold font-bold hover:underline decoration-2 underline-offset-4 bg-transparent border-none cursor-pointer"
            >
              {isLogin ? 'Register now' : 'Sign in instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;