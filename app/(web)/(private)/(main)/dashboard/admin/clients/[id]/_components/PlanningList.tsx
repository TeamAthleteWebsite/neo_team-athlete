"use client";

import { type PlanningWithContract } from "@/src/actions/planning.actions";

// Définition locale de PlanningStatus
enum PlanningStatus {
  PLANNED = "PLANNED",
  DONE = "DONE",
  CANCELLED = "CANCELLED"
}

interface PlanningListProps {
  plannings: PlanningWithContract[];
}

export const PlanningList: React.FC<PlanningListProps> = ({ plannings }) => {
  const formatDayAndTime = (date: Date) => {
    const sessionDate = new Date(date);
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dayName = dayNames[sessionDate.getDay()];
    
    // Heure de début (heure de la date)
    const startHour = sessionDate.getHours();
    const startMinute = sessionDate.getMinutes();
    
    // Heure de fin (heure de la date + 1)
    const endHour = startHour + 1;
    
    const formatTime = (hour: number, minute: number) => {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMinute = minute.toString().padStart(2, "0");
      return `${displayHour}:${displayMinute} ${period}`;
    };
    
    return `${dayName}, ${formatTime(startHour, startMinute)} - ${formatTime(endHour, startMinute)}`;
  };

  const formatDate = (date: Date) => {
    const sessionDate = new Date(date);
    return sessionDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getStatusBadge = (status: PlanningStatus) => {
    const statusConfig = {
      [PlanningStatus.PLANNED]: {
        label: "Prévu",
        className: "bg-blue-500/20 text-blue-400 border-blue-400/30"
      },
      [PlanningStatus.DONE]: {
        label: "Terminé",
        className: "bg-green-500/20 text-green-400 border-green-400/30"
      },
      [PlanningStatus.CANCELLED]: {
        label: "Annulé",
        className: "bg-gray-500/20 text-gray-400 border-gray-400/30"
      }
    };

    const config = statusConfig[status];
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (plannings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 text-lg">Aucune séance planifiée</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plannings.map((planning) => (
        <div
          key={planning.id}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
        >
          <div className="flex-1">
            <div className="text-white font-medium text-lg">
              {formatDayAndTime(planning.date)}
            </div>
            <div className="text-white/70 text-sm mt-1">
              {formatDate(planning.date)}
            </div>
          </div>
          <div className="ml-4">
            {getStatusBadge(planning.status)}
          </div>
        </div>
      ))}
    </div>
  );
};
