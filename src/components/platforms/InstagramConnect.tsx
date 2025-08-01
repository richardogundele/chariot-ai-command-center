import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Instagram, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { 
  checkFacebookConnection, 
  saveFacebookCredentials, 
  disconnectFacebook,
  validateFacebookToken,
  getFacebookUserInfo
} from "@/services/platforms/facebook";

export const InstagramConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [simulateDemo, setSimulateDemo] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [validationActive, setValidationActive] = useState(false);
  const { toast } = useToast();

  // Check connection status on component mount
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        setIsCheckingConnection(true);
        const connected = await checkFacebookConnection(); // Instagram uses same Meta API
        setIsConnected(connected);
        if (!connected) {
          setTokenError("Instagram connection not found or expired. Please reconnect.");
        } else {
          setTokenError(null);
        }
      } catch (error) {
        console.error("Error checking Instagram connection:", error);
        setIsConnected(false);
        setTokenError(error instanceof Error ? error.message : "Failed to check connection");
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkConnectionStatus();
  }, []);

  // Pre-validate token as user types
  useEffect(() => {
    const validateToken = async () => {
      if (accessToken.length > 20 && !validationActive) {
        setValidationActive(true);
        try {
          const userInfo = await getFacebookUserInfo(accessToken);
          if (userInfo) {
            setUserName(userInfo.name);
            setTokenError(null);
          } else {
            setUserName(null);
            setTokenError("Invalid access token");
          }
        } catch (error) {
          setUserName(null);
          setTokenError("Invalid access token");
        } finally {
          setValidationActive(false);
        }
      } else if (accessToken.length <= 20) {
        setUserName(null);
        setTokenError(null);
      }
    };

    const debounceTimer = setTimeout(validateToken, 500);
    return () => clearTimeout(debounceTimer);
  }, [accessToken, validationActive]);

  const handleSimulateConnect = async () => {
    setIsLoading(true);
    try {
      // Save a dummy token for demo purposes
      const success = await saveFacebookCredentials({
        accessToken: "demo_instagram_token_" + Date.now(),
        userId: "demo_user",
        expiresAt: Date.now() + (60 * 24 * 60 * 60 * 1000) // 60 days
      });

      if (success) {
        setIsConnected(true);
        setIsDialogOpen(false);
        setTokenError(null);
        toast({
          title: "Demo Mode Activated",
          description: "Instagram demo connection established successfully!",
        });
      }
    } catch (error) {
      console.error("Demo connection error:", error);
      toast({
        title: "Demo Connection Failed",
        description: "Failed to establish demo connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateToken = async () => {
    if (!accessToken) {
      toast({
        title: "Missing Token",
        description: "Please enter your Instagram access token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await validateFacebookToken(accessToken);
      if (isValid) {
        const userInfo = await getFacebookUserInfo(accessToken);
        setUserName(userInfo?.name || null);
        toast({
          title: "Token Valid",
          description: `Instagram access token is valid${userInfo ? ` for ${userInfo.name}` : ''}`,
        });
      } else {
        setUserName(null);
        toast({
          title: "Invalid Token",
          description: "The Instagram access token is not valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      setUserName(null);
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : "Failed to validate token",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!accessToken) {
      toast({
        title: "Missing Token",
        description: "Please enter your Instagram access token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First validate the token
      const isValid = await validateFacebookToken(accessToken);
      if (!isValid) {
        toast({
          title: "Invalid Token",
          description: "The provided Instagram access token is not valid",
          variant: "destructive",
        });
        return;
      }

      // Get user info
      const userInfo = await getFacebookUserInfo(accessToken);
      if (!userInfo) {
        toast({
          title: "Connection Failed",
          description: "Could not retrieve user information from Instagram",
          variant: "destructive",
        });
        return;
      }

      // Save credentials (using Facebook service since Instagram uses same Meta API)
      const success = await saveFacebookCredentials({
        accessToken,
        userId: userInfo.id,
        expiresAt: Date.now() + (60 * 24 * 60 * 60 * 1000) // 60 days default
      });

      if (success) {
        setIsConnected(true);
        setIsDialogOpen(false);
        setTokenError(null);
        setUserName(userInfo.name);
        toast({
          title: "Instagram Connected",
          description: `Successfully connected Instagram account for ${userInfo.name}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to save Instagram connection. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Instagram connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect Instagram account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const success = await disconnectFacebook(); // Instagram uses same connection service
      if (success) {
        setIsConnected(false);
        setUserName(null);
        setTokenError("Instagram connection removed. Please reconnect to create ads.");
        toast({
          title: "Instagram Disconnected",
          description: "Instagram account has been disconnected successfully",
        });
      } else {
        toast({
          title: "Disconnection Failed",
          description: "Failed to disconnect Instagram account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Instagram disconnection error:", error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect Instagram account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingConnection) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full">
              <Instagram className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle>Instagram</CardTitle>
              <CardDescription>Checking connection...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Verifying Instagram connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full">
              <Instagram className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle>Instagram</CardTitle>
              <CardDescription>
                {isConnected
                  ? `Connected${userName ? ` as ${userName}` : ''}`
                  : "Connect your Instagram Business account"
                }
              </CardDescription>
            </div>
          </div>
          {isConnected ? (
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertCircle className="w-3 h-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {tokenError && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{tokenError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Instagram ads are managed through Meta Business (same as Facebook). 
            Connect your account to create and manage Instagram advertising campaigns.
          </p>

          <div className="flex gap-2">
            {isConnected ? (
              <>
                <Button 
                  onClick={handleValidateToken} 
                  variant="outline" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Verify Connection
                </Button>
                <Button 
                  onClick={handleDisconnect} 
                  variant="destructive" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Disconnect
                </Button>
              </>
            ) : (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Connect Instagram</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Connect Instagram Business Account</DialogTitle>
                    <DialogDescription>
                      Enter your Meta access token to connect your Instagram Business account for ad management.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram-token">Instagram Access Token</Label>
                      <Input
                        id="instagram-token"
                        type="password"
                        placeholder="Enter your Meta access token..."
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        disabled={isLoading}
                      />
                      {userName && (
                        <p className="text-sm text-green-600">
                          ✓ Token valid for: {userName}
                        </p>
                      )}
                      {validationActive && (
                        <p className="text-sm text-muted-foreground">
                          <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
                          Validating token...
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleValidateToken}
                        variant="outline"
                        disabled={isLoading || !accessToken}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Validate
                      </Button>
                      <Button
                        onClick={handleConnect}
                        disabled={isLoading || !accessToken}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Connect
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Demo Mode</p>
                      <Button
                        onClick={handleSimulateConnect}
                        variant="outline"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Use Demo Connection
                      </Button>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>How to get your Instagram access token:</strong><br />
                        1. Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Meta for Developers</a><br />
                        2. Create or select your app<br />
                        3. Add "Instagram Basic Display" or "Instagram Marketing API" product<br />
                        4. Generate a User Access Token with required permissions:<br />
                        • instagram_basic<br />
                        • ads_management<br />
                        • ads_read<br />
                        • business_management<br />
                        5. Copy the generated token and paste it above
                      </AlertDescription>
                    </Alert>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};