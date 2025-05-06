
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, BarChart3, TrendingUp, Users, 
  ArrowUpRight, ArrowDownRight 
} from "lucide-react";

export const CampaignSummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
              <h2 className="text-3xl font-bold">3</h2>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <Play className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              2
            </div>
            <span className="text-xs text-muted-foreground">vs. last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spend</p>
              <h2 className="text-3xl font-bold">$3,245</h2>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              12.5%
            </div>
            <span className="text-xs text-muted-foreground">vs. last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. ROAS</p>
              <h2 className="text-3xl font-bold">3.2x</h2>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              0.4x
            </div>
            <span className="text-xs text-muted-foreground">vs. last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversions</p>
              <h2 className="text-3xl font-bold">235</h2>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <Users className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-red-600 text-sm font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              3.2%
            </div>
            <span className="text-xs text-muted-foreground">vs. last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
