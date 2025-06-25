
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Bell, User, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/auth/authService";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          if (user.user_metadata && user.user_metadata.full_name) {
            const fullName = user.user_metadata.full_name as string;
            const firstName = fullName.split(' ')[0];
            setUserName(firstName);
          } else if (user.email) {
            setUserName(user.email.split('@')[0]);
          } else {
            setUserName("User");
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserName("User");
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {/* Enhanced Header */}
        <header className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center justify-between p-6">
            {/* Welcome Section */}
            <div className="flex items-center gap-4">
              <div className="glow-effect">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Welcome back, <span className="chariot-gradient-text">{userName}</span>
                </h2>
                <p className="text-sm text-muted-foreground">Let's boost your campaigns today</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns, products..."
                  className="pl-10 w-80 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">3</span>
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-xl" align="end">
                  <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-chariot-purple/5 to-chariot-accent/5">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Stay updated with your campaigns</p>
                  </div>
                  <div className="p-4 space-y-4 max-h-80 overflow-auto">
                    <div className="flex gap-4 items-start p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                      <div className="h-3 w-3 rounded-full bg-green-500 mt-1"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">Campaign launched successfully</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">Your new campaign is now live and generating traffic</p>
                        <p className="text-xs text-muted-foreground mt-2">2 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                      <div className="h-3 w-3 rounded-full bg-chariot-purple mt-1"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Weekly report available</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Your performance summary is ready for review</p>
                        <p className="text-xs text-muted-foreground mt-2">1 hour ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/50">
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mt-1"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Budget optimization suggested</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">AI recommends reallocating 15% of budget to top performers</p>
                        <p className="text-xs text-muted-foreground mt-2">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                    <Button variant="ghost" size="sm" className="w-full text-sm hover:bg-chariot-purple/10 hover:text-chariot-purple rounded-lg">
                      View all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile */}
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={cn("p-8 bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 min-h-screen", className)}>
          {children}
        </div>
      </main>
    </div>
  );
};
