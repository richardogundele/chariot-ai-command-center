
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { updateCampaignStatus } from "@/services/platforms/facebook";
import { toast } from "sonner";
import {
  AlertCircle,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  X
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface CampaignActionsProps {
  campaignId: string;
  status: string;
  onStatusChange?: (newStatus: string) => void;
}

export const CampaignActions: React.FC<CampaignActionsProps> = ({
  campaignId,
  status,
  onStatusChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const success = await updateCampaignStatus(campaignId, newStatus);
      if (success) {
        toast.success(`Campaign ${newStatus.toLowerCase()}d`, {
          description: `Campaign has been successfully ${newStatus.toLowerCase()}d`
        });
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      } else {
        throw new Error(`Failed to ${newStatus.toLowerCase()} campaign`);
      }
    } catch (error) {
      console.error(`Error ${newStatus.toLowerCase()}ing campaign:`, error);
      toast.error(`Failed to ${newStatus.toLowerCase()} campaign`, {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
      setShowStopDialog(false);
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'Paused':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Paused</Badge>;
      case 'Stopped':
        return <Badge variant="outline" className="text-red-500 border-red-500">Stopped</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Pending</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          {renderStatusBadge()}
        </div>
        
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Button disabled size="sm">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing
            </Button>
          ) : (
            <>
              {status === 'Active' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange('Paused')}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              
              {status === 'Paused' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange('Active')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
              
              {(status === 'Active' || status === 'Paused') && (
                <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Stop Campaign</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to stop this campaign? This action cannot be undone
                        and the campaign cannot be restarted once stopped.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleStatusChange('Stopped')}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Stop Campaign
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {status === 'Failed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange('Pending')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      {status === 'Pending' && (
        <div className="rounded-md bg-blue-50 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Campaign is being processed
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Your campaign is currently being set up on Facebook. This might take a few moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {status === 'Failed' && (
        <div className="rounded-md bg-red-50 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Campaign setup failed
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  There was an issue creating your campaign on Facebook. You can try again by clicking "Retry".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
