'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings as SettingsIcon,
  Download,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { UserProfile } from '@/types';

interface HeaderProps {
  user: UserProfile | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenOmnibar: () => void;
  onOpenImportExport: () => void;
  onOpenSettings: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onOpenOmnibar,
  onOpenImportExport,
  onOpenSettings,
  onOpenAuth,
  onSignOut,
  theme,
  onToggleTheme,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#090D16]/95 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-6 flex items-center justify-between transition-colors shrink-0">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-glow text-white font-bold">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-white">LinkVault</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            Save • Organize • Achieve
          </p>
        </div>
      </div>

      {/* Middle: Universal Search Omnibar */}
      <div className="flex-1 max-w-2xl mx-4">
        <div
          onClick={onOpenOmnibar}
          className="relative flex items-center w-full bg-[#111728]/80 hover:bg-[#151D33] border border-white/[0.08] hover:border-indigo-500/50 rounded-xl px-3.5 py-2 cursor-pointer transition-all duration-200 group shadow-sm"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search resources, tags, categories, tasks, goals..."
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-400 focus:outline-none"
          />
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded-md">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Tools & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action / Sparkle */}
        <button
          onClick={onOpenOmnibar}
          title="Quick Commands"
          className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-white/[0.05] transition-colors"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-slate-400 hover:bg-white/[0.05] transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#090D16]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111728] border border-white/[0.08] rounded-2xl shadow-glass p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-indigo-400 font-medium">3 unread</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-slate-200">
                  <p className="font-medium text-white">Task Due Reminder</p>
                  <p className="text-slate-400 text-[11px]">Three.js tutorial scheduled for today 10:00 AM</p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] text-slate-300">
                  <p className="font-medium text-white">Goal Milestone</p>
                  <p className="text-slate-400 text-[11px]">Master Three.js reached 68% completion!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE OR SIGN IN BUTTONS */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl hover:bg-white/[0.05] transition-all group"
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500/70 transition-all"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-white leading-tight">{user.fullName}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{user.email}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-[#111728] border border-white/[0.08] rounded-2xl shadow-glass py-1.5 z-50 text-xs animate-fade-in">
                <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                  <p className="font-semibold text-white">{user.fullName}</p>
                  <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  Settings & Profile
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenImportExport();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Import & Export Data
                </button>
                <div className="my-1 border-t border-white/[0.06]"></div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
