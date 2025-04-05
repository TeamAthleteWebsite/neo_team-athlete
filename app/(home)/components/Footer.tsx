"use client";

import { useSession } from "@/lib/auth-client";
import { HomeIcon, LogInIcon, SearchIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { FooterNavItem } from "./FooterNavItem";

export default function Footer() {
  const [activeTab, setActiveTab] = useState("home");
  const { data: session } = useSession();

  return (
    <footer className="fixed bottom-0 w-full bg-black text-white border-t border-gray-800 z-50">
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center py-3">
          <FooterNavItem
            id="home"
            label="Home"
            href="/"
            icon={<HomeIcon className="w-6 h-6" />}
            isActive={activeTab === "home"}
            onClick={setActiveTab}
          />
          <FooterNavItem
            id="search"
            label="Search"
            href="/search"
            icon={<SearchIcon className="w-6 h-6" />}
            isActive={activeTab === "search"}
            onClick={setActiveTab}
          />
          {session ? (
            <FooterNavItem
              id="profile"
              label="Profile"
              href="/profile"
              icon={<UserIcon className="w-6 h-6" />}
              isActive={activeTab === "profile"}
              onClick={setActiveTab}
            />
          ) : (
            <FooterNavItem
              id="login"
              label="Connexion"
              href="/auth/signin"
              icon={<LogInIcon className="w-6 h-6" />}
              isActive={activeTab === "login"}
              onClick={setActiveTab}
            />
          )}
        </ul>
      </nav>
    </footer>
  );
}
