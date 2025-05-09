
import { useState } from "react";
import { Product } from "@/services/products/types";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductsTabContentProps {
  products: Product[];
  tabValue: string;
  onDeleteProduct: (id: number | string) => Promise<void>;
  onCreateCampaign: (id: number | string) => void;
  onRegenerateContent: (id: number | string, type: string, product: Product) => Promise<void>;
  onSalesLetterGeneration: (product: Product) => void;
  onAIRecommendations: (product: Product) => void;
  onViewAdContent: (product: Product) => void;
  regeneratingId: number | string | null;
  regenerationType: string;
}

const ProductsTabContent = ({
  products,
  tabValue,
  onDeleteProduct,
  onCreateCampaign,
  onRegenerateContent,
  onSalesLetterGeneration,
  onAIRecommendations,
  onViewAdContent,
  regeneratingId,
  regenerationType
}: ProductsTabContentProps) => {
  const navigate = useNavigate();
  const filteredProducts = tabValue === "all" 
    ? products 
    : products.filter(p => p.status === tabValue);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? filteredProducts.map((product) => (
        <ProductCard 
          key={product.id}
          product={product}
          onDelete={onDeleteProduct}
          onCreateCampaign={onCreateCampaign}
          onRegenerate={(id, type) => onRegenerateContent(id, type, product)}
          onSalesLetter={onSalesLetterGeneration}
          onRecommendations={onAIRecommendations}
          onViewAdContent={onViewAdContent}
          regeneratingId={regeneratingId}
          regenerationType={regenerationType}
        />
      )) : (
        <div className="col-span-3 text-center py-12">
          <p className="text-muted-foreground mb-4">
            {tabValue === "all"
              ? "No products found. Add your first product to get started."
              : `No ${tabValue.toLowerCase()} products found.`}
          </p>
          {tabValue === "all" && (
            <Button onClick={() => navigate("/products")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsTabContent;
