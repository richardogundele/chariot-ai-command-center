import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { ArrowLeft, Globe, Loader2, RefreshCw, CheckCircle2, DollarSign, Sparkles, AlertCircle, Settings as SettingsIcon } from "lucide-react";
import { generateAdCopy, generateProductImage, extractProductFromUrl } from "@/services/products/aiGenerationService";
import { saveProduct } from "@/services/products/productService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast: useToastFn } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [inputMethod, setInputMethod] = useState<"url" | "manual">("url");
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [generatedAdCopy, setGeneratedAdCopy] = useState("");
  const [generatedAdImage, setGeneratedAdImage] = useState<string | null>(null);
  const [urlError, setUrlError] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check if API key is available either in env or localStorage
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    setHasApiKey(!!apiKey);
  }, []);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) {
      toast.error("Please enter a product URL to continue.");
      return;
    }

    setIsLoading(true);
    setUrlError("");
    
    try {
      // Extract product data from URL
      const result = await extractProductFromUrl(productUrl);
      
      if (result.success && result.name && result.description) {
        setProductName(result.name);
        setProductDescription(result.description);
        if (result.price) {
          setPrice(result.price.toString());
        }
        
        toast.success("Product information retrieved successfully!");
        setStep(2);
      } else {
        setUrlError(result.error || "Could not extract product information from this URL.");
        toast.error("Failed to retrieve product information. Please check the URL or use manual entry.");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setUrlError("An unexpected error occurred. Please try again or use manual entry.");
      toast.error("Failed to retrieve product information. Please try again or use manual entry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productDescription) {
      toast.error("Please fill in all required fields to continue.");
      return;
    }

    setStep(2);
    toast.success("Product details saved. Ready for AI content generation.");
  };

  const handleGenerateAdContent = async () => {
    setIsGenerating(true);
    
    try {
      // Generate ad copy and image in parallel
      const [adCopy, imageUrl] = await Promise.all([
        generateAdCopy(productName, productDescription),
        generateProductImage(productName, productDescription)
      ]);
      
      setGeneratedAdCopy(adCopy);
      setGeneratedAdImage(imageUrl);
      
      toast.success("AI has created ad content based on your product details.");
    } catch (error) {
      console.error("Error generating ad content:", error);
      toast.error("Failed to generate AI content. Please try again.");
      
      // Fallback content in case of error
      setGeneratedAdCopy("Experience the amazing " + productName + ". Designed for performance and comfort. Get yours today!");
      setGeneratedAdImage("/placeholder.svg");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdCopyEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedAdCopy(e.target.value);
  };

  const handleRegenerateAdContent = async () => {
    setIsGenerating(true);
    
    try {
      const newAdCopy = await generateAdCopy(productName, productDescription);
      setGeneratedAdCopy(newAdCopy);
      toast.success("New ad copy generated successfully!");
    } catch (error) {
      console.error("Error regenerating ad copy:", error);
      toast.error("Failed to generate new ad copy. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateImage = async () => {
    setIsGenerating(true);
    
    try {
      const newImageUrl = await generateProductImage(productName, productDescription);
      setGeneratedAdImage(newImageUrl);
      toast.success("New product image generated successfully!");
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast.error("Failed to generate new image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!productName || !productDescription || !generatedAdCopy || !generatedAdImage) {
      toast.error("Missing required information. Please complete all steps.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save to Supabase
      const result = await saveProduct({
        name: productName,
        description: productDescription,
        adCopy: generatedAdCopy,
        image: generatedAdImage,
        price: price ? parseFloat(price) : undefined,
        platforms: [],
        status: 'Draft'
      });
      
      if (result) {
        toast.success("Product saved successfully!");
        navigate("/saved-products");
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product for your marketing campaigns</p>
          </div>
        </div>
      </div>
      
      {!hasApiKey && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>OpenAI API Key Missing</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>For full functionality, please add your OpenAI API key in settings. The application will use placeholder content until then.</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Go to Settings
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-4 mb-6">
        <div className={`relative flex-1 flex h-1 ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}>
          <div className="absolute -top-1 -left-1 rounded-full bg-primary text-xs text-white flex items-center justify-center h-3 w-3"></div>
        </div>
        <div className={`relative flex-1 flex h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}>
          <div className={`absolute -top-1 -left-1 rounded-full text-xs flex items-center justify-center h-3 w-3 ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}></div>
        </div>
      </div>
      
      {step === 1 && (
        <Card className="mb-8">
          <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as "url" | "manual")}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="url">Product URL</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url">
              <form onSubmit={handleUrlSubmit}>
                <CardHeader>
                  <CardTitle>Enter Product URL</CardTitle>
                  <CardDescription>We'll extract product information automatically</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-url">Product URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="product-url" 
                        placeholder="https://example.com/product" 
                        className={`pl-10 ${urlError ? 'border-red-500' : ''}`}
                        value={productUrl}
                        onChange={(e) => {
                          setProductUrl(e.target.value);
                          if (urlError) setUrlError("");
                        }}
                      />
                    </div>
                    {urlError && (
                      <p className="text-sm text-red-500">{urlError}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Enter the URL of your product page. We'll extract the name, description, and price.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing URL...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="manual">
              <form onSubmit={handleManualSubmit}>
                <CardHeader>
                  <CardTitle>Enter Product Details</CardTitle>
                  <CardDescription>Add your product information manually</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input 
                      id="product-name" 
                      placeholder="Premium Wireless Headphones" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-description">Product Description</Label>
                    <Textarea 
                      id="product-description" 
                      placeholder="Describe your product in detail..."
                      rows={4}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Our AI will analyze this to create targeted ads</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="price" 
                        placeholder="99.99" 
                        className="pl-10" 
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Continue</Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Product Details</CardTitle>
              <CardDescription>Confirm your product information before generating ad content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Product Name</h3>
                    <p>{productName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-sm">{productDescription}</p>
                  </div>
                  
                  {price && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                      <p>${price}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center items-center space-y-4 border rounded-md p-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Our AI will generate optimized ad content for your product based on the description.
                  </p>
                  <Button onClick={handleGenerateAdContent} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Ad Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Edit Details
              </Button>
            </CardFooter>
          </Card>
          
          {generatedAdCopy && (
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Ad Content</CardTitle>
                <CardDescription>Review and edit your generated ad copy and image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ad-copy">Ad Copy</Label>
                      <Textarea 
                        id="ad-copy" 
                        rows={6} 
                        value={generatedAdCopy}
                        onChange={handleAdCopyEdit}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleRegenerateAdContent}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Generate New Copy
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div>
                    <div className="space-y-2 mb-4">
                      <Label>Generated Ad Image</Label>
                      <div className="border rounded-md p-4 flex items-center justify-center">
                        {generatedAdImage ? (
                          <img 
                            src={generatedAdImage} 
                            alt="Generated ad" 
                            className="max-h-48 mx-auto rounded-md"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Loader2 className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
                            <p className="text-sm text-muted-foreground">Generating ad image...</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={handleRegenerateImage}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate New Image
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setGeneratedAdCopy("");
                  setGeneratedAdImage(null);
                }}>
                  Reset
                </Button>
                <Button onClick={handleSaveProduct} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Product
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AddProduct;
