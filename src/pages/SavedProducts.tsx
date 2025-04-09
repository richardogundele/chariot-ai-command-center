import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, BarChart, RefreshCw, Settings, Trash2, Play, Loader2, Sparkles, Mail, FileText, Lightbulb, Copy, Check, Info, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const mockProducts = [
  {
    id: 1,
    name: "Premium Fitness Watch",
    description: "Advanced health tracking features with 7-day battery life",
    status: "Active",
    metrics: {
      sales: 142,
      revenue: 14200,
      roas: 3.5,
    },
    lastUpdated: "2 hours ago",
    platforms: ["facebook", "instagram"],
    adCopy: "Track your health journey with precision. Our Premium Fitness Watch offers 24/7 heart rate monitoring, sleep analysis, and week-long battery life. Perfect for serious athletes and health enthusiasts.",
    image: "/placeholder.svg",
    insights: [
      "Users aged 25-34 show highest engagement",
      "Morning ads outperform evening ads by 28%",
      "Health-focused messaging drives 3.2x more conversions"
    ]
  },
  {
    id: 2,
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium sound quality with 20-hour battery life",
    status: "Paused",
    metrics: {
      sales: 87,
      revenue: 8700,
      roas: 2.8,
    },
    lastUpdated: "1 day ago",
    platforms: ["facebook"],
    adCopy: "Immerse yourself in pure sound. Our Wireless Noise-Cancelling Headphones deliver crystal clear audio with deep bass and 20 hours of playtime. Perfect for work, travel, or escaping into your favorite music.",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    description: "1080p HD with night vision and motion detection",
    status: "Draft",
    metrics: {
      sales: 0,
      revenue: 0,
      roas: 0,
    },
    lastUpdated: "3 days ago",
    platforms: [],
    adCopy: "Protect what matters most. Our Smart Home Security Camera features crystal clear 1080p HD video, night vision, and instant motion alerts to your phone. Easy setup, 24/7 monitoring, and peace of mind.",
    image: "/placeholder.svg"
  },
];

const SavedProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState(mockProducts);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [regenerationType, setRegenerationType] = useState<string>("");
  const [salesLetterDialog, setSalesLetterDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [salesLetter, setSalesLetter] = useState("");
  const [salesLetterType, setSalesLetterType] = useState("promotional");
  const [salesLetterTarget, setSalesLetterTarget] = useState("broad");
  const [salesLetterLoading, setSalesLetterLoading] = useState(false);
  const [salesLetterCopied, setSalesLetterCopied] = useState(false);
  const [recommendationsDialog, setRecommendationsDialog] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignBudget, setCampaignBudget] = useState("50");
  const [campaignPlatform, setCampaignPlatform] = useState("facebook");
  const [campaignLoading, setCampaignLoading] = useState(false);

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been removed from your library",
    });
  };

  const handleCreateCampaign = (id: number) => {
    toast({
      title: "Campaign creation started",
      description: "Redirecting to campaign setup...",
    });
    navigate("/campaign");
  };

  const handleRegenerateContent = (id: number, type: string) => {
    setRegeneratingId(id);
    setRegenerationType(type);
    
    toast({
      title: "Regenerating content",
      description: `AI is creating new ${type === "adCopy" ? "ad copy" : "product image"}...`,
    });

    setTimeout(() => {
      setRegeneratingId(null);
      setRegenerationType("");
      toast({
        title: "Content regenerated",
        description: `New ${type === "adCopy" ? "ad copy" : "product image"} is now available.`,
      });
    }, 3000);
  };

  const handleSalesLetterGeneration = (product: any) => {
    setSelectedProduct(product);
    setSalesLetterDialog(true);
    setSalesLetter("");
  };

  const generateSalesLetter = () => {
    if (!selectedProduct) return;
    
    setSalesLetterLoading(true);
    
    setTimeout(() => {
      const letterTemplates = {
        promotional: {
          broad: `Subject: Transform Your Fitness Journey with the Premium Fitness Watch

Dear Valued Customer,

Are you ready to take control of your health and fitness like never before?

Introducing the Premium Fitness Watch – the ultimate companion for your wellness journey.

What makes our Premium Fitness Watch stand out:

• Advanced 24/7 heart rate monitoring that tracks your pulse with medical-grade accuracy
• In-depth sleep analysis that helps you optimize your rest and recovery
• Impressive 7-day battery life that keeps up with your active lifestyle
• Water-resistant design for swimmers and outdoor enthusiasts
• Intuitive interface that makes tracking your progress effortless

Our customers report significant improvements in their fitness goals, with 87% achieving better workout consistency and 72% experiencing improved sleep quality.

For a limited time, get 15% off when you use code FITNESS15 at checkout.

Don't settle for incomplete data about your health. Make informed decisions with the Premium Fitness Watch.

Take the first step toward a healthier you today!

[Shop Now]

To your health,
ChariotAI Team`,
          specific: `Subject: Specifically Designed for Serious Athletes: Premium Fitness Watch

Dear Fitness Enthusiast,

As someone committed to peak physical performance, you understand that precise data leads to precise results.

The Premium Fitness Watch was engineered with athletes like you in mind.

Elite features for elite performers:
• Heart rate variability tracking for optimizing training intensity
• Recovery metrics that prevent overtraining and injury
• VO2 max estimation to monitor cardiorespiratory fitness
• Advanced sleep cycle analysis for performance-focused recovery
• Training load monitoring to ensure progressive overload

Professional trainer Marcus Johnson says: "The detailed metrics from this watch have revolutionized how I program workouts for my Olympic-level clients."

When your training demands precision, your equipment should deliver it.

Special offer for dedicated athletes: Use code ELITE25 for 25% off and receive our exclusive "Peak Performance Training Guide" free with your purchase.

Push your limits with confidence.

[Upgrade Your Training]

In pursuit of excellence,
ChariotAI Team`,
        },
        follow_up: {
          broad: `Subject: How's Your Premium Fitness Watch Experience?

Dear Valued Customer,

It's been a few weeks since you purchased your Premium Fitness Watch, and we're eager to hear how it's transforming your fitness journey.

Many of our customers report significant improvements in their:
• Daily activity levels
• Sleep quality
• Workout consistency
• Overall wellness awareness

Are you experiencing these benefits too? We'd love to know what features you're enjoying the most!

If you have any questions about maximizing your watch's capabilities, our support team is ready to help. Simply reply to this email.

As a valued customer, we're offering you exclusive access to our premium workout plans, perfectly tailored to work with your Premium Fitness Watch's tracking capabilities.

[Access Free Workout Plans]

Stay healthy,
ChariotAI Team

P.S. Know someone who could benefit from precision fitness tracking? Share the gift of health with our referral program and earn a $25 credit!`,
          specific: `Subject: Elevate Your Athletic Performance with Premium Fitness Watch Insights

Dear Fitness Professional,

As an athlete who demands the best from your body, you've now had your Premium Fitness Watch for a few weeks. We're curious: how has it impacted your training regimen?

Our professional athlete users report:
• 23% more efficient training sessions
• 18% improved recovery times
• Better periodization through data-driven insights
• More accurate training load management

Are you leveraging the advanced metrics to optimize your performance?

For serious athletes like you, we've created an exclusive webinar: "Data-Driven Performance: Unlocking Elite Potential with Your Premium Fitness Watch." This session features Olympic trainers and sports physiologists sharing advanced strategies.

[Reserve Your Spot - Limited Availability]

Additionally, we've prepared a personalized analysis of your first month's data with AI-powered recommendations to help you break through plateaus.

[Access Your Personalized Analysis]

Train smarter,
ChariotAI Performance Team

P.S. Your unique athlete discount code PERFORM20 gives your training partners 20% off their own Premium Fitness Watch.`,
        },
        educational: {
          broad: `Subject: Understanding Your Body's Data: Premium Fitness Watch Guide

Dear Health Enthusiast,

Knowledge is power, especially when it comes to your well-being.

Your Premium Fitness Watch collects thousands of data points daily. Here's how to interpret them for better health outcomes:

Heart Rate Zones Explained:
• Zone 1 (50-60%): Recovery zone - ideal for warm-ups and active recovery
• Zone 2 (60-70%): Fat burning zone - best for weight management
• Zone 3 (70-80%): Aerobic zone - improves cardiovascular efficiency
• Zone 4 (80-90%): Anaerobic zone - increases performance capacity
• Zone 5 (90-100%): Maximum effort - boosts speed and power

Sleep Metrics That Matter:
The sleep analysis feature tracks REM, light, and deep sleep phases. Aim for 20-25% deep sleep for optimal recovery and cognitive function.

Stress Score Interpretation:
Your watch measures heart rate variability to assess stress levels. A higher variability indicates better stress resilience.

We've created a comprehensive guide to help you apply these insights to your daily routine.

[Download Free Wellness Guide]

To your continued health journey,
ChariotAI Education Team`,
          specific: `Subject: Advanced Biometric Analysis for Athletic Excellence

Dear Performance Athlete,

The difference between good and great often comes down to how you interpret and apply data.

Your Premium Fitness Watch provides elite-level metrics that, when properly understood, can transform your training approach:

Training Effect Analysis:
• Aerobic TE: Measures improvement to cardiovascular system
• Anaerobic TE: Tracks development of power and muscular endurance
• Optimal weekly balance: 80% aerobic / 20% anaerobic for most endurance athletes

Recovery Time Science:
The suggested recovery hours are calculated based on:
• Exercise intensity distribution
• Training impulse (TRIMP) score
• Heart rate variability trends
• Previous training load

Readiness Score Optimization:
• 90-100: Prime for high-intensity training
• 70-89: Good for moderate sessions
• Below 70: Focus on recovery or technique work

We've partnered with sports scientists to create an advanced interpretation guide specifically for competitive athletes.

[Access Elite Performance Analysis Guide]

For peak performance,
ChariotAI Sports Science Division`,
        }
      };
      
      const letterContent = letterTemplates[salesLetterType as keyof typeof letterTemplates]?.[salesLetterTarget as keyof typeof letterTemplates.promotional] || '';
      
      setSalesLetter(letterContent);
      setSalesLetterLoading(false);
    }, 2000);
  };

  const handleCopySalesLetter = () => {
    navigator.clipboard.writeText(salesLetter);
    setSalesLetterCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The sales letter has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setSalesLetterCopied(false);
    }, 2000);
  };

  const handleAIRecommendations = (product: any) => {
    setSelectedProduct(product);
    setRecommendationsDialog(true);
    setRecommendations([]);
    setRecommendationsLoading(true);
    
    setTimeout(() => {
      const mockRecommendations = [
        "Increase budget by 15% for Instagram campaigns targeting 25-34 year olds to maximize ROAS",
        "Create video ads focusing on sleep analysis feature which is generating 32% more engagement",
        "Test new ad creative with morning workout imagery based on time-of-day performance data",
        "Expand targeting to include 'marathon training' interest group which shows high conversion potential",
        "Adjust campaign scheduling to increase delivery between 6-9am when CTR is highest"
      ];
      
      setRecommendations(mockRecommendations);
      setRecommendationsLoading(false);
    }, 2500);
  };

  const handleQuickCampaignCreation = () => {
    setCampaignLoading(true);
    
    setTimeout(() => {
      setCampaignLoading(false);
      setCampaignDialog(false);
      
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully. View details in Campaign page.",
      });
      
      navigate("/campaign");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Saved Products</h1>
          <p className="text-muted-foreground">View and manage your product library</p>
        </div>
        <Button onClick={() => navigate("/products")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="draft">Ready for Ads</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
                onCreateCampaign={handleCreateCampaign}
                onRegenerate={handleRegenerateContent}
                onSalesLetter={handleSalesLetterGeneration}
                onRecommendations={handleAIRecommendations}
                regeneratingId={regeneratingId}
                regenerationType={regenerationType}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.status === "Active").map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
                onCreateCampaign={handleCreateCampaign}
                onRegenerate={handleRegenerateContent}
                onSalesLetter={handleSalesLetterGeneration}
                onRecommendations={handleAIRecommendations}
                regeneratingId={regeneratingId}
                regenerationType={regenerationType}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="paused" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.status === "Paused").map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
                onCreateCampaign={handleCreateCampaign}
                onRegenerate={handleRegenerateContent}
                onSalesLetter={handleSalesLetterGeneration}
                onRecommendations={handleAIRecommendations}
                regeneratingId={regeneratingId}
                regenerationType={regenerationType}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.status === "Draft").map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
                onCreateCampaign={handleCreateCampaign}
                onRegenerate={handleRegenerateContent}
                onSalesLetter={handleSalesLetterGeneration}
                onRecommendations={handleAIRecommendations}
                regeneratingId={regeneratingId}
                regenerationType={regenerationType}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={salesLetterDialog} onOpenChange={setSalesLetterDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              AI Sales Letter Generator
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? `Create persuasive sales letters for ${selectedProduct.name}` : 'Generate AI-powered sales copy'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Letter Type</label>
              <Select value={salesLetterType} onValueChange={setSalesLetterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select letter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">Promotional (Sales Focused)</SelectItem>
                  <SelectItem value="follow_up">Follow-up (Post-Purchase)</SelectItem>
                  <SelectItem value="educational">Educational (Value-Add)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <Select value={salesLetterTarget} onValueChange={setSalesLetterTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broad">Broad Audience</SelectItem>
                  <SelectItem value="specific">Specific Niche (Enthusiasts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-4">
            {!salesLetter && !salesLetterLoading && (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md bg-muted/30">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Configure your options and click generate to create a customized sales letter
                </p>
              </div>
            )}
            
            {salesLetterLoading && (
              <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-md">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">
                  AI is crafting your perfect sales letter...
                </p>
              </div>
            )}
            
            {salesLetter && !salesLetterLoading && (
              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCopySalesLetter}
                    className="h-8 w-8 rounded-full bg-background"
                  >
                    {salesLetterCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Textarea 
                  className="min-h-[400px] font-mono text-sm p-4"
                  value={salesLetter}
                  onChange={(e) => setSalesLetter(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSalesLetterDialog(false)}
            >
              Close
            </Button>
            <Button 
              onClick={generateSalesLetter}
              disabled={salesLetterLoading}
            >
              {salesLetterLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={recommendationsDialog} onOpenChange={setRecommendationsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
              AI Campaign Recommendations
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? `Smart insights for optimizing ${selectedProduct.name} campaigns` : 'AI-powered optimization recommendations'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            {recommendationsLoading ? (
              <div className="flex flex-col items-center justify-center p-10">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">
                  Analyzing campaign data and generating recommendations...
                </p>
              </div>
            ) : (
              <>
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((recommendation, i) => (
                      <Card key={i} className="bg-amber-50/50 border-amber-200">
                        <CardContent className="p-4 flex items-start">
                          <Lightbulb className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{recommendation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    No recommendations available yet
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            {!recommendationsLoading && recommendations.length > 0 && (
              <div className="w-full flex items-center justify-start mb-4 text-xs text-muted-foreground">
                <Info className="h-3 w-3 mr-1" />
                Recommendations based on historical campaign performance and market trends
              </div>
            )}
            <Button onClick={() => setRecommendationsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={campaignDialog} onOpenChange={setCampaignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Quick Campaign</DialogTitle>
            <DialogDescription>
              Set up a basic campaign to promote your product. You can customize it further later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input 
                id="campaign-name" 
                placeholder="Summer Sale 2023" 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="campaign-budget">Daily Budget ($)</Label>
              <Input 
                id="campaign-budget" 
                type="number" 
                placeholder="50" 
                value={campaignBudget}
                onChange={(e) => setCampaignBudget(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="campaign-platform">Platform</Label>
              <Select value={campaignPlatform} onValueChange={setCampaignPlatform}>
                <SelectTrigger id="campaign-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCampaignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate("/campaign-creation")} variant="outline">
              Advanced Setup
            </Button>
            <Button onClick={handleQuickCampaignCreation} disabled={campaignLoading || !campaignName}>
              {campaignLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Launch
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    status: string;
    metrics: {
      sales: number;
      revenue: number;
      roas: number;
    };
    lastUpdated: string;
    platforms: string[];
    adCopy: string;
    image: string;
    insights?: string[];
  };
  onDelete: (id: number) => void;
  onCreateCampaign: (id: number) => void;
  onRegenerate: (id: number, type: string) => void;
  onSalesLetter: (product: any) => void;
  onRecommendations: (product: any) => void;
  regeneratingId: number | null;
  regenerationType: string;
}

const ProductCard = ({ 
  product, 
  onDelete, 
  onCreateCampaign, 
  onRegenerate,
  onSalesLetter,
  onRecommendations,
  regeneratingId,
  regenerationType
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="aspect-video bg-muted overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        {regeneratingId === product.id && regenerationType === "image" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <Badge 
            variant={
              product.status === "Active" ? "default" : 
              product.status === "Paused" ? "secondary" : "outline"
            }
          >
            {product.status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {product.status !== "Draft" ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Sales</p>
                <p className="text-xl font-semibold">{product.metrics.sales}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xl font-semibold">${product.metrics.revenue}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ROAS</p>
                <p className="text-xl font-semibold">{product.metrics.roas}x</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-1">
              <div className="text-sm font-medium pb-1">AI-Generated Ad Copy</div>
              <div className="relative">
                <p className="text-sm text-muted-foreground line-clamp-3">{product.adCopy}</p>
                {regeneratingId === product.id && regenerationType === "adCopy" && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse mr-2" />
                    <span className="text-sm">Regenerating...</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mt-2">
            {product.platforms.includes("facebook") && (
              <Badge variant="outline" className="bg-blue-50">Facebook</Badge>
            )}
            {product.platforms.includes("instagram") && (
              <Badge variant="outline" className="bg-purple-50">Instagram</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
            <div className="flex gap-2">
              {product.status === "Draft" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRegenerate(product.id, "adCopy")}
                  disabled={regeneratingId === product.id}
                  className="h-8"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
              )}
              {(product.status === "Active" || product.status === "Paused") && (
                <Button variant="ghost" size="icon" onClick={() => onRegenerate(product.id, "image")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => product.status === "Draft" ? setCampaignDialog(true) : navigate('/campaign')}
              className="h-8"
            >
              {product.status === "Draft" ? (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Create Campaign
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  View Campaign
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSalesLetter(product)}
              className="h-8"
            >
              <FileText className="h-4 w-4 mr-1" />
              Ad Creatives
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRecommendations(product)}
              className="h-8"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Insights
            </Button>
          </div>
        </div>
      </CardFooter>
      
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this product and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onDelete(product.id);
              setConfirmDelete(false);
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SavedProducts;
