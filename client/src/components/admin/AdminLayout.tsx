import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, Palette, Plane, Image, Users, Store, Mountain, UserCircle, Settings, LogOut, Menu, X, ChevronRight, Shield, Sparkles, Layers
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

import logo from '../../assets/new-logo.png';

const sidebarItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Categories', path: '/admin/categories', icon: Layers },
  { label: 'Districts', path: '/admin/districts', icon: MapPin },
  { label: 'Tourism', path: '/admin/tourism', icon: Plane },
  { label: 'Popular Places', path: '/admin/places', icon: Sparkles },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Marketplace', path: '/admin/marketplace', icon: Store },
  { label: 'Tribes', path: '/admin/tribes', icon: Mountain },
  { label: 'Personalities', path: '/admin/personalities', icon: UserCircle },
  { label: 'Site Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col
        bg-[#0f0f18] border-r border-white/[0.06]
        transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-20'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={logo}
              alt="Bihar Darshan"
              className="h-10 w-auto object-contain shrink-0"
              style={{
                filter: "brightness(0) saturate(100%) invert(84%) sepia(25%) saturate(700%) hue-rotate(350deg) brightness(96%) contrast(90%)"
              }}
            />
            {sidebarOpen && <span className="text-white font-bold text-sm tracking-tight whitespace-nowrap">Bihar Darshan</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex text-white/30 hover:text-white/60 transition-colors"
          >
            <ChevronRight size={16} className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-white/30">
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-[#EAB308]/10 text-[#EAB308] shadow-sm'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-white/[0.06] pt-4 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white/50 hover:text-white">
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-white font-semibold text-sm">
                {sidebarItems.find(i => isActive(i.path))?.label || 'Admin'}
              </h2>
              <p className="text-white/30 text-xs">Content Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-white/30 hover:text-[#EAB308] transition-colors border border-white/10 px-3 py-1.5 rounded-lg hover:border-[#EAB308]/30">
              View Site →
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAB308] to-[#EAB308] flex items-center justify-center text-black text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
