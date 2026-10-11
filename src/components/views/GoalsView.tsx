'use client';

import React from 'react';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Link2,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { Goal, Resource, Task } from '@/types';
import confetti from 'canvas-confetti';

interface GoalsViewProps {
  goals: Goal[];
  resources: Resource[];
  tasks: Task[];
  onOpenGoalModal: (goal?: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalProgress: (id: string, progress: number) => void;
  onSelectResource: (resource: Resource) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  resources,
  tasks,
  onOpenGoalModal,
  onDeleteGoal,
  onUpdateGoalProgress,
  onSelectResource,
}) => {
  const handleMilestoneToggle = (goal: Goal, mIndex: number) => {
    if (!goal.milestones) return;
    const updatedMilestones = goal.milestones.map((m, idx) =>
      idx === mIndex ? { ...m, isCompleted: !m.isCompleted } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
    const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

    onUpdateGoalProgress(goal.id, newProgress);

    if (newProgress === 100) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06B6D4', '#6366F1', '#EC4899', '#10B981'],
        });
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Goals & Personal Progress</span>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {goals.length} active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect your inspirations to concrete milestone achievements
          </p>
        </div>

        <button
          onClick={() => onOpenGoalModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-glow transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const linkedResources = resources.filter((r) =>
            goal.linkedResourceIds?.includes(r.id)
          );
          const linkedTasks = tasks.filter((t) => t.goalId === goal.id);

          return (
            <div
              key={goal.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-white/[0.08] hover:border-cyan-500/40 space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Visual Banner */}
                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-[#0A0E1A] border border-white/[0.08]">
                  {goal.imageUrl ? (
                    <img
                      src={goal.imageUrl}
                      alt={goal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cyan-900/20 text-cyan-400">
                      <Target className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent" />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    <button
                      onClick={() => onOpenGoalModal(goal)}
                      className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-slate-300 hover:text-white"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-slate-300 hover:text-rose-400"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {goal.title}
                    </h3>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {goal.progress}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      Target: {goal.targetDate}
                    </span>
                    <span className="capitalize">{goal.status.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Milestones Checklist */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Milestones ({goal.milestones.filter((m) => m.isCompleted).length}/
                      {goal.milestones.length})
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {goal.milestones.map((m, idx) => (
                        <div
                          key={m.id}
                          onClick={() => handleMilestoneToggle(goal, idx)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer text-xs"
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              m.isCompleted ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'
                            }`}
                          />
                          <span
                            className={`truncate ${
                              m.isCompleted ? 'line-through text-slate-500' : 'text-slate-300'
                            }`}
                          >
                            {m.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Linked Resources Preview */}
              {linkedResources.length > 0 && (
                <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-indigo-400" />
                    Linked Resources ({linkedResources.length})
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {linkedResources.map((res) => (
                      <div
                        key={res.id}
                        onClick={() => onSelectResource(res)}
                        className="p-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer shrink-0 flex items-center gap-1.5 text-[11px] text-slate-300 max-w-[120px] truncate"
                      >
                        {res.thumbnailUrl ? (
                          <img
                            src={res.thumbnailUrl}
                            alt=""
                            className="w-4 h-4 rounded object-cover"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded bg-indigo-500/20" />
                        )}
                        <span className="truncate">{res.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
