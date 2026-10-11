'use client';

import React, { useState } from 'react';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Resource, Category } from '@/types';
import { storage } from '@/lib/storage';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  onDataImported: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  resources,
  onDataImported,
}) => {
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle HTML Bookmark file import
  const handleHtmlBookmarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        // Parse standard Netscape Bookmark HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const links = doc.querySelectorAll('a');

        let importedCount = 0;
        let skippedCount = 0;
        const currentResources = storage.getResources();
        const existingUrls = new Set(currentResources.map((r) => r.url.toLowerCase()));

        links.forEach((a) => {
          const href = a.getAttribute('href');
          const title = a.textContent || '';
          if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
            if (existingUrls.has(href.toLowerCase())) {
              skippedCount++;
            } else {
              existingUrls.add(href.toLowerCase());
              let domain = href;
              try {
                domain = new URL(href).hostname.replace(/^www\./, '');
              } catch {}

              storage.addResource({
                url: href,
                domain,
                title: title.trim() || domain,
                description: `Imported from bookmark file`,
                contentType: 'website',
                isFavorite: false,
                isReadLater: false,
                isArchived: false,
                tags: ['Imported'],
              });
              importedCount++;
            }
          }
        });

        setImportSummary(`Successfully imported ${importedCount} bookmarks (${skippedCount} duplicates skipped).`);
        onDataImported();
      } catch (err: any) {
        setErrorMsg(`Failed to parse bookmarks: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Handle JSON backup import
  const handleJsonBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storage.importData(content);
      if (res.success) {
        setImportSummary(`Successfully restored ${res.count} resources from backup!`);
        onDataImported();
      } else {
        setErrorMsg(`Import failed: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  // Export to JSON
  const handleExportJson = () => {
    const dataStr = storage.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkvault-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to CSV
  const handleExportCsv = async () => {
    const headers = ['id', 'title', 'url', 'domain', 'contentType', 'isFavorite', 'createdAt'];
    const rows = resources.map((r) =>
      headers
        .map((h) => {
          const val = (r as any)[h] !== undefined ? String((r as any)[h]).replace(/"/g, '""') : '';
          return `"${val}"`;
        })
        .join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkvault-resources-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0F1626] border border-white/[0.1] rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import & Export Data</h2>
              <p className="text-xs text-slate-400">Migrate your bookmarks and create backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status notification */}
        {importSummary && (
          <div className="my-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{importSummary}</span>
          </div>
        )}
        {errorMsg && (
          <div className="my-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="py-4 space-y-5">
          {/* Section: Import */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Import Bookmarks
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* HTML Browser Export */}
              <label className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/50 cursor-pointer flex flex-col items-center justify-center text-center transition-all group">
                <Upload className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-semibold text-white">Browser HTML Export</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Chrome, Safari, Firefox</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleHtmlBookmarkUpload}
                  className="hidden"
                />
              </label>

              {/* JSON Backup */}
              <label className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/50 cursor-pointer flex flex-col items-center justify-center text-center transition-all group">
                <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-semibold text-white">JSON Backup File</span>
                <span className="text-[10px] text-slate-400 mt-0.5">LinkVault full backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJsonBackupUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Section: Export */}
          <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Export Library
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="p-3.5 rounded-2xl bg-[#090D16] border border-white/[0.08] hover:border-indigo-500/40 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Export to JSON</p>
                  <p className="text-[10px] text-slate-400">Full backup including tasks & goals</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="p-3.5 rounded-2xl bg-[#090D16] border border-white/[0.08] hover:border-indigo-500/40 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Export to CSV</p>
                  <p className="text-[10px] text-slate-400">Spreadsheet table of resources</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
