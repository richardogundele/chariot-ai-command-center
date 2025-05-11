
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Loader2 } from "lucide-react";
import { fetchProducts } from "@/services/products/productService";
import { checkFacebookConnection } from "@/services/platforms/facebook";
import { Product } from "@/services/products/types";

const CampaignCreation = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [hasFacebookConnection, setHasFacebookConnection] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    campaignName: "",
    objective: "awareness",
    product: "",
    platforms: ["facebook", "instagram"],
    budget: 50,
    duration: "7",
    targetAudience: "",
    customizations: false,
    advanced: {
      ageRange: "18-65+",
      gender: "all",
      locations: [],
      interests: [],
      behaviors: [],
      placement: "automatic",
      bidStrategy: "lowest_cost",
    }
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load user products
        const productData = await fetchProducts();
        setProducts(productData);
        
        // Check Facebook connection status
        const facebookConnected = await checkFacebookConnection();
        setHasFacebookConnection(facebookConnected);
        
        if (!facebookConnected && formData.platforms.includes("facebook")) {
          toast.warning("You need to connect your Facebook account before launching a campaign.", {
            duration: 5000,
            action: {
              label: "Connect",
              onClick: () => navigate("/platforms")
            }
          });
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load data. Please refresh the page.");
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadInitialData();
  }, [navigate]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => {
    if (step === 1 && (!formData.campaignName || !formData.objective)) {
      toast.error("Please provide campaign name and objective");
      return;
    }
    
    if (step === 2 && !formData.platforms.length) {
      toast.error("Please select at least one platform");
      return;
    }
    
    if (step === 3 && !formData.targetAudience.trim()) {
      toast.error("Please provide target audience description");
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast.success("Campaign created successfully!");
        navigate("/campaign");
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/campaign");
    }
  };

  const renderAdvancedOptions = () => {
    if (!formData.customizations) return null;
    
    return (
      <div className="pt-4 space-y-4 border-t">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="demographics">
            <AccordionTrigger className="text-sm font-medium">Demographics</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <Select 
                    value={formData.advanced.ageRange} 
                    onValueChange={(value) => handleChange("advanced.ageRange", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55-64">55-64</SelectItem>
                      <SelectItem value="18-65+">All ages (18+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup 
                    value={formData.advanced.gender}
                    onValueChange={(value) => handleChange("advanced.gender", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="gender-all" />
                      <Label htmlFor="gender-all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="targeting">
            <AccordionTrigger className="text-sm font-medium">Detailed Targeting</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests</Label>
                  <Textarea 
                    id="interests" 
                    placeholder="E.g. fitness, technology, cooking (comma-separated)" 
                    value={formData.advanced.interests.join(", ")}
                    onChange={(e) => handleChange("advanced.interests", e.target.value.split(",").map(i => i.trim()).filter(Boolean))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="locations">Locations</Label>
                  <Textarea 
                    id="locations" 
                    placeholder="E.g. New York, Los Angeles, Chicago (comma-separated)" 
                    value={formData.advanced.locations.join(", ")}
                    onChange={(e) => handleChange("advanced.locations", e.target.value.split(",").map(i => i.trim()).filter(Boolean))}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="optimization">
            <AccordionTrigger className="text-sm font-medium">Ad Delivery Optimization</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Placement</Label>
                  <Select 
                    value={formData.advanced.placement} 
                    onValueChange={(value) => handleChange("advanced.placement", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic Placement</SelectItem>
                      <SelectItem value="feeds">Feeds Only</SelectItem>
                      <SelectItem value="stories">Stories Only</SelectItem>
                      <SelectItem value="reels">Reels Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Bid Strategy</Label>
                  <Select 
                    value={formData.advanced.bidStrategy} 
                    onValueChange={(value) => handleChange("advanced.bidStrategy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bid strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lowest_cost">Lowest Cost (Automatic)</SelectItem>
                      <SelectItem value="cost_cap">Cost Cap</SelectItem>
                      <SelectItem value="bid_cap">Bid Cap</SelectItem>
                      <SelectItem value="target_cost">Target Cost</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Controls how your budget is spent throughout your campaign.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">Set up your marketing campaign</p>
      </div>

      <div className="flex mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex-1 flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNumber < step ? "bg-green-500 text-white" : 
                stepNumber === step ? "bg-primary text-white" : 
                "bg-gray-200 text-gray-500"
              }`}
            >
              {stepNumber < step ? <Check className="h-4 w-4" /> : stepNumber}
            </div>
            <div 
              className={`h-1 flex-1 ${
                stepNumber < 4 ? (stepNumber < step ? "bg-green-500" : "bg-gray-200") : "hidden"
              }`}
            ></div>
          </div>
        ))}
      </div>

      <Card className="max-w-4xl mx-auto">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Campaign Basics</CardTitle>
              <CardDescription>Set up the foundation of your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="e.g., Summer Sale 2023"
                  value={formData.campaignName}
                  onChange={(e) => handleChange("campaignName", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Campaign Objective</Label>
                <RadioGroup 
                  value={formData.objective}
                  onValueChange={(value) => handleChange("objective", value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="awareness" id="awareness" />
                    <Label htmlFor="awareness" className="cursor-pointer">Brand Awareness</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="traffic" id="traffic" />
                    <Label htmlFor="traffic" className="cursor-pointer">Website Traffic</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="conversions" id="conversions" />
                    <Label htmlFor="conversions" className="cursor-pointer">Conversions</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product">Select Product</Label>
                {loadingProducts ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading products...</span>
                  </div>
                ) : (
                  <Select 
                    value={formData.product}
                    onValueChange={(value) => handleChange("product", value)}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.length > 0 ? (
                        products.map(product => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-products" disabled>
                          No products found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
                {products.length === 0 && !loadingProducts && (
                  <p className="text-sm text-amber-600 mt-1">
                    You don't have any products yet.{" "}
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-sm text-primary"
                      onClick={() => navigate("/add-product")}
                    >
                      Add a product
                    </Button>
                  </p>
                )}
              </div>
            </CardContent>
          </>
        )}
        
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Platforms & Budget</CardTitle>
              <CardDescription>Choose where to run your ads and set your budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Platforms</Label>
                  {!hasFacebookConnection && (
                    <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                      Facebook not connected
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <Switch 
                      checked={formData.platforms.includes("facebook")}
                      onCheckedChange={(checked) => {
                        const platforms = checked 
                          ? [...formData.platforms, "facebook"] 
                          : formData.platforms.filter(p => p !== "facebook");
                        handleChange("platforms", platforms);
                        
                        if (checked && !hasFacebookConnection) {
                          toast.warning("You need to connect Facebook before launching a campaign", {
                            duration: 5000,
                            action: {
                              label: "Connect",
                              onClick: () => navigate("/platforms")
                            }
                          });
                        }
                      }}
                      id="facebook"
                    />
                    <Label htmlFor="facebook" className="cursor-pointer">Facebook</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <Switch 
                      checked={formData.platforms.includes("instagram")}
                      onCheckedChange={(checked) => {
                        const platforms = checked 
                          ? [...formData.platforms, "instagram"] 
                          : formData.platforms.filter(p => p !== "instagram");
                        handleChange("platforms", platforms);
                      }}
                      id="instagram"
                    />
                    <Label htmlFor="instagram" className="cursor-pointer">Instagram</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <Switch 
                      checked={formData.platforms.includes("google")}
                      onCheckedChange={(checked) => {
                        const platforms = checked 
                          ? [...formData.platforms, "google"] 
                          : formData.platforms.filter(p => p !== "google");
                        handleChange("platforms", platforms);
                      }}
                      id="google"
                    />
                    <Label htmlFor="google" className="cursor-pointer">Google Ads</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Daily Budget</Label>
                    <span className="text-sm font-medium">${formData.budget}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[formData.budget]}
                      onValueChange={(value) => handleChange("budget", value[0])}
                      max={500}
                      step={10}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated monthly spend: ${formData.budget * 30}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Campaign Duration</Label>
                  <Select 
                    value={formData.duration}
                    onValueChange={(value) => handleChange("duration", value)}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </>
        )}
        
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Audience & Targeting</CardTitle>
              <CardDescription>Define who you want to reach with your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="target-audience">Target Audience Description</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Help</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">About Target Audience</h4>
                        <p className="text-sm text-muted-foreground">
                          Describe your ideal customer in detail. Include demographics, interests, 
                          and pain points. Our AI will use this to create targeted campaigns.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Example: "25-34 year old professionals interested in fitness and wellness, 
                          who are looking to improve their health with convenient solutions."
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Textarea 
                  id="target-audience"
                  placeholder="Describe your ideal customer (e.g., age range, interests, location, etc.)"
                  rows={4}
                  value={formData.targetAudience}
                  onChange={(e) => handleChange("targetAudience", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Our AI will use this information to create targeted ad campaigns
                </p>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch 
                  id="customizations"
                  checked={formData.customizations}
                  onCheckedChange={(checked) => handleChange("customizations", checked)}
                />
                <Label htmlFor="customizations">
                  I want to make advanced targeting customizations
                </Label>
              </div>
              
              {renderAdvancedOptions()}
            </CardContent>
          </>
        )}
        
        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle>Review & Launch</CardTitle>
              <CardDescription>Review your campaign details before launching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Campaign Name</h3>
                  <p className="font-medium">{formData.campaignName}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Objective</h3>
                  <p className="font-medium capitalize">{formData.objective}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Product</h3>
                  <p className="font-medium">
                    {products.find(p => p.id.toString() === formData.product)?.name || "Not selected"}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Platforms</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.platforms.map(platform => (
                      <Badge key={platform} variant="outline" className="capitalize">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Budget & Duration</h3>
                  <p className="font-medium">${formData.budget}/day for {formData.duration} days</p>
                  <p className="text-sm text-muted-foreground">Total budget: ${formData.budget * parseInt(formData.duration)}</p>
                </div>
                
                {formData.customizations && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Advanced Targeting</h3>
                      <div className="mt-2 text-sm">
                        <div><strong>Age Range:</strong> {formData.advanced.ageRange}</div>
                        <div><strong>Gender:</strong> {formData.advanced.gender === 'all' ? 'All genders' : formData.advanced.gender}</div>
                        {formData.advanced.locations.length > 0 && (
                          <div><strong>Locations:</strong> {formData.advanced.locations.join(", ")}</div>
                        )}
                        {formData.advanced.interests.length > 0 && (
                          <div><strong>Interests:</strong> {formData.advanced.interests.join(", ")}</div>
                        )}
                        <div><strong>Placement:</strong> {formData.advanced.placement}</div>
                        <div><strong>Bid Strategy:</strong> {formData.advanced.bidStrategy.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">AI-Optimized Campaign</h3>
                  <p className="text-sm">
                    ChariotAI will continuously optimize your campaign for maximum performance.
                    You will receive regular updates and suggestions for improvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        )}
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNext} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Campaign...
              </>
            ) : step < 4 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Launch Campaign"
            )}
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default CampaignCreation;
