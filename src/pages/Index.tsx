
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Target, TrendingUp, Star, Shield, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 aurora-bg opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-chariot-purple/10 rounded-full blur-3xl floating-animation"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-chariot-accent/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '-3s' }}></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Hero Section */}
        <div className="w-full max-w-7xl text-center mb-16 chariot-fade-in">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-chariot-purple/20 to-chariot-accent/20 border border-chariot-purple/30 text-sm font-medium text-chariot-purple mb-6 backdrop-blur-sm">
              🚀 AI-Powered Marketing Revolution
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            Welcome to{" "}
            <span className="chariot-gradient-text relative">
              ChariotAI
              <div className="absolute -inset-1 bg-gradient-to-r from-chariot-purple to-chariot-accent blur-lg opacity-30 rounded-lg"></div>
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Your elite AI marketing team that delivers{" "}
            <span className="text-chariot-purple font-semibold">exceptional results</span> at scale.
            Transform your business with intelligent automation and data-driven strategies.
          </p>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold chariot-gradient-text">500+</div>
              <div className="text-sm text-muted-foreground">Successful Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold chariot-gradient-text">3.2x</div>
              <div className="text-sm text-muted-foreground">Average ROAS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold chariot-gradient-text">$150M+</div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold chariot-gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground">AI Optimization</div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="w-full max-w-7xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="glow-effect inline-block mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Submit Your Product</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply provide your product details and let our AI team analyze market opportunities and create optimized campaigns
                </p>
              </CardContent>
            </Card>
            
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="glow-effect inline-block mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-chariot-purple to-chariot-accent flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">AI Optimizes Everything</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI continuously creates, tests, and optimizes campaigns across multiple platforms for maximum performance
                </p>
              </CardContent>
            </Card>
            
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="glow-effect inline-block mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Watch Results Grow</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor real-time performance metrics and watch your ROI grow with minimal effort and maximum impact
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Additional Features */}
        <div className="w-full max-w-7xl mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="glow-effect inline-block mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className="font-semibold text-sm mb-2">Precision Targeting</h4>
              <p className="text-xs text-muted-foreground">AI-powered audience segmentation</p>
            </div>
            
            <div className="text-center group">
              <div className="glow-effect inline-block mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className="font-semibold text-sm mb-2">Risk Protection</h4>
              <p className="text-xs text-muted-foreground">Smart budget management</p>
            </div>
            
            <div className="text-center group">
              <div className="glow-effect inline-block mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className="font-semibold text-sm mb-2">Global Reach</h4>
              <p className="text-xs text-muted-foreground">Multi-platform campaigns</p>
            </div>
            
            <div className="text-center group">
              <div className="glow-effect inline-block mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className="font-semibold text-sm mb-2">Expert Support</h4>
              <p className="text-xs text-muted-foreground">24/7 AI assistance</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <Link to="/onboarding">
            <Button size="lg" className="premium-button text-lg px-12 py-6 text-white shadow-2xl">
              Start Your AI Marketing Journey
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Trusted by 10,000+ businesses worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
