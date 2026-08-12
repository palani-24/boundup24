import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Radio,
  BarChart2,
  Volume2,
  Heart,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { useAuthStore } from '../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login({ login: loginInput, password });
      navigate('/home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register({ fullName, username, email, password });
      navigate('/home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your inputs.');
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg('');
    setLoginInput('k2d');
    setPassword('password123');
    try {
      await login({ login: 'k2d', password: 'password123' });
      navigate('/home');
    } catch (err) {
      // Fallback demo signup
      try {
        await register({
          fullName: 'Palani Developer',
          username: 'k2d',
          email: 'p94509107@gmail.com',
          password: 'password123',
        });
        navigate('/home');
      } catch (regErr: any) {
        setErrorMsg(regErr.message || 'Demo login failed.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col lg:flex-row overflow-hidden relative select-none font-sans">
      
      {/* BACKGROUND AMBIENT GLOW ORBS */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-orange-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />

      {/* LEFT SIDE: CINEMATIC FEATURE SHOWCASE (DESKTOP) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 lg:p-16 relative z-10 border-r border-slate-800/80 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-slate-950/90 backdrop-blur-sm">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Logo size="md" showTagline={true} />
          <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" /> Live Platform
          </div>
        </div>

        {/* Hero Copy */}
        <div className="my-auto max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" /> Next-Gen Social Networking Monorepo
          </div>

          <h1 className="text-4xl xl:text-5xl font-black font-heading tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Connect. Share. Discover. <span className="text-orange-500">Feel People Live.</span>
          </h1>

          <p className="text-sm xl:text-base text-slate-400 leading-relaxed">
            Experience real-time Socket messaging, 24h stories, short video reels, voice notes, interactive polls, close friends privacy, and AI-assisted content generation.
          </p>

          {/* FLOATING MOCKUP CARDS SHOWCASE */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            
            {/* Story & Reel Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-orange-500">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover border border-slate-950"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Elena Vance</h4>
                  <span className="text-[10px] text-orange-400 font-semibold">Active 24h Story</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="flex items-center gap-1 text-red-400"><Heart className="w-3 h-3 fill-current" /> 4.8k</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 240</span>
              </div>
            </motion.div>

            {/* Poll & Voice Pill Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
                <span className="flex items-center gap-1 text-amber-400"><BarChart2 className="w-3.5 h-3.5" /> Interactive Poll</span>
                <span className="text-[10px] text-slate-500">84% Vote</span>
              </div>
              <div className="w-full bg-slate-800 rounded-lg p-2 text-[11px] text-slate-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-orange-500/30 w-[84%]" />
                <span className="relative z-10 font-medium">Warm Orange Theme 🔥</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Social Proof Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted Sessions</span>
          </div>
          <span>© 2026 BOUNDUP Monorepo</span>
        </div>
      </div>

      {/* RIGHT SIDE: AUTHENTICATION FORM CARD */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-20">
        
        {/* Mobile Logo Branding */}
        <div className="lg:hidden mb-8 text-center">
          <Logo size="lg" showTagline={true} />
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          
          {/* TAB SWITCHER */}
          <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
            <button
              onClick={() => { setIsRegistering(false); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isRegistering ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegistering(true); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isRegistering ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center justify-between animate-in fade-in">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} className="text-red-400 font-bold ml-2">✕</button>
            </div>
          )}

          {/* SIGN IN FORM */}
          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email or Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. k2d or user@boundup.com"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing In...' : <>Sign In to BoundUp <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Palani Developer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. k2d"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. p94509107@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? 'Creating Account...' : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* INSTANT DEMO LOGIN BUTTON */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-current" /> Instant Demo Login (1-Click)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
