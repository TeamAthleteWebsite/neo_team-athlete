"use client";

import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface DaySessionsProps {
  sessions: PlanningWithClient[];
  selectedDate: Date;
}

export const DaySessions: React.FC<DaySessionsProps> = ({
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

  const sortedSessions = sessions.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

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
      <h3 className="text-lg font-semibold text-accent mb-4">
        {formatDate(selectedDate)}
      </h3>
      
      <div className="space-y-3">
        {sortedSessions.map((session) => {
          const startTime = new Date(session.date);
          const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 heure
          
          return (
            <div
              key={session.id}
              className="flex items-center gap-4 p-4 bg-black/70 rounded-lg cursor-pointer hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform"
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
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={session.contract.client.image || undefined} 
                  alt={getClientFullName(session.contract.client)}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getClientInitials(session.contract.client)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h4 className="font-medium text-white">
                  {getClientFullName(session.contract.client)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatTime(startTime)} - {formatTime(endTime)}
                </p>
              </div>
              
              <div className="text-muted-foreground">
                <svg 
                  className="w-5 h-5" 
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
    </div>
  );
};
