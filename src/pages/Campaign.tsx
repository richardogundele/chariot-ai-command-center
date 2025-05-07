
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, CalendarDays, Trash2, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CampaignDialog from "@/components/products/CampaignDialog";
import { CampaignSummaryCards } from "@/components/campaign/CampaignSummaryCards";
import { CampaignList } from "@/components/campaign/CampaignList";
import { CampaignPerformanceTabs } from "@/components/campaign/CampaignPerformanceTabs";

const Campaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState<string>("");
  
  const handleDeleteCampaign = () => {
    // In a real app, this would make an API call to delete the campaign
    toast({
      title: "Campaign Deleted",
      description: "The campaign has been deleted successfully.",
    });
    setDeleteDialogOpen(false);
  };
  
  const handleEditCampaign = () => {
    // In a real app, this would make an API call to update the campaign
    toast({
      title: "Campaign Updated",
      description: "The campaign has been updated successfully.",
    });
    setEditDialogOpen(false);
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
                <tr className="border-t">
                  <td className="p-3">Summer Sale 2023</td>
                  <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span></td>
                  <td className="p-3">Facebook</td>
                  <td className="p-3">$50/day</td>
                  <td className="p-3">2.4x ROAS</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog("1", "Summer Sale 2023")}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openDeleteDialog("1", "Summer Sale 2023")}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Back to School</td>
                  <td className="p-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Paused</span></td>
                  <td className="p-3">Instagram</td>
                  <td className="p-3">$35/day</td>
                  <td className="p-3">1.8x ROAS</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog("2", "Back to School")}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openDeleteDialog("2", "Back to School")}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </td>
                </tr>
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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input id="name" defaultValue={selectedCampaignName} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Daily Budget</Label>
              <Input id="budget" type="number" defaultValue={50} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCampaign}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Campaign;
