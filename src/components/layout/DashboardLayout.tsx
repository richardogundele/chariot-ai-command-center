
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className = "" }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800/50 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-4 sm:px-6 py-3 sm:py-4 transition-colors duration-300">
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <NotificationCenter />
            <ThemeToggle />
          </div>
        </header>
        
        {/* Main Content */}
        <main className={`flex-1 p-4 lg:p-6 overflow-auto ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
