'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Bookmark,
  ExternalLink,
  Folder,
  Layers,
  Globe,
  Play,
  GraduationCap,
  Sparkles,
  Palette,
  Code2,
  Bot,
  FileText,
  Video,
  Clock,
  History,
  ArrowDownAZ,
  TrendingUp,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  Box,
  Cpu,
  Type,
  Smile,
  Compass,
  Briefcase,
  Clapperboard,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Resource, Category, ContentType } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface AllResourcesViewProps {
  resources: Resource[];
  categories: Category[];
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  onSelectResource: (resource: Resource) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleArchive: (id: string, e: React.MouseEvent) => void;
  onOpenAddResource: () => void;
  filterMode?: 'all' | 'favorites' | 'read-later' | 'archive' | 'recently-viewed';
}

// Map category slug to an expressive modern Lucide icon
export const getCategoryIconComponent = (slug: string) => {
  switch (slug) {
    case 'animation-motion':
      return Film;
    case '3d-websites':
      return Box;
    case 'ui-ux-design':
      return Palette;
    case 'web-design-inspiration':
      return Globe;
    case 'frontend-development':
      return Code2;
    case 'backend-development':
      return Cpu;
    case 'ai-tools':
      return Bot;
    case 'tutorials-courses':
      return GraduationCap;
    case 'youtube-resources':
      return Play;
    case 'articles-blogs':
      return FileText;
    case 'creative-coding':
      return Sparkles;
    case 'typography-fonts':
      return Type;
    case 'icons-illustrations':
      return Smile;
    case 'portfolio-inspiration':
      return Compass;
    case 'business-productivity':
      return Briefcase;
    case 'movies-entertainment':
      return Clapperboard;
    case 'read-later':
      return Clock;
    default:
      return Folder;
  }
};

const contentTypesList: {
  value: string;
  label: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}[] = [
  { value: 'all', label: 'All Content Types', icon: Layers, color: '#A5B4FC' },
  { value: 'website', label: 'Website', icon: Globe, color: '#38BDF8' },
  { value: 'youtube', label: 'YouTube', icon: Play, color: '#F87171' },
  { value: 'tutorial', label: 'Tutorial', icon: GraduationCap, color: '#FBBF24' },
  { value: 'inspiration', label: 'Inspiration', icon: Sparkles, color: '#C084FC' },
  { value: 'design', label: 'Design', icon: Palette, color: '#F472B6' },
  { value: 'development', label: 'Development', icon: Code2, color: '#60A5FA' },
  { value: 'ai_tools', label: 'AI Tools', icon: Bot, color: '#818CF8' },
  { value: 'article', label: 'Article', icon: FileText, color: '#34D399' },
  { value: 'video', label: 'Video', icon: Video, color: '#FB7185' },
];

const sortOptionsList: {
  value: 'newest' | 'oldest' | 'alphabetical' | 'views';
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { value: 'newest', label: 'Recently Added', icon: Clock },
  { value: 'oldest', label: 'Oldest First', icon: History },
  { value: 'alphabetical', label: 'Alphabetical', icon: ArrowDownAZ },
  { value: 'views', label: 'Most Viewed', icon: TrendingUp },
];

export const AllResourcesView: React.FC<AllResourcesViewProps> = ({
  resources,
  categories,
  selectedCategorySlug,
  onSelectCategory,
  onSelectResource,
  onToggleFavorite,
  onToggleArchive,
  onOpenAddResource,
  filterMode = 'all',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical' | 'views'>('newest');

  // Custom Dropdowns State
  const [isContentTypeOpen, setIsContentTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const contentTypeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const threadsRef = useRef<HTMLDivElement>(null);

  // Close custom dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentTypeRef.current && !contentTypeRef.current.contains(e.target as Node)) {
        setIsContentTypeOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Horizontal scroll buttons helper
  const scrollThreads = (direction: 'left' | 'right') => {
    if (threadsRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      threadsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter pipeline
  let filtered = resources.filter((res) => {
    // Mode filters
    if (filterMode === 'favorites' && !res.isFavorite) return false;
    if (filterMode === 'read-later' && !res.isReadLater) return false;
    if (filterMode === 'archive' && !res.isArchived) return false;
    if (filterMode !== 'archive' && res.isArchived) return false;

    // Category filter
    if (selectedCategorySlug) {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      if (cat && res.categoryId !== cat.id) return false;
    }

    // Type filter
    if (selectedType !== 'all' && res.contentType !== selectedType) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        res.title.toLowerCase().includes(q) ||
        res.domain.toLowerCase().includes(q) ||
        res.description?.toLowerCase().includes(q) ||
        res.tags?.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0);
    return 0;
  });

  const getTitleForMode = () => {
    if (filterMode === 'favorites') return 'Favorites & Pinned';
    if (filterMode === 'read-later') return 'Read Later Queue';
    if (filterMode === 'archive') return 'Archived Resources';
    if (filterMode === 'recently-viewed') return 'Recently Viewed';
    if (selectedCategorySlug) {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      return cat?.name || 'Category Library';
    }
    return 'All Resources';
  };

  const currentTypeConfig = contentTypesList.find((t) => t.value === selectedType) || contentTypesList[0];
  const CurrentTypeIcon = currentTypeConfig.icon;

  const currentSortOption = sortOptionsList.find((s) => s.value === sortBy) || sortOptionsList[0];
  const CurrentSortIcon = currentSortOption.icon;

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{getTitleForMode()}</span>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {filtered.length} items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover, organize, and search through your collected links
          </p>
        </div>

        <button
          onClick={onOpenAddResource}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all shrink-0 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* FAST CATEGORY THREADS BAR (Interactive Horizontal Ribbon with Icons) */}
      <div className="relative group/threads px-0.5">
        <button
          type="button"
          onClick={() => scrollThreads('left')}
          title="Scroll left"
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-[#090D16]/95 border border-white/10 text-slate-300 hover:text-white shadow-xl backdrop-blur-md opacity-0 group-hover/threads:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={threadsRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* "All Categories" Thread */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 select-none ${
              !selectedCategorySlug
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-glow border border-indigo-400/50 scale-[1.02]'
                : 'bg-[#0F1626] text-slate-400 hover:text-white hover:bg-[#151E33] border border-white/[0.08]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>All Categories</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                !selectedCategorySlug
                  ? 'bg-white/20 text-white'
                  : 'bg-white/[0.06] text-slate-400'
              }`}
            >
              {resources.filter((r) => !r.isArchived).length}
            </span>
          </button>

          {/* Dynamic Category Thread Pills */}
          {categories.map((cat) => {
            const isSelected = selectedCategorySlug === cat.slug;
            const Icon = getCategoryIconComponent(cat.slug);
            const count = resources.filter(
              (r) => r.categoryId === cat.id && !r.isArchived
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 select-none active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow border border-indigo-400/60 scale-[1.02]'
                    : 'bg-[#0F1626] text-slate-300 hover:text-white hover:bg-[#151E33] border border-white/[0.08] hover:border-white/[0.15]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: cat.color }}
                />
                <Icon
                  className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: isSelected ? '#FFFFFF' : cat.color }}
                />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white/[0.06] text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollThreads('right')}
          title="Scroll right"
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-[#090D16]/95 border border-white/10 text-slate-300 hover:text-white shadow-xl backdrop-blur-md opacity-0 group-hover/threads:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FILTER & CONTROL BAR (Replaces native <select> with Animated Custom Dropdowns) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0F1626] border border-white/[0.08] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, domain, tags..."
            className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Controls: Custom Animated Dropdowns & Grid/List View Toggle */}
        <div className="flex items-center gap-2">
          {/* CUSTOM CONTENT TYPE DROPDOWN (Replaces native select) */}
          <div className="relative" ref={contentTypeRef}>
            <button
              type="button"
              onClick={() => {
                setIsContentTypeOpen(!isContentTypeOpen);
                setIsSortOpen(false);
              }}
              className="flex items-center gap-2 bg-[#090D16] hover:bg-[#12182A] border border-white/[0.08] hover:border-indigo-500/40 rounded-xl px-3 py-2 text-xs text-white transition-all shadow-sm group select-none"
            >
              <CurrentTypeIcon
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: currentTypeConfig.color }}
              />
              <span className="font-medium truncate max-w-[130px]">
                {currentTypeConfig.label}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${
                  isContentTypeOpen ? 'rotate-180 text-indigo-400' : ''
                }`}
              />
            </button>

            {isContentTypeOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0F1626]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-2xl p-1.5 z-50 text-xs animate-fade-in space-y-0.5">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1 flex items-center justify-between">
                  <span>Content Type</span>
                  <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                </div>
                {contentTypesList.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.value;
                  const count =
                    type.value === 'all'
                      ? resources.filter((r) => !r.isArchived).length
                      : resources.filter(
                          (r) => r.contentType === type.value && !r.isArchived
                        ).length;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setSelectedType(type.value);
                        setIsContentTypeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors rounded-xl ${
                        isSelected
                          ? 'bg-indigo-600/25 text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: type.color }} />
                        <span className="truncate">{type.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">{count}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CUSTOM SORT BY DROPDOWN (Replaces native select) */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsContentTypeOpen(false);
              }}
              className="flex items-center gap-2 bg-[#090D16] hover:bg-[#12182A] border border-white/[0.08] hover:border-indigo-500/40 rounded-xl px-3 py-2 text-xs text-white transition-all shadow-sm group select-none"
            >
              <CurrentSortIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-medium truncate max-w-[120px]">
                {currentSortOption.label}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${
                  isSortOpen ? 'rotate-180 text-indigo-400' : ''
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0F1626]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-2xl p-1.5 z-50 text-xs animate-fade-in space-y-0.5">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
                  Sort Order
                </div>
                {sortOptionsList.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors rounded-xl ${
                        isSelected
                          ? 'bg-indigo-600/25 text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-[#090D16] border border-white/[0.08] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] space-y-3">
          <Folder className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No resources found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or adding a new link to your library.
          </p>
          <button
            onClick={onOpenAddResource}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Resource Now
          </button>
        </div>
      )}

      {/* Grid Layout */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((res) => {
            const resCat = categories.find((c) => c.id === res.categoryId);
            const CatIcon = resCat ? getCategoryIconComponent(resCat.slug) : Folder;

            return (
              <div
                key={res.id}
                onClick={() => onSelectResource(res)}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-glow transition-all duration-300"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#0A0E1A]">
                  {res.thumbnailUrl ? (
                    <img
                      src={res.thumbnailUrl}
                      alt={res.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#121A2E] to-[#1E163B]">
                      <span className="text-xs font-medium text-slate-300">{res.domain}</span>
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-black/50 text-slate-200 border border-white/20">
                      {res.contentType}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                      {resCat ? (
                        <>
                          <CatIcon
                            className="w-3 h-3 shrink-0"
                            style={{ color: resCat.color }}
                          />
                          <span className="truncate">{resCat.name}</span>
                        </>
                      ) : (
                        <span className="truncate">{res.domain}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(res.url, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                        title="Open external link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => onToggleFavorite(res.id, e)}
                        className={`p-1 rounded transition-colors ${
                          res.isFavorite
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${res.isFavorite ? 'fill-current' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List Layout */}
      {viewMode === 'list' && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((res) => {
            const resCat = categories.find((c) => c.id === res.categoryId);
            const CatIcon = resCat ? getCategoryIconComponent(resCat.slug) : Folder;

            return (
              <div
                key={res.id}
                onClick={() => onSelectResource(res)}
                className="glass-card p-3 rounded-2xl flex items-center justify-between gap-4 cursor-pointer group hover:border-indigo-500/50 hover:shadow-glow transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {res.thumbnailUrl ? (
                    <img
                      src={res.thumbnailUrl}
                      alt={res.title}
                      className="w-14 h-10 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Folder className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 truncate">
                      {res.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{res.domain}</span>
                      <span>•</span>
                      {resCat && (
                        <>
                          <span className="flex items-center gap-1">
                            <CatIcon className="w-3 h-3" style={{ color: resCat.color }} />
                            <span>{resCat.name}</span>
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span className="capitalize">{res.contentType}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(res.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(res.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => onToggleFavorite(res.id, e)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      res.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${res.isFavorite ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
