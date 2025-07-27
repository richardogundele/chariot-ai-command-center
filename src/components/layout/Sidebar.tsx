
import { Home, PieChart, AlertOctagon, LogOut, ChevronLeft, ChevronRight, BarChart, Settings as SettingsIcon, Package, Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar = ({ onCollapseChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Notify parent component when collapse state changes
  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", color: "from-blue-500 to-blue-600" },
    { icon: Package, label: "Products", path: "/saved-products", color: "from-green-500 to-green-600" },
    { icon: PieChart, label: "Campaign", path: "/campaign", color: "from-purple-500 to-purple-600" },
    { icon: AlertOctagon, label: "Alerts", path: "/alerts", color: "from-red-500 to-red-600" },
    { icon: BarChart, label: "Reports & Analytics", path: "/reports", color: "from-orange-500 to-orange-600" },
    { icon: SettingsIcon, label: "Settings", path: "/settings", color: "from-gray-500 to-gray-600" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 border-r border-gray-700/50 dark:border-gray-800/50 transition-all duration-300 flex flex-col backdrop-blur-xl",
          "transform lg:transform-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-20" : "w-72"
        )}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-700/50 dark:border-gray-800/50">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="glow-effect">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Chariot<span className="chariot-gradient-text">AI</span>
                </h1>
                <p className="text-xs text-gray-400 dark:text-gray-500">Marketing Platform</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <div className="glow-effect">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-gray-400 dark:text-gray-500 hover:text-white hover:bg-gray-800/50 dark:hover:bg-gray-900/50 transition-colors"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-400 dark:text-gray-500 hover:text-white hover:bg-gray-800/50 dark:hover:bg-gray-900/50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-chariot-purple/20 to-chariot-accent/20 text-white border border-chariot-purple/30"
                    : "text-gray-300 dark:text-gray-400 hover:text-white hover:bg-gray-800/50 dark:hover:bg-gray-900/50"
                )}
              >
                {/* Icon with gradient background */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300",
                  isActive 
                    ? `bg-gradient-to-br ${item.color} shadow-lg` 
                    : "bg-gray-700/50 dark:bg-gray-800/50 group-hover:bg-gray-600/50 dark:group-hover:bg-gray-700/50"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors duration-300",
                    isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-white"
                  )} />
                </div>
                
                {!collapsed && (
                  <span className="transition-all duration-300">{item.label}</span>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 rounded-full bg-chariot-accent"></div>
                )}
                
                {/* Hover effect */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-chariot-purple/10 to-chariot-accent/10 rounded-xl opacity-0 transition-opacity duration-300",
                  !isActive && "group-hover:opacity-100"
                )}></div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-gray-700/50 dark:border-gray-800/50 space-y-4">
        {/* User Info (when expanded) */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 dark:bg-gray-900/50">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AI</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">AI Marketing</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs truncate">Active Campaign</p>
            </div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-gray-300 dark:text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300",
            collapsed && "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 mr-3 group-hover:bg-red-500/20 transition-colors duration-300">
            <LogOut className="h-4 w-4" />
          </div>
          {!collapsed && <span>Logout</span>}
        </Button>
        </div>
      </div>
    </>
  );
};
