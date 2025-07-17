
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <h2 className="text-xl font-semibold">Recently Added Products</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate("/saved-products")} 
          className="self-start sm:self-auto h-10 px-4 text-base font-medium"
        >
          View All Products
        </Button>
      </div>
      
      {loadingRecent ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recentProducts.length > 0 ? (
            recentProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="relative">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="w-full h-full rounded-none flex items-center justify-center text-muted-foreground bg-muted text-2xl font-semibold">
                        {product.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm leading-relaxed">{product.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 pb-3">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">AI-Generated Ad Copy</div>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{product.adCopy}</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-3 p-4 pt-3 border-t">
                  <div className="flex items-center text-xs text-muted-foreground w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Added {product.lastUpdated}
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-10 text-sm font-medium"
                      onClick={() => {
                        navigator.clipboard.writeText(product.adCopy);
                        toast({
                          title: "Copied",
                          description: "Ad copy copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-10 text-sm font-medium"
                      onClick={() => onViewProduct(product)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">No products found. Add your first product to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProductsList;
