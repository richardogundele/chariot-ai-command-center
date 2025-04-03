import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart, RefreshCw, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for saved products
const mockProducts = [
  {
    id: 1,
    name: "Premium Fitness Watch",
    description: "Advanced health tracking features with 7-day battery life",
    status: "Active",
    metrics: {
      sales: 142,
      revenue: 14200,
      roas: 3.5,
    },
    lastUpdated: "2 hours ago",
    platforms: ["facebook", "instagram"],
  },
  {
    id: 2,
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium sound quality with 20-hour battery life",
    status: "Paused",
    metrics: {
      sales: 87,
      revenue: 8700,
      roas: 2.8,
    },
    lastUpdated: "1 day ago",
    platforms: ["facebook"],
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    description: "1080p HD with night vision and motion detection",
    status: "Draft",
    metrics: {
      sales: 0,
      revenue: 0,
      roas: 0,
    },
    lastUpdated: "3 days ago",
    platforms: [],
  },
];

const SavedProducts = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Saved Products</h1>
          <p className="text-muted-foreground">View and manage your product library</p>
        </div>
        <Button onClick={() => navigate("/products")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <Badge 
                      variant={
                        product.status === "Active" ? "default" : 
                        product.status === "Paused" ? "secondary" : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {product.status !== "Draft" ? (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sales</p>
                        <p className="text-xl font-semibold">{product.metrics.sales}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-semibold">${product.metrics.revenue}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">ROAS</p>
                        <p className="text-xl font-semibold">{product.metrics.roas}x</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      <p>No campaign data yet</p>
                      <p className="text-sm">Launch a campaign to see metrics</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {product.platforms.includes("facebook") && (
                      <Badge variant="outline" className="bg-blue-50">Facebook</Badge>
                    )}
                    {product.platforms.includes("instagram") && (
                      <Badge variant="outline" className="bg-purple-50">Instagram</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <BarChart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.filter(p => p.status === "Active").map((product) => (
              
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <Badge 
                      variant={
                        product.status === "Active" ? "default" : 
                        product.status === "Paused" ? "secondary" : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {product.status !== "Draft" ? (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sales</p>
                        <p className="text-xl font-semibold">{product.metrics.sales}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-semibold">${product.metrics.revenue}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">ROAS</p>
                        <p className="text-xl font-semibold">{product.metrics.roas}x</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      <p>No campaign data yet</p>
                      <p className="text-sm">Launch a campaign to see metrics</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {product.platforms.includes("facebook") && (
                      <Badge variant="outline" className="bg-blue-50">Facebook</Badge>
                    )}
                    {product.platforms.includes("instagram") && (
                      <Badge variant="outline" className="bg-purple-50">Instagram</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <BarChart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="paused" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.filter(p => p.status === "Paused").map((product) => (
              
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <Badge 
                      variant={
                        product.status === "Active" ? "default" : 
                        product.status === "Paused" ? "secondary" : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {product.status !== "Draft" ? (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sales</p>
                        <p className="text-xl font-semibold">{product.metrics.sales}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-semibold">${product.metrics.revenue}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">ROAS</p>
                        <p className="text-xl font-semibold">{product.metrics.roas}x</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      <p>No campaign data yet</p>
                      <p className="text-sm">Launch a campaign to see metrics</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {product.platforms.includes("facebook") && (
                      <Badge variant="outline" className="bg-blue-50">Facebook</Badge>
                    )}
                    {product.platforms.includes("instagram") && (
                      <Badge variant="outline" className="bg-purple-50">Instagram</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <BarChart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.filter(p => p.status === "Draft").map((product) => (
              
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <Badge 
                      variant={
                        product.status === "Active" ? "default" : 
                        product.status === "Paused" ? "secondary" : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {product.status !== "Draft" ? (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sales</p>
                        <p className="text-xl font-semibold">{product.metrics.sales}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-semibold">${product.metrics.revenue}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">ROAS</p>
                        <p className="text-xl font-semibold">{product.metrics.roas}x</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      <p>No campaign data yet</p>
                      <p className="text-sm">Launch a campaign to see metrics</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {product.platforms.includes("facebook") && (
                      <Badge variant="outline" className="bg-blue-50">Facebook</Badge>
                    )}
                    {product.platforms.includes("instagram") && (
                      <Badge variant="outline" className="bg-purple-50">Instagram</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <BarChart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SavedProducts;
