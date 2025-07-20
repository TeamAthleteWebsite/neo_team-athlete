import { NotificationType } from "@/prisma/generated";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export interface NotificationHeaderProps {
  hasUnreadNotifications: boolean;
  onMarkAllAsRead: () => void;
}
