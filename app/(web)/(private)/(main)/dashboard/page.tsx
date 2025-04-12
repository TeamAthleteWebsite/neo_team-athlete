import { UserIcon } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center bg-zinc-100/70 rounded-lg p-6">
        <UserIcon className="size-10" />

        <Link href="/profile">Mon compte</Link>
      </div>
    </div>
  );
}
