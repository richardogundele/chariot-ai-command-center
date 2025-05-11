
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
import { saveFacebookCredentials, checkFacebookConnection, disconnectFacebook } from "@/services/platforms/facebook/auth";
import { useEffect } from "react";
import { Check, ExternalLink, Facebook, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export const FacebookConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [simulateDemo, setSimulateDemo] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      const connected = await checkFacebookConnection();
      setIsConnected(connected);
    }
    
    checkConnection();
  }, []);

  const handleSimulateConnect = async () => {
    setIsLoading(true);
    
    // Simulate API connection process with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const demoToken = `DEMO_MVP_TOKEN_${Date.now()}`;
      const success = await saveFacebookCredentials({ 
        accessToken: demoToken,
        userId: "demo_user_123456789",
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      if (success) {
        toast.success("Facebook account connected successfully", {
          description: "Demo connection established for your MVP presentation"
        });
        setIsConnected(true);
        setIsDialogOpen(false);
      } else {
        toast.error("Connection failed", {
          description: "There was an issue connecting to Facebook"
        });
      }
    } catch (error) {
      console.error("Facebook connection error:", error);
      toast.error("Connection error", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (simulateDemo) {
      handleSimulateConnect();
      return;
    }
    
    if (!accessToken.trim()) {
      toast.error("Missing token", {
        description: "Please enter a valid Facebook access token"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await saveFacebookCredentials({ accessToken });
      
      if (success) {
        toast.success("Connection successful", {
          description: "Your Facebook account has been connected"
        });
        setIsConnected(true);
        setIsDialogOpen(false);
      } else {
        toast.error("Connection failed", {
          description: "Failed to connect to Facebook. Please try again."
        });
      }
    } catch (error) {
      console.error("Facebook connection error:", error);
      toast.error("Connection error", {
        description: "An error occurred while connecting to Facebook"
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
        toast.success("Disconnected", {
          description: "Your Facebook account has been disconnected"
        });
        setIsConnected(false);
      } else {
        toast.error("Disconnect failed", {
          description: "Failed to disconnect from Facebook. Please try again."
        });
      }
    } catch (error) {
      console.error("Facebook disconnection error:", error);
      toast.error("Disconnect error", {
        description: "An error occurred while disconnecting from Facebook"
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Disconnect"
              )}
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
                    Connect your Facebook account to manage your campaigns
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="demo-mode"
                      checked={simulateDemo}
                      onChange={(e) => setSimulateDemo(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <Label htmlFor="demo-mode" className="text-sm font-medium text-muted-foreground">
                      Use demo mode for MVP presentation
                    </Label>
                  </div>
                  
                  {!simulateDemo && (
                    <div className="space-y-2">
                      <Label htmlFor="fb-token">Access Token</Label>
                      <Input 
                        id="fb-token" 
                        value={accessToken} 
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="Enter your Facebook access token" 
                      />
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                          Get your access token from the Facebook Developer Portal
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-1 flex items-center gap-1"
                          onClick={() => window.open('https://developers.facebook.com/tools/explorer/', '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="text-xs">Get Token</span>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {simulateDemo && (
                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Demo mode will create a simulated connection for your MVP presentation
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {simulateDemo ? "Simulating..." : "Connecting..."}
                      </>
                    ) : (
                      simulateDemo ? "Connect Demo" : "Connect"
                    )}
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
