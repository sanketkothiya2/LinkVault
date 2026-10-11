'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  Check,
  Folder,
  Target,
} from 'lucide-react';
import { Task, Category, Goal, Priority } from '@/types';
import confetti from 'canvas-confetti';

interface TasksViewProps {
  tasks: Task[];
  categories: Category[];
  goals: Goal[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenTaskModal: (task?: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  categories,
  goals,
  onToggleTask,
  onDeleteTask,
  onOpenTaskModal,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all' | 'completed'>('today');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'today') {
      return t.dueDate === todayStr || !t.dueDate;
    }
    if (activeTab === 'upcoming') {
      return t.dueDate && t.dueDate > todayStr && t.status !== 'completed';
    }
    if (activeTab === 'completed') {
      return t.status === 'completed';
    }
    // 'all' tab shows everything
    return true;
  }).filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const handleToggle = (id: string, isCompleted: boolean) => {
    onToggleTask(id);
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#6366F1', '#10B981', '#F59E0B'],
        });
      } catch {}
    }
  };

  const priorityStyles: Record<Priority, string> = {
    urgent: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Tasks & Daily Priorities</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {filteredTasks.length} tasks
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Stay focused on high-priority goals and daily milestones
          </p>
        </div>

        <button
          onClick={() => onOpenTaskModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-glow transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Tabs and Priority Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#0F1626] border border-white/[0.08]">
        <div className="flex items-center gap-1">
          {(['today', 'upcoming', 'all', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#090D16] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';
          const cat = categories.find((c) => c.id === task.categoryId);
          const goal = goals.find((g) => g.id === task.goalId);

          return (
            <div
              key={task.id}
              className={`glass-card p-3.5 rounded-2xl flex items-center justify-between gap-4 transition-all group ${
                isDone ? 'opacity-50 bg-white/[0.01]' : 'hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <button
                  onClick={() => handleToggle(task.id, isDone)}
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-500 group-hover:border-indigo-400'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <h4
                    className={`text-xs sm:text-sm font-semibold text-white truncate ${
                      isDone ? 'line-through text-slate-500' : 'group-hover:text-indigo-200'
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px]">
                    <span
                      className={`px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider border ${
                        priorityStyles[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>

                    {task.dueTime && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </span>
                    )}

                    {task.dueDate && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                    )}

                    {cat && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {cat.name}
                      </span>
                    )}

                    {goal && (
                      <span className="text-cyan-400 flex items-center gap-1 font-medium">
                        <Target className="w-3 h-3" />
                        {goal.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onOpenTaskModal(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  title="Edit Task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] space-y-2">
            <CheckSquare className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No tasks in this view</h3>
            <p className="text-xs text-slate-400">All caught up or ready to plan ahead!</p>
          </div>
        )}
      </div>
    </div>
  );
};
