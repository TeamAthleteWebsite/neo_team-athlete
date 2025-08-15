import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationType } from "@/prisma/generated";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Trash2 } from "lucide-react";
import { NotificationCardProps } from "./types";

const getBadgeVariant = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SYSTEM_MESSAGE:
      return "info";
    case NotificationType.PROGRAM_UPDATE:
      return "success";
    case NotificationType.SESSION_REMINDER:
      return "warning";
    case NotificationType.ACHIEVEMENT:
      return "success";
    case NotificationType.NEW_PROSPECT:
      return "info";
    default:
      return "default";
  }
};

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  return (
    <Card className={notification.isRead ? "opacity-70" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{notification.title}</h3>
              <Badge variant={getBadgeVariant(notification.type)}>
                {notification.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground">
              {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: fr,
              }) : "Date inconnue"}
            </p>
          </div>
          <div className="flex gap-2">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
