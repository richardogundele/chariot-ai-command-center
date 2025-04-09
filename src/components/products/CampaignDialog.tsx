
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2 } from "lucide-react";

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CampaignDialog = ({ open, onOpenChange }: CampaignDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState("");
  const [campaignBudget, setCampaignBudget] = useState("50");
  const [campaignPlatform, setCampaignPlatform] = useState("facebook");
  const [campaignLoading, setCampaignLoading] = useState(false);

  const handleQuickCampaignCreation = () => {
    setCampaignLoading(true);
    
    setTimeout(() => {
      setCampaignLoading(false);
      onOpenChange(false);
      
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully. View details in Campaign page.",
      });
      
      navigate("/campaign");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Quick Campaign</DialogTitle>
          <DialogDescription>
            Set up a basic campaign to promote your product. You can customize it further later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input 
              id="campaign-name" 
              placeholder="Summer Sale 2023" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="campaign-budget">Daily Budget ($)</Label>
            <Input 
              id="campaign-budget" 
              type="number" 
              placeholder="50" 
              value={campaignBudget}
              onChange={(e) => setCampaignBudget(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="campaign-platform">Platform</Label>
            <Select value={campaignPlatform} onValueChange={setCampaignPlatform}>
              <SelectTrigger id="campaign-platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => navigate("/campaign-creation")} variant="outline">
            Advanced Setup
          </Button>
          <Button onClick={handleQuickCampaignCreation} disabled={campaignLoading || !campaignName}>
            {campaignLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Launch
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDialog;
