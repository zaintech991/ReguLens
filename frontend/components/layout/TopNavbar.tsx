"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LogIn, User, Search, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export function TopNavbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="h-full flex items-center justify-between px-4 md:px-8 max-w-[1920px] mx-auto">
        {/* Left side - Logo */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <Logo size="md" showText={true} />
          </Link>
        </div>

        {/* Center - Search (optional) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents, alerts..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/50 border-none text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right side - Navigation items */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-secondary/50 p-1.5 rounded-full transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-md">
                  JD
                </div>
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg py-1 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-border bg-secondary/30">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">john@example.com</p>
                    </div>
                    <Link href="/profile">
                      <div className="px-4 py-2.5 text-sm hover:bg-secondary cursor-pointer transition-colors">
                        Profile Settings
                      </div>
                    </Link>
                    <div className="px-4 py-2.5 text-sm hover:bg-secondary cursor-pointer transition-colors">
                      Billing
                    </div>
                    <div className="h-px bg-border my-1" />
                    <div className="px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
                      Sign Out
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border absolute w-full"
          >
            <div className="p-4 space-y-4">
              <Link href="/dashboard" onClick={() => setShowMobileMenu(false)} className="block py-2 text-lg font-medium">Dashboard</Link>
              <Link href="/documents" onClick={() => setShowMobileMenu(false)} className="block py-2 text-lg font-medium">Documents</Link>
              <Link href="/alerts" onClick={() => setShowMobileMenu(false)} className="block py-2 text-lg font-medium">Alerts</Link>
              <div className="h-px bg-border" />
              <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="block py-2 text-muted-foreground">Profile</Link>
              <Link href="/logout" onClick={() => setShowMobileMenu(false)} className="block py-2 text-red-500">Log Out</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
