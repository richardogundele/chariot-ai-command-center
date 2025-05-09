
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Saved Products</h1>
        <p className="text-muted-foreground">View and manage your product library</p>
      </div>
      <Button onClick={() => navigate("/products")}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Product
      </Button>
    </div>
  );
};

export default ProductsHeader;
