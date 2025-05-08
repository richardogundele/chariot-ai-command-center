
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdContentPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: {
    adCopy?: string;
    image?: string;
  } | null;
}

const AdContentPreview = ({ open, onOpenChange, content }: AdContentPreviewProps) => {
  const { toast } = useToast();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ad Content Preview</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Ad Copy</h3>
            <div className="border p-4 rounded-md bg-muted/30 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {content?.adCopy || "No ad copy available"}
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                if (content?.adCopy) {
                  navigator.clipboard.writeText(content.adCopy);
                  toast({
                    title: "Copied",
                    description: "Ad copy copied to clipboard",
                  });
                }
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Ad Copy
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Ad Image</h3>
            <div className="border p-4 rounded-md bg-muted/30 flex justify-center">
              {content?.image ? (
                <img 
                  src={content.image} 
                  alt="Ad image" 
                  className="max-h-96 object-contain"
                  onError={(e) => {
                    console.error("Image failed to load:", content.image);
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.alt = "Failed to load image";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-48 w-full text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdContentPreview;
