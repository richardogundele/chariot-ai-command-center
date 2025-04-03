
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="w-full max-w-4xl text-center chariot-fade-in">
        <h1 className="text-5xl font-bold mb-4">Welcome to <span className="chariot-gradient-text">ChariotAI</span></h1>
        <p className="text-xl text-muted-foreground mb-8">Your elite AI marketing team, delivering results at scale</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="chariot-card">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary text-xl font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Submit Your Product</h3>
              <p className="text-sm text-muted-foreground">Simply provide your product details and let our AI team handle the rest</p>
            </CardContent>
          </Card>
          
          <Card className="chariot-card">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary text-xl font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">AI Optimizes Campaigns</h3>
              <p className="text-sm text-muted-foreground">Our AI automatically creates, tests, and optimizes marketing campaigns</p>
            </CardContent>
          </Card>
          
          <Card className="chariot-card">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary text-xl font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Get Real Results</h3>
              <p className="text-sm text-muted-foreground">Monitor performance and watch your ROI grow with minimal effort</p>
            </CardContent>
          </Card>
        </div>
        
        <Link to="/onboarding">
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
