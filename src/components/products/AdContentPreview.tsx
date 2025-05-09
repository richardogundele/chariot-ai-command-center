
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
              <Avatar className="rounded-none w-full h-auto aspect-video">
                <AvatarImage 
                  src={content?.image || ""} 
                  alt="Ad image" 
                  className="object-contain max-h-96"
                />
                <AvatarFallback className="w-full h-full rounded-none flex items-center justify-center text-muted-foreground bg-muted">
                  {content?.image ? "Failed to load image" : "No image available"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdContentPreview;
