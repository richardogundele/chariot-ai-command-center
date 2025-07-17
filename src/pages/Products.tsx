
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAdCopy, generateProductImage } from "@/services/products/aiGenerationService";
import { saveProduct } from "@/services/products/productService";
import { Product } from "@/services/products/types";

// Import our new components
import ProductForm from "@/components/products/ProductForm";
import AiDescriptionCard from "@/components/products/AiDescriptionCard";
import RecentProductsList from "@/components/products/RecentProductsList";
import AdContentPreview from "@/components/products/AdContentPreview";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewDialog, setViewDialog] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<null | {adCopy: string, image: string}>(null);
  const [generatedAdCopy, setGeneratedAdCopy] = useState("");
  const [generatedAdImage, setGeneratedAdImage] = useState<string | null>(null);

  const handleSubmit = async (productName: string, productDetails: string) => {
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

  const handlePreviewAdContent = (product: Product) => {
    setPreviewProduct({
      adCopy: product.adCopy,
      image: product.image
    });
    setViewDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground mt-1">Add your products to create campaigns</p>
          </div>
          <Button 
            onClick={handleAddProduct} 
            className="self-start sm:self-auto min-h-[44px] px-6 text-base font-medium"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProductForm 
          onSubmit={handleSubmit} 
          loading={loading} 
          generating={generating} 
        />
        <AiDescriptionCard />
      </div>
      
      <RecentProductsList onViewProduct={handlePreviewAdContent} />

      <AdContentPreview 
        open={viewDialog} 
        onOpenChange={setViewDialog} 
        content={previewProduct} 
      />
    </DashboardLayout>
  );
};

export default Products;
