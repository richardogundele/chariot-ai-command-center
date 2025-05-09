import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, CalendarDays, Trash2, Edit, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CampaignDialog from "@/components/products/CampaignDialog";
import { CampaignSummaryCards } from "@/components/campaign/CampaignSummaryCards";
import { CampaignList } from "@/components/campaign/CampaignList";
import { CampaignPerformanceTabs } from "@/components/campaign/CampaignPerformanceTabs";
import { supabase } from "@/integrations/supabase/client"; 

interface Campaign {
  id: string;
  name: string;
  status: string;
  platform: string;
  budget: number;
  roas?: number;
}

const Campaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchCampaigns();
  }, []);
  
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*');
      
      if (error) throw error;
      
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to load campaign data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteCampaign = async () => {
    if (!selectedCampaignId) return;
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', selectedCampaignId);
        
      if (error) throw error;
      
      // Remove from local state
      setCampaigns(campaigns.filter(campaign => campaign.id !== selectedCampaignId));
      
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  const handleEditCampaign = async (formData: { name: string, budget: number }) => {
    if (!selectedCampaignId) return;
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ 
          name: formData.name,
          budget: formData.budget 
        })
        .eq('id', selectedCampaignId);
        
      if (error) throw error;
      
      // Update in local state
      setCampaigns(campaigns.map(campaign => 
        campaign.id === selectedCampaignId 
          ? { ...campaign, name: formData.name, budget: formData.budget }
          : campaign
      ));
      
      toast({
        title: "Campaign Updated",
        description: "The campaign has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEditDialogOpen(false);
    }
  };
  
  const openDeleteDialog = (id: string, name: string) => {
    setSelectedCampaignId(id);
    setSelectedCampaignName(name);
    setDeleteDialogOpen(true);
  };
  
  const openEditDialog = (id: string, name: string) => {
    setSelectedCampaignId(id);
    setSelectedCampaignName(name);
    setEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground">Manage and track all your product campaigns</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Last 7 days
          </Button>
          <Button className="gap-2" onClick={() => setCampaignDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>
      
      {/* Campaign Summary Cards */}
      <CampaignSummaryCards />
      
      {/* List of Campaigns */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Campaigns</h2>
        </div>
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3">Campaign Name</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Platform</th>
                  <th className="text-left p-3">Budget</th>
                  <th className="text-left p-3">Results</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </td>
                  </tr>
                ) : campaigns.length > 0 ? (
                  campaigns.map(campaign => (
                    <tr key={campaign.id} className="border-t">
                      <td className="p-3">{campaign.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'Paused' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-3">{campaign.platform}</td>
                      <td className="p-3">${campaign.budget}/day</td>
                      <td className="p-3">{campaign.roas ? `${campaign.roas.toFixed(1)}x ROAS` : 'No data'}</td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(campaign.id, campaign.name)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openDeleteDialog(campaign.id, campaign.name)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No campaigns found. Create your first campaign to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Performance Charts */}
      <CampaignPerformanceTabs />
      
      <CampaignDialog 
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
        // Pass a callback function that will refetch campaigns after a new one is created
        onCampaignCreated={fetchCampaigns}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign "{selectedCampaignName}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCampaign}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Make changes to your campaign settings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get('name') as string;
            const budget = parseFloat(formData.get('budget') as string);
            handleEditCampaign({ name, budget });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input id="name" name="name" defaultValue={selectedCampaignName} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Daily Budget</Label>
                <Input id="budget" name="budget" type="number" defaultValue={50} min={1} step={0.01} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Campaign;
