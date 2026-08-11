import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { CheckCircle, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import bgImage from '../assets/background.jpg';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let message = 'Failed to send password reset email. Please check your email address.';
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many requests. Please wait a few minutes before trying again.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <Navbar forceWhiteText={true} />

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 z-0 transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          transform: 'scale(1.1)'
        }}
      />

      <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none" />

      {/* MAIN INTERFACE CARD */}
      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl px-6 py-10 md:px-8 md:py-12 text-white transition-all duration-500">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Reset Password
            </h2>
            <p className="text-gray-300 mt-2 text-sm md:text-base">
              Enter your email address to receive a password reset link
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/15 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-2.5 mb-6 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {isSubmitted ? (
            <div className="flex flex-col items-center text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center shadow-lg">
                <CheckCircle size={40} className="text-emerald-400" strokeWidth={1.5} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Check your inbox!</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A password reset link has been sent to:
                </p>
              </div>

              {/* Email pill */}
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 w-full justify-center">
                <Mail size={16} className="text-brand-gold shrink-0" />
                <span className="text-white font-bold text-sm truncate">{email}</span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed px-2">
                Can't find it? Check your <span className="text-brand-gold font-semibold">spam or junk</span> folder. The link will allow you to reset your password.
              </p>

              <Link
                to="/login"
                className="block w-full py-4 bg-gold-dark hover:bg-accent-brown text-white font-bold rounded-2xl shadow-xl shadow-amber-950/40 text-center transition-all uppercase tracking-widest text-sm mt-2"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 ml-1 text-brand-gold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all placeholder:text-gray-500 text-white"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 bg-gold-dark hover:bg-accent-brown text-white font-bold rounded-2xl shadow-xl shadow-amber-950/40 transition-all active:scale-[0.97] uppercase tracking-widest text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending Link...</>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center text-sm pt-2">
                <Link to="/login" className="text-brand-gold font-bold hover:underline decoration-2 underline-offset-4">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
