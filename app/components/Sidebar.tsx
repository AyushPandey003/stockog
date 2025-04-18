"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

import ThemeToggle from './ThemeToggle';

interface NavItemProps {
  href: string;
  label: string;
  isActive: boolean;
}

function NavItem({ href, label, isActive }: NavItemProps) {
  return (
    <Link 
      href={href}
      className={`flex items-center p-3 rounded-lg transition-colors ${
        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground hover:text-foreground/80'
      }`}
    >
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-card text-card-foreground rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-card text-card-foreground border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">Stock News Analyzer</h1>
            <ThemeToggle />
          </div>
          
          <nav className="space-y-2 mt-4">
            <NavItem 
              href="/dashboard" 
              label="Dashboard" 
              isActive={pathname === '/dashboard'} 
            />
            <NavItem 
              href="/dashboard/news" 
              label="News Feed" 
              isActive={pathname === '/dashboard/news'} 
            />
            <NavItem 
              href="/dashboard/sentiment" 
              label="Sentiment Analysis" 
              isActive={pathname === '/dashboard/sentiment'} 
            />
            <NavItem 
              href="/dashboard/stock" 
              label="Stock Performance" 
              isActive={pathname === '/dashboard/stock'} 
            />
            <NavItem 
              href="/dashboard/settings" 
              label="Settings" 
              isActive={pathname === '/dashboard/settings'} 
            />
          </nav>
          
          <div className="mt-auto pt-8">
            <button
              onClick={() => signOut()}
              className="w-full p-3 text-left text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
} 