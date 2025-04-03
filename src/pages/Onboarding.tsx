
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [productUrl, setProductUrl] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((step === 1 && !productUrl) || (step === 2 && !productDetails)) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 1) {
      setStep(2);
    } else {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="w-full max-w-4xl chariot-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to <span className="chariot-gradient-text">ChariotAI</span></h1>
          <p className="text-muted-foreground text-lg">Your elite AI marketing team is ready to deliver results</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{step === 1 ? "Let's get started" : "Tell us more"}</CardTitle>
            <CardDescription>
              {step === 1 
                ? "First, let's connect your product" 
                : "Provide additional details to help us understand your product better"}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent>
              {step === 1 ? (
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="url">Product URL</TabsTrigger>
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-url">Product URL</Label>
                      <Input 
                        id="product-url"
                        placeholder="https://example.com/product"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-details">Product Details</Label>
                      <Textarea 
                        id="product-details"
                        placeholder="Enter your product description, key features, target audience, and pricing..."
                        value={productDetails}
                        onChange={(e) => setProductDetails(e.target.value)}
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="more-details">Additional Information</Label>
                    <Textarea 
                      id="more-details"
                      placeholder="Share any other information that might help us optimize your campaigns..."
                      value={productDetails}
                      onChange={(e) => setProductDetails(e.target.value)}
                      rows={5}
                    />
                  </div>
                  
                  <div className="rounded-md bg-primary/5 p-4 border border-primary/10">
                    <h3 className="text-sm font-medium mb-2">Here's what we'll do next:</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        <span>Conduct market research and identify optimal customer segments</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        <span>Create high-converting ad creatives for multiple platforms</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        <span>Launch and optimize campaigns to maximize ROI</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {step === 2 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              <Button 
                type="submit"
                className="ml-auto"
                disabled={loading}
              >
                {loading ? "Processing..." : step === 1 ? "Continue" : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
