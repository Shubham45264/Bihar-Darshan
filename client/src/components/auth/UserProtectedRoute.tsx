import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const UserProtectedRoute: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B3E2F]/20 border-t-[#8B3E2F] rounded-full animate-spin" />
        <p className="text-[#8B3E2F] mt-4 text-sm font-semibold tracking-wider animate-pulse uppercase">Checking Authentication...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;
