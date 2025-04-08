
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart, RefreshCw, Settings, Trash2, Play, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for saved products
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
    image: "/placeholder.svg"
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

    // Simulate regeneration process
    setTimeout(() => {
      setRegeneratingId(null);
      setRegenerationType("");
      toast({
        title: "Content regenerated",
        description: `New ${type === "adCopy" ? "ad copy" : "product image"} is now available.`,
      });
    }, 3000);
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
                regeneratingId={regeneratingId}
                regenerationType={regenerationType}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
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
  };
  onDelete: (id: number) => void;
  onCreateCampaign: (id: number) => void;
  onRegenerate: (id: number, type: string) => void;
  regeneratingId: number | null;
  regenerationType: string;
}

const ProductCard = ({ 
  product, 
  onDelete, 
  onCreateCampaign, 
  onRegenerate,
  regeneratingId,
  regenerationType
}: ProductCardProps) => {
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
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
        <div className="flex gap-2">
          {product.status === "Draft" && (
            <>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onCreateCampaign(product.id)}
                className="h-8"
              >
                <Play className="h-4 w-4 mr-1" />
                Create Campaign
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onRegenerate(product.id, "adCopy")}
                disabled={regeneratingId === product.id}
                className="h-8"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Regenerate
              </Button>
            </>
          )}
          {(product.status === "Active" || product.status === "Paused") && (
            <Button variant="ghost" size="icon" onClick={() => onRegenerate(product.id, "image")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SavedProducts;
