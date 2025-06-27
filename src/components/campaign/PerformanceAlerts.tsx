
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, TrendingDown, TrendingUp, Bell, Settings } from "lucide-react";
import { toast } from "sonner";

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'success' | 'danger';
  title: string;
  message: string;
  campaignId: string;
  campaignName: string;
  timestamp: Date;
  isRead: boolean;
}

interface PerformanceAlertsProps {
  campaignId?: string;
}

export const PerformanceAlerts = ({ campaignId }: PerformanceAlertsProps) => {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Simulate alerts generation
  useEffect(() => {
    const generateMockAlerts = () => {
      const mockAlerts: PerformanceAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Low CTR Alert',
          message: 'Campaign CTR has dropped below 1.5% in the last 24 hours',
          campaignId: 'camp-1',
          campaignName: 'Summer Sale Campaign',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false
        },
        {
          id: '2',
          type: 'danger',
          title: 'High CPA Alert',
          message: 'Cost per acquisition has increased by 40% compared to last week',
          campaignId: 'camp-2',
          campaignName: 'Product Launch Campaign',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: false
        },
        {
          id: '3',
          type: 'success',
          title: 'ROAS Improvement',
          message: 'Return on ad spend has improved by 25% in the last 3 days',
          campaignId: 'camp-3',
          campaignName: 'Holiday Promotion',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          isRead: true
        }
      ];

      if (campaignId) {
        setAlerts(mockAlerts.filter(alert => alert.campaignId === campaignId));
      } else {
        setAlerts(mockAlerts);
      }
    };

    generateMockAlerts();
  }, [campaignId]);

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    toast.success("Alert dismissed");
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'danger':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return 'secondary';
      case 'danger':
        return 'destructive';
      case 'success':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Performance Alerts
            </CardTitle>
            <CardDescription>
              {campaignId ? 'Campaign-specific alerts' : 'All campaign alerts and notifications'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!alertsEnabled ? (
          <div className="text-center p-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Performance alerts are disabled</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No alerts at this time</p>
            <p className="text-sm">Your campaigns are performing well!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${
                  alert.isRead ? 'opacity-60' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <h4 className="font-semibold">{alert.title}</h4>
                    <Badge variant={getAlertBadgeVariant(alert.type) as any}>
                      {alert.type}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <p className="text-sm mb-2">{alert.message}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Campaign: {alert.campaignName}</span>
                  <span>{alert.timestamp.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
