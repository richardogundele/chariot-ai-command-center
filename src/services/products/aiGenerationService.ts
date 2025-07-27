import { supabase } from "@/integrations/supabase/client";

/**
 * Generates ad copy for a product using OpenAI in Kenny Nwokoye's style
 */
export async function generateAdCopy(productName: string, productDescription: string): Promise<string> {
  try {
    // Try to get the API key from Supabase secrets first (most secure)
    let apiKey: string | null = null;
    
    try {
      const { data, error } = await supabase.functions.invoke('get-openai-key');
      if (!error && data?.apiKey) {
        apiKey = data.apiKey;
      }
    } catch (error) {
      console.log('Supabase secrets not available, trying database...');
    }

    // Fallback to database storage
    if (!apiKey) {
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'openai_api_key')
        .maybeSingle();

      if (apiKeyError) {
        console.error("Error fetching API key:", apiKeyError);
      }

      apiKey = apiKeyData?.key_value || localStorage.getItem('openai_api_key') || null;
    }

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
 * Generates product image using DALL-E API with enhanced 3D rendering prompt
 */
export async function generateProductImage(productName: string, productDescription: string): Promise<string> {
  try {
    // Try to get the API key from Supabase secrets first (most secure)
    let apiKey: string | null = null;
    
    try {
      const { data, error } = await supabase.functions.invoke('get-openai-key');
      if (!error && data?.apiKey) {
        apiKey = data.apiKey;
      }
    } catch (error) {
      console.log('Supabase secrets not available, trying database...');
    }

    // Fallback to database storage
    if (!apiKey) {
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'openai_api_key')
        .maybeSingle();

      if (apiKeyError) {
        console.error("Error fetching API key:", apiKeyError);
      }

      apiKey = apiKeyData?.key_value || localStorage.getItem('openai_api_key') || null;
    }

    if (!apiKey) {
      console.warn("No OpenAI API key found");
      // Return placeholder image
      return "/placeholder.svg";
    }

    const prompt = `Create a stunning 3D product render of ${productName} with professional studio lighting and a clean white background. The image should be:

- A high-quality 3D render with realistic materials, textures, and lighting
- Positioned at a 45-degree angle to show depth and dimensionality
- Illuminated with soft, even studio lighting that eliminates harsh shadows
- Set against a pure white seamless background for e-commerce use
- Rendered with photorealistic detail and premium finish
- Optimized for advertising and marketing materials
- Sharp focus with subtle depth of field
- Professional product photography style

Product details: ${productDescription}

Style: Ultra-realistic 3D product visualization, commercial photography quality, cinema 4D render, octane render, studio lighting setup, premium product showcase, marketing ready.`;

    console.log("Sending 3D render generation request with enhanced prompt");

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
        quality: "hd",
        response_format: "b64_json" // Request base64 encoded image instead of URL
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DALL-E API error:", errorData);
      throw new Error(`DALL-E API responded with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("DALL-E API response received for 3D render");
    
    if (data.data && data.data[0] && data.data[0].b64_json) {
      // Return data URL to display the image directly
      return `data:image/png;base64,${data.data[0].b64_json}`;
    }
    
    throw new Error("No image data in the DALL-E response");
  } catch (error) {
    console.error("Error generating 3D product render:", error);
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
