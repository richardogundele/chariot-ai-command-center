
import { Product } from "./types";

// Helper function for mock data when user is not authenticated
export function getMockProducts(): Product[] {
  return [
    {
      id: 1,
      name: "Premium Fitness Watch",
      description: "Advanced health tracking features with 7-day battery life",
      status: "Draft",
      metrics: { sales: 0, revenue: 0, roas: 0 },
      lastUpdated: "Just now",
      platforms: ["facebook", "instagram"],
      adCopy: "Track your health journey with precision. Our Premium Fitness Watch offers 24/7 monitoring.",
      image: "/placeholder.svg",
      insights: []
    },
    {
      id: 2,
      name: "Wireless Noise-Cancelling Headphones",
      description: "Premium sound quality with 20-hour battery life",
      status: "Draft",
      metrics: { sales: 0, revenue: 0, roas: 0 },
      lastUpdated: "Just now",
      platforms: ["facebook"],
      adCopy: "Immerse yourself in pure sound with our Wireless Noise-Cancelling Headphones.",
      image: "/placeholder.svg",
      insights: []
    }
  ];
}
