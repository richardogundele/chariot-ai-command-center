import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  user_id: string;
  full_name: string | null;
  company: string | null;
  job_title: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

interface Campaign {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  status: string;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  user_id: string;
  name: string;
  status: string;
  price: number | null;
  platforms: string[];
  created_at: string;
  updated_at: string;
}

export const AdminSettings = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profiles
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Fetch campaigns
        const { data: campaignsData } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        setUserProfiles(profiles || []);
        setCampaigns(campaignsData || []);
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          System overview and user activity logs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfiles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Profiles</CardTitle>
              <CardDescription>
                All registered users and their profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userProfiles.map((profile) => (
                    <TableRow key={profile.user_id}>
                      <TableCell className="font-mono text-xs">
                        {profile.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{profile.full_name || 'N/A'}</TableCell>
                      <TableCell>{profile.company || 'N/A'}</TableCell>
                      <TableCell>{profile.job_title || 'N/A'}</TableCell>
                      <TableCell>{profile.phone || 'N/A'}</TableCell>
                      <TableCell>{formatDate(profile.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {userProfiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No user profiles found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>
                All campaigns created by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.budget ? `$${campaign.budget}` : 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {campaign.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{formatDate(campaign.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {campaigns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No campaigns found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                All products created by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.status === 'Active' ? 'default' : 'secondary'}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.price ? `$${product.price}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {product.platforms.map((platform, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {product.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{formatDate(product.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;