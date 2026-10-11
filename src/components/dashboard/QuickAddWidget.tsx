'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, Loader2, Sparkles, Check, Globe } from 'lucide-react';
import { Resource, ContentType, ExtractedMetadata } from '@/types';
import { isValidUrl, normalizeUrl } from '@/lib/utils';

interface QuickAddWidgetProps {
  onSaveResource: (resource: Partial<Resource>) => void;
}

export const QuickAddWidget: React.FC<QuickAddWidgetProps> = ({ onSaveResource }) => {
  const [url, setUrl] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'more'>('website');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<ExtractedMetadata | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchMetadata = async (inputUrl: string) => {
    if (!isValidUrl(inputUrl)) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const clean = normalizeUrl(inputUrl);
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        setPreview(data);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (isValidUrl(val)) {
      fetchMetadata(val);
    } else {
      setPreview(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      setErrorMsg('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      let meta = preview;
      if (!meta) {
        const clean = normalizeUrl(url);
        const res = await fetch(`/api/metadata?url=${encodeURIComponent(clean)}`);
        if (res.ok) {
          meta = await res.json();
        }
      }

      const domain = meta?.domain || url.replace(/^https?:\/\//, '').split('/')[0];
      const title = meta?.title || domain;
      const finalType =
        selectedType !== 'more'
          ? (selectedType as ContentType)
          : meta?.contentType || 'website';

      onSaveResource({
        url: normalizeUrl(url),
        domain,
        title,
        description: meta?.description || `Saved link from ${domain}`,
        thumbnailUrl: meta?.thumbnailUrl || '',
        faviconUrl: meta?.faviconUrl || '',
        contentType: finalType,
        isFavorite: false,
        isReadLater: false,
        isArchived: false,
        tags: [finalType],
      });

      setUrl('');
      setPreview(null);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-white/[0.08] shadow-glass space-y-3.5">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Quick Add Resource</h3>
        </div>
        {isSuccess && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium animate-fade-in">
            <Check className="w-3 h-3" /> Saved!
          </span>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSave} className="space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Paste URL here..."
            className="w-full bg-[#0B0F19] text-xs text-white placeholder-slate-400 rounded-xl pl-3.5 pr-20 py-2.5 border border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
          </button>
        </div>

        {errorMsg && <p className="text-[11px] text-rose-400">{errorMsg}</p>}

        {/* Live Preview Card if URL recognized */}
        {preview && (
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5 animate-fade-in">
            {preview.thumbnailUrl ? (
              <img
                src={preview.thumbnailUrl}
                alt={preview.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
            )}
            <div className="overflow-hidden text-left flex-1">
              <p className="text-xs font-semibold text-white truncate">{preview.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{preview.domain}</p>
            </div>
          </div>
        )}

        {/* Content Type Quick Filter Pills */}
        <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedType('youtube')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedType === 'youtube'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            @ YouTube
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('website')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedType === 'website'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Website
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('article')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedType === 'article'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Article
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('more')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedType === 'more'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            More
          </button>
        </div>
      </form>
    </div>
  );
};
