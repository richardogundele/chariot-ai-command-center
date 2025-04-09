
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Loader2, Info } from "lucide-react";

interface RecommendationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: any | null;
}

const RecommendationsDialog = ({ open, onOpenChange, selectedProduct }: RecommendationsDialogProps) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Load recommendations whenever the dialog opens with a selected product
  useEffect(() => {
    if (open && selectedProduct) {
      loadRecommendations();
    }
  }, [open, selectedProduct]);

  const loadRecommendations = () => {
    if (!selectedProduct) return;
    
    setRecommendations([]);
    setRecommendationsLoading(true);
    
    setTimeout(() => {
      const mockRecommendations = [
        "Increase budget by 15% for Instagram campaigns targeting 25-34 year olds to maximize ROAS",
        "Create video ads focusing on sleep analysis feature which is generating 32% more engagement",
        "Test new ad creative with morning workout imagery based on time-of-day performance data",
        "Expand targeting to include 'marathon training' interest group which shows high conversion potential",
        "Adjust campaign scheduling to increase delivery between 6-9am when CTR is highest"
      ];
      
      setRecommendations(mockRecommendations);
      setRecommendationsLoading(false);
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
            AI Campaign Recommendations
          </DialogTitle>
          <DialogDescription>
            {selectedProduct ? `Smart insights for optimizing ${selectedProduct.name} campaigns` : 'AI-powered optimization recommendations'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          {recommendationsLoading ? (
            <div className="flex flex-col items-center justify-center p-10">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">
                Analyzing campaign data and generating recommendations...
              </p>
            </div>
          ) : (
            <>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((recommendation, i) => (
                    <Card key={i} className="bg-amber-50/50 border-amber-200">
                      <CardContent className="p-4 flex items-start">
                        <Lightbulb className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No recommendations available yet
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          {!recommendationsLoading && recommendations.length > 0 && (
            <div className="w-full flex items-center justify-start mb-4 text-xs text-muted-foreground">
              <Info className="h-3 w-3 mr-1" />
              Recommendations based on historical campaign performance and market trends
            </div>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationsDialog;
