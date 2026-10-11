'use client';

import React, { useState } from 'react';
import { X, Link as LinkIcon, Loader2, Sparkles, Globe, Tag, Folder } from 'lucide-react';
import { Category, Resource, ContentType, ExtractedMetadata } from '@/types';
import { isValidUrl, normalizeUrl } from '@/lib/utils';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (resource: Partial<Resource>) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSave,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [contentType, setContentType] = useState<ContentType>('website');
  const [categoryId, setCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [personalNotes, setPersonalNotes] = useState('');
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFetchMetadata = async () => {
    if (!url.trim() || !isValidUrl(url)) {
      setErrorMsg('Please enter a valid URL first (e.g. https://example.com)');
      return;
    }

    setIsLoadingMeta(true);
    setErrorMsg('');
    try {
      const clean = normalizeUrl(url);
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(clean)}`);
      if (!res.ok) throw new Error('Could not automatically retrieve metadata');
      const data: ExtractedMetadata = await res.json();

      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
      if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
      if (data.contentType) setContentType(data.contentType);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract metadata');
    } finally {
      setIsLoadingMeta(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg('URL is required');
      return;
    }

    const cleanUrl = normalizeUrl(url);
    const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');

    onSave({
      url: cleanUrl,
      domain,
      title: title.trim() || domain,
      description: description.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      faviconUrl: faviconUrl.trim() || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      contentType,
      categoryId: categoryId || undefined,
      tags,
      personalNotes: personalNotes.trim(),
      isFavorite: false,
      isReadLater: false,
      isArchived: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0F1626] border border-white/[0.1] rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Save New Resource</h2>
              <p className="text-xs text-slate-400">Extracts Open Graph metadata & organizes automatically</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* URL Input & Extract Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Website URL *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => {
                  if (url && !title) handleFetchMetadata();
                }}
                placeholder="https://yarrlist.net/movies-and-tv-shows"
                required
                className="flex-1 bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleFetchMetadata}
                disabled={isLoadingMeta}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {isLoadingMeta ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Auto-Fetch</span>
              </button>
            </div>
            {errorMsg && <p className="text-[11px] text-rose-400">{errorMsg}</p>}
          </div>

          {/* Live Preview Card */}
          {(thumbnailUrl || title) && (
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex gap-3 items-center">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="w-20 h-14 rounded-xl object-cover shrink-0 bg-[#090D16]"
                />
              ) : (
                <div className="w-20 h-14 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Live Preview
                </span>
                <p className="text-xs font-bold text-white truncate">{title || 'Resource Title'}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{description || 'No description'}</p>
              </div>
            </div>
          )}

          {/* Title & Content Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resource title"
                className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="website">Website</option>
                <option value="youtube">YouTube</option>
                <option value="tutorial">Tutorial</option>
                <option value="inspiration">Inspiration</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="ai_tools">AI Tools</option>
                <option value="video">Video</option>
                <option value="article">Article</option>
              </select>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-slate-400" /> Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="">Select a category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Tags (Press Enter)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="e.g. 3D, Shaders, React"
                className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Tags List */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meta description from website..."
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Personal Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Personal Notes</label>
            <textarea
              rows={2}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Why did you save this? Important timestamps, code snippets, takeaways..."
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Custom Thumbnail URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Thumbnail Image URL</label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://... (auto-populated by scraper)"
              className="w-full bg-[#090D16] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow transition-all"
          >
            Save Resource
          </button>
        </div>
      </div>
    </div>
  );
};
