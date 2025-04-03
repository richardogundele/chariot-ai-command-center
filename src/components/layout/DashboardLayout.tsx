
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // In a real app, this would come from an auth service
    // For now, we'll use a mock username stored in localStorage
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <header className="border-b border-chariot-purple/10 p-4 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div className="text-lg font-medium">Hello, <span className="text-chariot-purple font-semibold">{userName}</span></div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-chariot-purple/10">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 border border-chariot-purple/20 shadow-lg" align="end">
              <div className="p-4 border-b border-chariot-purple/10">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium">Campaign launched successfully</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-2 w-2 rounded-full bg-chariot-purple mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium">Weekly report available</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium">Budget optimization suggested</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-chariot-purple/10 text-center">
                <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-chariot-purple/10 hover:text-chariot-purple">View all notifications</Button>
              </div>
            </PopoverContent>
          </Popover>
        </header>
        <div className={cn("p-8 bg-gradient-to-br from-white to-chariot-lavender/5", className)}>
          {children}
        </div>
      </main>
    </div>
  );
};
