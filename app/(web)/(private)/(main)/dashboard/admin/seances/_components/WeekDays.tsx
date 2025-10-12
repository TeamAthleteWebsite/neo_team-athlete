"use client";

import { type PlanningWithClient } from "@/src/actions/planning.actions";

interface WeekDaysProps {
  currentWeek: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  sessions: PlanningWithClient[];
}

export const WeekDays: React.FC<WeekDaysProps> = ({
  currentWeek,
  selectedDate,
  onDateSelect,
  sessions
}) => {
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + daysToMonday);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { weekday: "short" });
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate().toString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const hasSessions = (date: Date) => {
    return sessions.some(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = getWeekDays(currentWeek);

  return (
    <div className="grid grid-cols-7 gap-2 mb-6">
      {weekDays.map((day, index) => {
        const isPast = isPastDate(day);
        
        return (
          <button
            key={index}
            onClick={() => !isPast && onDateSelect(day)}
            disabled={isPast}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border transition-all opacity-70 bg-black
              ${isPast
                ? 'bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed'
                : isSelected(day) 
                ? 'bg-primary text-primary-foreground border-primary opacity-100' 
                : isToday(day)
                ? 'bg-accent/20 text-accent border-accent/30 opacity-100'
                : hasSessions(day)
                ? 'bg-black text-blue-400 border-gray-600 hover:bg-gray-800 hover:opacity-75'
                : 'bg-black text-white border-gray-600 hover:bg-gray-800 hover:opacity-75'
              }
            `}
          >
            <span className="text-xs font-medium mb-1">
              {formatDayName(day)}
            </span>
            <span className="text-lg font-bold">
              {formatDayNumber(day)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
