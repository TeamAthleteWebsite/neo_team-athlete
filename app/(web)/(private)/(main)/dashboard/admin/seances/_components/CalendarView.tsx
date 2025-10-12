"use client";

import { useState } from "react";
import { WeekNavigation } from "./WeekNavigation";
import { WeekDays } from "./WeekDays";
import { TimeSlotCalendar } from "./TimeSlotCalendar";
import { WeekViewCalendar } from "./WeekViewCalendar";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { ArrowLeft, CalendarClock, Calendar, CalendarDays } from "lucide-react";
import Link from "next/link";

interface CalendarViewProps {
  sessions: PlanningWithClient[];
}

type ViewMode = "day" | "week";

export const CalendarView: React.FC<CalendarViewProps> = ({ sessions }) => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<ViewMode>("day");

  // Filtrer les séances pour la date sélectionnée
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const handleDateSelect = (date: Date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    // Ne pas réinitialiser la date sélectionnée lors du changement de vue
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Link 
          href="/dashboard/admin"
          className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Toggle de vue */}
          <div className="flex items-center space-x-2 bg-black/30 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange("day")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === "day"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Jour</span>
            </button>
            <button
              onClick={() => handleViewModeChange("week")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === "week"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm">Semaine</span>
            </button>
          </div>
          
          <Link 
            href="/dashboard/admin/disponibilites"
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <CalendarClock className="w-8 h-8" />
            <span className="text-sm">Disponibilités</span>
          </Link>
        </div>
      </div>
      
      <WeekNavigation 
        currentWeek={currentWeek}
        onWeekChange={setCurrentWeek}
      />
      
      {viewMode === "day" ? (
        <>
          <WeekDays
            currentWeek={currentWeek}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            sessions={sessions}
          />
          
          <TimeSlotCalendar
            sessions={selectedDateSessions}
            selectedDate={selectedDate}
          />
        </>
      ) : (
        <WeekViewCalendar
          currentWeek={currentWeek}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          sessions={sessions}
        />
      )}
    </div>
  );
};
