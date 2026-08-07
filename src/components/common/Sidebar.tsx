import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot,
  ShoppingBag, 
  Users, 
  Calendar, 
  PhoneCall, 
  Mic, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  BarChart3, 
  UtensilsCrossed, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ThemeToggle } from './ThemeToggle';

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const logoutAdmin = useAuthStore((state) => state.logoutAdmin);

  const menuSections = [
    {
      title: 'Core Operations',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'AI Services', path: '/admin/ai-services', icon: Bot, badge: 'Ready' },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, badge: '4' },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Reservations', path: '/admin/reservations', icon: Calendar, badge: '3' },
      ]
    },
    {
      title: 'Concierge & Calls',
      items: [
        { name: 'Call History', path: '/admin/calls', icon: PhoneCall },
        { name: 'Recordings', path: '/admin/recordings', icon: Mic },
        { name: 'Transcripts', path: '/admin/transcripts', icon: FileText },
        { name: 'Summaries', path: '/admin/summaries', icon: Sparkles },
      ]
    },
    {
      title: 'Customer Experience',
      items: [
        { name: 'Complaints', path: '/admin/complaints', icon: AlertTriangle, badge: '2' },
        { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
        { name: 'WhatsApp Logs', path: '/admin/whatsapp', icon: MessageCircle },
        { name: 'Email Logs', path: '/admin/email', icon: Mail },
      ]
    },
    {
      title: 'Platform Management',
      items: [
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Menu Management', path: '/admin/menu-management', icon: UtensilsCrossed },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname === path;
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-200/80 dark:border-slate-800">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-heading font-black text-lg text-slate-900 dark:text-white leading-tight">
                  BR <span className="text-orange-500">ADMIN</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Control Center
                </span>
              </div>
            )}
          </Link>
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="p-3 overflow-y-auto max-h-[calc(100vh-140px)] space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ItemIcon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                      {!collapsed && <span>{item.name}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={`px-2 py-0.5 text-xs font-extrabold rounded-full ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-2">
          {!collapsed && <ThemeToggle />}
          <Link
            to="/"
            className="p-2 rounded-xl text-slate-500 hover:text-orange-600 hover:bg-orange-500/10 transition-colors text-xs font-bold flex items-center gap-1.5"
            title="Back to Customer Site"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Exit Admin</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
};
