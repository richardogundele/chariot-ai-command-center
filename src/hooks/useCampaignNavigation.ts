
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useCampaignNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [campaignId, setCampaignId] = useState<string | null>(null);
  
  // Extract campaignId from state (if available)
  useEffect(() => {
    if (location.state?.campaignId) {
      setCampaignId(location.state.campaignId);
      
      // Clear state after using it
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  const selectCampaign = (id: string) => {
    setCampaignId(id);
  };
  
  const backToList = () => {
    setCampaignId(null);
  };
  
  return {
    campaignId,
    selectCampaign,
    backToList
  };
};
