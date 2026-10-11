'use client';

import React from 'react';
import { ArrowRight, Check, Plus, Clock } from 'lucide-react';
import { Task, Priority } from '@/types';
import confetti from 'canvas-confetti';

interface TodayTasksWidgetProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onViewAll: () => void;
}

const priorityBadge: Record<Priority, { label: string; style: string }> = {
  urgent: { label: 'Urgent', style: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  high: { label: 'High', style: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  medium: { label: 'Medium', style: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  low: { label: 'Low', style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
};

export const TodayTasksWidget: React.FC<TodayTasksWidgetProps> = ({
  tasks,
  onToggleTask,
  onOpenNewTaskModal,
  onViewAll,
}) => {
  const displayTasks = tasks.slice(0, 5);

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleTask(id);
    if (!currentlyCompleted) {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366F1', '#A855F7', '#EC4899', '#10B981'],
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-glass space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Today's Tasks</h3>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {displayTasks.map((task) => {
          const isDone = task.status === 'completed';
          const pInfo = priorityBadge[task.priority] || priorityBadge.medium;

          return (
            <div
              key={task.id}
              onClick={() => handleToggle(task.id, isDone)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                isDone
                  ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                  : 'bg-[#0E1424]/70 border-white/[0.06] hover:border-indigo-500/40 hover:bg-[#11192E]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Custom Checkbox */}
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-500 group-hover:border-indigo-400'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-xs font-medium text-white truncate transition-all ${
                      isDone ? 'line-through text-slate-500' : 'group-hover:text-indigo-200'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${pInfo.style}`}
                    >
                      {pInfo.label}
                    </span>
                    {task.dueTime && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        Today: {task.dueTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action circle dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Quick Add Task Button */}
      <button
        onClick={onOpenNewTaskModal}
        className="w-full py-2 rounded-xl border border-dashed border-white/10 hover:border-indigo-500/50 text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5 text-indigo-400" />
        <span>Add New Task</span>
      </button>
    </div>
  );
};
