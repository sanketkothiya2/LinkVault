'use client';

import React from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { UserProfile } from '@/types';

interface HeroBannerProps {
  user: UserProfile;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ user }) => {
  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#111728] via-[#161D36] to-[#141A30] border border-white/[0.08] p-5 sm:p-7 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Greeting & Motivation */}
      <div className="relative z-10 max-w-xl space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span>Good Morning,</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
            {user.fullName.split(' ')[0]}
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
          Small steps every day lead to big dreams. Keep going! 🚀
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">
            Today is a great day to learn something new.
          </span>
        </div>
      </div>

      {/* Right Visual Artwork & Motivational Quote */}
      <div className="relative z-10 w-full md:w-auto shrink-0">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0E1322] shadow-xl group max-w-md">
          {/* Futuristic Cyberpunk City Artwork */}
          <div className="relative h-28 sm:h-32 w-full md:w-80">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80"
              alt="Futuristic Skyline"
              className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-transparent" />

            {/* Quote Overlay matching Screenshot 2 */}
            <div className="absolute inset-0 p-3.5 flex flex-col justify-end">
              <p className="text-[11px] sm:text-xs font-semibold text-white/95 leading-tight drop-shadow-md">
                "{user.quote}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
