import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RefreshCw, Sparkles, Target, MessageSquare, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { 
  COPYWRITING_STYLES, 
  generateCopyWithExplanation, 
  classifyProductNiche, 
  getStyleRecommendations,
  CopywritingRequest,
  CopywritingResult 
} from '@/services/products/copywritingEngine';
import { supabase } from '@/integrations/supabase/client';

interface CopywritingEngineProps {
  productName: string;
  productDescription: string;
  productPrice?: number;
  targetAudience?: string;
}

const CopywritingEngine = ({ 
  productName, 
  productDescription, 
  productPrice, 
  targetAudience 
}: CopywritingEngineProps) => {
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof COPYWRITING_STYLES>('hormozi');
  const [contentType, setContentType] = useState<CopywritingRequest['contentType']>('headlines');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, CopywritingResult>>({});

  // Get style recommendations based on product niche
  const niche = classifyProductNiche(productDescription);
  const recommendations = getStyleRecommendations(niche, contentType);

  const generateCopy = async () => {
    setIsGenerating(true);
    try {
      // Get OpenAI API key from Supabase function
      const { data: keyData } = await supabase.functions.invoke('get-openai-key');
      if (!keyData?.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const request: CopywritingRequest = {
        productName,
        productDescription,
        productPrice,
        targetAudience,
        style: selectedStyle,
        contentType,
        niche
      };

      const result = await generateCopyWithExplanation(request, keyData.apiKey);
      
      setResults(prev => ({
        ...prev,
        [selectedStyle + '-' + contentType]: result
      }));

      toast.success('Copy generated successfully!');
    } catch (error) {
      console.error('Error generating copy:', error);
      toast.error('Failed to generate copy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const currentResult = results[selectedStyle + '-' + contentType];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'headlines': return <Target className="h-4 w-4" />;
      case 'carousel': return <FileText className="h-4 w-4" />;
      case 'adcopy': return <Sparkles className="h-4 w-4" />;
      case 'sales': return <MessageSquare className="h-4 w-4" />;
      case 'chatbot': return <MessageSquare className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Style Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Copywriting Engine
          </CardTitle>
          <CardDescription>
            Generate high-converting copy in different styles based on your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Niche Detection */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">Detected Niche: {niche}</Badge>
            <Badge variant="secondary">Recommended: {recommendations.primary}</Badge>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Copywriting Style</label>
              <Select value={selectedStyle} onValueChange={(value) => setSelectedStyle(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(COPYWRITING_STYLES).map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{style.name}</span>
                        {recommendations.primary === style.id && (
                          <Badge variant="secondary" className="ml-2 text-xs">Recommended</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content Type</label>
              <Select value={contentType} onValueChange={(value) => setContentType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headlines">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Headlines & Hooks
                    </div>
                  </SelectItem>
                  <SelectItem value="carousel">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Carousel Posts
                    </div>
                  </SelectItem>
                  <SelectItem value="adcopy">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Ad Copy
                    </div>
                  </SelectItem>
                  <SelectItem value="sales">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Sales Letters
                    </div>
                  </SelectItem>
                  <SelectItem value="chatbot">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Chatbot Responses
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generateCopy} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Style Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">{COPYWRITING_STYLES[selectedStyle].name}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Best for: {COPYWRITING_STYLES[selectedStyle].useFor.join(', ')}
            </p>
            <div className="flex flex-wrap gap-1">
              {COPYWRITING_STYLES[selectedStyle].traits.map((trait) => (
                <Badge key={trait} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {currentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getContentIcon(contentType)}
              Generated {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="copy" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="copy">Main Copy</TabsTrigger>
                <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="copy" className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={currentResult.content}
                    readOnly
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(currentResult.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Badge>Confidence: {currentResult.confidence}%</Badge>
                  <Badge variant="outline">Style: {COPYWRITING_STYLES[currentResult.style].name}</Badge>
                </div>
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-4">
                {currentResult.alternatives.map((alt, index) => (
                  <div key={index} className="relative">
                    <Textarea
                      value={alt}
                      readOnly
                      className="min-h-[120px] resize-none"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(alt)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Why This Works</h4>
                    <p className="text-sm text-muted-foreground">{currentResult.explanation}</p>
                  </div>
                  
                  {currentResult.suggestedImprovements && (
                    <div>
                      <h4 className="font-medium mb-2">Suggested Improvements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {currentResult.suggestedImprovements.map((improvement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-current rounded-full" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CopywritingEngine;