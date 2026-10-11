'use client';

import React, { useState } from 'react';
import { User, Database, ShieldCheck, RefreshCw, Save, Check, Sun, Moon, Palette } from 'lucide-react';
import { UserProfile } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabase';
import { storage, INITIAL_RESOURCES, INITIAL_TASKS, INITIAL_GOALS, INITIAL_CATEGORIES } from '@/lib/storage';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onReloadData: () => void;
  theme?: string;
  onToggleTheme?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onReloadData,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [quote, setQuote] = useState(user.quote);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      quote: quote.trim(),
      avatarUrl: avatarUrl.trim(),
    };
    onUpdateUser(updated);
    storage.saveUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetToSeed = () => {
    if (confirm('Reset library to default master template (from screenshot)? This will restore all default resources, tasks, and goals.')) {
      storage.saveResources(INITIAL_RESOURCES);
      storage.saveTasks(INITIAL_TASKS);
      storage.saveGoals(INITIAL_GOALS);
      storage.saveCategories(INITIAL_CATEGORIES);
      onReloadData();
      alert('Data reset successfully to master layout!');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-white/[0.08]">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account profile, theme, and data storage configuration
        </p>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="glass-card rounded-2xl p-5 border border-white/[0.08] space-y-4"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <User className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">User Profile</h2>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={avatarUrl}
            alt={fullName}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/50"
          />
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Daily Motivational Quote</label>
          <input
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" /> Profile updated successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>

      {/* Appearance & Theme Preferences */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <Palette className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white">Appearance & Theme</h2>
        </div>

        <p className="text-xs text-slate-400">
          Customize the aesthetic theme of LinkVault. Select Dark Mode for sleek obsidian styling or Light Mode for crisp high-contrast clarity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Dark Mode Option */}
          <div
            onClick={() => {
              if (theme !== 'dark' && onToggleTheme) onToggleTheme();
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
              theme === 'dark'
                ? 'bg-indigo-500/10 border-indigo-500/40 shadow-glow'
                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Dark Obsidian</p>
                <p className="text-[11px] text-slate-400">Deep space background, subtle glass glow</p>
              </div>
            </div>
            {theme === 'dark' && (
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
            )}
          </div>

          {/* Light Mode Option */}
          <div
            onClick={() => {
              if (theme !== 'light' && onToggleTheme) onToggleTheme();
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
              theme === 'light'
                ? 'bg-amber-500/10 border-amber-500/40 shadow-glow'
                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Clean Light</p>
                <p className="text-[11px] text-slate-400">Crisp canvas, soft borders, high legibility</p>
              </div>
            </div>
            {theme === 'light' && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
            )}
          </div>
        </div>
      </div>

      {/* Backend & Security Status */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.08] space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <Database className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Database & Security Architecture</h2>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090D16] border border-white/[0.06]">
            <div>
              <p className="font-semibold text-white">Supabase PostgreSQL Connection</p>
              <p className="text-[11px] text-slate-400">
                {isSupabaseConfigured
                  ? 'Connected to live Supabase PostgreSQL database with Row Level Security.'
                  : 'Running in Local Fast Mode with persistent storage & zero latency.'}
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL READY'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090D16] border border-white/[0.06]">
            <div>
              <p className="font-semibold text-white">Server-Side SSRF Guardrails</p>
              <p className="text-[11px] text-slate-400">
                Guards active: private IPv4/IPv6 blocking, 1MB size limit, 6s timeout, HTML sanitization.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Reset Data */}
      <div className="glass-card rounded-2xl p-5 border border-rose-500/20 space-y-3">
        <h3 className="text-sm font-bold text-rose-400">Reset Data</h3>
        <p className="text-xs text-slate-400">
          Restore the library, tasks, and goals back to the initial master showcase state.
        </p>
        <button
          type="button"
          onClick={handleResetToSeed}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Master Showcase</span>
        </button>
      </div>
    </div>
  );
};
