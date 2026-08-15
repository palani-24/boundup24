import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-[#111111] hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold font-heading text-[#111111]">Reset Password</h1>
        </div>

        <div className="flex flex-col items-center text-center my-4">
          <Logo size="md" showTagline={false} />
          <p className="text-xs text-[#666666] mt-2 max-w-xs">
            Enter your email address associated with your BoundUp account to receive a password reset link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white border border-[#E5E7EB] rounded-24px p-6 shadow-sm flex flex-col items-center text-center gap-3">
            <CheckCircle className="w-12 h-12 text-[#FF5A1F]" />
            <h3 className="font-extrabold text-base text-[#111111]">Reset Link Sent</h3>
            <p className="text-xs text-[#666666]">
              We have sent password recovery instructions to <span className="font-bold text-[#111111]">{email}</span>.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold mt-2 hover:opacity-90"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-[#111111]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all mt-2"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>

      <div className="text-center pt-4">
        <NavLink to="/login" className="text-xs font-extrabold text-[#FF5A1F] hover:underline">
          Back to Login
        </NavLink>
      </div>
    </div>
  );
};
