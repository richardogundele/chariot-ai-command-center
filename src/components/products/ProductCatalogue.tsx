import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FileText, Megaphone, MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Product } from "@/services/products/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductCatalogueProps {
  products: Product[];
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

const ProductCatalogue = ({
  products,
  onDeleteProduct,
  onCreateCampaign,
  onRegenerateContent,
  onSalesLetterGeneration,
  onViewAdContent,
  regeneratingId,
  regenerationType
}: ProductCatalogueProps) => {
  const [salesLetters, setSalesLetters] = useState<Record<string, SalesLetter[]>>({});
  const [campaigns, setCampaigns] = useState<Record<string, Campaign[]>>({});
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const productIds = products.map(p => p.id.toString());
        
        // Fetch sales letters
        const { data: lettersData, error: lettersError } = await supabase
          .from('sales_letters')
          .select('*')
          .in('product_id', productIds);
        
        if (lettersError) throw lettersError;
        
        // Fetch campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .in('product_id', productIds);
        
        if (campaignsError) throw campaignsError;
        
        // Group by product_id
        const lettersGrouped = lettersData?.reduce((acc, letter) => {
          if (!acc[letter.product_id]) acc[letter.product_id] = [];
          acc[letter.product_id].push(letter);
          return acc;
        }, {} as Record<string, SalesLetter[]>) || {};
        
        const campaignsGrouped = campaignsData?.reduce((acc, campaign) => {
          if (!acc[campaign.product_id]) acc[campaign.product_id] = [];
          acc[campaign.product_id].push(campaign);
          return acc;
        }, {} as Record<string, Campaign[]>) || {};
        
        setSalesLetters(lettersGrouped);
        setCampaigns(campaignsGrouped);
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

    if (products.length > 0) {
      fetchAdditionalData();
    } else {
      setLoadingData(false);
    }
  }, [products, toast]);

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

  if (loadingData) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex space-x-6">
              <Skeleton className="w-40 h-40 rounded-lg" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product) => {
        const productSalesLetters = salesLetters[product.id.toString()] || [];
        const productCampaigns = campaigns[product.id.toString()] || [];
        const isRegenerating = regeneratingId === product.id;

        return (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    {isRegenerating && regenerationType === "image" && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                      {product.price && (
                        <Badge variant="outline">${product.price}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
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
            
            <CardContent className="space-y-6">
              {/* Product Description */}
              <div>
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                  Description
                </h4>
                <p className="text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Ad Copy */}
              {product.adCopy && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Ad Copy
                    </h4>
                    {isRegenerating && regenerationType === "adCopy" && (
                      <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{product.adCopy}</p>
                  </div>
                </div>
              )}

              {/* Sales Letters */}
              {productSalesLetters.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Sales Letters ({productSalesLetters.length})
                  </h4>
                  <div className="space-y-3">
                    {productSalesLetters.map((letter) => (
                      <div key={letter.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{letter.title}</h5>
                          <span className="text-xs text-muted-foreground">
                            {new Date(letter.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {letter.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campaigns */}
              {productCampaigns.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Campaigns ({productCampaigns.length})
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {productCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4 bg-card">
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
                            <span>${campaign.budget}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {product.metrics && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Performance
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{product.metrics.sales}</p>
                      <p className="text-xs text-muted-foreground">Sales</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">${product.metrics.revenue}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{product.metrics.roas}x</p>
                      <p className="text-xs text-muted-foreground">ROAS</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductCatalogue;