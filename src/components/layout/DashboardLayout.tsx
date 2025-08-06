
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}

export const DashboardLayout = ({ children, className = "", headerActions }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300; // Show after scrolling 300px
      setShowScrollTop(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate main content left margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobile) return "ml-0";
    if (sidebarCollapsed) return "lg:ml-20";
    return "lg:ml-72";
  };

  // Calculate header left position based on sidebar state
  const getHeaderLeftPosition = () => {
    if (isMobile) return "left-0";
    if (sidebarCollapsed) return "lg:left-20";
    return "lg:left-72";
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800/50 transition-colors duration-300">
      {/* Fixed Sidebar - always fixed on all screen sizes */}
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${getMainContentMargin()}`}>
        {/* Fixed Header with dynamic positioning */}
        <header className={`fixed top-0 right-0 ${getHeaderLeftPosition()} z-40 bg-background/95 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 shadow-lg pointer-events-none`}>
          <div className="flex items-center justify-end gap-2 sm:gap-4 pointer-events-auto">
            {headerActions}
            <NotificationCenter />
            <ThemeToggle />
          </div>
        </header>
        
        {/* Main Content with responsive padding */}
        <main className={`flex-1 pt-16 sm:pt-20 p-4 lg:p-6 transition-all duration-300 ${className}`}>
          {children}
        </main>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className={`
            fixed bottom-6 right-6 z-50 
            h-12 w-12 rounded-full p-0 
            bg-primary hover:bg-primary/90 
            text-primary-foreground shadow-lg hover:shadow-xl 
            transition-all duration-300 ease-in-out
            transform hover:scale-110
            border-2 border-background/20
          `}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
