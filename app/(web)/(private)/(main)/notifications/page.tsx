"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-client";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/src/actions/notification.actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NotificationHeader } from "./_components/NotificationHeader";
import { NotificationList } from "./_components/NotificationList";
import { NotificationTabs } from "./_components/NotificationTabs";
import { Notification } from "./_components/types";

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
        <NotificationHeader
          hasUnreadNotifications={notifications.some((n) => !n.isRead)}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        <CardContent>
          <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
