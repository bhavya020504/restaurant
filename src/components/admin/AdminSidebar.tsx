import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Calendar, 
  PhoneCall, 
  Mic, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  MessageCircle, 
  Mail, 
  BarChart3, 
  UtensilsCrossed, 
  Settings, 
  ChevronRight 
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, badge }) => (
  <NavLink
    to={to}
    end={to === '/admin'}
    className={({ isActive }) =>
      `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
        isActive
          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
      }`
    }
  >
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </div>
    {badge ? (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/20 text-orange-600 dark:text-orange-400">
        {badge}
      </span>
    ) : (
      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
    )}
  </NavLink>
);

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4 space-y-8">
      <div className="space-y-6">
        <div>
          <span className="px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Main Management
          </span>
          <div className="space-y-1">
            <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/admin/orders" icon={ShoppingBag} label="Orders" />
            <SidebarItem to="/admin/customers" icon={Users} label="Customers" />
            <SidebarItem to="/admin/reservations" icon={Calendar} label="Reservations" />
          </div>
        </div>

        <div>
          <span className="px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Audit & Support
          </span>
          <div className="space-y-1">
            <SidebarItem to="/admin/calls" icon={PhoneCall} label="Call History" />
            <SidebarItem to="/admin/recordings" icon={Mic} label="Recordings" />
            <SidebarItem to="/admin/transcripts" icon={FileText} label="Transcripts" />
            <SidebarItem to="/admin/summaries" icon={Sparkles} label="Summaries" />
            <SidebarItem to="/admin/complaints" icon={AlertTriangle} label="Complaints" />
          </div>
        </div>

        <div>
          <span className="px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Messaging Logs
          </span>
          <div className="space-y-1">
            <SidebarItem to="/admin/whatsapp" icon={MessageCircle} label="WhatsApp Logs" />
            <SidebarItem to="/admin/email" icon={Mail} label="Email Logs" />
          </div>
        </div>

        <div>
          <span className="px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Platform Settings
          </span>
          <div className="space-y-1">
            <SidebarItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
            <SidebarItem to="/admin/menu-management" icon={UtensilsCrossed} label="Menu Management" />
            <SidebarItem to="/admin/settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </div>
    </aside>
  );
};
