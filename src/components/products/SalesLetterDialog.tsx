
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SalesLetterCreator from "./SalesLetterCreator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAdCopy } from "@/services/products/aiGenerationService";
import { Product } from "@/services/products/types";

interface SalesLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
}

const SalesLetterDialog = ({ open, onOpenChange, selectedProduct }: SalesLetterDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [salesLetter, setSalesLetter] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open && selectedProduct) {
      generateSalesLetter();
    }
  }, [open, selectedProduct]);

  const generateSalesLetter = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    
    try {
      // Use the existing AI to generate a long-form sales letter
      const prompt = `Write a comprehensive, long-form sales letter for ${selectedProduct.name}. 
      Use the following structure:
      1. Attention-grabbing headline
      2. Opening that hooks the reader and identifies their pain points
      3. Introduction of ${selectedProduct.name} as the solution
      4. Detailed explanation of benefits (not just features)
      5. Social proof or testimonials (you can create fictional ones)
      6. Offer details including price and value proposition
      7. Guarantee section to remove risk
      8. Call to action
      9. P.S. section with an additional incentive

      The tone should be persuasive but trustworthy. Make it conversational but professional.
      Product description: ${selectedProduct.description}`;
      
      const letter = await generateAdCopy(selectedProduct.name, prompt);
      setSalesLetter(letter);
    } catch (error) {
      console.error("Error generating sales letter:", error);
      toast({
        title: "Error",
        description: "Failed to generate sales letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sales Letter Generator</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating sales letter...</p>
            <p className="text-xs text-muted-foreground mt-2">This may take a moment</p>
          </div>
        ) : selectedProduct ? (
          <SalesLetterCreator 
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            initialContent={salesLetter}
          />
        ) : (
          <div className="text-center py-8">
            <p>No product selected</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalesLetterDialog;
