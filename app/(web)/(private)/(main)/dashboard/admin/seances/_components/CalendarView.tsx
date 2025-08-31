"use client";

import { useState, useEffect } from "react";
import { WeekNavigation } from "./WeekNavigation";
import { WeekDays } from "./WeekDays";
import { DaySessions } from "./DaySessions";
import { type PlanningWithClient } from "@/src/actions/planning.actions";

interface CalendarViewProps {
  sessions: PlanningWithClient[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ sessions }) => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

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

  const selectedDateSessions = getSessionsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <WeekNavigation 
        currentWeek={currentWeek}
        onWeekChange={setCurrentWeek}
      />
      
      <WeekDays
        currentWeek={currentWeek}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        sessions={sessions}
      />
      
      <DaySessions
        sessions={selectedDateSessions}
        selectedDate={selectedDate}
      />
    </div>
  );
};
