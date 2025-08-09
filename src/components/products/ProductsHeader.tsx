
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProductsHeaderProps = {
  hideAddButton?: boolean;
  onAddClick?: () => void;
  title?: string;
  subtitle?: string;
  addLabel?: string;
};

const ProductsHeader = ({
  hideAddButton,
  onAddClick,
  title = "Saved Products",
  subtitle = "View and manage your product library",
  addLabel = "Add New Product",
}: ProductsHeaderProps) => {
  const navigate = useNavigate();
  const handleAdd = onAddClick ?? (() => navigate("/products"));
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {!hideAddButton && (
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
};

export default ProductsHeader;
