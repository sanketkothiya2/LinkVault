'use client';

import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Search,
  ExternalLink,
  ArrowRight,
  Layers,
  Sparkles,
  Link2,
  Film,
  Box,
  Palette,
  Globe,
  Code2,
  Cpu,
  Bot,
  GraduationCap,
  Play,
  Type,
  Smile,
  Compass,
  Briefcase,
} from 'lucide-react';
import { Category, Resource } from '@/types';

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes('animation') || s.includes('motion')) return Film;
  if (s.includes('three') || s.includes('3d') || s.includes('spline')) return Box;
  if (s.includes('design') || s.includes('ui') || s.includes('ux') || s.includes('color')) return Palette;
  if (s.includes('website') || s.includes('web') || s.includes('portfolio') || s.includes('awwwards')) return Globe;
  if (s.includes('front') || s.includes('react') || s.includes('code') || s.includes('dev')) return Code2;
  if (s.includes('tech') || s.includes('backend') || s.includes('api')) return Cpu;
  if (s.includes('ai') || s.includes('prompt') || s.includes('bot')) return Bot;
  if (s.includes('learn') || s.includes('tutorial') || s.includes('course')) return GraduationCap;
  if (s.includes('video') || s.includes('youtube')) return Play;
  if (s.includes('tool') || s.includes('utility')) return Sparkles;
  if (s.includes('type') || s.includes('font')) return Type;
  if (s.includes('icon') || s.includes('asset')) return Smile;
  if (s.includes('inspirational') || s.includes('explore')) return Compass;
  if (s.includes('career') || s.includes('job')) return Briefcase;
  return Folder;
};

interface CategoriesViewProps {
  categories: Category[];
  resources: Resource[];
  onSelectCategory: (slug: string) => void;
  onOpenNewCategoryModal: () => void;
  onOpenAddResource: (categoryId?: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  resources,
  onSelectCategory,
  onOpenNewCategoryModal,
  onOpenAddResource,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories by name
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total categorized items
  const totalCategorized = resources.filter(
    (r) => r.categoryId && !r.isArchived
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <span>Category Explorer</span>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {categories.length} Categories
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and organize all your bookmarks, tutorials, 3D websites, and tools by category
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={onOpenNewCategoryModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
          <button
            onClick={() => onOpenAddResource()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0F1626] border border-white/[0.08]">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            <strong className="text-white">{totalCategorized}</strong> resources organized
          </span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => {
          const catResources = resources.filter(
            (r) => r.categoryId === cat.id && !r.isArchived
          );
          const previewItems = catResources.slice(0, 3);
          const CatIcon = getCategoryIcon(cat.slug);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="glass-card rounded-2xl p-4 border border-white/[0.08] hover:border-indigo-500/40 hover:scale-[1.01] transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3.5 relative overflow-hidden"
            >
              {/* Top Accent Glow */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-80"
                style={{ backgroundColor: cat.color }}
              />

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-white/[0.08] transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${cat.color}25`,
                        color: cat.color,
                      }}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-slate-300 shrink-0">
                    {catResources.length}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {cat.slug}
                </p>
              </div>

              {/* Preview of items inside this category */}
              <div className="space-y-1.5 bg-[#090D16]/60 rounded-xl p-2.5 border border-white/[0.04]">
                {previewItems.length > 0 ? (
                  previewItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-[11px] text-slate-300 truncate"
                    >
                      {item.faviconUrl ? (
                        <img
                          src={item.faviconUrl}
                          alt=""
                          className="w-3.5 h-3.5 rounded shrink-0 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic py-1 text-center">
                    No resources saved yet
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAddResource(cat.id);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add link</span>
                </button>

                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
