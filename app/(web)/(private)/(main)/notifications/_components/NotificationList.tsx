import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationCard } from "./NotificationCard";
import { NotificationListProps } from "./types";

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  loading,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-card rounded-lg border">
        <p className="text-muted-foreground">Chargement des notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-card rounded-lg border">
        <p className="text-muted-foreground">Aucune notification à afficher</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4 pr-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
