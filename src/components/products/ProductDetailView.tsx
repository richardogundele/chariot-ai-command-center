import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Eye, FileText, Megaphone, MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Product } from "@/services/products/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onDeleteProduct: (id: number | string) => Promise<void>;
  onCreateCampaign: (id: number | string) => void;
  onRegenerateContent: (id: number | string, type: string, product: Product) => Promise<void>;
  onSalesLetterGeneration: (product: Product) => void;
  onViewAdContent: (product: Product) => void;
  regeneratingId: number | string | null;
  regenerationType: string;
}

interface SalesLetter {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  created_at: string;
}

const ProductDetailView = ({
  product,
  onBack,
  onDeleteProduct,
  onCreateCampaign,
  onRegenerateContent,
  onSalesLetterGeneration,
  onViewAdContent,
  regeneratingId,
  regenerationType
}: ProductDetailViewProps) => {
  const [salesLetters, setSalesLetters] = useState<SalesLetter[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Fetch sales letters
        const { data: lettersData, error: lettersError } = await supabase
          .from('sales_letters')
          .select('*')
          .eq('product_id', product.id.toString());
        
        if (lettersError) throw lettersError;
        
        // Fetch campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('product_id', product.id.toString());
        
        if (campaignsError) throw campaignsError;
        
        setSalesLetters(lettersData || []);
        setCampaigns(campaignsData || []);
      } catch (error) {
        console.error("Error fetching additional data:", error);
        toast({
          title: "Error",
          description: "Failed to load complete product data.",
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchAdditionalData();
  }, [product.id, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'paused': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'draft': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-600/10 text-blue-700 dark:text-blue-400';
      case 'instagram': return 'bg-pink-600/10 text-pink-700 dark:text-pink-400';
      case 'google': return 'bg-red-600/10 text-red-700 dark:text-red-400';
      case 'tiktok': return 'bg-black/10 text-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const isRegenerating = regeneratingId === product.id;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>

      {/* Main Product Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-32 h-32 rounded-lg object-cover border"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                {isRegenerating && regenerationType === "image" && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-3">{product.name}</CardTitle>
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                  {product.price && (
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      ${product.price}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.platforms?.map((platform) => (
                    <Badge key={platform} variant="secondary" className={getPlatformColor(platform)}>
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewAdContent(product)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Content
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRegenerateContent(product.id, "adCopy", product)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRegenerateContent(product.id, "image", product)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSalesLetterGeneration(product)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Sales Letter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCreateCampaign(product.id)}>
                  <Megaphone className="w-4 h-4 mr-2" />
                  Create Campaign
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem 
                  onClick={() => onDeleteProduct(product.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Product Description */}
          <div>
            <h4 className="font-semibold mb-3 text-base">Product Description</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          {/* Ad Copy */}
          {product.adCopy && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-base">Ad Copy</h4>
                {isRegenerating && regenerationType === "adCopy" && (
                  <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{product.adCopy}</p>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {product.metrics && (
            <div>
              <h4 className="font-semibold mb-3 text-base">Performance Metrics</h4>
              <div className="grid grid-cols-3 gap-6">
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-1">{product.metrics.sales}</div>
                  <div className="text-sm text-muted-foreground">Sales</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-1">${product.metrics.revenue}</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-1">{product.metrics.roas}x</div>
                  <div className="text-sm text-muted-foreground">ROAS</div>
                </Card>
              </div>
            </div>
          )}

          {/* Sales Letters */}
          {loadingData ? (
            <div>
              <h4 className="font-semibold mb-3 text-base">Sales Letters</h4>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          ) : salesLetters.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-base">
                Sales Letters ({salesLetters.length})
              </h4>
              <div className="space-y-4">
                {salesLetters.map((letter) => (
                  <Card key={letter.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{letter.title}</h5>
                        <span className="text-xs text-muted-foreground">
                          {new Date(letter.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {letter.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns */}
          {loadingData ? (
            <div>
              <h4 className="font-semibold mb-3 text-base">Campaigns</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          ) : campaigns.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-base">
                Campaigns ({campaigns.length})
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{campaign.name}</h5>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded ${getPlatformColor(campaign.platform)}`}>
                          {campaign.platform}
                        </span>
                        {campaign.budget && (
                          <span className="font-medium">${campaign.budget}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailView;