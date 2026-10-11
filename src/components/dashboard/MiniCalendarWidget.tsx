'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface MiniCalendarWidgetProps {
  onSelectDate?: (dateStr: string) => void;
}

export const MiniCalendarWidget: React.FC<MiniCalendarWidgetProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(10); // default 10 matching screenshot 2

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    if (onSelectDate) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onSelectDate(dateStr);
    }
  };

  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(<div key={`empty-${i}`} className="h-6 w-6" />);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = d === selectedDay;
    const hasDot = [3, 7, 10, 14, 18, 22].includes(d);

    days.push(
      <button
        key={`day-${d}`}
        onClick={() => handleDayClick(d)}
        className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-all relative mx-auto ${
          isSelected
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-glow scale-110'
            : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
        }`}
      >
        <span>{d}</span>
        {hasDot && !isSelected && (
          <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-400" />
        )}
      </button>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-glass space-y-3">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {monthNames[month]} {year}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">{days}</div>
    </div>
  );
};
