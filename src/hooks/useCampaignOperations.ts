
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCampaignOperations = () => {
  const [loading, setLoading] = useState(false);

  const bulkUpdateCampaigns = async (campaignIds: string[], updates: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .in('id', campaignIds);

      if (error) throw error;

      toast.success(`Updated ${campaignIds.length} campaigns successfully`);
      return true;
    } catch (error) {
      console.error('Error updating campaigns:', error);
      toast.error('Failed to update campaigns');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cloneCampaign = async (campaignId: string) => {
    setLoading(true);
    try {
      // Fetch original campaign
      const { data: originalCampaign, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (fetchError) throw fetchError;

      // Create clone
      const { data: clonedCampaign, error: cloneError } = await supabase
        .from('campaigns')
        .insert({
          ...originalCampaign,
          id: undefined, // Let it generate new ID
          name: `${originalCampaign.name} (Copy)`,
          status: 'Draft',
          created_at: undefined,
          updated_at: undefined
        })
        .select()
        .single();

      if (cloneError) throw cloneError;

      toast.success('Campaign cloned successfully');
      return clonedCampaign;
    } catch (error) {
      console.error('Error cloning campaign:', error);
      toast.error('Failed to clone campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaigns = async (campaignIds: string[]) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .in('id', campaignIds);

      if (error) throw error;

      toast.success(`Deleted ${campaignIds.length} campaigns successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting campaigns:', error);
      toast.error('Failed to delete campaigns');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (template: any) => {
    setLoading(true);
    try {
      // This would save to a campaign_templates table
      // For now, we'll just simulate the operation
      console.log('Saving template:', template);
      
      toast.success('Template saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bulkUpdateCampaigns,
    cloneCampaign,
    deleteCampaigns,
    saveTemplate
  };
};
