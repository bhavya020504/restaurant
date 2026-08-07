import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-8xl font-black text-orange-500 font-heading tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
          Page Not Found
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          The requested page could not be located in the BR KITCHEN platform.
        </p>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Link to="/">
          <Button icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
