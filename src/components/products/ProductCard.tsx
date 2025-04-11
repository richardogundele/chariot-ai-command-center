
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Trash2, Play, Loader2, FileText, Lightbulb, Eye } from "lucide-react";
import { Sparkles } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number | string;
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
  onDelete: (id: number | string) => void;
  onCreateCampaign: (id: number | string) => void;
  onRegenerate: (id: number | string, type: string) => void;
  onSalesLetter: (product: any) => void;
  onRecommendations: (product: any) => void;
  regeneratingId: number | string | null;
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
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignBudget, setCampaignBudget] = useState("50");
  const [campaignPlatform, setCampaignPlatform] = useState("facebook");
  const [campaignLoading, setCampaignLoading] = useState(false);
  
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRegenerate(product.id, "image")}
                  disabled={regeneratingId === product.id}
                >
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
    </Card>
  );
};

export default ProductCard;
