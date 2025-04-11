
interface OpenAIImageGenerationResponse {
  created: number;
  data: {
    url: string;
  }[];
}

// For development, you can use a default API key, but in production
// this should be properly secured using environment variables
const OPENAI_API_KEY = "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";

export async function generateAdCopy(productName: string, productDescription: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key is missing. Using mock ad copy.');
      return `Experience the amazing ${productName}. Designed for performance and comfort. Get yours today!`;
    }
    
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
            content: "You are an advertising copywriter specialist. Create compelling, concise ad copy."
          },
          {
            role: "user",
            content: `Write a compelling and concise ad copy (maximum 3 sentences) for the following product: 
            Product Name: ${productName}
            Product Description: ${productDescription}`
          }
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Failed to generate ad copy:", error);
    return "Experience the difference with our premium product. Designed for performance and comfort. Get yours today!";
  }
}

export async function generateProductImage(productName: string, productDescription: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key is missing. Using placeholder image.');
      return "/placeholder.svg";
    }
    
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
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json() as OpenAIImageGenerationResponse;
    return data.data[0].url;
  } catch (error) {
    console.error("Failed to generate product image:", error);
    return "/placeholder.svg";
  }
}
