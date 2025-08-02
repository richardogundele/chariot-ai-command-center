
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import refactored components
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductGrid from "@/components/products/ProductGrid";
import ProductDetailView from "@/components/products/ProductDetailView";
import ProductsLoading from "@/components/products/ProductsLoading";
import SalesLetterDialog from "@/components/products/SalesLetterDialog";
import RecommendationsDialog from "@/components/products/RecommendationsDialog";
import CampaignDialog from "@/components/products/CampaignDialog";
import AdContentPreview from "@/components/products/AdContentPreview";
import { Product } from "@/services/products/types";
import { fetchProducts, deleteProduct, regenerateAdCopy, regenerateProductImage } from "@/services";

const SavedProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<number | string | null>(null);
  const [regenerationType, setRegenerationType] = useState<string>("");
  
  // Dialog states
  const [salesLetterDialog, setSalesLetterDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recommendationsDialog, setRecommendationsDialog] = useState(false);
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState<{adCopy?: string, image?: string} | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log("Fetched products:", data);
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
    // Set the selected product for use in the campaign dialog
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setCampaignDialog(true);
    } else {
      toast({
        title: "Error",
        description: "Product not found. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewAdContent = (product: Product) => {
    setPreviewContent({
      adCopy: product.adCopy,
      image: product.image
    });
    setViewDialog(true);
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

  const handleProductClick = (product: Product) => {
    setSelectedProductForDetail(product);
  };

  const handleBackToGrid = () => {
    setSelectedProductForDetail(null);
  };

  const filterProductsByTab = (products: Product[], tabValue: string) => {
    if (tabValue === "all") return products;
    return products.filter(p => p.status === tabValue);
  };

  return (
    <DashboardLayout>
      <ProductsHeader />

      {loading ? (
        <ProductsLoading />
      ) : selectedProductForDetail ? (
        <ProductDetailView
          product={selectedProductForDetail}
          onBack={handleBackToGrid}
          onDeleteProduct={handleDeleteProduct}
          onCreateCampaign={handleCreateCampaign}
          onRegenerateContent={handleRegenerateContent}
          onSalesLetterGeneration={handleSalesLetterGeneration}
          onViewAdContent={handleViewAdContent}
          regeneratingId={regeneratingId}
          regenerationType={regenerationType}
        />
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="Active">Active</TabsTrigger>
            <TabsTrigger value="Paused">Paused</TabsTrigger>
            <TabsTrigger value="Draft">Ready for Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ProductGrid
              products={filterProductsByTab(products, "all")}
              onProductClick={handleProductClick}
            />
          </TabsContent>
          
          <TabsContent value="Active" className="mt-0">
            <ProductGrid
              products={filterProductsByTab(products, "Active")}
              onProductClick={handleProductClick}
            />
          </TabsContent>
          
          <TabsContent value="Paused" className="mt-0">
            <ProductGrid
              products={filterProductsByTab(products, "Paused")}
              onProductClick={handleProductClick}
            />
          </TabsContent>
          
          <TabsContent value="Draft" className="mt-0">
            <ProductGrid
              products={filterProductsByTab(products, "Draft")}
              onProductClick={handleProductClick}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {/* Dialogs */}
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
        onCampaignCreated={() => {
          // Refresh products after campaign creation
          fetchProducts().then(data => setProducts(data));
        }}
      />

      <AdContentPreview 
        open={viewDialog}
        onOpenChange={setViewDialog}
        content={previewContent}
      />
    </DashboardLayout>
  );
};

export default SavedProducts;
