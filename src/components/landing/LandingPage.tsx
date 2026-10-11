'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Bookmark,
  CheckCircle2,
  Target,
  Zap,
  ShieldCheck,
  Database,
  ExternalLink,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  Play,
  Layers,
  Flame,
  Search,
  Folder,
  Globe,
  Film,
  Box,
  Palette,
  Code2,
} from 'lucide-react';
import { ThreeCanvas } from './ThreeCanvas';
import { UserProfile } from '@/types';

interface LandingPageProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onEnterGuestDemo: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onEnterGuestDemo,
  theme,
  onToggleTheme,
}) => {
  const [activeTabDemo, setActiveTabDemo] = useState<'all' | '3d' | 'design' | 'dev'>('all');

  const demoItems = [
    {
      title: 'Three.js Crash Course - Build 3D Websites',
      domain: 'youtube.com',
      category: '3D Websites',
      icon: Box,
      color: '#06B6D4',
      badge: 'Tutorial',
      tag: '3d',
    },
    {
      title: 'Best Animated Short Films of All Time',
      domain: 'yarrlist.net',
      category: 'Animation & Motion',
      icon: Film,
      color: '#F97316',
      badge: 'Inspiration',
      tag: 'design',
    },
    {
      title: 'The Future of Web Design in 2025',
      domain: 'DesignCourse',
      category: 'UI/UX Design',
      icon: Palette,
      color: '#EC4899',
      badge: 'Video',
      tag: 'design',
    },
    {
      title: 'Next.js 15 Full-Stack Masterclass',
      domain: 'github.com',
      category: 'Frontend Dev',
      icon: Code2,
      color: '#3B82F6',
      badge: 'Dev',
      tag: 'dev',
    },
  ];

  const filteredDemo =
    activeTabDemo === 'all'
      ? demoItems
      : demoItems.filter((i) => i.tag === activeTabDemo);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden transition-colors selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 3D WEBGL HERO CANVAS BACKGROUND */}
      <ThreeCanvas className="h-[800px] z-0 opacity-80" />

      {/* AMBIENT GRADIENT GLOWS */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="absolute top-60 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px] pointer-events-none -z-10" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full h-16 bg-[#090D16]/80 dark:bg-[#090D16]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 lg:px-8 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-glow text-white font-bold">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">LinkVault</span>
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Save • Organize • Achieve
            </p>
          </div>
        </div>

        {/* Navigation Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#demo" className="hover:text-white transition-colors">
            Interactive Demo
          </a>
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a
            href="https://github.com/sanketkothiya2/LinkVault"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Sign In */}
          <button
            onClick={() => onOpenAuth('signin')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign In</span>
          </button>

          {/* Get Started */}
          <button
            onClick={() => onOpenAuth('signup')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Get Started</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        {/* Floating Launch Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.04] border border-indigo-500/30 backdrop-blur-md shadow-glow animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-100">
            Next-Gen Personal Link Architecture • Supabase PostgreSQL Ready
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
          Collect what inspires you. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Build what you dream.
          </span>
        </h1>

        {/* Subhead */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          The ultimate productivity workspace to organize 3D websites, YouTube tutorials, and tools.
          Turn bookmarks into actionable daily tasks, track long-term milestones, and sync seamlessly to the cloud.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all hover:scale-105 active:scale-95"
          >
            <span>Create Your Free Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onEnterGuestDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-[#111728]/90 hover:bg-[#161F36] border border-white/[0.1] hover:border-indigo-500/40 shadow-sm transition-all"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span>Explore Live Demo as Guest</span>
          </button>
        </div>

        {/* Trust & Spec Pill Marquee */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <p className="text-lg font-extrabold text-white">100%</p>
            <p className="text-[11px] text-slate-400">Local-First & Offline Ready</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <p className="text-lg font-extrabold text-indigo-400">0ms</p>
            <p className="text-[11px] text-slate-400">Instant Cached UI Speed</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <p className="text-lg font-extrabold text-purple-400">Supabase</p>
            <p className="text-[11px] text-slate-400">PostgreSQL Cloud Sync</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <p className="text-lg font-extrabold text-emerald-400">Three.js</p>
            <p className="text-[11px] text-slate-400">Interactive 3D Graphics</p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO SNEAK PEEK */}
      <section id="demo" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-5 sm:p-7 border border-white/[0.1] shadow-2xl relative overflow-hidden space-y-6">
          {/* Top Window Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">linkvault.app/explorer</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Filter Preview:</span>
              {(['all', '3d', 'design', 'dev'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTabDemo(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeTabDemo === t
                      ? 'bg-indigo-600 text-white shadow-glow'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Card Grid Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDemo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#090D16]/60 border border-white/[0.06] hover:border-indigo-500/40 hover:scale-[1.01] transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}25`, color: item.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">{item.domain}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">{item.category}</span>
                    <button
                      onClick={onEnterGuestDemo}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Open in Vault</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-indigo-500/10 rounded-2xl p-3.5 border border-indigo-500/20 text-xs">
            <p className="text-slate-200">
              Want to manage your own tags, categories, tasks, and goals?
            </p>
            <button
              onClick={onEnterGuestDemo}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow transition-all"
            >
              <span>Launch Demo App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Built for Developers, Designers & Visual Creators
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to transform a messy bookmark bar into an ultra-organized personal second brain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-indigo-500/40 space-y-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Universal Resource Explorer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save articles, 3D websites, GitHub repos, and YouTube videos. Automatic OpenGraph scraping fetches high-res thumbnails, descriptions, and favicons instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-purple-500/40 space-y-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Category "Threads" Fast Filter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scrollable animated ribbon inspired by modern social ribbons. Filter by category, tags, or content type with bespoke design icons and live counts in 1-click.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-emerald-500/40 space-y-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Task & Milestone Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't just hoard bookmarks—act on them. Link tutorials to actionable tasks with priorities, time reminders, and colorful confetti milestone celebrations.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-blue-500/40 space-y-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Supabase Cloud Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly connected to PostgreSQL with Row Level Security. Works in zero-latency offline mode and syncs back to the cloud automatically.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-amber-500/40 space-y-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Enterprise SSRF Guardrails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Server-side security filter blocks internal IP probing (127.0.0.1, 10.x, 192.168.x), enforces payload limits, and sanitizes metadata HTML.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-pink-500/40 space-y-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Data Ownership & Portability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full control over your assets. 1-click export to standard JSON backups or formatted CSV spreadsheets, plus seamless JSON library import.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative z-10 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-8 sm:p-12 border border-white/[0.1] shadow-glow space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to upgrade your resource workflow?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join developers and designers organizing their digital vault with LinkVault. Zero setup needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterGuestDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
            >
              <span>Test Drive Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.08] py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p>
          LinkVault • Personal Resource Library & Productivity Workspace
        </p>
        <p className="text-[11px] text-slate-600">
          Built with Next.js 15, Three.js, Tailwind CSS & Supabase.
        </p>
      </footer>
    </div>
  );
};
