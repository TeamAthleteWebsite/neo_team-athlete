import { UserIcon } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex flex-row items-center justify-center h-screen gap-4">
      <Block>
        <UserIcon className="size-10" />

        <Link href="/profile">Mon compte</Link>
      </Block>
      <Block>
        <UserIcon className="size-10" />

        <Link href="/dashboard/admin">Admin</Link>
      </Block>
    </div>
  );
}

const Block = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-100/70 rounded-lg p-6 flex-1/2">
      {children}
    </div>
  );
};
