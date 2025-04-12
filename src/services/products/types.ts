
export interface Product {
  id: string | number;
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
  insights: any[];
  price?: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  adCopy: string;
  image: string;
  platforms: string[];
  status: string;
  price?: number;
}
