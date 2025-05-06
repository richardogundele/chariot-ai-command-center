
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
import { checkFacebookConnection } from "@/services/platforms/facebookService";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CampaignDialog = ({ open, onOpenChange }: CampaignDialogProps) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("conversion");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFacebookConnection, setHasFacebookConnection] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // Reset form state when dialog opens
      setCampaignName("");
      setCampaignType("conversion");
      
      // Check if Facebook is connected
      const checkConnections = async () => {
        setCheckingConnection(true);
        try {
          const fbConnected = await checkFacebookConnection();
          setHasFacebookConnection(fbConnected);
        } catch (error) {
          console.error("Error checking connections:", error);
        } finally {
          setCheckingConnection(false);
        }
      };
      
      checkConnections();
    }
  }, [open]);

  const handleSubmit = () => {
    if (!campaignName.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate campaign creation process
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      
      toast.success("Campaign created", {
        description: "You will now be redirected to the campaign creation page"
      });
      
      navigate("/campaign-creation", { 
        state: { campaignName, campaignType } 
      });
    }, 1500);
  };

  const handleConnectFacebook = () => {
    onOpenChange(false);
    navigate("/platforms");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
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
