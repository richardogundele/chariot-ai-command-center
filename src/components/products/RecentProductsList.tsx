
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Copy, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/services/products/types";
import { fetchProducts } from "@/services/products/productService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Recently Added Products</h2>
        <Button variant="outline" size="sm" onClick={() => navigate("/saved-products")} className="self-start sm:self-auto">
          View All Products
        </Button>
      </div>
      
      {loadingRecent ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentProducts.length > 0 ? (
            recentProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow transition-all">
                <div className="relative">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="w-full h-full rounded-none flex items-center justify-center text-muted-foreground bg-muted">
                        {product.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <CardHeader className="p-3 sm:p-4 pb-2">
                  <CardTitle className="text-base sm:text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs sm:text-sm">{product.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-3 sm:p-4 pb-2">
                  <div className="space-y-2">
                    <div className="text-xs sm:text-sm font-medium">AI-Generated Ad Copy</div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{product.adCopy}</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 sm:p-4 pt-2 border-t">
                  <div className="flex items-center text-xs text-muted-foreground self-start">
                    <Clock className="h-3 w-3 mr-1" />
                    Added {product.lastUpdated}
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
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
                      className="h-8 px-2 text-xs"
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
            <div className="col-span-full text-center py-12">
              <p className="text-sm sm:text-base text-muted-foreground mb-4">No products found. Add your first product to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProductsList;
