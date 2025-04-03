
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, Calendar, Download, TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { WeeklyProfitChart } from "@/components/reports/WeeklyProfitChart";
import { InsightCard } from "@/components/reports/InsightCard";
import { Progress } from "@/components/ui/progress";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Weekly Profit Report</h1>
          <p className="text-muted-foreground">April 1st - April 7th, 2025</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Change Period
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Weekly revenue, costs, and profit</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <WeeklyProfitChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Spend</span>
                <span className="text-sm font-medium">$5,400</span>
              </div>
              <Progress value={54} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Revenue</span>
                <span className="text-sm font-medium">$16,200</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="py-3 px-4 bg-primary/5 rounded-md border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">ROAS</span>
                <span className="font-bold text-xl">3.0x</span>
              </div>
              <p className="text-xs text-muted-foreground">Return on Ad Spend is above target (2.5x)</p>
            </div>
            
            <div className="py-3 px-4 bg-primary/5 rounded-md border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Net Profit</span>
                <span className="font-bold text-xl text-green-600">$10,800</span>
              </div>
              <p className="text-xs text-muted-foreground">+18% compared to previous week</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2">
              Reinvest Profits <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Key Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InsightCard 
          icon={TrendingUp}
          title="Google Ads Performance"
          description="Scaling up Google Ads led to 34% higher conversions this week while maintaining acquisition costs."
          action="Explore Performance"
        />
        
        <InsightCard 
          icon={TrendingDown}
          title="Facebook Ad Efficiency"
          description="Cost per conversion decreased by 12% after adjusting audience targeting based on last week's data."
          action="View Details"
        />
        
        <InsightCard 
          icon={DollarSign}
          title="Opportunity: TikTok Ads"
          description="Based on audience demographics, expanding to TikTok could yield a 22% higher ROAS than current platforms."
          action="Create Test Campaign"
        />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Strategic suggestions based on this week's performance</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-accent/10 rounded-md border border-accent/20">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Recommendation: Increase budget allocation
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Current ROAS of 3.0x suggests there's room to scale. Increasing daily budget by 20% could capture additional conversions while maintaining profitability.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">Decline</Button>
              <Button size="sm" variant="ghost">Modify</Button>
            </div>
          </div>
          
          <div className="p-4 bg-accent/10 rounded-md border border-accent/20">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Recommendation: Optimize ad creative
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Testing has shown that testimonial-based creatives are outperforming feature-focused ads by 28%. Shifting budget toward testimonial ads could improve overall campaign performance.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">Decline</Button>
              <Button size="sm" variant="ghost">Modify</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
