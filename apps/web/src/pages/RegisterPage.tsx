import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';
import { useAuthStore } from '../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register({ fullName, username, email, password });
      navigate('/home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg select-none">
      <div className="w-full max-w-md bg-white border border-brand-border rounded-24px p-8 shadow-glass flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" showTagline={true} />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-12px">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="mt-2">
            Create Account
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2 pt-4 border-t border-brand-border text-xs text-brand-muted">
          <p>
            Already have an account?{' '}
            <NavLink to="/login" className="font-bold text-brand-primary hover:underline">
              Log In
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};
