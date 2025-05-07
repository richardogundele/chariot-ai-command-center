
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2 } from "lucide-react";
import ApiKeyInput from './ApiKeyInput';
import { getApiKey, updateApiKey } from '@/services/api/apiKeyService';

export default function ApiKeySettings() {
  const { toast } = useToast();
  const [openAIApiKey, setOpenAIApiKey] = useState<string | null>(null);
  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
  const [hiveApiKey, setHiveApiKey] = useState<string | null>(null);
  const [googleCustomSearchApiKey, setGoogleCustomSearchApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load API keys from Supabase
    const loadApiKeys = async () => {
      try {
        setLoading(true);
        const [openai, google, hive, googleSearch] = await Promise.all([
          getApiKey('openai_api_key'),
          getApiKey('google_api_key'),
          getApiKey('hive_api_key'),
          getApiKey('google_custom_search_api_key')
        ]);
        
        setOpenAIApiKey(openai);
        setGoogleApiKey(google);
        setHiveApiKey(hive);
        setGoogleCustomSearchApiKey(googleSearch);
        
        // Set to localStorage for backward compatibility
        if (openai) window.localStorage.setItem('openai_api_key', openai);
      } catch (error) {
        console.error("Failed to load API keys:", error);
        toast({
          title: "Error Loading Keys",
          description: "Could not load API keys from the database.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadApiKeys();
  }, [toast]);

  const handleSaveOpenAIKey = async (key: string) => {
    try {
      const success = await updateApiKey('openai_api_key', key);
      
      if (success) {
        setOpenAIApiKey(key);
        window.localStorage.setItem('openai_api_key', key); // For backward compatibility
        
        toast({
          title: "API Key Saved",
          description: "Your OpenAI API key has been saved successfully.",
        });
      } else {
        throw new Error("Failed to update API key");
      }
    } catch (error) {
      console.error("Error saving OpenAI key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveGoogleApiKey = async (key: string) => {
    try {
      const success = await updateApiKey('google_api_key', key);
      
      if (success) {
        setGoogleApiKey(key);
        window.localStorage.setItem('google_api_key', key);
        
        toast({
          title: "Google API Key Saved",
          description: "Your Google API key has been saved successfully.",
        });
      } else {
        throw new Error("Failed to update API key");
      }
    } catch (error) {
      console.error("Error saving Google key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveHiveApiKey = async (key: string) => {
    try {
      const success = await updateApiKey('hive_api_key', key);
      
      if (success) {
        setHiveApiKey(key);
        window.localStorage.setItem('hive_api_key', key);
        
        toast({
          title: "Hive API Key Saved",
          description: "Your Hive API key has been saved successfully.",
        });
      } else {
        throw new Error("Failed to update API key");
      }
    } catch (error) {
      console.error("Error saving Hive key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveGoogleCustomSearchApiKey = async (key: string) => {
    try {
      const success = await updateApiKey('google_custom_search_api_key', key);
      
      if (success) {
        setGoogleCustomSearchApiKey(key);
        window.localStorage.setItem('google_custom_search_api_key', key);
        
        toast({
          title: "Google Custom Search API Key Saved",
          description: "Your Google Custom Search API key has been saved successfully.",
        });
      } else {
        throw new Error("Failed to update API key");
      }
    } catch (error) {
      console.error("Error saving Google Custom Search key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">API Keys</h2>
        <p className="text-muted-foreground">
          Configure external API keys for enhanced functionality
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading API keys...</span>
        </div>
      ) : (
        <>
          {openAIApiKey && (
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
            initialValue={openAIApiKey || ""}
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
                onSave={handleSaveGoogleApiKey}
                initialValue={googleApiKey || ""}
              />
              
              <ApiKeyInput
                serviceName="Hive"
                description="For content moderation and analysis"
                onSave={handleSaveHiveApiKey}
                initialValue={hiveApiKey || ""}
              />
              
              <ApiKeyInput
                serviceName="Google Custom Search"
                description="For enhanced product search capabilities"
                onSave={handleSaveGoogleCustomSearchApiKey}
                initialValue={googleCustomSearchApiKey || ""}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
