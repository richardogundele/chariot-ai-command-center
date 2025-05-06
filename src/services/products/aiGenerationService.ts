
interface OpenAIImageGenerationResponse {
  created: number;
  data: {
    url: string;
  }[];
}

interface OpenAIChatResponse {
  choices: [
    {
      message: {
        content: string;
      };
    }
  ];
}

// Helper function to get API key from environment variables or localStorage
function getOpenAIApiKey(): string {
  return import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key') || '';
}

export async function generateAdCopy(productName: string, productDescription: string): Promise<string> {
  try {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      console.warn('OpenAI API key is missing. Using mock ad copy.');
      return `Experience the amazing ${productName}. Designed for performance and comfort. Get yours today!`;
    }
    
    const systemPrompt = `You are Kenny Nwokoye, a Nigerian entrepreneur and digital marketing expert known for his persuasive, conversational, and no-fluff approach.`;
    
    const userPrompt = `Write a high-converting sales copy in the style of Kenny Nwokoye, 
    The tone should be energetic, engaging, and direct—using storytelling, 
    bold statements, emotional triggers, and a clear call to action. Use short,
    punchy sentences, occasional capital letters, and relevant emojis to make 
    the message pop. The copy should focus on the product ${productName},
    highlight key pain points, and position the solution as a must-have. End with 
    a strong sense of urgency and a compelling CTA.
    
    Product description: ${productDescription}`;

    console.log('Sending request to OpenAI for ad copy generation with:', { productName, productDescription });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json() as OpenAIChatResponse;
    console.log('Ad copy generation response:', data);
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Failed to generate ad copy:", error);
    return "Experience the difference with our premium product. Designed for performance and comfort. Get yours today!";
  }
}

export async function generateProductImage(productName: string, productDescription: string): Promise<string> {
  try {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      console.warn('OpenAI API key is missing. Using placeholder image.');
      return "/placeholder.svg";
    }
    
    console.log('Sending request to OpenAI for image generation with:', { productName, productDescription });

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a professional, clean product advertisement image for: ${productName}. 
        Product details: ${productDescription}. 
        Style: Modern, minimal product photography on white background, suitable for e-commerce.`,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json() as OpenAIImageGenerationResponse;
    console.log('Image generation response:', data);
    return data.data[0].url;
  } catch (error) {
    console.error("Failed to generate product image:", error);
    return "/placeholder.svg";
  }
}

// Helper function to extract product details from a URL
export async function extractProductFromUrl(url: string): Promise<{
  success: boolean;
  name?: string;
  description?: string;
  price?: number;
  error?: string;
}> {
  try {
    if (!url || !url.startsWith('http')) {
      return { 
        success: false, 
        error: 'Invalid URL format. Please provide a complete URL including http:// or https://' 
      };
    }
    
    // For demo purposes, we'll simulate successful extraction for any valid URL
    console.log('Attempting to extract product from URL:', url);
    
    try {
      // Validate URL by trying to create a URL object
      new URL(url);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for popular e-commerce domains to provide more realistic simulated data
      const domain = new URL(url).hostname.toLowerCase();
      
      if (domain.includes('amazon')) {
        return {
          success: true,
          name: 'Premium Bluetooth Headphones',
          description: 'Wireless over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Features quick charging and comfortable memory foam ear cushions.',
          price: 149.99
        };
      } else if (domain.includes('etsy')) {
        return {
          success: true,
          name: 'Handcrafted Wooden Watch',
          description: 'Unique handmade wooden watch crafted from sustainable bamboo. Features Japanese quartz movement, soft leather strap, and splash-resistant design.',
          price: 89.95
        };
      } else if (domain.includes('shopify') || domain.includes('myshopify')) {
        return {
          success: true,
          name: 'Organic Skincare Gift Set',
          description: 'All-natural skincare collection featuring facial cleanser, toner, moisturizer, and serum. Made with organic ingredients and essential oils. Free from parabens and artificial fragrances.',
          price: 64.50
        };
      } else {
        // Generic product for other domains
        return {
          success: true,
          name: 'Sample Product',
          description: 'This is a simulated product description based on the URL you provided. In a real implementation, we would extract actual product details from the page.',
          price: 99.99
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Invalid URL format. Please check the URL and try again.' 
      };
    }
  } catch (error) {
    console.error('Error extracting product data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract product information'
    };
  }
}
