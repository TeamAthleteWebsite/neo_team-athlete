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

interface TimeSlotCalendarProps {
  sessions: PlanningWithClient[];
  selectedDate: Date;
  onSessionDeleted?: (sessionId: string) => void;
}

interface TimeSlot {
  hour: number;
  label: string;
  sessions: PlanningWithClient[];
}

export const TimeSlotCalendar: React.FC<TimeSlotCalendarProps> = ({
  sessions,
  selectedDate,
  onSessionDeleted,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PlanningWithClient | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
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
              <div className="w-20 flex-shrink-0 text-right">
                <span className="text-base font-medium text-white">
                  {timeSlot.label}
                </span>
              </div>
              
              {/* Conteneur des séances */}
              <div className="flex-1 min-h-[80px]">
                {timeSlot.sessions.length === 0 ? (
                  <div className="h-[80px] border-l-2 border-gray-700/50 ml-4"></div>
                ) : (
                  <div className="space-y-2">
                    {timeSlot.sessions.map((session) => {
                      const clientName = getClientFullName(session.contract.client);
                      
                      return (
                        <div
                          key={session.id}
                          className="flex items-center gap-4 p-4 bg-black/70 rounded-lg hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform border-l-4 border-primary"
                        >
                          <div
                            className="flex items-center gap-4 flex-1 cursor-pointer"
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
                            <Avatar className="h-12 w-12">
                              <AvatarImage 
                                src={session.contract.client.image || undefined} 
                                alt={clientName}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary text-base">
                                {getClientInitials(session.contract.client)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <h4 className="font-medium text-white text-base">
                                {clientName}
                              </h4>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="text-muted-foreground hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Options de la séance"
                              >
                                <MoreVertical className="w-5 h-5" />
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
            </div>
          ))}
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
