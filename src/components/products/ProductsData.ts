
export interface Product {
  id: number;
  name: string;
  description: string;
  status: string;
  metrics: {
    sales: number;
    revenue: number;
    roas: number;
  };
  lastUpdated: string;
  platforms: string[];
  adCopy: string;
  image: string;
  insights?: string[];
}

export const mockProducts: Product[] = [
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
    adCopy: "Track your health journey with precision. Our Premium Fitness Watch offers 24/7 heart rate monitoring, sleep analysis, and week-long battery life. Perfect for serious athletes and health enthusiasts.",
    image: "/placeholder.svg",
    insights: [
      "Users aged 25-34 show highest engagement",
      "Morning ads outperform evening ads by 28%",
      "Health-focused messaging drives 3.2x more conversions"
    ]
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
    adCopy: "Immerse yourself in pure sound. Our Wireless Noise-Cancelling Headphones deliver crystal clear audio with deep bass and 20 hours of playtime. Perfect for work, travel, or escaping into your favorite music.",
    image: "/placeholder.svg"
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
    adCopy: "Protect what matters most. Our Smart Home Security Camera features crystal clear 1080p HD video, night vision, and instant motion alerts to your phone. Easy setup, 24/7 monitoring, and peace of mind.",
    image: "/placeholder.svg"
  },
];
