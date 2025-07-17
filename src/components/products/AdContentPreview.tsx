
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Ad Content Preview</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Ad Copy</h3>
            <div className="border p-4 rounded-lg bg-muted/30 whitespace-pre-wrap max-h-80 overflow-y-auto text-base leading-relaxed">
              {content?.adCopy || "No ad copy available"}
            </div>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base font-medium"
              size="lg"
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
              <Copy className="mr-2 h-5 w-5" />
              Copy Ad Copy
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Ad Image</h3>
            <div className="border p-4 rounded-lg bg-muted/30 flex justify-center">
              <Avatar className="rounded-lg w-full h-auto aspect-video max-w-md">
                <AvatarImage 
                  src={content?.image || ""} 
                  alt="Ad image" 
                  className="object-contain rounded-lg"
                />
                <AvatarFallback className="w-full h-full rounded-lg flex items-center justify-center text-muted-foreground bg-muted">
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
