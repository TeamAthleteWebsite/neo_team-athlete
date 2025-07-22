import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationType } from "@/prisma/generated";
import { Filter } from "lucide-react";
import { useState } from "react";

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedTypes?: NotificationType[];
  onTypesChange?: (types: NotificationType[]) => void;
}

const notificationTypes = [
  { value: NotificationType.SYSTEM_MESSAGE, label: "Système" },
  { value: NotificationType.PROGRAM_UPDATE, label: "Programmes" },
  { value: NotificationType.SESSION_REMINDER, label: "Rappels" },
  { value: NotificationType.ACHIEVEMENT, label: "Réalisations" },
];

export function NotificationTabs({
  activeTab,
  onTabChange,
  selectedTypes: externalSelectedTypes,
  onTypesChange: externalOnTypesChange,
}: NotificationTabsProps) {
  const [internalSelectedTypes, setInternalSelectedTypes] = useState<
    NotificationType[]
  >([]);

  // Utiliser soit les props externes soit l'état interne
  const selectedTypes = externalSelectedTypes ?? internalSelectedTypes;
  const onTypesChange = externalOnTypesChange ?? setInternalSelectedTypes;

  const hasActiveFilters = selectedTypes.length > 0;

  const handleTypeToggle = (type: NotificationType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleClearFilters = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onTypesChange([]);
  };

  return (
    <div className="flex flex-col gap-4 my-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
          <TabsList className="flex gap-2">
            <TabsTrigger value="all" className="text-sm">
              Toutes
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-sm">
              Non lues
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={hasActiveFilters ? "default" : "outline"}
              size="sm"
              className="relative group"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="flex items-center gap-2">
                {hasActiveFilters ? (
                  <>
                    Types ({selectedTypes.length})
                    <Badge
                      variant="secondary"
                      className="ml-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleClearFilters}
                    >
                      Effacer
                    </Badge>
                  </>
                ) : (
                  "Filtrer"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              {notificationTypes.map((type) => (
                <div
                  key={type.value}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
                >
                  <Checkbox
                    id={type.value}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => handleTypeToggle(type.value)}
                  />
                  <label
                    htmlFor={type.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-grow"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
