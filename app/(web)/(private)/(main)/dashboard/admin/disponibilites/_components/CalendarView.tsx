"use client";

import { useState, useEffect } from "react";
import { WeekNavigation } from "./WeekNavigation";
import { WeekDays } from "./WeekDays";
import { DayAvailabilities } from "./DayAvailabilities";
import { CreateSessionPopup } from "./CreateSessionPopup";
import { type AvailabilityWithClient } from "@/src/actions/planning.actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CalendarViewProps {
  availabilities: AvailabilityWithClient[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ availabilities }) => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityWithClient | null>(null);

  // Filtrer les disponibilités pour la date sélectionnée
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const getAvailabilitiesForDate = (date: Date) => {
    return availabilities.filter(availability => {
      const availabilityDate = new Date(availability.startTime);
      return availabilityDate.toDateString() === date.toDateString();
    });
  };

  const handleDateSelect = (date: Date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
    }
  };

  const handleAvailabilityClick = (availability: AvailabilityWithClient) => {
    setSelectedAvailability(availability);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedAvailability(null);
  };

  const selectedDateAvailabilities = getAvailabilitiesForDate(selectedDate);

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
      </div>
      
      <WeekNavigation 
        currentWeek={currentWeek}
        onWeekChange={setCurrentWeek}
      />
      
      <WeekDays
        currentWeek={currentWeek}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        availabilities={availabilities}
      />
      
      <DayAvailabilities
        availabilities={selectedDateAvailabilities}
        selectedDate={selectedDate}
        onAvailabilityClick={handleAvailabilityClick}
      />
      
      <CreateSessionPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        availability={selectedAvailability}
      />
    </div>
  );
};
