
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  onSubmit: (productName: string, productDetails: string) => Promise<void>;
  loading: boolean;
  generating: boolean;
}

const ProductForm = ({ onSubmit, loading, generating }: ProductFormProps) => {
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const { toast } = useToast();

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
    
    await onSubmit(productName, productDetails);
  };

  return (
    <Card className="shadow-sm h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Add New Product</CardTitle>
        <CardDescription>Get started by adding your product details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="product-name" className="text-base font-medium">Product Name</Label>
            <Input 
              id="product-name"
              placeholder="e.g., Wireless Headphones"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full h-12 text-base"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="product-details" className="text-base font-medium">Product Description</Label>
            <Textarea 
              id="product-details"
              placeholder="Describe your product's features and benefits"
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              rows={4}
              className="w-full resize-none text-base leading-relaxed"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">Our AI will analyze this to create targeted ads in Kenny Nwokoye's style</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium" 
            disabled={loading || generating}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Adding Product...</span>
              </>
            ) : generating ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                <span>Generating Ad Content...</span>
              </>
            ) : <span>Add Product</span>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
