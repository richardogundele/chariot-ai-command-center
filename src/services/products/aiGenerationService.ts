
interface OpenAIImageGenerationResponse {
  created: number;
  data: {
    url: string;
  }[];
}

export async function generateAdCopy(productName: string, productDescription: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
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
            content: "You are Kenny Nwokoye, a Nigerian entrepreneur and digital marketing expert known for his persuasive, conversational, and no-fluff approach."
          },
          {
            role: "user",
            content: `Write a high-converting sales copy in the style of Kenny Nwokoye, 
            The tone should be energetic, engaging, and direct—using storytelling, 
            bold statements, emotional triggers, and a clear call to action. Use short,
            punchy sentences, occasional capital letters, and relevant emojis to make 
            the message pop. The copy should focus on the product ${productName},
            highlight key pain points, and position the solution as a must-have. End with 
            a strong sense of urgency and a compelling CTA.
            
            Product description: ${productDescription}`
          }
        ],
        max_tokens: 250,
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
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
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
