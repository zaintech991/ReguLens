"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  FileText,
  AlertTriangle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
];

export function Sidebar() {
  const { isSidebarCollapsed: collapsed, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 90 : 280,
      }}
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] z-40",
        "bg-background border-r border-border/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
        "transition-all duration-300 ease-[0.22, 1, 0.36, 1]",
        "hidden md:block"
      )}
    >
      <div className="flex flex-col h-full py-6">
        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div className="relative group">
                  <motion.div
                    layout
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer font-medium",
                      "transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon 
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-colors duration-200", 
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )} 
                    />
                    
                    <div className="overflow-hidden flex-1">
                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap text-[15px]"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {!collapsed && isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40"
                      />
                    )}
                  </motion.div>
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 mt-auto border-t border-border/60">
           <button
            onClick={toggleSidebar}
            className={cn(
              "w-full flex items-center justify-center p-3 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200",
              collapsed && "bg-transparent hover:bg-secondary"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="p-1 rounded-md bg-border/50">
                  <ChevronLeft className="h-4 w-4" />
                </div>
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
