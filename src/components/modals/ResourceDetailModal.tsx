'use client';

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Bookmark,
  Archive,
  Trash2,
  Calendar,
  Eye,
  Check,
  Tag,
  Folder,
  Edit3,
} from 'lucide-react';
import { Resource, Category } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface ResourceDetailModalProps {
  resource: Resource | null;
  onClose: () => void;
  categories: Category[];
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDeleteResource: (id: string) => void;
  onUpdateResource: (id: string, updates: Partial<Resource>) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
  categories,
  onToggleFavorite,
  onToggleArchive,
  onDeleteResource,
  onUpdateResource,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(resource?.personalNotes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!resource) return null;

  const category = categories.find((c) => c.id === resource.categoryId);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(resource.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = () => {
    onUpdateResource(resource.id, { personalNotes: notes });
    setIsEditingNotes(false);
  };

  const handleDelete = () => {
    onDeleteResource(resource.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0F1626] border border-white/[0.1] rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {resource.contentType}
            </span>
            <span className="text-xs text-slate-400 font-mono">{resource.domain}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(resource.id)}
              title="Favorite"
              className={`p-2 rounded-xl transition-colors ${
                resource.isFavorite
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${resource.isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Archive */}
            <button
              onClick={() => onToggleArchive(resource.id)}
              title={resource.isArchived ? 'Restore' : 'Archive'}
              className={`p-2 rounded-xl transition-colors ${
                resource.isArchived
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Archive className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert */}
        {showDeleteConfirm && (
          <div className="my-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between animate-fade-in">
            <span className="text-xs font-semibold text-rose-300">
              Are you sure you want to delete this resource?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 rounded-lg text-xs text-slate-300 hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Large Thumbnail */}
          {resource.thumbnailUrl && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0A0E1A] border border-white/[0.08] shadow-lg">
              <img
                src={resource.thumbnailUrl}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Domain Actions */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {resource.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Open Link */}
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
              >
                <span>Visit Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Copy URL */}
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-medium transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>

              {/* URL Display */}
              <span className="text-xs text-slate-400 font-mono truncate max-w-sm ml-2">
                {resource.url}
              </span>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Category</span>
              <select
                value={resource.categoryId || ''}
                onChange={(e) => onUpdateResource(resource.id, { categoryId: e.target.value || undefined })}
                className="bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Date Added</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {formatRelativeTime(resource.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Views Tracked</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                {resource.viewCount} views
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Last Opened</span>
              <span className="font-semibold text-white truncate">
                {resource.lastOpenedAt ? formatRelativeTime(resource.lastOpenedAt) : 'Never'}
              </span>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Summary & Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A0E1A]/60 p-3.5 rounded-xl border border-white/[0.06]">
                {resource.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal Notes
              </h3>
              {!isEditingNotes && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Notes</span>
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your personal notes, takeaways, or code snippets..."
                  className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#0A0E1A]/60 border border-white/[0.06] text-xs text-slate-300 leading-relaxed min-h-[50px]">
                {resource.personalNotes || (
                  <span className="italic text-slate-500">
                    No personal notes added yet. Click edit to add notes.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
