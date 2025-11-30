"use client";

import { useState } from "react";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, User, Trash2 } from "lucide-react";
import { DeleteSessionDialog } from "./DeleteSessionDialog";

interface WeekViewCalendarProps {
  currentWeek: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  sessions: PlanningWithClient[];
  onSessionDeleted?: (sessionId: string) => void;
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: string;
  sessions: PlanningWithClient[];
  isSelected: boolean;
  isToday: boolean;
}


export const WeekViewCalendar: React.FC<WeekViewCalendarProps> = ({
  currentWeek,
  selectedDate,
  onDateSelect,
  sessions,
  onSessionDeleted,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PlanningWithClient | null>(null);


  const getClientFullName = (client: PlanningWithClient["contract"]["client"]) => {
    return `${client.name} ${client.lastName || ""}`.trim();
  };

  const getClientInitials = (client: PlanningWithClient["contract"]["client"]) => {
    const firstName = client.name.charAt(0).toUpperCase();
    const lastName = client.lastName ? client.lastName.charAt(0).toUpperCase() : "";
    return `${firstName}${lastName}`;
  };

  const handleViewClient = (clientId: string) => {
    router.push(`/dashboard/admin/clients/${clientId}`);
  };

  const handleDeleteClick = (session: PlanningWithClient, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSession(session);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedSession && onSessionDeleted) {
      onSessionDeleted(selectedSession.id);
    }
    setDeleteDialogOpen(false);
    setSelectedSession(null);
  };


  // Générer les données pour les 7 jours de la semaine
  const generateWeekData = (): DayData[] => {
    const weekData: DayData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Trouver le lundi de la semaine affichée par la navigation
    const monday = new Date(currentWeek);
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
            <div className="text-sm font-medium">{day.dayName}</div>
            <div className="text-base font-bold">{day.dayNumber}</div>
          </div>
        ))}
      </div>

      {/* Calendrier horaire commun avec scroll synchronisé */}
      <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
        <div className="space-y-2">
          {/* Générer les créneaux horaires de 7h à 22h */}
          {Array.from({ length: 16 }, (_, index) => {
            const hour = 7 + index;
            const timeSlotLabel = `${hour.toString().padStart(2, '0')}:00`;
            
            return (
              <div key={hour} className="flex gap-2">
                {/* Label horaire (seulement pour le premier jour) */}
                <div className="w-20 flex-shrink-0 text-right">
                  <span className="text-base font-medium text-white">
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
                      <div key={`${day.date.toISOString()}-${hour}`} className="min-h-[30px]">
                        {sessionsInSlot.length === 0 ? (
                          <div className="h-[30px] border-l border-gray-700/30 ml-1"></div>
                        ) : (
                          <div className="space-y-1">
                            {sessionsInSlot.map((session) => {
                              const clientName = getClientFullName(session.contract.client);
                              
                              return (
                                <div
                                  key={session.id}
                                  className="flex items-center gap-2 p-2 bg-black/70 rounded hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform border-l-2 border-primary"
                                >
                                  <div
                                    className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                                    onClick={() => handleViewClient(session.contract.client.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleViewClient(session.contract.client.id);
                                      }
                                    }}
                                    aria-label={`Voir la fiche de ${clientName}`}
                                  >
                                    <Avatar className="h-6 w-6 flex-shrink-0">
                                      <AvatarImage 
                                        src={session.contract.client.image || undefined} 
                                        alt={clientName}
                                      />
                                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                        {getClientInitials(session.contract.client)}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-white truncate">
                                        {clientName}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        className="text-muted-foreground hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10 flex-shrink-0"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label="Options de la séance"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                      <DropdownMenuItem
                                        onClick={() => handleViewClient(session.contract.client.id)}
                                        className="cursor-pointer"
                                      >
                                        <User className="w-4 h-4 mr-2" />
                                        Voir le client
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={(e) => handleDeleteClick(session, e)}
                                        className="cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer la séance
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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
      
      {selectedSession && (
        <DeleteSessionDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedSession(null);
          }}
          sessionId={selectedSession.id}
          clientName={getClientFullName(selectedSession.contract.client)}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};
