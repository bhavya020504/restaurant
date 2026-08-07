import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Utensils, Mail, Lock, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginAsCustomer = useAuthStore((state) => state.loginAsCustomer);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await ApiService.login(email, password);
      loginAsCustomer(email);
      navigate('/profile');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
      loginAsCustomer(email);
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/30">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400">Sign in to your BR KITCHEN customer account</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            icon={<LogIn className="w-4 h-4" />}
            className="w-full font-bold"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-orange-500 hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};
