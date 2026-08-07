import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Bell, Search, User } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuthStore } from '../store/useAuthStore';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);

  // Deriving title from pathname
  const getPageTitle = () => {
    const path = location.pathname.replace('/admin', '').replace('/', '');
    if (!path) return 'Operations Overview';
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
      
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              BR KITCHEN Real-time Operations Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, calls..."
                className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-52"
              />
            </div>

            <ThemeToggle />

            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors border border-slate-200/60 dark:border-slate-800">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/20 font-heading">
                AD
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                  Manager Admin
                </span>
                <span className="text-[10px] text-orange-500 font-bold tracking-wider uppercase mt-0.5">
                  Superuser
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
