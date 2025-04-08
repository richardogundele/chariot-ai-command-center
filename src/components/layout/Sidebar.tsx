
import { Home, PieChart, AlertOctagon, DollarSign, LogOut, ChevronLeft, ChevronRight, Package, BarChart, Settings as SettingsIcon, Share } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: PieChart, label: "Campaign", path: "/campaign" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: AlertOctagon, label: "Alerts", path: "/alerts" },
    { icon: BarChart, label: "Reports & Analytics", path: "/reports" },
    { icon: Share, label: "Platforms", path: "/platforms" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div 
      className={cn(
        "min-h-screen bg-sidebar border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-sidebar-foreground">Chariot<span className="text-sidebar-primary">AI</span></span>
          </div>
        )}
        {collapsed && <div className="mx-auto text-xl font-bold text-sidebar-primary">C</div>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground",
            collapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
