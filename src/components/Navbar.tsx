import React from 'react';
import {
  ShieldAlert,
  Activity,
  Mic,
  History,
  LayoutDashboard,
  Radio,
  Sliders,
  Sparkles,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'scanner' | 'threats' | 'dashboard' | 'history' | 'admin';
  onSelectView: (view: 'scanner' | 'threats' | 'dashboard' | 'history' | 'admin') => void;
  onOpenVoiceAssistant: () => void;
  onOpenPrivacy: () => void;
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenVoiceAssistant,
  onOpenPrivacy,
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'scanner' as const, label: 'Scanner', icon: ShieldAlert },
    { id: 'threats' as const, label: 'Live Threat Feed', icon: Radio },
    { id: 'dashboard' as const, label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'history' as const, label: 'Scan History', icon: History },
    { id: 'admin' as const, label: 'Admin Console', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            id="nav-brand-logo"
            onClick={() => onSelectView('scanner')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  FraudShield AI
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/90 text-cyan-400 border border-cyan-700/50">
                  v2.4 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI-Powered Scam & Fraud Detection
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Voice Assistant Copilot Trigger */}
            <button
              id="nav-voice-assistant-btn"
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-900/60 to-purple-900/60 border border-violet-700/50 text-violet-300 hover:text-white hover:border-violet-500 transition-all shadow-sm group"
              title="Speak with AI Security Copilot"
            >
              <Mic className="w-3.5 h-3.5 text-violet-400 group-hover:scale-125 transition-transform" />
              <span className="hidden sm:inline">Copilot Voice</span>
            </button>

            {/* Privacy & Account Settings */}
            <button
              id="nav-privacy-btn"
              onClick={onOpenPrivacy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Privacy & Data Controls"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Privacy</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
