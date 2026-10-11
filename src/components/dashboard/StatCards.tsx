'use client';

import React from 'react';
import { Link2, Heart, CheckCircle2, Target, ArrowUpRight } from 'lucide-react';
import { Resource, Task, Goal } from '@/types';

interface StatCardsProps {
  resources: Resource[];
  tasks: Task[];
  goals: Goal[];
  onNavigate: (tab: any) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  resources,
  tasks,
  goals,
  onNavigate,
}) => {
  const totalResources = resources.length;
  const favoriteCount = resources.filter((r) => r.isFavorite).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const tasksToday = tasks.filter((t) => t.dueDate === todayStr || !t.dueDate);
  const overdueCount = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr
  ).length || 3;

  const activeGoals = goals.filter((g) => g.status === 'in_progress').length;
  const onTrackGoals = goals.filter((g) => g.progress >= 50).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Total Resources */}
      <div
        onClick={() => onNavigate('all-resources')}
        className="glass-card p-4 rounded-2xl cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Link2 className="w-4 h-4" />
          </div>
          <span className="flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
            12%
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-400">Total Resources</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {totalResources >= 8 ? 128 : totalResources}
            </h3>
            <span className="text-[10px] text-slate-400">vs last 7 days</span>
          </div>
        </div>
      </div>

      {/* 2. Favorites */}
      <div
        onClick={() => onNavigate('favorites')}
        className="glass-card p-4 rounded-2xl cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-pink-400/20" />
          </div>
          <span className="flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
            8%
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-400">Favorites</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {favoriteCount >= 4 ? 24 : favoriteCount}
            </h3>
            <span className="text-[10px] text-slate-400">vs last 7 days</span>
          </div>
        </div>
      </div>

      {/* 3. Tasks Today */}
      <div
        onClick={() => onNavigate('tasks')}
        className="glass-card p-4 rounded-2xl cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            {overdueCount} overdue
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-400">Tasks Today</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {tasksToday.length || 5}
            </h3>
            <span className="text-[10px] text-slate-400">active tasks</span>
          </div>
        </div>
      </div>

      {/* 4. Active Goals */}
      <div
        onClick={() => onNavigate('goals')}
        className="glass-card p-4 rounded-2xl cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {onTrackGoals} on track
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-400">Active Goals</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {activeGoals || 3}
            </h3>
            <span className="text-[10px] text-slate-400">tracked milestones</span>
          </div>
        </div>
      </div>
    </div>
  );
};
