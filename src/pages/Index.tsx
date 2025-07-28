
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArrowRight, Zap, Target, TrendingUp, Star, Shield, Globe, Users, CheckCircle, Quote, ChevronRight, Sparkles, Brain, Rocket, BarChart3, Play, Award, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const heroImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop&crop=center", 
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1500673922987-e212871f1c81?w=1920&h=1080&fit=crop&crop=center"
  ];

  return (
    <div className="min-h-screen bg-black text-white dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ChariotAI
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <Carousel
          className="absolute inset-0"
          opts={{ 
            loop: true,
            duration: 5000
          }}
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm font-medium text-white mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Result-as-a-Service Agentic AI Platform
              <Award className="h-4 w-4" />
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight text-white animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Automate Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Social Media Ads
            </span>{" "}
            <span className="block mt-4">End-to-End</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            ChariotAI is a <span className="text-accent font-semibold">Result-as-a-Service platform</span> that automates the entire journey of running social media ads 
            from ad copy and image creation to campaign launch, tracking, and performance optimization so you get 
            <span className="text-primary font-semibold"> real business results without the complexity.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/login">
              <Button size="lg" className="text-xl px-10 py-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                <Rocket className="h-6 w-6 mr-3" />
                Start Free Trial
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-lg text-gray-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">340%</div>
              <div className="text-gray-300 text-lg">Average ROAS Increase</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-300 text-lg">AI Optimization</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">5min</div>
              <div className="text-gray-300 text-lg">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tech Leaders</span> Choose ChariotAI
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for scale, designed for results. Our AI-first approach delivers measurable ROI from day one.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 group">
              <CardContent className="p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="h-20 w-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">AI-Powered Creation</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Advanced machine learning algorithms create high-converting ad copy and stunning visuals tailored to your target audience with 94% accuracy rate.
                  </p>
                  <div className="mt-6 inline-flex items-center text-blue-600 font-semibold">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    94% Conversion Rate
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 group">
              <CardContent className="p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="h-20 w-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Enterprise-Grade Automation</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Automated campaign launch, real-time bid optimization, and intelligent budget allocation across 15+ platforms with zero manual intervention.
                  </p>
                  <div className="mt-6 inline-flex items-center text-purple-600 font-semibold">
                    <Clock className="h-5 w-5 mr-2" />
                    15+ Platforms
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 group">
              <CardContent className="p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="h-20 w-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Predictive Optimization</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Machine learning models predict performance trends and automatically optimize campaigns in real-time, maximizing ROI 24/7 without human intervention.
                  </p>
                  <div className="mt-6 inline-flex items-center text-green-600 font-semibold">
                    <DollarSign className="h-5 w-5 mr-2" />
                    340% ROI Increase
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-card/50 to-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ChariotAI</span> Transforms Your Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From product upload to profitable campaigns in minutes, not months. Our enterprise-grade AI handles the complexity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <div className="text-center group relative">
              <div className="relative mb-10">
                <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10">
                  1
                </div>
                <div className="absolute inset-0 h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-20 animate-pulse"></div>
                <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-500 to-primary opacity-30"></div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/20 hover:border-primary/30 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-foreground">AI Product Analysis</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Upload your product and our advanced AI analyzes market opportunities, identifies target demographics, and determines optimal positioning strategies using proprietary algorithms.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-blue-600 font-semibold">
                  <Sparkles className="h-5 w-5" />
                  <span>90% Market Analysis Accuracy</span>
                </div>
              </div>
            </div>
            
            <div className="text-center group relative">
              <div className="relative mb-10">
                <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10">
                  2
                </div>
                <div className="absolute inset-0 h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-primary to-green-500 opacity-30"></div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/20 hover:border-primary/30 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Autonomous Campaign Creation</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our AI generates high-converting ad copy, creates professional visuals, and launches optimized campaigns across 15+ platforms simultaneously with zero manual intervention.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-purple-600 font-semibold">
                  <Rocket className="h-5 w-5" />
                  <span>15+ Platform Integration</span>
                </div>
              </div>
            </div>
            
            <div className="text-center group relative">
              <div className="mb-10">
                <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10">
                  3
                </div>
                <div className="absolute inset-0 h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/20 hover:border-primary/30 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Predictive Growth Optimization</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Watch your ROI grow exponentially as our machine learning algorithms continuously optimize campaigns in real-time, predicting trends and adjusting strategies automatically.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <TrendingUp className="h-5 w-5" />
                  <span>340% Average ROI Increase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Innovation Leaders</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join successful entrepreneurs and enterprise teams already scaling with ChariotAI's cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardContent className="p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-primary/60 mb-6" />
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    "ChariotAI increased our ROAS by 340% in just the first month. The automation is incredible - we literally set it and forget it. This is the future of digital marketing."
                  </p>
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      KN
                    </div>
                    <div className="ml-6">
                      <div className="font-bold text-lg text-foreground">Kenny Nwokoye</div>
                      <div className="text-primary font-medium">Dubai Online Entrepreneur</div>
                      <div className="text-sm text-muted-foreground mt-1">Scale: $2M+ Revenue</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardContent className="p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-primary/60 mb-6" />
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    "Finally, a platform that actually delivers on its promises. Our ad spend efficiency has never been better. The ROI speaks for itself."
                  </p>
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      OO
                    </div>
                    <div className="ml-6">
                      <div className="font-bold text-lg text-foreground">Opeyemi Olutayo</div>
                      <div className="text-primary font-medium">Senior Sales Coach</div>
                      <div className="text-sm text-muted-foreground mt-1">Enterprise Growth Expert</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardContent className="p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-primary/60 mb-6" />
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    "The AI-generated ads perform better than anything our team created manually. It's like having a marketing genius on autopilot 24/7."
                  </p>
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      SA
                    </div>
                    <div className="ml-6">
                      <div className="font-bold text-lg text-foreground">Solomon Adebayo</div>
                      <div className="text-primary font-medium">Marketing Data Analyst</div>
                      <div className="text-sm text-muted-foreground mt-1">Performance Analytics Lead</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              Ready to <span className="text-yellow-300">10x</span> Your Marketing ROI?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the AI marketing revolution. Transform your business with enterprise-grade automation that delivers real results from day one.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/login">
                <Button size="lg" className="text-xl px-12 py-8 bg-white text-primary hover:bg-gray-100 font-bold rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105">
                  <Rocket className="h-6 w-6 mr-3" />
                  Start Free Trial Now
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-lg text-blue-100">
              <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
              <span className="font-semibold">14-day free trial • No credit card required • Cancel anytime • Enterprise support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card/50 to-background py-20 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ChariotAI
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
                The enterprise-grade Result-as-a-Service platform that automates your entire social media advertising journey 
                with cutting-edge AI technology built for scale.
              </p>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 hover:scale-110 transition-transform duration-300">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-foreground">Product</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link to="/features" className="hover:text-primary transition-colors text-base">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors text-base">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-primary transition-colors text-base">Integrations</Link></li>
                <li><Link to="/api" className="hover:text-primary transition-colors text-base">Enterprise API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-foreground">Company</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors text-base">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors text-base">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-primary transition-colors text-base">Careers</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors text-base">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/20 mt-16 pt-8 text-center">
            <p className="text-muted-foreground text-lg">&copy; 2024 ChariotAI. All rights reserved. Built for the future of AI-powered marketing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
