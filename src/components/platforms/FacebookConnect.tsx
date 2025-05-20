
import { useState, useEffect } from "react";
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
import { saveFacebookCredentials, checkFacebookConnection, disconnectFacebook, validateFacebookToken } from "@/services/platforms/facebook/auth";
import { getFacebookUserInfo } from "@/services/platforms/facebook/apiClient";
import { Check, ExternalLink, Facebook, Info, Loader2, RefreshCw, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";

export const FacebookConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [simulateDemo, setSimulateDemo] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [validationActive, setValidationActive] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      setIsCheckingConnection(true);
      try {
        const connected = await checkFacebookConnection();
        setIsConnected(connected);
        
        // Clear any previous errors if connection is successful
        if (connected) {
          setTokenError(null);
        }
      } catch (error: any) {
        // Check if error message contains token expiration info
        const errorMsg = error?.message || '';
        if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
          setTokenError(errorMsg);
          setIsConnected(false);
        }
        console.error("Error checking Facebook connection:", error);
      } finally {
        setIsCheckingConnection(false);
      }
    }
    
    checkConnection();
  }, []);

  // Pre-validate token as user types
  useEffect(() => {
    const validateToken = async () => {
      if (!accessToken || accessToken.length < 50 || !validationActive) return;
      
      try {
        const userInfo = await getFacebookUserInfo(accessToken);
        if (userInfo) {
          setUserName(userInfo.name);
          toast.success("Token looks valid!", { 
            description: `Connected to ${userInfo.name}'s Facebook account` 
          });
        } else {
          setUserName(null);
          toast.error("Token validation failed", { 
            description: "Could not verify this token. It might be expired or invalid." 
          });
        }
      } catch (error) {
        console.error("Token pre-validation error:", error);
        setUserName(null);
      }
      
      setValidationActive(false);
    };

    validateToken();
  }, [accessToken, validationActive]);

  const handleSimulateConnect = async () => {
    setIsLoading(true);
    
    // Simulate API connection process with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Create a demo token that will be valid for 7 days
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      const demoToken = `DEMO_MVP_TOKEN_${Date.now()}`;
      const success = await saveFacebookCredentials({ 
        accessToken: demoToken,
        userId: "demo_user_123456789",
        expiresAt
      });
      
      if (success) {
        toast.success("Facebook account connected successfully", {
          description: "Demo connection established for your MVP presentation"
        });
        setIsConnected(true);
        setIsDialogOpen(false);
        setTokenError(null);
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

  const handleValidateToken = async () => {
    if (!accessToken.trim()) {
      toast.error("Missing token", {
        description: "Please enter a Facebook access token"
      });
      return;
    }

    setValidationActive(true);
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
    setTokenError(null);
    
    try {
      // First validate the token
      const isValid = await validateFacebookToken(accessToken);
      
      if (!isValid) {
        toast.error("Invalid token", {
          description: "This token appears to be invalid or expired. Please generate a new one."
        });
        setIsLoading(false);
        return;
      }
      
      // Get user info to store with the token
      const userInfo = await getFacebookUserInfo(accessToken);
      
      if (!userInfo) {
        toast.error("Couldn't retrieve account info", {
          description: "We were unable to get your Facebook account information with this token."
        });
        setIsLoading(false);
        return;
      }
      
      // Default token expiration to 60 days if we can't determine it
      const expiresAt = Date.now() + 60 * 24 * 60 * 60 * 1000;
      
      const success = await saveFacebookCredentials({ 
        accessToken,
        userId: userInfo.id,
        expiresAt
      });
      
      if (success) {
        toast.success("Connection successful", {
          description: `Connected to ${userInfo.name}'s Facebook account`
        });
        setIsConnected(true);
        setIsDialogOpen(false);
        setUserName(userInfo.name);
      } else {
        toast.error("Connection failed", {
          description: "Failed to connect to Facebook. Please try again."
        });
      }
    } catch (error: any) {
      console.error("Facebook connection error:", error);
      
      // Check if the error is related to token expiration
      const errorMsg = error?.message || '';
      if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
        setTokenError(errorMsg);
        toast.error("Invalid token", {
          description: "The access token provided is expired or invalid. Please generate a new token."
        });
      } else {
        toast.error("Connection error", {
          description: error?.message || "An error occurred while connecting to Facebook"
        });
      }
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
        setTokenError(null);
        setUserName(null);
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
        {tokenError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription className="text-xs">
              {tokenError.includes('expired') 
                ? "Your Facebook access token has expired. Please reconnect with a new token."
                : tokenError}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isCheckingConnection ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            ) : (
              <div className={`p-1 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                {isConnected ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
            )}
            <div>
              <span>{isCheckingConnection ? 'Checking connection...' : isConnected ? 'Connected' : 'Not connected'}</span>
              {isConnected && userName && (
                <p className="text-xs text-muted-foreground">Account: {userName}</p>
              )}
            </div>
          </div>
          
          {isConnected ? (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                disabled={isCheckingConnection || isLoading}
                onClick={async () => {
                  setIsCheckingConnection(true);
                  try {
                    const connected = await checkFacebookConnection();
                    setIsConnected(connected);
                    if (connected) {
                      toast.success("Connection verified", {
                        description: "Your Facebook connection is active"
                      });
                    } else {
                      toast.error("Connection lost", {
                        description: "Your Facebook connection is no longer valid. Please reconnect."
                      });
                    }
                  } catch (error: any) {
                    console.error("Error refreshing connection status:", error);
                    setTokenError(error?.message || "Could not verify connection status");
                    setIsConnected(false);
                    toast.error("Verification failed", {
                      description: error?.message || "Could not verify connection status"
                    });
                  } finally {
                    setIsCheckingConnection(false);
                  }
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-xs">Verify</span>
              </Button>
              
              <Button variant="outline" disabled={isCheckingConnection || isLoading} onClick={handleDisconnect}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Disconnect"
                )}
              </Button>
            </div>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Connect</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
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
                      <div className="flex space-x-2">
                        <Input 
                          id="fb-token" 
                          value={accessToken} 
                          onChange={(e) => {
                            setAccessToken(e.target.value);
                            setUserName(null); // Reset user name when token changes
                          }}
                          placeholder="Enter your Facebook access token" 
                          className="flex-1"
                        />
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={handleValidateToken}
                          disabled={!accessToken || accessToken.length < 20}
                        >
                          Validate
                        </Button>
                      </div>
                      
                      {userName && (
                        <div className="rounded-md bg-green-50 p-3 mt-2">
                          <div className="flex">
                            <Check className="h-5 w-5 text-green-400 mr-2" />
                            <p className="text-sm text-green-700">
                              Token validated successfully for {userName}'s account
                            </p>
                          </div>
                        </div>
                      )}
                      
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
                      
                      <Alert className="mt-4">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Getting a Valid Access Token</AlertTitle>
                        <AlertDescription className="text-xs space-y-2">
                          <p>1. Go to the <a href="https://developers.facebook.com/tools/explorer/" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Graph API Explorer</a>.</p>
                          <p>2. Select your app from the dropdown (or create one if needed).</p>
                          <p>3. Click on "Generate Access Token" and log in with your Facebook account.</p>
                          <p>4. In the permissions dialog, make sure to select these permissions:</p>
                          <ul className="list-disc list-inside pl-2">
                            <li>ads_management</li>
                            <li>ads_read</li>
                            <li>business_management</li>
                            <li>public_profile</li>
                          </ul>
                          <p>5. Click "Generate Token" and copy the resulting token.</p>
                          <p className="font-semibold mt-2">Note: Facebook tokens expire after approximately 60 days.</p>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {simulateDemo && (
                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Demo mode will create a simulated connection for your MVP presentation. No real Facebook connection will be established.
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
                  <Button onClick={handleConnect} disabled={isLoading || (!simulateDemo && !accessToken)}>
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
