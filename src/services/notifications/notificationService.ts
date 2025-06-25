
import { toast } from "sonner";

export interface NotificationData {
  type: 'product_created' | 'image_generated' | 'campaign_created' | 'campaign_status' | 'performance_alert';
  title: string;
  message: string;
  metadata?: any;
}

export class NotificationService {
  static async createNotification(data: NotificationData) {
    // In a real app, this would save to the database
    // For now, we'll just show a toast notification
    toast.success(data.title, {
      description: data.message,
      duration: 4000,
    });
    
    console.log('Notification created:', data);
  }

  static notifyProductCreated(productName: string) {
    this.createNotification({
      type: 'product_created',
      title: 'New Product Added',
      message: `${productName} has been successfully added to your product library`,
    });
  }

  static notifyImageGenerated(productName: string) {
    this.createNotification({
      type: 'image_generated',
      title: 'Product Image Generated',
      message: `AI has generated a new product image for ${productName}`,
    });
  }

  static notifyCampaignCreated(campaignName: string) {
    this.createNotification({
      type: 'campaign_created',
      title: 'Campaign Created',
      message: `Campaign "${campaignName}" has been created successfully`,
    });
  }

  static notifyCampaignStatusChange(campaignName: string, status: string) {
    this.createNotification({
      type: 'campaign_status',
      title: `Campaign ${status}`,
      message: `Your campaign "${campaignName}" is now ${status.toLowerCase()}`,
    });
  }

  static notifyPerformanceAlert(message: string) {
    this.createNotification({
      type: 'performance_alert',
      title: 'Performance Alert',
      message: message,
    });
  }
}
