"use client";

import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface TimeSlotCalendarProps {
  sessions: PlanningWithClient[];
  selectedDate: Date;
}

interface TimeSlot {
  hour: number;
  label: string;
  sessions: PlanningWithClient[];
}

export const TimeSlotCalendar: React.FC<TimeSlotCalendarProps> = ({
  sessions,
  selectedDate
}) => {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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

  // Générer les créneaux horaires de 07h00 à 22h00
  const generateTimeSlots = (): TimeSlot[] => {
    const timeSlots: TimeSlot[] = [];
    
    for (let hour = 7; hour <= 22; hour++) {
      const sessionsInSlot = sessions.filter(session => {
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

  const timeSlots = generateTimeSlots();

  if (sessions.length === 0) {
    return (
      <div className="bg-black/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-accent mb-4">
          {formatDate(selectedDate)}
        </h3>
        <div className="font-medium text-center text-white py-8">
          <p>Aucune séance planifiée pour cette journée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-accent mb-6">
        {formatDate(selectedDate)}
      </h3>
      
      {/* Conteneur avec défilement vertical */}
      <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
        <div className="space-y-4">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot.hour} className="flex gap-4">
              {/* Label horaire */}
              <div className="w-16 flex-shrink-0 text-right">
                <span className="text-sm font-medium text-white">
                  {timeSlot.label}
                </span>
              </div>
              
              {/* Conteneur des séances */}
              <div className="flex-1 min-h-[60px]">
                {timeSlot.sessions.length === 0 ? (
                  <div className="h-[60px] border-l-2 border-gray-700/50 ml-4"></div>
                ) : (
                  <div className="space-y-2">
                    {timeSlot.sessions.map((session) => {
                      const startTime = new Date(session.date);
                      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 heure
                      
                      return (
                        <div
                          key={session.id}
                          className="flex items-center gap-3 p-3 bg-black/70 rounded-lg cursor-pointer hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform border-l-4 border-primary"
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
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={session.contract.client.image || undefined} 
                              alt={getClientFullName(session.contract.client)}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getClientInitials(session.contract.client)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-sm">
                              {getClientFullName(session.contract.client)}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(startTime)} - {formatTime(endTime)}
                            </p>
                          </div>
                          
                          <div className="text-muted-foreground">
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
