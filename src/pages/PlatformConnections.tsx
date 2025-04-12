
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FacebookConnect } from "@/components/platforms/FacebookConnect";
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
          
          {/* Placeholder for future platform connections */}
          <Card className="w-full border-gray-300/20 opacity-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <CardTitle>Instagram</CardTitle>
                  <CardDescription>Coming soon...</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Instagram ad platform integration will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlatformConnections;
