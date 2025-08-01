
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FacebookConnect } from "@/components/platforms/FacebookConnect";
import { InstagramConnect } from "@/components/platforms/InstagramConnect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

const PlatformConnections = () => {
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold chariot-gradient-text">Platform Connections</h1>
          <p className="text-muted-foreground">Connect your marketing platforms to enable automated campaigns</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FacebookConnect />
          <InstagramConnect />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlatformConnections;
