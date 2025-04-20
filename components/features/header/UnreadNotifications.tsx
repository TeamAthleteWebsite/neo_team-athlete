import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { getUnreadNotificationsCount } from "@/src/actions/notification.actions";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const UnreadNotifications = () => {
  const { data: session } = useSession();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchUnreadNotifications() {
      if (!userId) return;
      const count = await getUnreadNotificationsCount(userId);
      setUnreadNotifications(count);
    }

    fetchUnreadNotifications();
  }, [userId]);

  return (
    <Link href="/notifications" className="p-2 cursor-pointer relative">
      <Bell />
      {unreadNotifications > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center"
        >
          {unreadNotifications}
        </Badge>
      )}
    </Link>
  );
};
