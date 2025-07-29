
import { Home, PieChart, AlertOctagon, LogOut, ChevronLeft, ChevronRight, BarChart, Settings as SettingsIcon, Package, Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUserProfile } from "@/services/auth/userProfileService";
import { getCurrentUser } from "@/services/auth/authService";

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar = ({ onCollapseChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userFirstName, setUserFirstName] = useState<string>("User"); // Default fallback to "User"
  const location = useLocation();
  const navigate = useNavigate();

  // Notify parent component when collapse state changes
  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  // Fetch user profile and extract first name
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get current user first to check all available data
        const { user } = await getCurrentUser();
        
        if (!user) {
          return;
        }

        let firstName = null;

        // Strategy 1: Check user_profiles table (created by database trigger)
        try {
          const profile = await getUserProfile();
          
          if (profile?.fullName && profile.fullName.trim()) {
            firstName = profile.fullName.split(' ')[0];
          }
        } catch (profileError) {
          console.warn("Profile fetch failed:", profileError);
        }

        // Strategy 2: Check user_metadata.full_name (from registration)
        if (!firstName && user.user_metadata?.full_name) {
          firstName = String(user.user_metadata.full_name).split(' ')[0];
        }

        // Strategy 3: Check user_metadata.name (alternative field)  
        if (!firstName && user.user_metadata?.name) {
          firstName = String(user.user_metadata.name).split(' ')[0];
        }

        // Strategy 4: Check user_metadata.first_name (if it exists)
        if (!firstName && user.user_metadata?.first_name) {
          firstName = String(user.user_metadata.first_name);
        }

        // Strategy 5: Extract from email as last resort
        if (!firstName && user.email) {
          const emailPart = user.email.split('@')[0];
          // Clean up email username and capitalize
          firstName = emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
        }

        // Apply the name if we found one
        if (firstName && firstName.trim()) {
          setUserFirstName(firstName.trim());
        }

      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Keep default "User" if there's an error
      }
    };

    fetchUserProfile();
  }, []);

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
        <nav className="space-y-3 px-4" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden border border-transparent",
                  "focus:outline-none focus:ring-2 focus:ring-chariot-purple/50 focus:border-chariot-purple/30 focus-visible:ring-2",
                  isActive
                    ? "bg-gradient-to-r from-chariot-purple/20 to-chariot-accent/20 text-white border-chariot-purple/30 shadow-lg"
                    : "text-gray-300 dark:text-gray-400 hover:text-white hover:bg-gray-800/50 dark:hover:bg-gray-900/50 hover:border-gray-700/50"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Icon with gradient background */}
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg mr-4 transition-all duration-300 flex-shrink-0",
                  isActive 
                    ? `bg-gradient-to-br ${item.color} shadow-lg scale-105` 
                    : "bg-gray-700/50 dark:bg-gray-800/50 group-hover:bg-gray-600/50 dark:group-hover:bg-gray-700/50 group-hover:scale-105"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors duration-300",
                    isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-white"
                  )} />
                </div>
                
                {!collapsed && (
                  <span className="transition-all duration-300 flex-1 min-w-0 truncate">{item.label}</span>
                )}
                
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <div className="w-2 h-2 rounded-full bg-chariot-accent shadow-sm animate-pulse flex-shrink-0"></div>
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
          <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-gray-800/60 to-gray-800/40 dark:from-gray-900/60 dark:to-gray-900/40 border border-gray-700/30 backdrop-blur-sm">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center shadow-lg flex-shrink-0 ring-2 ring-chariot-purple/20">
              <span className="text-white font-semibold text-sm">{userFirstName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">Hi {userFirstName} 👋</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs truncate">Welcome back</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" title="Online"></div>
          </div>
        )}
        
        {/* Collapsed user avatar */}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center shadow-lg ring-2 ring-chariot-purple/20">
              <span className="text-white font-semibold text-sm">{userFirstName.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-gray-300 dark:text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300 min-h-[44px] rounded-xl",
            "focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/30",
            collapsed && "justify-center px-0"
          )}
          onClick={handleLogout}
          aria-label="Logout"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 mr-3 group-hover:bg-red-500/20 transition-colors duration-300 flex-shrink-0">
            <LogOut className="h-4 w-4" />
          </div>
          {!collapsed && <span className="font-medium">Logout</span>}
        </Button>
        </div>
      </div>
    </>
  );
};
