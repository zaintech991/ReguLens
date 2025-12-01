"use client";

import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { useUIStore } from "@/lib/store";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />
      <div className="flex flex-1 pt-16">
        {showSidebar && <Sidebar />}
        <motion.main 
          className="flex-1 relative"
          initial={false}
          animate={{
            marginLeft: showSidebar ? (isSidebarCollapsed ? 90 : 280) : 0
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(91, 76, 234, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.02) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)
              `
            }}
          />
          <div className="relative p-4 md:p-6 w-full">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}

