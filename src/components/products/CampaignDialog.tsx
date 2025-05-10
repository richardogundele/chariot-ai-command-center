
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  checkFacebookConnection, 
  createFacebookCampaign,
  getFacebookAdAccounts 
} from "@/services/platforms/facebookService";
import { toast } from "sonner";
import { AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import { fetchProducts } from "@/services/products/productService";
import { Product } from "@/services/products/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated?: () => void; // Optional callback for when a campaign is created
}

const CampaignDialog = ({ open, onOpenChange, onCampaignCreated }: CampaignDialogProps) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("conversion");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [budget, setBudget] = useState(50);
  const [duration, setDuration] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFacebookConnection, setHasFacebookConnection] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [adAccounts, setAdAccounts] = useState<Array<{ id: string, name: string }>>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [launchImmediately, setLaunchImmediately] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // Reset form state when dialog opens
      setCampaignName("");
      setCampaignType("conversion");
      setSelectedProductId("");
      setBudget(50);
      setDuration(7);
      setLaunchImmediately(true);
      
      // Check if Facebook is connected
      const checkConnections = async () => {
        setCheckingConnection(true);
        try {
          const fbConnected = await checkFacebookConnection();
          setHasFacebookConnection(fbConnected);
          
          if (fbConnected) {
            // Fetch Facebook ad accounts
            const accountsResult = await getFacebookAdAccounts();
            if (accountsResult.success && accountsResult.accounts) {
              setAdAccounts(accountsResult.accounts);
              if (accountsResult.accounts.length > 0) {
                setSelectedAdAccount(accountsResult.accounts[0].id);
              }
            }
          }
          
        } catch (error) {
          console.error("Error checking connections:", error);
        } finally {
          setCheckingConnection(false);
        }
      };
      
      // Load products
      const loadProducts = async () => {
        setLoadingProducts(true);
        try {
          const productsList = await fetchProducts();
          setProducts(productsList);
        } catch (error) {
          console.error("Error loading products:", error);
        } finally {
          setLoadingProducts(false);
        }
      };
      
      checkConnections();
      loadProducts();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!campaignName.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create campaign in Facebook
      const result = await createFacebookCampaign({
        name: campaignName,
        objective: campaignType,
        budget: budget,
        duration: duration,
        productId: selectedProductId, 
        targetAudience: "Default audience", // This would typically be defined by the user
        platforms: ["facebook"],
        advanced: {
          adAccountId: selectedAdAccount,
          launchImmediately
        }
      });

      if (result.success) {
        toast.success("Campaign created", {
          description: `Your campaign has been ${launchImmediately ? 'launched' : 'saved'} successfully`
        });
        
        // Call the callback if provided
        if (onCampaignCreated) {
          onCampaignCreated();
        }
        
        onOpenChange(false);
        
        // Navigate to the campaign page
        navigate("/campaign", { 
          state: { 
            campaignName, 
            campaignType,
            newCampaign: true,
            campaignId: result.campaignId,
            status: result.status
          } 
        });
      } else {
        throw new Error(result.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Campaign creation error:", error);
      toast.error("Campaign creation failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectFacebook = () => {
    onOpenChange(false);
    navigate("/platforms");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new marketing campaign for your product
          </DialogDescription>
        </DialogHeader>
        
        {checkingConnection ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !hasFacebookConnection ? (
          <div className="py-4">
            <div className="rounded-md bg-yellow-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Facebook account not connected
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You need to connect your Facebook account before creating a campaign.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleConnectFacebook} 
              className="w-full"
            >
              Connect Facebook Account
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input 
                  id="campaign-name"
                  placeholder="e.g., Summer Sale 2023"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Product</Label>
                {loadingProducts ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading products...</span>
                  </div>
                ) : products.length > 0 ? (
                  <Select 
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="py-2">
                    <p className="text-sm text-amber-600">
                      You don't have any products yet.{" "}
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-sm text-primary"
                        onClick={() => {
                          onOpenChange(false);
                          navigate("/add-product");
                        }}
                      >
                        Add a product
                      </Button>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <RadioGroup 
                  value={campaignType} 
                  onValueChange={setCampaignType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conversion" id="conversion" />
                    <Label htmlFor="conversion">Conversion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="awareness" id="awareness" />
                    <Label htmlFor="awareness">Brand Awareness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="traffic" id="traffic" />
                    <Label htmlFor="traffic">Website Traffic</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Daily Budget (USD)</Label>
                <div className="flex items-center space-x-2">
                  <span>$</span>
                  <Input 
                    id="budget"
                    type="number"
                    min="5"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Estimated monthly spend: ${budget * 30}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Campaign Duration (days)</Label>
                <Input 
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              
              {adAccounts.length > 0 && (
                <div className="space-y-2">
                  <Label>Ad Account</Label>
                  <Select 
                    value={selectedAdAccount}
                    onValueChange={setSelectedAdAccount}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ad Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {adAccounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="launch" 
                  checked={launchImmediately}
                  onCheckedChange={(checked) => setLaunchImmediately(!!checked)} 
                />
                <Label htmlFor="launch">Launch campaign immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedProductId}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {launchImmediately ? "Launching..." : "Creating..."}
                  </>
                ) : (
                  launchImmediately ? "Launch Campaign" : "Create Campaign"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDialog;
