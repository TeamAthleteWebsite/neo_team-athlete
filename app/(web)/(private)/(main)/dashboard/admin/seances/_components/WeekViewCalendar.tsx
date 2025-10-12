"use client";

import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface WeekViewCalendarProps {
  currentWeek: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  sessions: PlanningWithClient[];
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: string;
  sessions: PlanningWithClient[];
  isSelected: boolean;
  isToday: boolean;
}

interface TimeSlot {
  hour: number;
  label: string;
  sessions: PlanningWithClient[];
}

export const WeekViewCalendar: React.FC<WeekViewCalendarProps> = ({
  currentWeek,
  selectedDate,
  onDateSelect,
  sessions
}) => {
  const router = useRouter();


  const getClientFullName = (client: PlanningWithClient["contract"]["client"]) => {
    return `${client.name} ${client.lastName || ""}`.trim();
  };

  const getClientInitials = (client: PlanningWithClient["contract"]["client"]) => {
    const firstName = client.name.charAt(0).toUpperCase();
    const lastName = client.lastName ? client.lastName.charAt(0).toUpperCase() : "";
    return `${firstName}${lastName}`;
  };

  const handleSessionClick = (clientId: string) => {
    router.push(`/dashboard/admin/clients/${clientId}`);
  };

  // Générer les créneaux horaires pour un jour donné
  const generateTimeSlotsForDay = (daySessions: PlanningWithClient[]): TimeSlot[] => {
    const timeSlots: TimeSlot[] = [];
    
    for (let hour = 7; hour <= 22; hour++) {
      const sessionsInSlot = daySessions.filter(session => {
        const sessionHour = new Date(session.date).getHours();
        return sessionHour === hour;
      });

      timeSlots.push({
        hour,
        label: `${hour.toString().padStart(2, '0')}:00`,
        sessions: sessionsInSlot
      });
    }

    return timeSlots;
  };

  // Générer les données pour les 7 jours de la semaine
  const generateWeekData = (): DayData[] => {
    const weekData: DayData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Trouver le lundi de la semaine du jour sélectionné
    const monday = new Date(selectedDate);
    const dayOfWeek = monday.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    monday.setDate(monday.getDate() + daysToMonday);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === date.toDateString();
      });

      weekData.push({
        date,
        dayName: date.toLocaleDateString("fr-FR", { weekday: "short" }),
        dayNumber: date.getDate().toString(),
        sessions: daySessions,
        isSelected: date.toDateString() === selectedDate.toDateString(),
        isToday: date.toDateString() === today.toDateString()
      });
    }

    return weekData;
  };

  const weekData = generateWeekData();

  return (
    <div className="bg-black/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-accent mb-6">
        Vue Semaine
      </h3>
      
      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekData.map((day) => (
          <div 
            key={day.date.toISOString()}
            className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
              day.isSelected
                ? "bg-primary text-white"
                : day.isToday
                ? "bg-primary/20 text-primary border border-primary"
                : "bg-black/50 text-white hover:bg-black/70"
            }`}
            onClick={() => onDateSelect(day.date)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onDateSelect(day.date);
              }
            }}
            aria-label={`Sélectionner le ${day.dayName} ${day.dayNumber}`}
          >
            <div className="text-xs font-medium">{day.dayName}</div>
            <div className="text-sm font-bold">{day.dayNumber}</div>
          </div>
        ))}
      </div>

      {/* Calendrier horaire commun avec scroll synchronisé */}
      <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
        <div className="space-y-1">
          {/* Générer les créneaux horaires de 7h à 22h */}
          {Array.from({ length: 16 }, (_, index) => {
            const hour = 7 + index;
            const timeSlotLabel = `${hour.toString().padStart(2, '0')}:00`;
            
            return (
              <div key={hour} className="flex gap-2">
                {/* Label horaire (seulement pour le premier jour) */}
                <div className="w-16 flex-shrink-0 text-right">
                  <span className="text-sm font-medium text-white">
                    {timeSlotLabel}
                  </span>
                </div>
                
                {/* Grille des 7 jours pour ce créneau horaire */}
                <div className="grid grid-cols-7 gap-2 flex-1">
                  {weekData.map((day) => {
                    const sessionsInSlot = day.sessions.filter(session => {
                      const sessionHour = new Date(session.date).getHours();
                      return sessionHour === hour;
                    });
                    
                    return (
                      <div key={`${day.date.toISOString()}-${hour}`} className="min-h-[20px]">
                        {sessionsInSlot.length === 0 ? (
                          <div className="h-[20px] border-l border-gray-700/30 ml-1"></div>
                        ) : (
                          <div className="space-y-1">
                            {sessionsInSlot.map((session) => {
                              
                              return (
                                <div
                                  key={session.id}
                                  className="flex items-center gap-1 p-1 bg-black/70 rounded cursor-pointer hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform border-l-2 border-primary"
                                  onClick={() => handleSessionClick(session.contract.client.id)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      handleSessionClick(session.contract.client.id);
                                    }
                                  }}
                                  aria-label={`Voir la fiche de ${getClientFullName(session.contract.client)}`}
                                >
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage 
                                      src={session.contract.client.image || undefined} 
                                      alt={getClientFullName(session.contract.client)}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {getClientInitials(session.contract.client)}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-white truncate">
                                      {getClientFullName(session.contract.client)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
