import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationType } from "@prisma/client";

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function NotificationTabs({
  activeTab,
  onTabChange,
}: NotificationTabsProps) {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4 flex flex-wrap gap-2 w-full">
        <TabsTrigger value="all" className="flex-1 min-w-[100px] text-sm">
          Toutes
        </TabsTrigger>
        <TabsTrigger value="unread" className="flex-1 min-w-[100px] text-sm">
          Non lues
        </TabsTrigger>
        <TabsTrigger
          value={NotificationType.SYSTEM_MESSAGE}
          className="flex-1 min-w-[100px] text-sm"
        >
          Système
        </TabsTrigger>
        <TabsTrigger
          value={NotificationType.PROGRAM_UPDATE}
          className="flex-1 min-w-[100px] text-sm"
        >
          Programmes
        </TabsTrigger>
        <TabsTrigger
          value={NotificationType.SESSION_REMINDER}
          className="flex-1 min-w-[100px] text-sm"
        >
          Rappels
        </TabsTrigger>
        <TabsTrigger
          value={NotificationType.ACHIEVEMENT}
          className="flex-1 min-w-[100px] text-sm"
        >
          Réalisations
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
