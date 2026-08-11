import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login({ login: loginInput, password });
      navigate('/home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg select-none">
      <div className="w-full max-w-md bg-white border border-brand-border rounded-24px p-8 shadow-glass flex flex-col gap-6">
        {/* BRAND LOGO */}
        <div className="flex flex-col items-center text-center">
          <h1 className="font-heading font-extrabold text-3xl text-brand-primary tracking-tight">BOUNDUP</h1>
          <p className="text-xs font-semibold text-brand-muted tracking-wide mt-1">
            Connect. Share. Discover. Bound Up.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-12px">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email or Username"
            type="text"
            placeholder="enter your email or username"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="mt-2">
            Log In
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2 pt-4 border-t border-brand-border text-xs text-brand-muted">
          <p>
            Don't have an account?{' '}
            <NavLink to="/register" className="font-bold text-brand-primary hover:underline">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};
