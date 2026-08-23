import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { Droplet, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useBloodSupply();
  const [email, setEmail] = useState('s.mitchell@metro-bloodbank.org');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleQuickDemoLogin = (_roleName: string, demoEmail: string) => {
    setEmail(demoEmail);
    login(demoEmail, 'demo1234');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#B91C1C] selection:text-white font-sans">
      <div className="relative max-w-md w-full space-y-4">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#7F1D1D] text-white shadow-sm mb-1">
            <Droplet className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight uppercase">
            BLOODSUPPLY INTELLIGENCE
          </h1>
          <p className="text-xs text-[#6B7280]">
            Clinical Blood Bank Vault & Hospital Logistics System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wide">Staff Authentication</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#991B1B] bg-[#FEE2E2] px-2 py-0.5 rounded border border-[#FECACA]">
              <ShieldCheck className="w-3 h-3" />
              Secure Portal
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@metro-bloodbank.org"
                  className="w-full pl-9 pr-3 py-2 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md text-[#111827] text-xs focus:border-[#B91C1C] focus:bg-white focus:outline-hidden transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] text-[#B91C1C] hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md text-[#111827] text-xs focus:border-[#B91C1C] focus:bg-white focus:outline-hidden transition"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 text-xs text-[#6B7280] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E5E7EB] text-[#B91C1C] focus:ring-[#B91C1C]"
                />
                <span className="text-[11px]">Remember my terminal session</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-md shadow-xs transition flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Authenticate & Enter System</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Access One-Click Login */}
          <div className="pt-3 border-t border-[#E5E7EB] space-y-1.5">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block text-center">
              Quick 1-Click Demo Credentials
            </span>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Admin', 's.mitchell@metro-bloodbank.org')}
              className="w-full p-2.5 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] hover:border-[#B91C1C] text-left transition flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-xs text-[#111827] group-hover:text-[#B91C1C] transition">
                  Dr. Sarah Mitchell (Administrator)
                </div>
                <div className="text-[10px] text-[#6B7280]">Chief Logistics Officer • Full Access</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] rounded">
                Demo Login →
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#6B7280]">
          Metropolitan Central Blood Transfusion Service • HIPAA & ISO 15189 Certified
        </p>
      </div>

      {/* Forgot password info modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-sm w-full p-5 text-[#111827] text-xs space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-[#111827]">Password Recovery Demo</h3>
            <p className="text-[#6B7280] leading-relaxed">
              For demonstration mode, simply click the <strong>Demo Login</strong> button on the login screen to sign in instantly with administrator privileges.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
