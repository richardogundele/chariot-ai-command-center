import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Users, TrendingUp, Activity, DollarSign, BarChart3, UserPlus, Target, Calendar } from "lucide-react";

// Enhanced interfaces for admin data
interface UserProfile {
  user_id: string;
  full_name: string | null;
  company: string | null;
  job_title: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  email?: string; // Add email from auth data
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number | null;
  spent: number | null;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  status: string;
  price: number | null;
  platforms: string[];
  user_id: string;
  created_at: string;
}

// Chart data interfaces
interface UserRegistrationData {
  date: string;
  users: number;
  cumulative: number;
}

interface CampaignPerformanceData {
  name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

interface ActivityData {
  metric: string;
  value: number;
  change: string;
  color: string;
}

// Mock data for demonstration
const MOCK_EMAILS = [
  "eniolamustapha2004@gmail.com", "tomoyeted@gmail.com", "ademofe15@gmail.com", "maskarano111@gmail.com",
  "greatlewis1@gmail.com", "kayusbenny04@gmail.com", "adeyemirinunotuwad66@gmail.com", "chigboesinclaraoba@gmail.com",
  "garidreal@yahoo.com", "oluwasanmijeremiah@gmail.com", "belmoremi001@gmail.com", "kingsleyedebo@gmail.com",
  "chumanyadnani6@gmail.com", "mercy9203@gmail.com", "baitesara27@gmail.com", "oluwatunmiseadenuyi@gmail.com",
  "moyoye1@gmail.com", "oluwakayode.olamoyegun@gmail.com", "wwzeq@gmail.com", "Kellyowoju@gmail.com",
  "omeiresabigal@gmail.com", "scholarlyemi@gmail.com", "ibrahimabdussama319@gmail.com", "formecpet@gmail.com",
  "susantalumi@gmail.com", "fomhundaramola789@gmail.com", "blessinhelen17@yahoo.com", "olamatcan1@gmail.com",
  "sulemankawale@gmail.com", "Naxtech939@gmail.com", "dublaiola1@gmail.com", "matroach@gmail.com",
  "marophics62@gmail.com", "wuraobalayuwen@gmail.com", "iofuwasinolutuwa@gmail.com", "gladkunambrose@hotmail.com",
  "favournenyenwa6@gmail.com", "gloriatonchenonka@gmail.com", "mohayarima@gmail.com", "digitalmom93@gmail.com",
  "narhbait@gmail.com", "adewimprescilla16@gmail.com", "sribiit@gmail.com", "Omabionocornelius@gmail.com",
  "yhunpee001@gmail.com", "sundaychinonsia23@gmail.com", "mecallmynosuihuya@gmail.com", "sultatofaroyalola5@gmail.com",
  "olamideatiya@gmail.com", "promiseve2@gmail.com", "lbsam26700749@gmail.com", "daniellranci973@gmail.com",
  "abisolatemtope38@gmail.com", "uzoma.eskay@gmail.com", "emmanuelegabriel24767@gmail.com", "fathiyechegal@gmail.com",
  "goodness29@gmail.com", "christianahanakao43@gmail.com", "revdiyike6@gmail.com", "uwailams@gmail.com",
  "ogbeladelayinka2019@gmail.com", "kellyayode@gmail.com", "oladrianabdulquadir@gmail.com", "ajisebolawasaason@gmail.com",
  "olaniyanotuwapeluniya@gmail.com", "infogoodplasticmould@gmail.com", "dami.olasinide@gmail.com", "akaninagooodnessudonu@gmail.com",
  "riched88866@gmail.com", "ckenepaul96@yahoo.com", "2012israeliw@gmail.com", "igbinwemwen95@gmail.com",
  "ibukunelutish08@gmail.com", "idorossanuel169@gmail.com", "chinanyeogbu8012019@gmail.com"
];

const generateMockUsers = (): UserProfile[] => {
  const companies = ["TechCorp", "StartupLab", "MediaFlow", "DevStudio", "DataMine", "CloudServ", "AppForge", "WebCraft"];
  const jobTitles = ["Marketing Manager", "Founder", "CEO", "CMO", "Digital Marketer", "Growth Hacker", "Product Manager", "Business Owner"];
  
  // Actual names provided by the user
  const actualNames = [
    "Eniola Mustapha", "Anietebong Imoh", "Ebenezer Tomoye", "ADEOYE Mofeoluwa", "Richard Abiola Masika",
    "Great Ibewuike", "Kayode Adewole", "Adeyemi Itunuoluwa", "Victor Aderibigbe", "GLORIA ONUGBO",
    "Jeremiah Oluwasanmi", "Emeka Christabel", "Dolapo Adebo", "Daniel Joseph", "Adeleye Mercy",
    "Baloges Yusuf", "Oluwatunmise Adenuyiwa", "Oyebakin Moyosola", "Olamoyegun Oluwakayode", "Queen Adaobi Nweze",
    "Kelly Owoju", "Phiny Nona", "Remilekun Fasanya", "Abdussamad Ibrahim", "Adejare Adeyemiwa Oloru",
    "Nectun Olaosalumi", "Oluwafunmi Daramola", "Blessing Egbenoma Edion", "Ajima", "Moshood Suleiman",
    "Stanislaus Reuben-Dim", "Afolabi Emmanuel", "Abdulhafiz Ibrahim Adam", "Mac Sophia", "Wuraola Aliyu",
    "Toluwalope Ogundele", "Ambrose Oladokun", "Favour", "Gloria Dove", "Muhammad Masud",
    "Magdalene", "Florence Peter-Chigbata", "Priscilla Adewumi", "Sandra Ibili", "Osunmowese Okwun",
    "Chioma Onioba", "Daniel Oladimeji", "Sunday Chinonso Ukwu", "Idris Sulaiman", "Suliyat Yetunde Olayiwola",
    "Aliyu Olamide", "Doshy Steve", "Sam", "Daniel Francis", "Ubon Sonaya",
    "Temitope Abisolaaeni", "Emmanuel Uzoma", "Emmanuel Gabriel", "Bunmi", "Goodness Ayodele",
    "Alao Christianah Aanuola", "Tracy Landu", "Uwaila Sunday", "Ogbelade Olayinka", "ADESUYAN Oluwaloye Davi",
    "Oladiran Abdulaualafi", "Samson", "Olaniyan Oluwapelumi", "Samson Sanni", "Damitare Olasinide",
    "Akanimo Goodness Udoh", "Richie Diamond", "Ekene Paul", "ATILOLA ISRAEL WEALTH", "Richius Attah",
    "Ronwa", "Dorcas Samuel Dikko", "Chincnya Vivian", "Olanrewaju Oke"
  ];
  
  return MOCK_EMAILS.map((email, index) => ({
    user_id: `user_${index + 1}`,
    email,
    full_name: actualNames[index] || `User ${index + 1}`, // Use actual names or fallback
    company: companies[index % companies.length],
    job_title: jobTitles[index % jobTitles.length],
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }));
};

const generateMockCampaigns = (): Campaign[] => {
  const campaignNames = [
    "Summer Sale Blast", "Holiday Special", "Back to School", "Black Friday Mega", "New Year Launch",
    "Spring Collection", "Tech Product Launch", "Fashion Week", "Sports Equipment Sale", "Home Decor Promo",
    "Electronics Deal", "Beauty Products", "Fitness Campaign", "Travel Deals", "Food & Dining",
    "Automotive Sale", "Gaming Hardware", "Book Collection", "Pet Supplies", "Garden Tools"
  ];
  
  const statuses = ["active", "paused", "completed"];
  const platforms = ["Facebook", "Instagram", "TikTok"];
  
  return Array.from({ length: 150 }, (_, index) => ({
    id: `campaign_${index + 1}`,
    name: `${campaignNames[index % campaignNames.length]} ${Math.floor(index / campaignNames.length) + 1}`,
    status: statuses[index % statuses.length],
    budget: Math.floor(Math.random() * 5000) + 1000,
    spent: Math.floor(Math.random() * 4000) + 500,
    impressions: Math.floor(Math.random() * 100000) + 10000,
    clicks: Math.floor(Math.random() * 5000) + 500,
    conversions: Math.floor(Math.random() * 200) + 10,
    user_id: `user_${Math.floor(Math.random() * MOCK_EMAILS.length) + 1}`,
    created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }));
};

const generateMockProducts = (): Product[] => {
  const productNames = [
    "Wireless Headphones", "Smart Watch", "Laptop Stand", "Coffee Maker", "Yoga Mat",
    "Phone Case", "Desk Lamp", "Bluetooth Speaker", "Fitness Tracker", "Water Bottle",
    "Backpack", "Sunglasses", "Keyboard", "Mouse Pad", "Monitor", "Tablet", "Camera",
    "Shoes", "T-Shirt", "Hoodie", "Jeans", "Watch", "Jewelry", "Perfume", "Skincare"
  ];
  
  const statuses = ["Active", "Draft", "Archived"];
  const platforms = [["Facebook"], ["Instagram"], ["TikTok"], ["Facebook", "Instagram"], ["Facebook", "TikTok"], ["Instagram", "TikTok"], ["Facebook", "Instagram", "TikTok"]];
  
  return Array.from({ length: 300 }, (_, index) => ({
    id: `product_${index + 1}`,
    name: `${productNames[index % productNames.length]} ${Math.floor(index / productNames.length) + 1}`,
    status: statuses[index % statuses.length],
    price: Math.floor(Math.random() * 500) + 10,
    platforms: platforms[index % platforms.length],
    user_id: `user_${Math.floor(Math.random() * MOCK_EMAILS.length) + 1}`,
    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

export const AdminSettings = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userRegistrationData, setUserRegistrationData] = useState<UserRegistrationData[]>([]);
  const [campaignPerformanceData, setCampaignPerformanceData] = useState<CampaignPerformanceData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockData = () => {
      setLoading(true);
      
      // Use mock data for demonstration
      const mockUsers = generateMockUsers();
      const mockCampaigns = generateMockCampaigns();
      const mockProducts = generateMockProducts();

      setUserProfiles(mockUsers);
      setCampaigns(mockCampaigns);
      setProducts(mockProducts);

      // Generate chart data
      generateUserRegistrationData(mockUsers);
      generateCampaignPerformanceData(mockCampaigns);
      generateActivityData(mockUsers, mockCampaigns, mockProducts);

      setLoading(false);
    };

    loadMockData();
  }, []);

  // Generate user registration trend data
  const generateUserRegistrationData = (profiles: UserProfile[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    let cumulativeCount = 0;
    const registrationData = last30Days.map(date => {
      const usersOnDate = profiles.filter(p => 
        p.created_at.split('T')[0] === date
      ).length;
      
      const cumulativeUsers = profiles.filter(p => 
        new Date(p.created_at) <= new Date(date)
      ).length;

      cumulativeCount = Math.max(cumulativeCount, cumulativeUsers);

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: usersOnDate,
        cumulative: cumulativeUsers
      };
    });

    setUserRegistrationData(registrationData);
  };

  // Generate campaign performance data
  const generateCampaignPerformanceData = (campaigns: Campaign[]) => {
    const topCampaigns = campaigns
      .filter(c => c.impressions && c.clicks && c.conversions)
      .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
      .slice(0, 15)
      .map(campaign => ({
        name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name,
        impressions: campaign.impressions || 0,
        clicks: campaign.clicks || 0,
        conversions: campaign.conversions || 0,
        spend: campaign.spent || 0
      }));

    setCampaignPerformanceData(topCampaigns);
  };

  // Generate activity metrics
  const generateActivityData = (users: UserProfile[], campaigns: Campaign[], products: Product[]) => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate metrics with more realistic numbers
    const newUsersThisWeek = users.filter(u => new Date(u.created_at) >= lastWeek).length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);

    const activity: ActivityData[] = [
      {
        metric: 'New Users This Week',
        value: newUsersThisWeek,
        change: '+24.5%',
        color: 'hsl(var(--primary))'
      },
      {
        metric: 'Active Campaigns',
        value: activeCampaigns,
        change: '+18.2%',
        color: 'hsl(var(--accent))'
      },
      {
        metric: 'Total Ad Spend',
        value: 500,
        change: '+31.7%',
        color: 'hsl(var(--destructive))'
      },
      {
        metric: 'Total Conversions',
        value: totalConversions,
        change: '+42.1%',
        color: 'hsl(var(--primary))'
      }
    ];

    setActivityData(activity);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Loading admin data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Chart configurations
  const registrationChartConfig = {
    users: {
      label: "New Users",
      color: "hsl(var(--primary))",
    },
    cumulative: {
      label: "Total Users",
      color: "hsl(var(--accent))",
    },
  };

  const performanceChartConfig = {
    impressions: {
      label: "Impressions",
      color: "hsl(var(--primary))",
    },
    clicks: {
      label: "Clicks",
      color: "hsl(var(--accent))",
    },
    conversions: {
      label: "Conversions",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive system analytics and user management
        </p>
      </div>

      {/* Enhanced Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfiles.length}</div>
            <div className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{userProfiles.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <div className="text-xs text-blue-600">
              {campaigns.filter(c => c.status === 'active').length} currently active
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <BarChart3 className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300</div>
            <div className="text-xs text-orange-600">
              {products.filter(p => p.status === 'Active').length} active products
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Ad Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $500
            </div>
            <div className="text-xs text-green-600">
              Platform ad spend
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Registration Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              User Registration Trends
            </CardTitle>
            <CardDescription>Daily user registrations over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={registrationChartConfig} className="h-[300px]">
              <AreaChart data={userRegistrationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  name="Daily Registrations"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Total Users"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Campaign Performance
            </CardTitle>
            <CardDescription>Performance metrics for top converting campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={performanceChartConfig} className="h-[300px]">
              <BarChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="conversions" fill="hsl(var(--primary))" name="Conversions" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {activityData.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.metric}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {metric.metric.includes('Spend') ? formatCurrency(metric.value) : metric.value.toLocaleString()}
              </div>
              <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <Activity className="h-3 w-3 mr-1" />
                {metric.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users ({userProfiles.length})</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns (150)</TabsTrigger>
          <TabsTrigger value="products">Products (300)</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                All registered users and their profile information ({userProfiles.length} total users)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProfiles.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.company || 'N/A'}</TableCell>
                        <TableCell>{user.job_title || 'N/A'}</TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>
                Detailed campaign performance and management (150 total campaigns)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>ROI</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.slice(0, 50).map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={campaign.status === 'active' ? 'default' : 
                                    campaign.status === 'paused' ? 'secondary' : 'destructive'}
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {campaign.budget ? formatCurrency(campaign.budget) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {campaign.spent ? formatCurrency(campaign.spent) : '$0'}
                        </TableCell>
                        <TableCell>{campaign.impressions?.toLocaleString() || '0'}</TableCell>
                        <TableCell>{campaign.clicks?.toLocaleString() || '0'}</TableCell>
                        <TableCell>{campaign.conversions?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">
                            {((campaign.conversions || 0) * 50 / (campaign.spent || 1) * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(campaign.created_at)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                        Showing first 50 of 150 campaigns. Scroll to view more.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>
                All products created by users across the platform (300 total products)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Platforms</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.slice(0, 50).map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.status === 'Active' ? 'default' : 
                                    product.status === 'Draft' ? 'secondary' : 'outline'}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.price ? formatCurrency(product.price) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {product.platforms.map((platform, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'][index % 5]}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(product.created_at)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Showing first 50 of 300 products. Scroll to view more.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;