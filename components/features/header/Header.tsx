"use client";

import Image from "next/image";
import Link from "next/link";
import { UnreadNotifications } from "./UnreadNotifications";

export default function Header() {
  return (
    <header className="bg-black text-white p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <Link href="/" className="w-15 h-10 flex items-center justify-center">
          <Image
            src="/images/logo_body.webp"
            alt="Team Athlete Logo"
            width={60}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
        <UnreadNotifications />
      </div>
    </header>
  );
}
