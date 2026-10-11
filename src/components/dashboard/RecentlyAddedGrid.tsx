'use client';

import React from 'react';
import { Play, Bookmark, ExternalLink, ArrowRight } from 'lucide-react';
import { Resource, ContentType } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface RecentlyAddedGridProps {
  resources: Resource[];
  onSelectResource: (resource: Resource) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onViewAll: () => void;
}

const tagColorMap: Record<ContentType, { bg: string; text: string; label: string }> = {
  youtube: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'text-red-400', label: 'YouTube' },
  video: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'text-red-400', label: 'Video' },
  website: { bg: 'bg-sky-500/20 text-sky-400 border-sky-500/30', text: 'text-sky-400', label: 'Website' },
  tutorial: { bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', text: 'text-cyan-400', label: 'Tutorial' },
  inspiration: { bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30', text: 'text-purple-400', label: 'Inspiration' },
  design: { bg: 'bg-orange-500/20 text-orange-400 border-orange-500/30', text: 'text-orange-400', label: 'Design' },
  development: { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'text-blue-400', label: 'Development' },
  ai_tools: { bg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', text: 'text-indigo-400', label: 'AI Tools' },
  article: { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', text: 'text-emerald-400', label: 'Article' },
};

export const RecentlyAddedGrid: React.FC<RecentlyAddedGridProps> = ({
  resources,
  onSelectResource,
  onToggleFavorite,
  onViewAll,
}) => {
  const displayItems = resources.slice(0, 8);

  return (
    <div className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Recently Added
        </h2>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {displayItems.map((res) => {
          const tagInfo = tagColorMap[res.contentType] || tagColorMap.website;
          const isVideo = res.contentType === 'youtube' || res.contentType === 'video' || res.contentType === 'tutorial';

          return (
            <div
              key={res.id}
              onClick={() => onSelectResource(res)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#0A0E1A]">
                {res.thumbnailUrl ? (
                  <img
                    src={res.thumbnailUrl}
                    alt={res.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#121A2E] to-[#1E163B]">
                    <img
                      src={res.faviconUrl || `https://www.google.com/s2/favicons?domain=${res.domain}&sz=64`}
                      alt={res.domain}
                      className="w-8 h-8 mb-2 rounded"
                    />
                    <span className="text-xs font-medium text-slate-300">{res.domain}</span>
                  </div>
                )}

                {/* Video Play Overlay */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600/90 transition-all shadow-lg">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Content Type Pill */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border shadow-sm ${tagInfo.bg}`}
                  >
                    {tagInfo.label}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {res.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                    <span className="truncate max-w-[120px]">{res.domain}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(res.createdAt)}</span>
                  </div>
                </div>

                {/* Card Footer: Domain & Action Bookmark */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-300 truncate">
                    {res.tags?.[0] ? `#${res.tags[0]}` : res.domain}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(res.url, '_blank', 'noopener,noreferrer');
                      }}
                      title="Open Link"
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => onToggleFavorite(res.id, e)}
                      title={res.isFavorite ? 'Remove Favorite' : 'Save Favorite'}
                      className={`p-1 rounded-md transition-colors ${
                        res.isFavorite
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${res.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
