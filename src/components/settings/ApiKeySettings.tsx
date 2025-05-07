
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import ApiKeyInput from './ApiKeyInput';

export default function ApiKeySettings() {
  const { toast } = useToast();
  
  // Get the saved API key or use the one provided
  const savedApiKey = window.localStorage.getItem('openai_api_key');
  const defaultApiKey = "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";
  
  useEffect(() => {
    // Set the default API key if none exists
    if (!savedApiKey) {
      window.localStorage.setItem('openai_api_key', defaultApiKey);
      toast({
        title: "API Key Configured",
        description: "OpenAI API key has been automatically configured for your convenience.",
      });
    }
  }, [toast, savedApiKey]);

  const handleSaveOpenAIKey = (key: string) => {
    // In a real app, this would be stored securely and used for API requests
    window.localStorage.setItem('openai_api_key', key);
    
    // For demo purposes, we'll reload the page to use the new key
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">API Keys</h2>
        <p className="text-muted-foreground">
          Configure external API keys for enhanced functionality
        </p>
      </div>
      
      {savedApiKey && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertDescription className="text-green-700 ml-2">
            OpenAI API key is configured and ready for use.
          </AlertDescription>
        </Alert>
      )}
      
      <ApiKeyInput
        serviceName="OpenAI"
        description="Required for AI-generated ad copy and product images"
        onSave={handleSaveOpenAIKey}
        initialValue={savedApiKey || defaultApiKey}
      />

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Additional API Keys</h3>
        <p className="text-muted-foreground mb-4">
          These API keys will be available in future updates
        </p>
        
        <div className="grid gap-4">
          <ApiKeyInput
            serviceName="Google API"
            description="For maps and search integrations"
            onSave={(key) => {
              window.localStorage.setItem('google_api_key', key);
              toast({
                title: "Google API Key Saved",
                description: "Your Google API key has been saved successfully.",
              });
            }}
            initialValue="AIzaSyDv8HHl96mUkffa_uNaqFigTbmljg39UBQ"
          />
          
          <ApiKeyInput
            serviceName="Hive"
            description="For content moderation and analysis"
            onSave={(key) => {
              window.localStorage.setItem('hive_api_key', key);
              toast({
                title: "Hive API Key Saved",
                description: "Your Hive API key has been saved successfully.",
              });
            }}
            initialValue="EqHi0adq7V4H5o5QPekGr7G9ZLJbzgHb"
          />
          
          <ApiKeyInput
            serviceName="Google Custom Search"
            description="For enhanced product search capabilities"
            onSave={(key) => {
              window.localStorage.setItem('google_custom_search_api_key', key);
              toast({
                title: "Google Custom Search API Key Saved",
                description: "Your Google Custom Search API key has been saved successfully.",
              });
            }}
            initialValue="AIzaSyDhFWIGmbt6YFv1sCr1XkuDnnUq1lvWNlM"
          />
        </div>
      </div>
    </div>
  );
}
