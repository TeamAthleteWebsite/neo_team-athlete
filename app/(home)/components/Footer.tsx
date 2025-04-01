"use client";

import { HomeIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  href: string;
}

export default function Footer() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: <HomeIcon className="w-6 h-6" />,
    },
    {
      id: "search",
      label: "Search",
      href: "/search",
      icon: <SearchIcon className="w-6 h-6" />,
    },

    {
      id: "profile",
      label: "Profile",
      href: "/auth/signin",
      icon: <UserIcon className="w-6 h-6" />,
    },
  ];

  return (
    <footer className="fixed bottom-0 w-full bg-black text-white border-t border-gray-800 z-50">
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 ${
                  activeTab === item.id ? "text-white" : "text-gray-500"
                }`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
