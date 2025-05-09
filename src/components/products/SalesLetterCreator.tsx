
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SalesLetterCreatorProps {
  productId: string | number;
  productName: string;
  initialContent?: string;
}

export const SalesLetterCreator = ({ productId, productName, initialContent = "" }: SalesLetterCreatorProps) => {
  const [letterTitle, setLetterTitle] = useState(`${productName} - Sales Letter`);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Sales letter content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Convert productId to string if it's a number
      const productIdString = typeof productId === 'number' ? productId.toString() : productId;
      
      const { data, error } = await supabase
        .from('sales_letters')
        .insert({
          product_id: productIdString,
          title: letterTitle,
          content: content
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Sales letter saved successfully",
      });
    } catch (error) {
      console.error("Error saving sales letter:", error);
      toast({
        title: "Error",
        description: "Failed to save sales letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Sales letter copied to clipboard",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${letterTitle.replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Sales letter downloaded as text file",
    });
  };

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Sales Letter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="letter-title">Title</Label>
          <Input
            id="letter-title"
            value={letterTitle}
            onChange={(e) => setLetterTitle(e.target.value)}
            placeholder="Enter a title for your sales letter"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="letter-content">Content</Label>
          <Textarea
            id="letter-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your sales letter content"
            className="min-h-[300px]"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Letter
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="flex-1"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesLetterCreator;
