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
      .single();

    // If there's no API key in the database, try to get it from localStorage
    const apiKey = apiKeyData?.key_value || localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.warn("No OpenAI API key found");
      // Return placeholder text
      return `Experience the amazing ${productName}!\n\nStop settling for average. ${productName} delivers exceptional quality and performance that will transform your daily life.\n\n✅ Premium quality\n✅ Exceptional performance\n✅ Outstanding value\n\nYou deserve the best. Invest in yourself today with ${productName}.\n\nLIMITED TIME OFFER: Get 15% off when you order now!`;
    }

    // Kenny Nwokoye's style prompt for marketing copy
    const prompt = `
      Create compelling marketing copy for ${productName} in the exact sales style of Kenny Nwokoye with these key characteristics:
      1. Use direct, conversational language that creates urgency without being pushy
      2. Include emotionally engaging phrases that connect with the reader's needs and desires
      3. Create a clear value proposition with benefits-focused bullets (using emoji bullet points ✅)
      4. Use short, punchy sentences that build excitement
      5. Include phrases like "LIMITED TIME OFFER", "You deserve the best", "Stop settling for..."
      6. Structure the copy with clear sections including headline, hook, benefits, and call to action
      7. 1-2 engaging questions that make the reader reflect on their needs
      8. Use brief but powerful testimonial-style statements
      9. Make it suitable for both social media ads and product pages

      Product Description: ${productDescription}
    `;

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
            content: 'You are a world-class marketing copywriter specializing in Kenny Nwokoye\'s persuasive style of direct response marketing.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content.trim();
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
      .single();

    // If there's no API key in the database, try to get it from localStorage
    const apiKey = apiKeyData?.key_value || localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.warn("No OpenAI API key found");
      // Return placeholder image
      return "/placeholder.svg";
    }

    const prompt = `Create a professional, high-quality marketing image for ${productName}. ${productDescription}. The image should be clean, professional, product-focused and suitable for advertisements. Photorealistic style.`;

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
      }),
    });

    const data = await response.json();
    
    if (data.data && data.data[0] && data.data[0].url) {
      // Save the image to Supabase storage or just return the URL
      return data.data[0].url;
    }
    
    throw new Error("No image URL in the DALL-E response");
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
