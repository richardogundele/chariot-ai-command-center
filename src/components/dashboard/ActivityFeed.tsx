
import { Clock, Zap, TrendingUp, Users, BarChart3, DollarSign, Plus, Trash2, Image, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth/authService";
import { fetchRecentActivity } from "@/services/dashboard/dashboardService";

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
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, recentData] = await Promise.all([
          getCurrentUser(),
          fetchRecentActivity()
        ]);

        // Set user name with improved fallback logic
        const { user } = userResponse;
        if (user && user.user_metadata && user.user_metadata.full_name) {
          // First priority: full name from user metadata
          const fullName = user.user_metadata.full_name as string;
          const firstName = fullName.split(' ')[0];
          setUserFirstName(firstName);
        } else if (user && user.user_metadata && user.user_metadata.name) {
          // Second priority: name field from user metadata
          const name = user.user_metadata.name as string;
          const firstName = name.split(' ')[0];
          setUserFirstName(firstName);
        } else if (user && user.email) {
          // Third priority: extract from email
          const emailUsername = user.email.split('@')[0];
          // Capitalize first letter for better presentation
          const capitalizedName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
          setUserFirstName(capitalizedName);
        } else {
          // Fallback to generic name
          setUserFirstName("User");
        }

        // Generate activities from real data
        const realActivities: ActivityItem[] = [];
        let id = 1;

        // Add recent products
        recentData.recentProducts.forEach((product, index) => {
          realActivities.push({
            id: id++,
            time: index === 0 ? "Just now" : `${(index + 1) * 2} hours ago`,
            icon: Plus,
            iconColor: "text-green-500",
            iconBgColor: "bg-green-500/10",
            title: "New product added",
            description: `${product.name} added to library`,
            isNew: index === 0
          });
        });

        // Add recent campaigns
        recentData.recentCampaigns.forEach((campaign, index) => {
          realActivities.push({
            id: id++,
            time: `${(index + 3) * 2} hours ago`,
            icon: Zap,
            iconColor: campaign.status === 'Active' ? "text-green-500" : campaign.status === 'Failed' ? "text-red-500" : "text-yellow-500",
            iconBgColor: campaign.status === 'Active' ? "bg-green-500/10" : campaign.status === 'Failed' ? "bg-red-500/10" : "bg-yellow-500/10",
            title: `Campaign ${campaign.status.toLowerCase()}`,
            description: `${campaign.name} campaign on ${campaign.platform}`,
          });
        });

        // Add some mock activities to fill the feed
        if (realActivities.length < 5) {
          realActivities.push(
            {
              id: id++,
              time: "6 hours ago",
              icon: TrendingUp,
              iconColor: "text-green-500",
              iconBgColor: "bg-green-500/10",
              title: "Budget reallocation",
              description: "Optimized ad spend allocation",
            },
            {
              id: id++,
              time: "8 hours ago",
              icon: DollarSign,
              iconColor: "text-blue-500",
              iconBgColor: "bg-blue-500/10",
              title: "Performance update",
              description: "Campaign metrics refreshed",
            }
          );
        }

        setActivities(realActivities.slice(0, 7)); // Limit to 7 activities
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Fallback to mock data
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Sample activity data as fallback
  const mockActivities: ActivityItem[] = [
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-md animate-pulse">
            <div className="flex-shrink-0 p-2 rounded-full h-9 w-9 bg-gray-200"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
