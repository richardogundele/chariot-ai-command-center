import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";

// Import refactored components
import ProductCard from "@/components/products/ProductCard";
import SalesLetterDialog from "@/components/products/SalesLetterDialog";
import RecommendationsDialog from "@/components/products/RecommendationsDialog";
import CampaignDialog from "@/components/products/CampaignDialog";
import { Product } from "@/services/products/types";
import { fetchProducts, deleteProduct, regenerateAdCopy, regenerateProductImage } from "@/services";

const SavedProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<number | string | null>(null);
  const [regenerationType, setRegenerationType] = useState<string>("");
  const [salesLetterDialog, setSalesLetterDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recommendationsDialog, setRecommendationsDialog] = useState(false);
  const [campaignDialog, setCampaignDialog] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  const handleDeleteProduct = async (id: number | string) => {
    try {
      const success = await deleteProduct(id);
      
      if (success) {
        setProducts(products.filter(product => product.id !== id));
        toast({
          title: "Product deleted",
          description: "The product has been removed from your library",
        });
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCampaign = (id: number | string) => {
    toast({
      title: "Campaign creation started",
      description: "Redirecting to campaign setup...",
    });
    navigate("/campaign");
  };

  const handleRegenerateContent = async (id: number | string, type: string, product: Product) => {
    setRegeneratingId(id);
    setRegenerationType(type);
    
    toast({
      title: "Regenerating content",
      description: `AI is creating new ${type === "adCopy" ? "ad copy" : "product image"}...`,
    });

    try {
      let newContent = null;
      
      if (type === "adCopy") {
        newContent = await regenerateAdCopy(id, product.name, product.description);
        if (newContent) {
          setProducts(products.map(p => 
            p.id === id ? { ...p, adCopy: newContent } : p
          ));
        }
      } else if (type === "image") {
        newContent = await regenerateProductImage(id, product.name, product.description);
        if (newContent) {
          setProducts(products.map(p => 
            p.id === id ? { ...p, image: newContent } : p
          ));
        }
      }
      
      if (newContent) {
        toast({
          title: "Content regenerated",
          description: `New ${type === "adCopy" ? "ad copy" : "product image"} is now available.`,
        });
      } else {
        throw new Error("Failed to regenerate content");
      }
    } catch (error) {
      console.error(`Error regenerating ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to generate new ${type === "adCopy" ? "ad copy" : "product image"}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setRegeneratingId(null);
      setRegenerationType("");
    }
  };

  const handleSalesLetterGeneration = (product: Product) => {
    setSelectedProduct(product);
    setSalesLetterDialog(true);
  };

  const handleAIRecommendations = (product: Product) => {
    setSelectedProduct(product);
    setRecommendationsDialog(true);
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="draft">Ready for Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteProduct}
                  onCreateCampaign={handleCreateCampaign}
                  onRegenerate={(id, type) => handleRegenerateContent(id, type, product)}
                  onSalesLetter={handleSalesLetterGeneration}
                  onRecommendations={handleAIRecommendations}
                  regeneratingId={regeneratingId}
                  regenerationType={regenerationType}
                />
              )) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found. Add your first product to get started.</p>
                  <Button onClick={() => navigate("/products")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.status === "Active").length > 0 ? 
                products.filter(p => p.status === "Active").map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    onCreateCampaign={handleCreateCampaign}
                    onRegenerate={(id, type) => handleRegenerateContent(id, type, product)}
                    onSalesLetter={handleSalesLetterGeneration}
                    onRecommendations={handleAIRecommendations}
                    regeneratingId={regeneratingId}
                    regenerationType={regenerationType}
                  />
                )) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">No active products found.</p>
                  </div>
                )}
            </div>
          </TabsContent>
          
          <TabsContent value="paused" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.status === "Paused").length > 0 ? 
                products.filter(p => p.status === "Paused").map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    onCreateCampaign={handleCreateCampaign}
                    onRegenerate={(id, type) => handleRegenerateContent(id, type, product)}
                    onSalesLetter={handleSalesLetterGeneration}
                    onRecommendations={handleAIRecommendations}
                    regeneratingId={regeneratingId}
                    regenerationType={regenerationType}
                  />
                )) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">No paused products found.</p>
                  </div>
                )}
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.status === "Draft").length > 0 ? 
                products.filter(p => p.status === "Draft").map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    onCreateCampaign={handleCreateCampaign}
                    onRegenerate={(id, type) => handleRegenerateContent(id, type, product)}
                    onSalesLetter={handleSalesLetterGeneration}
                    onRecommendations={handleAIRecommendations}
                    regeneratingId={regeneratingId}
                    regenerationType={regenerationType}
                  />
                )) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">No draft products found.</p>
                  </div>
                )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <SalesLetterDialog 
        open={salesLetterDialog}
        onOpenChange={setSalesLetterDialog}
        selectedProduct={selectedProduct}
      />
      
      <RecommendationsDialog
        open={recommendationsDialog}
        onOpenChange={setRecommendationsDialog}
        selectedProduct={selectedProduct}
      />
      
      <CampaignDialog 
        open={campaignDialog}
        onOpenChange={setCampaignDialog}
      />
    </DashboardLayout>
  );
};

export default SavedProducts;
