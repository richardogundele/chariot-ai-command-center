
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Edit, Clock, Eye, Copy, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock recent products data
const recentProducts = [
  {
    id: 1,
    name: "Premium Fitness Watch",
    description: "Advanced health tracking features with 7-day battery life",
    image: "/placeholder.svg",
    adCopy: "Track your health journey with precision. Our Premium Fitness Watch offers 24/7 heart rate monitoring, sleep analysis, and week-long battery life. Perfect for serious athletes and health enthusiasts.",
    dateAdded: "2 hours ago"
  },
  {
    id: 2,
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium sound quality with 20-hour battery life",
    image: "/placeholder.svg",
    adCopy: "Immerse yourself in pure sound. Our Wireless Noise-Cancelling Headphones deliver crystal clear audio with deep bass and 20 hours of playtime. Perfect for work, travel, or escaping into your favorite music.",
    dateAdded: "1 day ago"
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    description: "1080p HD with night vision and motion detection",
    image: "/placeholder.svg",
    adCopy: "Protect what matters most. Our Smart Home Security Camera features crystal clear 1080p HD video, night vision, and instant motion alerts to your phone. Easy setup, 24/7 monitoring, and peace of mind.",
    dateAdded: "3 days ago"
  }
];

const Products = () => {
  const [productUrl, setProductUrl] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((activeTab === "url" && !productUrl) || (activeTab === "manual" && (!productName || !productDetails))) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call and AI generation
    setTimeout(() => {
      setLoading(false);

      // Show generating toast
      setGenerating(true);
      toast({
        title: "AI is working",
        description: "Generating ad copy and images for your product...",
      });

      // Simulate AI generation completion
      setTimeout(() => {
        setGenerating(false);
        toast({
          title: "Product Added",
          description: "Your product and AI-generated ad content are ready.",
        });
        navigate("/saved-products");
      }, 3000);
    }, 1500);
  };

  const [activeTab, setActiveTab] = useState("url");

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Add your products to create campaigns</p>
        </div>
        <Button onClick={() => navigate("/add-product")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Add New Product</CardTitle>
            <CardDescription>Get started by adding your product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="url">Product URL</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-url">Product URL</Label>
                    <Input 
                      id="product-url"
                      placeholder="https://example.com/product"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">We'll automatically extract product information from this URL</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || generating}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Product...
                      </>
                    ) : generating ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                        Generating Ad Content...
                      </>
                    ) : "Add Product"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="manual" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input 
                      id="product-name"
                      placeholder="e.g., Wireless Headphones"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-details">Product Description</Label>
                    <Textarea 
                      id="product-details"
                      placeholder="Describe your product's features and benefits"
                      value={productDetails}
                      onChange={(e) => setProductDetails(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Our AI will analyze this to create targeted ads</p>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading || generating}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Product...
                      </>
                    ) : generating ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                        Generating Ad Content...
                      </>
                    ) : "Add Product"}
                  </Button>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>

        <Card className="hidden md:block shadow-sm border border-purple-100 bg-gradient-to-br from-white to-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">AI Ad Creation</CardTitle>
            <CardDescription>Here's what happens after you add a product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg p-4 space-y-2 bg-white shadow-sm border border-purple-100/50">
              <div className="flex items-center justify-between">
                <div className="font-medium text-purple-800">1. AI analyzes your product</div>
              </div>
              <p className="text-sm text-muted-foreground">We identify key selling points and create compelling messaging</p>
            </div>
            
            <div className="rounded-lg p-4 space-y-2 bg-white shadow-sm border border-purple-100/50">
              <div className="flex items-center justify-between">
                <div className="font-medium text-purple-800">2. Create engaging visuals</div>
              </div>
              <p className="text-sm text-muted-foreground">Our AI generates stunning product images tailored for each platform</p>
            </div>
            
            <div className="rounded-lg p-4 space-y-2 bg-white shadow-sm border border-purple-100/50">
              <div className="flex items-center justify-between">
                <div className="font-medium text-purple-800">3. Launch your campaign</div>
              </div>
              <p className="text-sm text-muted-foreground">Choose platforms and budgets to start advertising your product</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recently Added Products</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/saved-products")}>
            View All Products
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow transition-all">
              <div className="relative">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-2 right-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">AI-Generated Ad Copy</div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{product.adCopy}</p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2 border-t">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Added {product.dateAdded}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;
