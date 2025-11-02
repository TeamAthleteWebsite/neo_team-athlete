"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeekNavigationProps {
  currentWeek: Date;
  onWeekChange: (newWeek: Date) => void;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeek,
  onWeekChange
}) => {
  const getStartOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setHours(0, 0, 0, 0);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + daysToMonday);
    return startOfWeek;
  };

  const canGoToPreviousWeek = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfCurrentWeekCalendar = getStartOfWeek(currentWeek);
    const startOfTodayWeek = getStartOfWeek(today);
    
    // Si on est dans une semaine future, on peut toujours revenir (au moins jusqu'à la semaine actuelle)
    if (startOfCurrentWeekCalendar > startOfTodayWeek) {
      return true;
    }
    
    // Sinon, on peut revenir uniquement si la semaine précédente n'est pas dans le passé
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    const startOfNewWeek = getStartOfWeek(newWeek);
    
    return startOfNewWeek >= startOfTodayWeek;
  };

  const handlePreviousWeek = () => {
    if (canGoToPreviousWeek()) {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(newWeek.getDate() - 7);
      onWeekChange(newWeek);
    }
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    onWeekChange(newWeek);
  };

  const formatWeekRange = (date: Date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    const formatDate = (d: Date) => {
      return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit"
      });
    };
    
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousWeek}
        disabled={!canGoToPreviousWeek()}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Semaine précédente
      </Button>
      
      <h2 className="text-lg font-semibold text-accent">
        {formatWeekRange(currentWeek)}
      </h2>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextWeek}
        className="flex items-center gap-2"
      >
        Semaine suivante
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
