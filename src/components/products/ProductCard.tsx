
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { RefreshCw, MoreHorizontal, FileEdit, PlayCircle, Trash2, FileText, Lightbulb, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Product } from "@/services/products/types";

interface ProductCardProps {
  product: Product;
  onDelete: (id: number | string) => void;
  onCreateCampaign: (id: number | string) => void;
  onRegenerate: (id: number | string, type: string) => void;
  onSalesLetter: (product: Product) => void;
  onRecommendations: (product: Product) => void;
  onViewAdContent: (product: Product) => void;
  regeneratingId: number | string | null;
  regenerationType: string;
}

const ProductCard = ({
  product,
  onDelete,
  onCreateCampaign,
  onRegenerate,
  onSalesLetter,
  onRecommendations,
  onViewAdContent,
  regeneratingId,
  regenerationType
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const statusColors = {
    Active: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    Paused: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
    Draft: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
  };
  
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative">
        <div className="aspect-video bg-muted overflow-hidden">
          <img 
            src={imageError ? "/placeholder.svg" : product.image || "/placeholder.svg"} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={() => {
              console.error("Failed to load product image:", product.image);
              setImageError(true);
            }}
          />
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge 
            variant="outline" 
            className={`${product.status in statusColors ? statusColors[product.status as keyof typeof statusColors] : "bg-gray-500/10"}`}
          >
            {product.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewAdContent(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View Ad Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRegenerate(product.id, "adCopy")}>
                <FileEdit className="mr-2 h-4 w-4" />
                Regenerate Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRegenerate(product.id, "image")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSalesLetter(product)}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Sales Letter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRecommendations(product)}>
                <Lightbulb className="mr-2 h-4 w-4" />
                AI Recommendations
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">
          <div className="text-sm font-medium">AI-Generated Ad Copy</div>
          <p className="text-xs text-muted-foreground line-clamp-3">{product.adCopy}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="w-full">
          <div className="mb-3 text-xs text-muted-foreground">
            Last updated: {product.lastUpdated}
          </div>
          {regeneratingId === product.id ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating {regenerationType === "adCopy" ? "Copy" : "Image"}...
            </Button>
          ) : (
            <Button 
              onClick={() => onCreateCampaign(product.id)}
              className="w-full"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
