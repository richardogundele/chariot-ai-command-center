
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AiDescriptionCard = () => {
  return (
    <Card className="hidden md:block shadow-sm border border-purple-100 bg-gradient-to-br from-white to-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">AI Ad Creation</CardTitle>
        <CardDescription>Here's what happens after you add a product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg p-4 space-y-2 bg-white shadow-sm border border-purple-100/50">
          <div className="flex items-center justify-between">
            <div className="font-medium text-purple-800">1. AI analyzes your product</div>
          </div>
          <p className="text-sm text-muted-foreground">We identify key selling points and create compelling messaging in Kenny Nwokoye's style</p>
        </div>
        
        <div className="rounded-lg p-4 space-y-2 bg-white shadow-sm border border-purple-100/50">
          <div className="flex items-center justify-between">
            <div className="font-medium text-purple-800">2. Create engaging visuals</div>
          </div>
          <p className="text-sm text-muted-foreground">Our AI generates stunning product images using DALL-E 3</p>
        </div>
        
        <div className="rounded-lg p-4 space-y-2 bg-white shadow-sm border border-purple-100/50">
          <div className="flex items-center justify-between">
            <div className="font-medium text-purple-800">3. Launch your campaign</div>
          </div>
          <p className="text-sm text-muted-foreground">Choose platforms and budgets to start advertising your product</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiDescriptionCard;
