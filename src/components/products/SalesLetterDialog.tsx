
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalesLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: any | null;
}

const SalesLetterDialog = ({ open, onOpenChange, selectedProduct }: SalesLetterDialogProps) => {
  const { toast } = useToast();
  const [salesLetter, setSalesLetter] = useState("");
  const [salesLetterType, setSalesLetterType] = useState("promotional");
  const [salesLetterTarget, setSalesLetterTarget] = useState("broad");
  const [salesLetterLoading, setSalesLetterLoading] = useState(false);
  const [salesLetterCopied, setSalesLetterCopied] = useState(false);

  const generateSalesLetter = () => {
    if (!selectedProduct) return;
    
    setSalesLetterLoading(true);
    
    setTimeout(() => {
      const letterTemplates = {
        promotional: {
          broad: `Subject: Transform Your Fitness Journey with the Premium Fitness Watch

Dear Valued Customer,

Are you ready to take control of your health and fitness like never before?

Introducing the Premium Fitness Watch – the ultimate companion for your wellness journey.

What makes our Premium Fitness Watch stand out:

• Advanced 24/7 heart rate monitoring that tracks your pulse with medical-grade accuracy
• In-depth sleep analysis that helps you optimize your rest and recovery
• Impressive 7-day battery life that keeps up with your active lifestyle
• Water-resistant design for swimmers and outdoor enthusiasts
• Intuitive interface that makes tracking your progress effortless

Our customers report significant improvements in their fitness goals, with 87% achieving better workout consistency and 72% experiencing improved sleep quality.

For a limited time, get 15% off when you use code FITNESS15 at checkout.

Don't settle for incomplete data about your health. Make informed decisions with the Premium Fitness Watch.

Take the first step toward a healthier you today!

[Shop Now]

To your health,
ChariotAI Team`,
          specific: `Subject: Specifically Designed for Serious Athletes: Premium Fitness Watch

Dear Fitness Enthusiast,

As someone committed to peak physical performance, you understand that precise data leads to precise results.

The Premium Fitness Watch was engineered with athletes like you in mind.

Elite features for elite performers:
• Heart rate variability tracking for optimizing training intensity
• Recovery metrics that prevent overtraining and injury
• VO2 max estimation to monitor cardiorespiratory fitness
• Advanced sleep cycle analysis for performance-focused recovery
• Training load monitoring to ensure progressive overload

Professional trainer Marcus Johnson says: "The detailed metrics from this watch have revolutionized how I program workouts for my Olympic-level clients."

When your training demands precision, your equipment should deliver it.

Special offer for dedicated athletes: Use code ELITE25 for 25% off and receive our exclusive "Peak Performance Training Guide" free with your purchase.

Push your limits with confidence.

[Upgrade Your Training]

In pursuit of excellence,
ChariotAI Team`,
        },
        follow_up: {
          broad: `Subject: How's Your Premium Fitness Watch Experience?

Dear Valued Customer,

It's been a few weeks since you purchased your Premium Fitness Watch, and we're eager to hear how it's transforming your fitness journey.

Many of our customers report significant improvements in their:
• Daily activity levels
• Sleep quality
• Workout consistency
• Overall wellness awareness

Are you experiencing these benefits too? We'd love to know what features you're enjoying the most!

If you have any questions about maximizing your watch's capabilities, our support team is ready to help. Simply reply to this email.

As a valued customer, we're offering you exclusive access to our premium workout plans, perfectly tailored to work with your Premium Fitness Watch's tracking capabilities.

[Access Free Workout Plans]

Stay healthy,
ChariotAI Team

P.S. Know someone who could benefit from precision fitness tracking? Share the gift of health with our referral program and earn a $25 credit!`,
          specific: `Subject: Elevate Your Athletic Performance with Premium Fitness Watch Insights

Dear Fitness Professional,

As an athlete who demands the best from your body, you've now had your Premium Fitness Watch for a few weeks. We're curious: how has it impacted your training regimen?

Our professional athlete users report:
• 23% more efficient training sessions
• 18% improved recovery times
• Better periodization through data-driven insights
• More accurate training load management

Are you leveraging the advanced metrics to optimize your performance?

For serious athletes like you, we've created an exclusive webinar: "Data-Driven Performance: Unlocking Elite Potential with Your Premium Fitness Watch." This session features Olympic trainers and sports physiologists sharing advanced strategies.

[Reserve Your Spot - Limited Availability]

Additionally, we've prepared a personalized analysis of your first month's data with AI-powered recommendations to help you break through plateaus.

[Access Your Personalized Analysis]

Train smarter,
ChariotAI Performance Team

P.S. Your unique athlete discount code PERFORM20 gives your training partners 20% off their own Premium Fitness Watch.`,
        },
        educational: {
          broad: `Subject: Understanding Your Body's Data: Premium Fitness Watch Guide

Dear Health Enthusiast,

Knowledge is power, especially when it comes to your well-being.

Your Premium Fitness Watch collects thousands of data points daily. Here's how to interpret them for better health outcomes:

Heart Rate Zones Explained:
• Zone 1 (50-60%): Recovery zone - ideal for warm-ups and active recovery
• Zone 2 (60-70%): Fat burning zone - best for weight management
• Zone 3 (70-80%): Aerobic zone - improves cardiovascular efficiency
• Zone 4 (80-90%): Anaerobic zone - increases performance capacity
• Zone 5 (90-100%): Maximum effort - boosts speed and power

Sleep Metrics That Matter:
The sleep analysis feature tracks REM, light, and deep sleep phases. Aim for 20-25% deep sleep for optimal recovery and cognitive function.

Stress Score Interpretation:
Your watch measures heart rate variability to assess stress levels. A higher variability indicates better stress resilience.

We've created a comprehensive guide to help you apply these insights to your daily routine.

[Download Free Wellness Guide]

To your continued health journey,
ChariotAI Education Team`,
          specific: `Subject: Advanced Biometric Analysis for Athletic Excellence

Dear Performance Athlete,

The difference between good and great often comes down to how you interpret and apply data.

Your Premium Fitness Watch provides elite-level metrics that, when properly understood, can transform your training approach:

Training Effect Analysis:
• Aerobic TE: Measures improvement to cardiovascular system
• Anaerobic TE: Tracks development of power and muscular endurance
• Optimal weekly balance: 80% aerobic / 20% anaerobic for most endurance athletes

Recovery Time Science:
The suggested recovery hours are calculated based on:
• Exercise intensity distribution
• Training impulse (TRIMP) score
• Heart rate variability trends
• Previous training load

Readiness Score Optimization:
• 90-100: Prime for high-intensity training
• 70-89: Good for moderate sessions
• Below 70: Focus on recovery or technique work

We've partnered with sports scientists to create an advanced interpretation guide specifically for competitive athletes.

[Access Elite Performance Analysis Guide]

For peak performance,
ChariotAI Sports Science Division`,
        }
      };
      
      const letterContent = letterTemplates[salesLetterType as keyof typeof letterTemplates]?.[salesLetterTarget as keyof typeof letterTemplates.promotional] || '';
      
      setSalesLetter(letterContent);
      setSalesLetterLoading(false);
    }, 2000);
  };

  const handleCopySalesLetter = () => {
    navigator.clipboard.writeText(salesLetter);
    setSalesLetterCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The sales letter has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setSalesLetterCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            AI Sales Letter Generator
          </DialogTitle>
          <DialogDescription>
            {selectedProduct ? `Create persuasive sales letters for ${selectedProduct.name}` : 'Generate AI-powered sales copy'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Letter Type</label>
            <Select value={salesLetterType} onValueChange={setSalesLetterType}>
              <SelectTrigger>
                <SelectValue placeholder="Select letter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional (Sales Focused)</SelectItem>
                <SelectItem value="follow_up">Follow-up (Post-Purchase)</SelectItem>
                <SelectItem value="educational">Educational (Value-Add)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience</label>
            <Select value={salesLetterTarget} onValueChange={setSalesLetterTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="broad">Broad Audience</SelectItem>
                <SelectItem value="specific">Specific Niche (Enthusiasts)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-4">
          {!salesLetter && !salesLetterLoading && (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md bg-muted/30">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Configure your options and click generate to create a customized sales letter
              </p>
            </div>
          )}
          
          {salesLetterLoading && (
            <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-md">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">
                AI is crafting your perfect sales letter...
              </p>
            </div>
          )}
          
          {salesLetter && !salesLetterLoading && (
            <div className="relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCopySalesLetter}
                  className="h-8 w-8 rounded-full bg-background"
                >
                  {salesLetterCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea 
                className="min-h-[400px] font-mono text-sm p-4"
                value={salesLetter}
                onChange={(e) => setSalesLetter(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button 
            onClick={generateSalesLetter}
            disabled={salesLetterLoading}
          >
            {salesLetterLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SalesLetterDialog;
