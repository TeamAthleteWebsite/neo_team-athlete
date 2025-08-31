"use client";

import { type AvailabilityWithClient } from "@/src/actions/planning.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DayAvailabilitiesProps {
  availabilities: AvailabilityWithClient[];
  selectedDate: Date;
}

export const DayAvailabilities: React.FC<DayAvailabilitiesProps> = ({
  availabilities,
  selectedDate
}) => {
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

  const getClientFullName = (client: AvailabilityWithClient["client"]) => {
    return `${client.name} ${client.lastName || ""}`.trim();
  };

  const getClientInitials = (client: AvailabilityWithClient["client"]) => {
    const firstName = client.name.charAt(0).toUpperCase();
    const lastName = client.lastName ? client.lastName.charAt(0).toUpperCase() : "";
    return `${firstName}${lastName}`;
  };

  const sortedAvailabilities = availabilities.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  if (availabilities.length === 0) {
    return (
      <div className="bg-black/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-accent mb-4">
          {formatDate(selectedDate)}
        </h3>
        <div className="font-medium text-center text-white py-8">
          <p>Aucune disponibilité pour cette journée</p>
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
        {sortedAvailabilities.map((availability) => {
          return (
            <div
              key={availability.id}
              className="flex items-center gap-4 p-4 bg-black/70 rounded-lg"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={availability.client.image || undefined} 
                  alt={getClientFullName(availability.client)}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getClientInitials(availability.client)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h4 className="font-medium text-white">
                  {getClientFullName(availability.client)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
