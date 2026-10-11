'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  Bookmark,
  ExternalLink,
  Archive,
  Trash2,
  Tag,
  Folder,
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

  return (
    <div className="space-y-5">
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0F1626] border border-white/[0.08]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, domain, tag..."
            className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#090D16] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Content Types</option>
            <option value="youtube">YouTube</option>
            <option value="website">Website</option>
            <option value="tutorial">Tutorial</option>
            <option value="inspiration">Inspiration</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="ai_tools">AI Tools</option>
            <option value="article">Article</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#090D16] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="newest">Recently Added</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="views">Most Viewed</option>
          </select>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-[#090D16] border border-white/[0.08] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
          >
            <Plus className="w-3.5 h-3.5" /> Add Resource Now
          </button>
        </div>
      )}

      {/* Grid Layout */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((res) => (
            <div
              key={res.id}
              onClick={() => onSelectResource(res)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
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
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-black/40 text-slate-200 border border-white/20">
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
                    {categories.find((c) => c.id === res.categoryId) && (
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: categories.find((c) => c.id === res.categoryId)?.color }}
                      />
                    )}
                    <span className="truncate">
                      {categories.find((c) => c.id === res.categoryId)?.name || res.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(res.url, '_blank', 'noopener,noreferrer');
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => onToggleFavorite(res.id, e)}
                      className={`p-1 rounded transition-colors ${
                        res.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${res.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List Layout */}
      {viewMode === 'list' && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((res) => (
            <div
              key={res.id}
              onClick={() => onSelectResource(res)}
              className="glass-card p-3 rounded-2xl flex items-center justify-between gap-4 cursor-pointer group hover:border-indigo-500/50"
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
                    <span>{categories.find((c) => c.id === res.categoryId)?.name || res.contentType}</span>
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => onToggleFavorite(res.id, e)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    res.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${res.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
