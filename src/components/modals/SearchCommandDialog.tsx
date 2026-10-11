'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Link2, CheckSquare, Target, Folder, ExternalLink } from 'lucide-react';
import { Resource, Task, Goal, Category } from '@/types';

interface SearchCommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  tasks: Task[];
  goals: Goal[];
  categories: Category[];
  onSelectResource: (r: Resource) => void;
  onSelectGoal: (g: Goal) => void;
  onSelectCategory: (catSlug: string) => void;
}

export const SearchCommandDialog: React.FC<SearchCommandDialogProps> = ({
  isOpen,
  onClose,
  resources,
  tasks,
  goals,
  categories,
  onSelectResource,
  onSelectGoal,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredResources = q
    ? resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.domain.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
      )
    : resources.slice(0, 4);

  const filteredTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q))
    : tasks.slice(0, 3);

  const filteredGoals = q
    ? goals.filter((g) => g.title.toLowerCase().includes(q))
    : goals.slice(0, 2);

  const filteredCategories = q
    ? categories.filter((c) => c.name.toLowerCase().includes(q))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0F1626] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3 bg-[#111828]">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search anything..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Resources */}
          {filteredResources.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Resources ({filteredResources.length})
              </span>
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    onSelectResource(res);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Link2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-300 truncate">
                        {res.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{res.domain}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.04]">
                    {res.contentType}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Tasks ({filteredTasks.length})
              </span>
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-6 h-6 rounded-md bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-white truncate">{t.title}</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono capitalize">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Goals */}
          {filteredGoals.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Goals ({filteredGoals.length})
              </span>
              {filteredGoals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => {
                    onSelectGoal(g);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-6 h-6 rounded-md bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-white truncate">{g.title}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold">{g.progress}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {filteredCategories.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Categories
              </span>
              {filteredCategories.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCategory(c.slug);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-xs font-medium text-white">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{c.itemCount || 0} items</span>
                </div>
              ))}
            </div>
          )}

          {filteredResources.length === 0 &&
            filteredTasks.length === 0 &&
            filteredGoals.length === 0 &&
            filteredCategories.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching results found for "{query}".
              </div>
            )}
        </div>

        {/* Footer Shortcut hint */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#0A0E1A] flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or shortcuts</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
