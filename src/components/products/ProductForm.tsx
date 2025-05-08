
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
  );
};

export default ProductForm;
