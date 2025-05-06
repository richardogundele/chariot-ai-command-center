
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Key } from "lucide-react";

interface ApiKeyInputProps {
  serviceName: string;
  description: string;
  onSave: (key: string) => void;
  initialValue?: string;
}

export default function ApiKeyInput({ serviceName, description, onSave, initialValue = '' }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would make an API call to store the key securely
      localStorage.setItem(`${serviceName.toLowerCase()}_api_key`, apiKey);
      onSave(apiKey);
      toast.success(`${serviceName} API key saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${serviceName} API key:`, error);
      toast.error(`Failed to save ${serviceName} API key. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          {serviceName} API Key
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder={`Enter your ${serviceName} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This key will be stored in your browser's local storage. In a production environment, this should be stored securely on the server.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!apiKey || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save API Key'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
