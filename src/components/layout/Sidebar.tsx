'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Star,
  Bookmark,
  FolderTree,
  Clock,
  CheckSquare,
  Target,
  History,
  Archive,
  Settings,
  Plus,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ActiveTab, Category } from '@/types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  categories: Category[];
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  onOpenNewCategoryModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  categories,
  selectedCategorySlug,
  onSelectCategory,
  onOpenNewCategoryModal,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all-resources', label: 'All Resources', icon: Compass },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'collections', label: 'Collections', icon: Bookmark },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'read-later', label: 'Read Later', icon: Clock },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'recently-viewed', label: 'Recently Viewed', icon: History },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 10);

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-[#090D16] border-r border-white/[0.08] p-3 overflow-hidden select-none">
      {/* Scrollable Navigation & Categories Area */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1 custom-sidebar-scroll">
        {/* Core Navigation Items */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !selectedCategorySlug;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectCategory(null);
                  onSelectTab(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Categories Section */}
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Categories
            </span>
            <button
              onClick={onOpenNewCategoryModal}
              title="Add New Category"
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Category</span>
            </button>
          </div>

          <div className="space-y-0.5">
            {visibleCategories.map((cat) => {
              const isSelected = selectedCategorySlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    onSelectTab('all-resources');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors group ${
                    isSelected
                      ? 'bg-white/[0.08] text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300 font-mono">
                    {cat.itemCount || 0}
                  </span>
                </button>
              );
            })}

            {categories.length > 10 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {showAllCategories ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>More ({categories.length - 10})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Promo Card - PINNED AT BOTTOM (shrink-0), NEVER CLIPPED OR CUT OFF */}
      <div className="shrink-0 pt-3 border-t border-white/[0.06]">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1E153B] via-[#161733] to-[#121B2F] border border-indigo-500/20 shadow-glow relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center mb-2 text-indigo-400">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <p className="text-xs font-semibold text-white leading-snug mb-1">
            Build better habits with your resources
          </p>
          <p className="text-[11px] text-slate-400 mb-2.5">
            Turn inspirations into completed goals.
          </p>
          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectTab('goals');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg shadow-sm transition-all"
          >
            <span>Explore Goals</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
