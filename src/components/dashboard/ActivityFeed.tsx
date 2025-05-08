
import { Clock, Zap, TrendingUp, Users, BarChart3, DollarSign, Plus, Trash2, Image, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth/authService";

interface ActivityItem {
  id: number;
  time: string;
  icon: React.ElementType;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
  isNew?: boolean;
}

export const ActivityFeed = () => {
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user && user.user_metadata && user.user_metadata.full_name) {
          const fullName = user.user_metadata.full_name as string;
          const firstName = fullName.split(' ')[0];
          setUserFirstName(firstName);
        } else if (user && user.email) {
          setUserFirstName(user.email.split('@')[0]);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    
    fetchUserInfo();
  }, []);

  // Sample activity data with product activities included
  const activities: ActivityItem[] = [
    {
      id: 1,
      time: "Just now",
      icon: Plus,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-500/10",
      title: "New product added",
      description: userFirstName ? `${userFirstName} added Premium Fitness Watch to library` : "Premium Fitness Watch added to library",
      isNew: true
    },
    {
      id: 2,
      time: "5 min ago",
      icon: Zap,
      iconColor: "text-yellow-500",
      iconBgColor: "bg-yellow-500/10",
      title: "Ad creative A/B test started",
      description: "Testing 3 variations to improve engagement",
      isNew: true
    },
    {
      id: 3,
      time: "23 min ago",
      icon: TrendingUp,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-500/10",
      title: "Budget reallocation",
      description: "Moved $50 from Instagram to Facebook ads",
    },
    {
      id: 4,
      time: "1 hour ago",
      icon: DollarSign,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
      title: "New sale recorded",
      description: "Product X - $89.99 from Facebook campaign",
    },
    {
      id: 5,
      time: "2 hours ago",
      icon: Trash2,
      iconColor: "text-red-500",
      iconBgColor: "bg-red-500/10",
      title: "Product deleted",
      description: userFirstName ? `${userFirstName} removed Wireless Headphones from library` : "Wireless Headphones removed from library",
    },
    {
      id: 6,
      time: "3 hours ago",
      icon: Edit,
      iconColor: "text-cyan-500",
      iconBgColor: "bg-cyan-500/10",
      title: "Ad copy regenerated",
      description: userFirstName ? `${userFirstName} updated copy for Organic Skincare Set` : "Updated copy for Organic Skincare Set",
    },
    {
      id: 7,
      time: "4 hours ago",
      icon: Image,
      iconColor: "text-emerald-500",
      iconBgColor: "bg-emerald-500/10",
      title: "Product image updated",
      description: userFirstName ? `${userFirstName} generated new image for Smart Home Hub` : "Generated new image for Smart Home Hub",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className={cn(
          "flex gap-3 p-3 rounded-md transition-all",
          activity.isNew ? "bg-primary/5 border border-primary/10" : ""
        )}>
          <div className={cn(
            "flex-shrink-0 p-2 rounded-full h-9 w-9 flex items-center justify-center",
            activity.iconBgColor
          )}>
            <activity.icon className={cn("h-4 w-4", activity.iconColor)} />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{activity.title}</h4>
              {activity.isNew && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                  New
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              <span>{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
