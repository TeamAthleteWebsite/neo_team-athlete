'use client';

import React from 'react';
import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
}

export default function Footer() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      id: 'search',
      label: 'Search',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      ),
    },
    
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="fixed bottom-0 w-full bg-black text-white border-t border-gray-800 z-50">
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 ${
                  activeTab === item.id ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
} 