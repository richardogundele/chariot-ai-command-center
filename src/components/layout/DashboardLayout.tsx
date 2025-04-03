
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <header className="border-b p-4 flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
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
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
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
              <div className="p-2 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full text-xs">View all notifications</Button>
              </div>
            </PopoverContent>
          </Popover>
        </header>
        <div className={cn("p-8", className)}>
          {children}
        </div>
      </main>
    </div>
  );
};
