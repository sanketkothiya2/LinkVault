'use client';

import React, { useState } from 'react';
import { X, Target, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Goal, GoalStatus, GoalMilestone } from '@/types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: Partial<Goal>) => void;
  initialGoal?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  initialGoal,
}) => {
  const [title, setTitle] = useState(initialGoal?.title || '');
  const [description, setDescription] = useState(initialGoal?.description || '');
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || 'Aug 30, 2025');
  const [progress, setProgress] = useState(initialGoal?.progress ?? 0);
  const [status, setStatus] = useState<GoalStatus>(initialGoal?.status || 'in_progress');
  const [imageUrl, setImageUrl] = useState(initialGoal?.imageUrl || '');
  const [milestones, setMilestones] = useState<GoalMilestone[]>(initialGoal?.milestones || []);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const newM: GoalMilestone = {
      id: `m-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      isCompleted: false,
    };
    const updated = [...milestones, newM];
    setMilestones(updated);
    setNewMilestoneTitle('');
    // Recalculate progress if desired
    const completedCount = updated.filter((m) => m.isCompleted).length;
    if (updated.length > 0) {
      setProgress(Math.round((completedCount / updated.length) * 100));
    }
  };

  const handleToggleMilestone = (mId: string) => {
    const updated = milestones.map((m) =>
      m.id === mId ? { ...m, isCompleted: !m.isCompleted } : m
    );
    setMilestones(updated);
    const completedCount = updated.filter((m) => m.isCompleted).length;
    if (updated.length > 0) {
      setProgress(Math.round((completedCount / updated.length) * 100));
    }
  };

  const handleRemoveMilestone = (mId: string) => {
    const updated = milestones.filter((m) => m.id !== mId);
    setMilestones(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveGoal({
      id: initialGoal?.id,
      title: title.trim(),
      description: description.trim(),
      targetDate: targetDate.trim(),
      progress: Number(progress),
      status,
      imageUrl: imageUrl.trim() || undefined,
      milestones,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0F1626] border border-white/[0.1] rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              <p className="text-xs text-slate-400">Track long-term skill acquisition & progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Goal Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Three.js"
              required
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Learn Three.js and build an interactive 3D portfolio"
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Target Date & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Target Date
              </label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="Aug 30, 2025"
                className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="space-y-1.5 bg-[#090D16] p-3 rounded-xl border border-white/[0.06]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Overall Progress</span>
              <span className="font-bold text-indigo-400 font-mono">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Thumbnail Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Cover Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Milestones Checklist */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <label className="text-xs font-semibold text-slate-300 block">
              Milestones ({milestones.filter((m) => m.isCompleted).length}/{milestones.length})
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                placeholder="Add milestone step..."
                className="flex-1 bg-[#090D16] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleMilestone(m.id)}
                    className="flex items-center gap-2 text-left truncate flex-1"
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        m.isCompleted ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'
                      }`}
                    />
                    <span className={m.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {m.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-glow transition-all"
          >
            {initialGoal ? 'Update Goal' : 'Save Goal'}
          </button>
        </div>
      </div>
    </div>
  );
};
