
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { saveFacebookCredentials, checkFacebookConnection, disconnectFacebook } from "@/services/platforms/facebookService";
import { useEffect } from "react";
import { Check, Facebook, X } from "lucide-react";

export const FacebookConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function checkConnection() {
      const connected = await checkFacebookConnection();
      setIsConnected(connected);
    }
    
    checkConnection();
  }, []);

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      toast({
        title: "Missing token",
        description: "Please enter a valid Facebook access token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await saveFacebookCredentials({ accessToken });
      
      if (success) {
        toast({
          title: "Connection successful",
          description: "Your Facebook account has been connected",
        });
        setIsConnected(true);
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Connection failed",
          description: "Failed to connect to Facebook. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Facebook connection error:", error);
      toast({
        title: "Connection error",
        description: "An error occurred while connecting to Facebook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    
    try {
      const success = await disconnectFacebook();
      
      if (success) {
        toast({
          title: "Disconnected",
          description: "Your Facebook account has been disconnected",
        });
        setIsConnected(false);
      } else {
        toast({
          title: "Disconnect failed",
          description: "Failed to disconnect from Facebook. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Facebook disconnection error:", error);
      toast({
        title: "Disconnect error",
        description: "An error occurred while disconnecting from Facebook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-blue-500/20 hover:border-blue-500/40 transition-colors shadow-sm">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Facebook className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <CardTitle>Facebook</CardTitle>
            <CardDescription>Connect your Facebook Business account</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              {isConnected ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
            </div>
            <span>{isConnected ? 'Connected' : 'Not connected'}</span>
          </div>
          
          {isConnected ? (
            <Button variant="outline" disabled={isLoading} onClick={handleDisconnect}>
              {isLoading ? "Processing..." : "Disconnect"}
            </Button>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Connect</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect to Facebook</DialogTitle>
                  <DialogDescription>
                    Enter your Facebook access token to connect your account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fb-token">Access Token</Label>
                    <Input 
                      id="fb-token" 
                      value={accessToken} 
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="Enter your Facebook access token" 
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your access token from the Facebook Developer Portal
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)} 
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConnect} disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {isConnected ? 
          "Your Facebook account is connected and ready for campaigns." : 
          "Connect to create and manage Facebook ad campaigns."
        }
      </CardFooter>
    </Card>
  );
};
