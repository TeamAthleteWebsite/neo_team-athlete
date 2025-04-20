"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-client";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/src/actions/notification.actions";
import { NotificationType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const { notifications } = await getNotifications(user.id);
        setNotifications(notifications);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des notifications:",
          error,
        );
        toast.error("Impossible de charger les notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
      toast.success("Notification marquée comme lue");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la notification:", error);
      toast.error("Impossible de marquer la notification comme lue");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
      toast.success("Toutes les notifications ont été marquées comme lues");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications:", error);
      toast.error("Impossible de marquer toutes les notifications comme lues");
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!user) return;

    try {
      await deleteNotification(notificationId);
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== notificationId,
        ),
      );
      toast.success("Notification supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      toast.error("Impossible de supprimer la notification");
    }
  };

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

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">
              Veuillez vous connecter pour voir vos notifications.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-accent text-2xl font-bold">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            {notifications.some((n) => !n.isRead) && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="unread">Non lues</TabsTrigger>
              <TabsTrigger value={NotificationType.SYSTEM_MESSAGE}>
                Système
              </TabsTrigger>
              <TabsTrigger value={NotificationType.PROGRAM_UPDATE}>
                Programmes
              </TabsTrigger>
              <TabsTrigger value={NotificationType.SESSION_REMINDER}>
                Rappels
              </TabsTrigger>
              <TabsTrigger value={NotificationType.ACHIEVEMENT}>
                Réalisations
              </TabsTrigger>
            </TabsList>

            <ScrollArea>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Chargement des notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>Aucune notification à afficher</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={notification.isRead ? "opacity-70" : ""}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {notification.title}
                              </h3>
                              <Badge
                                variant={getBadgeVariant(notification.type)}
                              >
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                {
                                  addSuffix: true,
                                  locale: fr,
                                },
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
