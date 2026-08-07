import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../../constants/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 dark:bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-white">
                BR <span className="text-orange-500">KITCHEN</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {RESTAURANT_INFO.tagline}. Hand-crafted culinary excellence delivered to your doorstep with precision.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Kitchen Open Now
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-heading">Explore Menu</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Chef's Signature Specials</Link></li>
              <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Artisan Wagyu Burgers</Link></li>
              <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Woodfired Sourdough Pizza</Link></li>
              <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Hand-Rolled Fresh Pasta</Link></li>
              <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Gourmet Desserts & Shakes</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-heading">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/reservation" className="hover:text-orange-400 transition-colors">Table Reservation</Link></li>
              <li><Link to="/order-tracking/BR-8921" className="hover:text-orange-400 transition-colors">Live Order Tracking</Link></li>
              <li><Link to="/profile" className="hover:text-orange-400 transition-colors">Saved Delivery Addresses</Link></li>
              <li><Link to="/admin" className="hover:text-orange-400 transition-colors">Admin Dashboard Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-heading">Contact Concierge</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <span>{RESTAURANT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <span>{RESTAURANT_INFO.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                <span>{RESTAURANT_INFO.operatingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BR KITCHEN Platform. All rights reserved. Premium Frontend UI.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for Gourmet Enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};
