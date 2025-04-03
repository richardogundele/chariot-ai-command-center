
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

const CampaignCreation = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    campaignName: "",
    objective: "awareness",
    product: "",
    platforms: ["facebook", "instagram"],
    budget: 50,
    duration: "7",
    targetAudience: "",
    customizations: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.campaignName || !formData.objective)) {
      toast({
        title: "Missing information",
        description: "Please provide campaign name and objective",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Campaign Created",
          description: "Your campaign has been created successfully.",
        });
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
                <Select 
                  value={formData.product}
                  onValueChange={(value) => handleChange("product", value)}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product1">Premium Fitness Watch</SelectItem>
                    <SelectItem value="product2">Wireless Headphones</SelectItem>
                    <SelectItem value="product3">Smart Home Camera</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <Switch 
                      checked={formData.platforms.includes("facebook")}
                      onCheckedChange={(checked) => {
                        const platforms = checked 
                          ? [...formData.platforms, "facebook"] 
                          : formData.platforms.filter(p => p !== "facebook");
                        handleChange("platforms", platforms);
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
                  <Label>Daily Budget</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[formData.budget]}
                      onValueChange={(value) => handleChange("budget", value[0])}
                      max={500}
                      step={10}
                      className="flex-1"
                    />
                    <span className="font-medium">${formData.budget}</span>
                  </div>
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
                <Label htmlFor="target-audience">Target Audience Description</Label>
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
              
              {formData.customizations && (
                <div className="pt-4 space-y-4 border-t">
                  <p className="text-sm font-medium">Advanced options coming soon</p>
                  <p className="text-sm text-muted-foreground">
                    Our team is working on adding more detailed targeting options.
                  </p>
                </div>
              )}
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
                    {formData.product === "product1" ? "Premium Fitness Watch" : 
                     formData.product === "product2" ? "Wireless Headphones" :
                     formData.product === "product3" ? "Smart Home Camera" : "Not selected"}
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
