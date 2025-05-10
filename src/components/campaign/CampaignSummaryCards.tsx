
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, BarChart3, TrendingUp, Users, 
  ArrowUpRight, ArrowDownRight 
} from "lucide-react";

interface CampaignSummaryCardsProps {
  impressions?: number;
  clicks?: number;
  ctr?: number;
  spend?: number;
}

export const CampaignSummaryCards: React.FC<CampaignSummaryCardsProps> = ({
  impressions = 0,
  clicks = 0,
  ctr = 0,
  spend = 0
}) => {
  // Format numbers for display
  const formattedSpend = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(spend);
  
  const formattedCtr = new Intl.NumberFormat('en-US', { 
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1 
  }).format(ctr / 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Impressions</p>
              <h2 className="text-3xl font-bold">{impressions.toLocaleString()}</h2>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <Play className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              New
            </div>
            <span className="text-xs text-muted-foreground">since campaign start</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clicks</p>
              <h2 className="text-3xl font-bold">{clicks.toLocaleString()}</h2>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Live
            </div>
            <span className="text-xs text-muted-foreground">updating in real-time</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">CTR</p>
              <h2 className="text-3xl font-bold">{formattedCtr}</h2>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Good
            </div>
            <span className="text-xs text-muted-foreground">industry average</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Spend</p>
              <h2 className="text-3xl font-bold">{formattedSpend}</h2>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <Users className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              Under
            </div>
            <span className="text-xs text-muted-foreground">budget</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
