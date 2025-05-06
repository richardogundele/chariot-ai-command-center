
import ApiKeyInput from './ApiKeyInput';

export default function ApiKeySettings() {
  const handleSaveOpenAIKey = (key: string) => {
    // In a real app, this would be stored securely and used for API requests
    window.localStorage.setItem('openai_api_key', key);
    
    // For demo purposes, we'll reload the page to use the new key
    window.location.reload();
  };

  const savedKey = window.localStorage.getItem('openai_api_key') || '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">API Keys</h2>
        <p className="text-muted-foreground">
          Configure external API keys for enhanced functionality
        </p>
      </div>
      
      <ApiKeyInput
        serviceName="OpenAI"
        description="Required for AI-generated ad copy and product images"
        onSave={handleSaveOpenAIKey}
        initialValue={savedKey}
      />
    </div>
  );
}
