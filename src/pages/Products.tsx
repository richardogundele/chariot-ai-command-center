
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Clock, Copy, RefreshCw, Sparkles, Eye } from "lucide-react";
import { generateAdCopy, generateProductImage } from "@/services/products/aiGenerationService";
import { saveProduct, fetchProducts } from "@/services/products/productService";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCurrentUser } from "@/services";

const Products = () => {
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [previewProduct, setPreviewProduct] = useState<null | {adCopy: string, image: string}>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [generatedAdCopy, setGeneratedAdCopy] = useState("");
  const [generatedAdImage, setGeneratedAdImage] = useState<string | null>(null);

  useEffect(() => {
    const loadRecentProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        // Get the 3 most recent products
        setRecentProducts(allProducts.slice(0, 3));
      } catch (error) {
        console.error("Error loading recent products:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    loadRecentProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !productDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    toast({
      title: "Processing",
      description: "Adding your product...",
    });

    try {
      // Show generating toast
      setGenerating(true);
      toast({
        title: "AI is working",
        description: "Generating ad copy and images for your product...",
      });

      // Generate ad copy and image in parallel
      const [adCopy, imageUrl] = await Promise.all([
        generateAdCopy(productName, productDetails),
        generateProductImage(productName, productDetails)
      ]);
      
      setGeneratedAdCopy(adCopy);
      setGeneratedAdImage(imageUrl);
      
      // Show preview automatically
      setPreviewProduct({
        adCopy,
        image: imageUrl
      });
      setViewDialog(true);
      
      // Save to Supabase
      const savedProduct = await saveProduct({
        name: productName,
        description: productDetails,
        adCopy,
        image: imageUrl,
        platforms: [],
        status: 'Draft'
      });

      if (savedProduct) {
        toast({
          title: "Product Added",
          description: "Your product and AI-generated ad content are ready.",
        });
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error in product creation:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };
  
  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handlePreviewAdContent = (product: any) => {
    setPreviewProduct({
      adCopy: product.adCopy,
      image: product.image
    });
    setViewDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Add your products to create campaigns</p>
        </div>
        <Button onClick={handleAddProduct}>
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
                <p className="text-xs text-muted-foreground">Our AI will analyze this to create targeted ads in Kenny Nwokoye's style</p>
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
              <p className="text-sm text-muted-foreground">We identify key selling points and create compelling messaging in Kenny Nwokoye's style</p>
            </div>
            
            <div className="rounded-lg p-4 space-y-2 bg-white shadow-sm border border-purple-100/50">
              <div className="flex items-center justify-between">
                <div className="font-medium text-purple-800">2. Create engaging visuals</div>
              </div>
              <p className="text-sm text-muted-foreground">Our AI generates stunning product images using DALL-E 3</p>
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
        
        {loadingRecent ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow transition-all">
                  <div className="relative">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
                      Added {product.lastUpdated}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => {
                          navigator.clipboard.writeText(product.adCopy);
                          toast({
                            title: "Copied",
                            description: "Ad copy copied to clipboard",
                          });
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => handlePreviewAdContent(product)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground mb-4">No products found. Add your first product to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ad Content Preview</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Ad Copy</h3>
              <div className="border p-4 rounded-md bg-muted/30 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {previewProduct?.adCopy}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (previewProduct?.adCopy) {
                    navigator.clipboard.writeText(previewProduct.adCopy);
                    toast({
                      title: "Copied",
                      description: "Ad copy copied to clipboard",
                    });
                  }
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Ad Copy
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Ad Image</h3>
              <div className="border p-4 rounded-md bg-muted/30 flex justify-center">
                {previewProduct?.image && (
                  <img 
                    src={previewProduct.image} 
                    alt="Ad image" 
                    className="max-h-96 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;
