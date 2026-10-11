'use client';

import React from 'react';
import { ArrowRight, Plus, Folder } from 'lucide-react';
import { Category } from '@/types';

interface RecentlyViewedCarouselProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onOpenNewCategory: () => void;
  onViewAll: () => void;
}

export const RecentlyViewedCarousel: React.FC<RecentlyViewedCarouselProps> = ({
  categories,
  onSelectCategory,
  onOpenNewCategory,
  onViewAll,
}) => {
  const popularCategories = categories.slice(0, 5);

  const categoryImages: Record<string, string> = {
    'animation-motion': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
    '3d-websites': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&auto=format&fit=crop&q=80',
    'ui-ux-design': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop&q=80',
    'web-design-inspiration': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    'frontend-development': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
  };

  return (
    <div className="space-y-3.5 pt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Recently Viewed
        </h2>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {popularCategories.map((cat) => {
          const imgUrl =
            categoryImages[cat.slug] ||
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="glass-card rounded-xl p-3 cursor-pointer group flex flex-col justify-between overflow-hidden relative"
            >
              {/* Category Graphic / Image Thumbnail */}
              <div className="relative h-16 w-full rounded-lg overflow-hidden mb-2.5 bg-[#090D16]">
                <img
                  src={imgUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent" />
                <div
                  className="absolute top-2 left-2 w-5 h-5 rounded-md flex items-center justify-center shadow"
                  style={{ backgroundColor: `${cat.color}33`, color: cat.color }}
                >
                  <Folder className="w-3 h-3" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  {cat.itemCount || 0} items
                </p>
              </div>
            </div>
          );
        })}

        {/* Add Collection card */}
        <div
          onClick={onOpenNewCategory}
          className="rounded-xl border border-dashed border-white/15 hover:border-indigo-500/60 p-3 cursor-pointer group flex flex-col items-center justify-center text-center transition-all bg-white/[0.01] hover:bg-indigo-600/[0.05]"
        >
          <div className="w-9 h-9 rounded-full bg-white/[0.05] group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 flex items-center justify-center mb-2 transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
            + Collection
          </span>
          <span className="text-[10px] text-slate-400">Create new</span>
        </div>
      </div>
    </div>
  );
};
