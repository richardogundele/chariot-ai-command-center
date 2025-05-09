
import { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { hasUserCompletedSetup } from "@/services/auth/userProfileService";

export function SetupNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check local storage first to see if we've already dismissed this notification
    const hasSeenNotification = localStorage.getItem('setup_notification_dismissed') === 'true';
    
    if (!hasSeenNotification) {
      checkUserSetup();
    }
  }, []);
  
  const checkUserSetup = async () => {
    try {
      const isSetupComplete = await hasUserCompletedSetup();
      
      // Only show notification if setup is not complete
      if (!isSetupComplete) {
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Error checking user setup:", error);
    }
  };
  
  const handleDismiss = () => {
    setShowNotification(false);
    // Remember that the user has dismissed this notification
    localStorage.setItem('setup_notification_dismissed', 'true');
  };
  
  const handleGoToSettings = () => {
    navigate('/settings');
    handleDismiss();
  };
  
  if (!showNotification) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">Complete Your Setup</h3>
        <button onClick={handleDismiss} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        To get started with our AI-powered marketing tools, please complete your profile and add your API keys in the settings.
      </p>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={handleDismiss}>
          Later
        </Button>
        <Button size="sm" onClick={handleGoToSettings}>
          Go to Settings
        </Button>
      </div>
    </div>
  );
}
