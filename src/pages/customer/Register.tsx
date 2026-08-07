import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Utensils, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const registerCustomer = useAuthStore((state) => state.registerCustomer);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await ApiService.register({ name, email, phone, password });
      registerCustomer(name, email, phone);
      navigate('/profile');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email or phone may already be registered.');
      registerCustomer(name, email, phone);
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
            Create Account
          </h2>
          <p className="text-xs text-slate-400">Join BR KITCHEN Gourmet Rewards Club</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            icon={<UserPlus className="w-4 h-4" />}
            className="w-full font-bold"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-orange-500 hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
