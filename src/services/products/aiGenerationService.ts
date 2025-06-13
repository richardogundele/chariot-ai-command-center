import { supabase } from "@/integrations/supabase/client";

/**
 * Generates ad copy for a product using OpenAI in Kenny Nwokoye's style
 */
export async function generateAdCopy(productName: string, productDescription: string): Promise<string> {
  try {
    // First, try to get the API key from the database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', 'openai_api_key')
      .maybeSingle();

    if (apiKeyError) {
      console.error("Error fetching API key:", apiKeyError);
    }

    // If there's no API key in the database, try to get it from localStorage or env
    const apiKey = apiKeyData?.key_value || localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.warn("No OpenAI API key found");
      // Return placeholder text
      return `Experience the amazing ${productName}!\n\nStop settling for average. ${productName} delivers exceptional quality and performance that will transform your daily life.\n\n✅ Premium quality\n✅ Exceptional performance\n✅ Outstanding value\n\nYou deserve the best. Invest in yourself today with ${productName}.\n\nLIMITED TIME OFFER: Get 15% off when you order now!`;
    }

    const systemPrompt = `You are Kenny Nwokoye, a Nigerian entrepreneur and digital marketing genius and expert known for his persuasive, conversational, and no-fluff approach with consistency in making crazy sales.`;

    const userPrompt = 
    `Write a high-converting sales copy in the style of Kenny Nwokoye, 
     The tone should be energetic, engaging, and direct—using storytelling, 
     bold statements, emotional triggers, and a clear call to action. Use short,
      punchy sentences, occasional capital letters, and relevant emojis to make 
      the message pop. DO NOT use markdown formatting like asterisks (**).
      The copy should focus on the product ${productName},
      highlight key pain points, and position the solution as a must-have. End with 
      a strong sense of urgency and a compelling CTA.
      
      Product Description: ${productDescription}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: userPrompt
          }
        ],
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API responded with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      // Remove any asterisks from the response text
      let adCopy = data.choices[0].message.content.trim();
      adCopy = adCopy.replace(/\*\*/g, '');
      return adCopy;
    }
    
    throw new Error("No content in the OpenAI response");

  } catch (error) {
    console.error("Error generating ad copy:", error);
    return `Experience the amazing ${productName}!\n\nStop settling for average. ${productName} delivers exceptional quality and performance that will transform your daily life.\n\n✅ Premium quality\n✅ Exceptional performance\n✅ Outstanding value\n\nYou deserve the best. Invest in yourself today with ${productName}.\n\nLIMITED TIME OFFER: Get 15% off when you order now!`;
  }
}

/**
 * Generates product image using DALL-E API
 */
export async function generateProductImage(productName: string, productDescription: string): Promise<string> {
  try {
    // First, try to get the API key from the database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', 'openai_api_key')
      .maybeSingle();

    if (apiKeyError) {
      console.error("Error fetching API key:", apiKeyError);
    }

    // If there's no API key in the database, try to get it from localStorage or env
    const apiKey = apiKeyData?.key_value || localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.warn("No OpenAI API key found");
      // Return placeholder image
      return "/placeholder.svg";
    }

    const prompt = `A professional product photography shot of ${productName} on a clean pure white background. The product should be centered, well-lit with soft lighting, and optimized for advertising use. Clean, minimal, commercial photography style. No shadows, no textures, just a crisp white background. Studio lighting setup. ${productDescription}. The image should look professional and ready for e-commerce or social media ads.`;

    console.log("Sending image generation request with prompt:", prompt.substring(0, 50) + "...");

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json" // Request base64 encoded image instead of URL
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DALL-E API error:", errorData);
      throw new Error(`DALL-E API responded with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("DALL-E API response received");
    
    if (data.data && data.data[0] && data.data[0].b64_json) {
      // Return data URL to display the image directly
      return `data:image/png;base64,${data.data[0].b64_json}`;
    }
    
    throw new Error("No image data in the DALL-E response");
  } catch (error) {
    console.error("Error generating product image:", error);
    return "/placeholder.svg";
  }
}

/**
 * Extract product information from a URL
 * Note: This is kept as a placeholder for feature completeness
 */
export async function extractProductFromUrl(url: string) {
  // This function is no longer needed since we removed the URL option
  // But we'll keep it to avoid breaking any existing code references
  return {
    success: false,
    error: "Product URL extraction has been disabled"
  };
}
