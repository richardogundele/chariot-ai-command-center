
import { Clock, Zap, TrendingUp, Users, BarChart3, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Sample activity data
  const activities: ActivityItem[] = [
    {
      id: 1,
      time: "Just now",
      icon: Zap,
      iconColor: "text-yellow-500",
      iconBgColor: "bg-yellow-500/10",
      title: "Ad creative A/B test started",
      description: "Testing 3 variations to improve engagement",
      isNew: true
    },
    {
      id: 2,
      time: "5 min ago",
      icon: TrendingUp,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-500/10",
      title: "Budget reallocation",
      description: "Moved $50 from Instagram to Facebook ads",
      isNew: true
    },
    {
      id: 3,
      time: "23 min ago",
      icon: DollarSign,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
      title: "New sale recorded",
      description: "Product X - $89.99 from Facebook campaign",
    },
    {
      id: 4,
      time: "1 hour ago",
      icon: Users,
      iconColor: "text-indigo-500",
      iconBgColor: "bg-indigo-500/10",
      title: "Audience analysis completed",
      description: "Found 2 high-performing segments",
    },
    {
      id: 5,
      time: "2 hours ago",
      icon: BarChart3,
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-500/10",
      title: "Weekly performance report",
      description: "ROAS increased by 0.4x compared to last week",
    },
    {
      id: 6,
      time: "4 hours ago",
      icon: Zap,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-500/10",
      title: "Ad optimization completed",
      description: "Updated bidding strategy for better performance",
    },
    {
      id: 7,
      time: "5 hours ago",
      icon: Clock,
      iconColor: "text-gray-500",
      iconBgColor: "bg-gray-500/10",
      title: "Campaign schedule updated",
      description: "Paused ads during non-converting hours",
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
