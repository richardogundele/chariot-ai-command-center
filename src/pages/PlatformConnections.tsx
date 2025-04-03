
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus, Loader2, ExternalLink } from "lucide-react";

const platformsData = [
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect to create and manage Facebook Ad campaigns",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: "bg-blue-600",
    connected: false,
    accounts: [],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect to create and manage Instagram Ad campaigns",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
      </svg>
    ),
    color: "bg-purple-600",
    connected: false,
    accounts: [],
  },
  {
    id: "google",
    name: "Google Ads",
    description: "Connect to create and manage Google Ad campaigns",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
    ),
    color: "bg-red-600",
    connected: false,
    accounts: [],
  },
  {
    id: "twitter",
    name: "Twitter Ads",
    description: "Connect to create and manage Twitter Ad campaigns",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
      </svg>
    ),
    color: "bg-blue-400",
    connected: false,
    accounts: [],
  },
];

const PlatformConnections = () => {
  const [platforms, setPlatforms] = useState(platformsData);
  const [connecting, setConnecting] = useState(null);
  const { toast } = useToast();

  const handleConnect = (platformId) => {
    setConnecting(platformId);
    
    // Simulate connection process
    setTimeout(() => {
      setPlatforms(platforms.map(platform => {
        if (platform.id === platformId) {
          return {
            ...platform,
            connected: true,
            accounts: [{
              id: 'acc_' + Math.random().toString(36).substr(2, 9),
              name: `${platform.name} Business Account`,
              type: 'Business',
            }]
          };
        }
        return platform;
      }));
      
      setConnecting(null);
      
      toast({
        title: "Platform Connected",
        description: `Successfully connected to ${platforms.find(p => p.id === platformId).name}.`,
      });
    }, 2000);
  };

  const handleDisconnect = (platformId) => {
    setPlatforms(platforms.map(platform => {
      if (platform.id === platformId) {
        return {
          ...platform,
          connected: false,
          accounts: []
        };
      }
      return platform;
    }));
    
    toast({
      title: "Platform Disconnected",
      description: `Successfully disconnected from ${platforms.find(p => p.id === platformId).name}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Connections</h1>
        <p className="text-muted-foreground">Connect ChariotAI to your marketing platforms</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {platforms.map((platform) => (
          <Card key={platform.id} className="overflow-hidden">
            <CardHeader className={`text-white ${platform.color}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-current">
                    {platform.icon}
                  </div>
                  <div>
                    <CardTitle>{platform.name}</CardTitle>
                    <CardDescription className="text-white/80">
                      {platform.connected ? "Connected" : "Not connected"}
                    </CardDescription>
                  </div>
                </div>
                {platform.connected && (
                  <Badge variant="outline" className="bg-white/20 border-white/40 text-white">
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-6">
                {platform.description}
              </p>
              
              {platform.connected && platform.accounts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Connected Accounts</h3>
                  {platform.accounts.map(account => (
                    <div key={account.id} className="flex justify-between items-center p-3 bg-muted rounded-md mb-2">
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.type}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6">
              {!platform.connected ? (
                <Button 
                  onClick={() => handleConnect(platform.id)}
                  disabled={connecting === platform.id}
                  className="w-full"
                >
                  {connecting === platform.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex w-full gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDisconnect(platform.id)}
                  >
                    Disconnect
                  </Button>
                  <Button className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default PlatformConnections;
