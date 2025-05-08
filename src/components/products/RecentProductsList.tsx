
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Copy, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/services/products/types";
import { fetchProducts } from "@/services/products/productService";

interface RecentProductsListProps {
  onViewProduct: (product: Product) => void;
}

const RecentProductsList = ({ onViewProduct }: RecentProductsListProps) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
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
                      onClick={() => onViewProduct(product)}
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
  );
};

export default RecentProductsList;
