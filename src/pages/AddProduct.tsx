
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Globe, Upload, Image, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [inputMethod, setInputMethod] = useState<"url" | "manual">("url");
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatedAdCopy, setGeneratedAdCopy] = useState("");
  const [generatedAdImage, setGeneratedAdImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) {
      toast({
        title: "URL required",
        description: "Please enter a product URL to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate fetching product data from URL
    setTimeout(() => {
      // Simulated data that would come from scraping the URL
      setProductName("Premium Wireless Headphones");
      setProductDescription("Experience crystal-clear audio with our premium wireless headphones. Featuring 40 hours of battery life, active noise cancellation, and a comfortable over-ear design.");
      setPrice("149.99");
      setTargetAudience("Music enthusiasts, professionals, commuters");
      setPreviewImage("/placeholder.svg");
      
      setIsLoading(false);
      setStep(2);
      
      toast({
        title: "Product information retrieved",
        description: "We've extracted the product details from the URL. You can edit them if needed.",
      });
    }, 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productDescription || !price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
  };

  const handleGenerateAdContent = () => {
    setIsGenerating(true);
    
    // Simulate AI generating ad content
    setTimeout(() => {
      setGeneratedAdCopy("Immerse yourself in sound like never before. Our Premium Wireless Headphones deliver studio-quality audio with 40+ hours of battery life. Perfect for work, travel, or just escaping into your favorite music. Limited time offer: $149.99 with free shipping!");
      setGeneratedAdImage("/placeholder.svg");
      setIsGenerating(false);
      
      toast({
        title: "Ad content generated",
        description: "AI has created ad copy and visuals based on your product details.",
      });
    }, 3000);
  };

  const handleAdCopyEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedAdCopy(e.target.value);
  };

  const handleRegenerateAdContent = () => {
    setIsGenerating(true);
    
    // Simulate regenerating content
    setTimeout(() => {
      setGeneratedAdCopy("Experience audio excellence with our Premium Wireless Headphones. Tune out the world with active noise cancellation and enjoy 40 hours of uninterrupted listening. Your commute just got upgraded. Now only $149.99 – high quality doesn't have to come at a high price.");
      setIsGenerating(false);
      
      toast({
        title: "New ad copy generated",
        description: "We've created a new variation of ad copy for your review.",
      });
    }, 2000);
  };

  const handleSaveProduct = () => {
    setIsLoading(true);
    
    // Simulate saving product and ad copy
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Product ready for campaign",
        description: "Your product has been saved and is ready for campaign launch.",
      });
      
      navigate("/dashboard");
    }, 1500);
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
                        className="pl-10"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the URL of your product page. We'll extract the name, description, images, and other details.
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
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="price" 
                          placeholder="99.99" 
                          className="pl-10" 
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="target-audience">Target Audience</Label>
                      <Input 
                        id="target-audience" 
                        placeholder="Professionals, Students, etc." 
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-image">Product Image</Label>
                    <div className="border-2 border-dashed rounded-md p-4 text-center">
                      {previewImage ? (
                        <div className="relative">
                          <img 
                            src={previewImage} 
                            alt="Product preview" 
                            className="max-h-48 mx-auto rounded-md"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => {
                              setSelectedImage(null);
                              setPreviewImage(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
                          <Input 
                            id="product-image" 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          <Button type="button" variant="outline" onClick={() => document.getElementById('product-image')?.click()}>
                            Select Image
                          </Button>
                        </div>
                      )}
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                      <p>${price}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Target Audience</h3>
                      <p className="text-sm">{targetAudience}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center border rounded-md p-4">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Product" 
                      className="max-h-48 mx-auto rounded-md"
                    />
                  ) : (
                    <div className="text-center">
                      <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No product image available</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Edit Details
                </Button>
                <Button onClick={handleGenerateAdContent} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Ad Content"
                  )}
                </Button>
              </div>
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
                          <div className="text-center">
                            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No ad image generated yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      disabled={isGenerating}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate New Image
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setGeneratedAdCopy("")}>
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
                      Mark Ready for Campaign
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
