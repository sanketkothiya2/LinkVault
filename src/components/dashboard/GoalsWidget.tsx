'use client';

import React from 'react';
import { ArrowRight, Target, Calendar, ChevronRight } from 'lucide-react';
import { Goal } from '@/types';

interface GoalsWidgetProps {
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
  onViewAll: () => void;
}

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({
  goals,
  onSelectGoal,
  onViewAll,
}) => {
  const displayGoals = goals.slice(0, 3);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-glass space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Goals</h3>
        </div>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {displayGoals.map((goal) => {
          return (
            <div
              key={goal.id}
              onClick={() => onSelectGoal(goal)}
              className="p-3 rounded-xl bg-[#0E1424]/70 border border-white/[0.06] hover:border-indigo-500/40 hover:bg-[#11192E] transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Visual Thumbnail */}
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#080C14] border border-white/[0.08]">
                  {goal.imageUrl ? (
                    <img
                      src={goal.imageUrl}
                      alt={goal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-400">
                      <Target className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {goal.title}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-indigo-400 shrink-0">
                      {goal.progress}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {goal.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
                    />
                  </div>

                  {/* Target Date */}
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      Target: {goal.targetDate}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
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
