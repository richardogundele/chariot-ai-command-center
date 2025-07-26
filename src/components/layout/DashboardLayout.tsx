
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className = "" }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate header left position based on sidebar state
  const getHeaderLeftPosition = () => {
    if (isMobile) return "left-0";
    if (sidebarCollapsed) return "lg:left-20";
    return "lg:left-72";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800/50 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header with dynamic positioning */}
        <header className={`fixed top-0 right-0 ${getHeaderLeftPosition()} z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 shadow-sm`}>
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <NotificationCenter />
            <ThemeToggle />
          </div>
        </header>
        
        {/* Main Content with responsive padding */}
        <main className={`flex-1 pt-16 sm:pt-20 p-4 lg:p-6 overflow-auto transition-all duration-300 ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
