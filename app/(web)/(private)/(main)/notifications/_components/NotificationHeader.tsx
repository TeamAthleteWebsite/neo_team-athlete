import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { NotificationHeaderProps } from "./types";

export function NotificationHeader({
  hasUnreadNotifications,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-accent text-2xl font-bold">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        {hasUnreadNotifications && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            Tout marquer comme lu
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
