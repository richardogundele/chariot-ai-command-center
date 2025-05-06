
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, Settings } from "lucide-react";

const mockCampaigns = [
  {
    id: 1,
    name: "Premium Fitness Watch Campaign",
    product: "Premium Fitness Watch",
    status: "Active",
    budget: "$250/day",
    platforms: ["Facebook", "Instagram", "Google"],
    performance: {
      roas: "3.2x",
      ctr: "3.8%",
      conversions: 142,
      spend: "$1,245.80"
    }
  },
  {
    id: 2,
    name: "Wireless Headphones Promo",
    product: "Wireless Noise-Cancelling Headphones",
    status: "Paused",
    budget: "$150/day",
    platforms: ["Facebook", "Google"],
    performance: {
      roas: "2.8x",
      ctr: "2.1%",
      conversions: 87,
      spend: "$985.25"
    }
  },
  {
    id: 3,
    name: "Security Camera Launch",
    product: "Smart Home Security Camera",
    status: "Draft",
    budget: "$0/day",
    platforms: [],
    performance: {
      roas: "0",
      ctr: "0%",
      conversions: 0,
      spend: "$0"
    }
  },
];

export const CampaignList = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Campaigns</CardTitle>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <CardDescription>Manage your active and paused campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCampaigns.map(campaign => (
            <div 
              key={campaign.id}
              className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => console.log(`View campaign ${campaign.id}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">Product: {campaign.product}</div>
                </div>
                <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                  campaign.status === "Active" ? "bg-green-500/10 text-green-600" :
                  campaign.status === "Paused" ? "bg-yellow-500/10 text-yellow-600" :
                  "bg-gray-500/10 text-gray-600"
                }`}>
                  {campaign.status}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Budget</div>
                  <div className="text-sm font-medium">{campaign.budget}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">ROAS</div>
                  <div className="text-sm font-medium">{campaign.performance.roas}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">CTR</div>
                  <div className="text-sm font-medium">{campaign.performance.ctr}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Conversions</div>
                  <div className="text-sm font-medium">{campaign.performance.conversions}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Spend</div>
                  <div className="text-sm font-medium">{campaign.performance.spend}</div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  {campaign.platforms.map(platform => (
                    <span 
                      key={platform} 
                      className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium text-primary"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={campaign.status === "Active" ? "" : "hidden"}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={campaign.status === "Paused" ? "" : "hidden"}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
