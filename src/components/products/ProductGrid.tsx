import { Product } from "@/services/products/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onDeleteProduct: (id: number | string) => void;
}

const ProductGrid = ({ products, onProductClick, onDeleteProduct }: ProductGridProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'paused': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'draft': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="relative cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
          onClick={() => onProductClick(product)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProduct(product.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <CardContent className="p-4">
            <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
                
                {product.price && (
                  <span className="text-sm font-medium">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;