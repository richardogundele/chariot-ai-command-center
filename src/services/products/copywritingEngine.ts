export interface CopywritingStyle {
  id: 'hormozi' | 'busayo' | 'launchboom' | 'chatbot';
  name: string;
  useFor: ('headlines' | 'carousel' | 'adcopy' | 'sales' | 'chatbot')[];
  traits: string[];
  systemPrompt: string;
  userPromptTemplate: string;
}

export interface CopywritingRequest {
  productName: string;
  productDescription: string;
  productPrice?: number;
  targetAudience?: string;
  niche?: string;
  style: CopywritingStyle['id'];
  contentType: 'headlines' | 'carousel' | 'adcopy' | 'sales' | 'chatbot';
  tone?: 'casual' | 'professional' | 'urgent' | 'friendly';
}

export interface CopywritingResult {
  content: string;
  style: CopywritingStyle['id'];
  explanation: string; // "Why This Works" explanation
  alternatives: string[]; // 2-3 variations
  confidence: number; // 0-100
  suggestedImprovements?: string[];
}

// Define copywriting styles based on your strategy
export const COPYWRITING_STYLES: Record<CopywritingStyle['id'], CopywritingStyle> = {
  hormozi: {
    id: 'hormozi',
    name: 'Alex Hormozi',
    useFor: ['headlines', 'adcopy'],
    traits: ['Punchy', 'Results-first', 'Social proof-based', 'No fluff', 'Direct value proposition'],
    systemPrompt: `You are Alex Hormozi, the master of direct-response marketing. Your style is:
    - Brutally honest and results-focused
    - Uses specific numbers and social proof
    - Eliminates risk with guarantees
    - Creates urgency through scarcity
    - Speaks to pain points directly
    - Uses short, punchy sentences
    - Always leads with value, not features`,
    userPromptTemplate: `Write compelling {contentType} for {productName} in Alex Hormozi's style.
    
    Product: {productName}
    Description: {productDescription}
    Price: {productPrice}
    Target: {targetAudience}
    
    Focus on:
    - Specific, measurable results
    - Social proof and testimonials
    - Risk reversal
    - Clear value proposition
    - Urgency and scarcity
    
    Make it punchy, direct, and results-focused. No fluff.`
  },
  
  busayo: {
    id: 'busayo',
    name: 'Joan Busayo',
    useFor: ['carousel', 'adcopy'],
    traits: ['Relatable', 'Poetic', 'Aesthetic flow', 'Emotional connection', 'Storytelling'],
    systemPrompt: `You are Joan Busayo, known for creating beautiful, relatable content that flows like poetry. Your style is:
    - Emotionally resonant and relatable
    - Uses storytelling and metaphors
    - Creates aesthetic, flowing copy
    - Connects on a personal level
    - Balances beauty with persuasion
    - Uses rhythm and cadence
    - Speaks to aspirations and dreams`,
    userPromptTemplate: `Create beautiful, flowing {contentType} for {productName} in Joan Busayo's poetic style.
    
    Product: {productName}
    Description: {productDescription}
    Target: {targetAudience}
    
    Focus on:
    - Emotional storytelling
    - Relatable experiences
    - Aesthetic flow and rhythm
    - Personal connection
    - Aspirational messaging
    
    Make it beautiful, relatable, and emotionally compelling.`
  },
  
  launchboom: {
    id: 'launchboom',
    name: 'LaunchBoom',
    useFor: ['adcopy', 'sales'],
    traits: ['Urgency', 'Validation', 'FOMO', 'Clear CTA', 'Benefit-focused'],
    systemPrompt: `You are a LaunchBoom copywriter, expert at creating high-converting ads with urgency and validation. Your style is:
    - Creates strong FOMO and urgency
    - Uses social validation heavily
    - Clear, compelling CTAs
    - Benefit-focused messaging
    - Addresses objections preemptively
    - Uses countdown timers and scarcity
    - Builds excitement and anticipation`,
    userPromptTemplate: `Write high-converting {contentType} for {productName} using LaunchBoom's proven framework.
    
    Product: {productName}
    Description: {productDescription}
    Price: {productPrice}
    
    Focus on:
    - Creating FOMO and urgency
    - Social proof and validation
    - Clear benefits over features
    - Strong, actionable CTA
    - Scarcity and limited time offers
    
    Make it urgent, validated, and conversion-focused.`
  },
  
  chatbot: {
    id: 'chatbot',
    name: 'My AI Prompt',
    useFor: ['chatbot', 'sales'],
    traits: ['Direct', 'Consultative', 'Doctor-like prescription', 'Authoritative', 'Problem-solver'],
    systemPrompt: `You are a sales chatbot that prescribes solutions like a doctor. Your style is:
    - Direct and consultative approach
    - Ask probing questions to understand pain points
    - Prescribe specific solutions with authority
    - Use medical/consultation metaphors
    - Build trust through expertise demonstration
    - Guide customers to the right solution methodically
    - Professional yet approachable tone`,
    userPromptTemplate: `Write {contentType} responses for {productName} using a consultative, doctor-like approach.
    
    Product: {productName}
    Description: {productDescription}
    Target: {targetAudience}
    
    Focus on:
    - Diagnosing customer pain points
    - Prescribing specific solutions
    - Building authority and trust
    - Methodical problem-solving approach
    - Professional consultation tone
    - Clear next steps/recommendations
    
    Be direct, consultative, and prescriptive like a trusted advisor.`
  }
};

// Smart style selection based on product type and goals
export function selectOptimalStyle(
  productType: string,
  contentType: CopywritingRequest['contentType'],
  businessGoal: 'awareness' | 'conversion' | 'engagement' | 'sales'
): CopywritingStyle['id'] {
  // Algorithm to select best style based on context
  if (contentType === 'headlines' && businessGoal === 'conversion') return 'hormozi';
  if (contentType === 'carousel' && businessGoal === 'engagement') return 'busayo';
  if (contentType === 'adcopy' && businessGoal === 'sales') return 'launchboom';
  if (contentType === 'sales') return 'chatbot';
  if (contentType === 'chatbot') return 'chatbot';
  
  return 'hormozi'; // Default fallback
}

// Generate copy with explainability
export async function generateCopyWithExplanation(
  request: CopywritingRequest,
  apiKey: string
): Promise<CopywritingResult> {
  const style = COPYWRITING_STYLES[request.style];
  
  // Build the prompt
  let prompt = style.userPromptTemplate
    .replace('{contentType}', request.contentType)
    .replace('{productName}', request.productName)
    .replace('{productDescription}', request.productDescription)
    .replace('{productPrice}', request.productPrice?.toString() || 'Not specified')
    .replace('{targetAudience}', request.targetAudience || 'General audience');

  try {
    // Generate main copy
    const copyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: style.systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.8,
      }),
    });

    if (!copyResponse.ok) {
      throw new Error(`OpenAI API error: ${copyResponse.status}`);
    }

    const copyData = await copyResponse.json();
    const mainContent = copyData.choices[0].message.content.trim();

    // Generate explanation
    const explanationPrompt = `Explain why this ${request.contentType} copy would be effective for ${request.productName}. Focus on:
    - What psychological triggers it uses
    - Why this style works for this product type
    - What specific elements drive conversions
    - How it addresses customer pain points
    
    Copy to analyze: "${mainContent}"
    
    Keep explanation concise and actionable (2-3 sentences).`;

    const explanationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a marketing psychology expert who explains why copy works.' },
          { role: 'user', content: explanationPrompt }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const explanationData = await explanationResponse.json();
    const explanation = explanationData.choices[0].message.content.trim();

    // Generate alternatives
    const alternativesPrompt = `Create 2 alternative versions of this copy with slight variations in approach:
    
    Original: "${mainContent}"
    
    Make each alternative unique while maintaining the same style and effectiveness.`;

    const alternativesResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: style.systemPrompt },
          { role: 'user', content: alternativesPrompt }
        ],
        max_tokens: 800,
        temperature: 0.9,
      }),
    });

    const alternativesData = await alternativesResponse.json();
    const alternativesText = alternativesData.choices[0].message.content.trim();
    
    // Parse alternatives (assuming they're separated by line breaks or numbers)
    const alternatives = alternativesText
      .split(/\n\n|\d\.|Alternative \d:/)
      .filter(alt => alt.trim().length > 20)
      .slice(0, 2);

    return {
      content: mainContent,
      style: request.style,
      explanation,
      alternatives,
      confidence: 85, // Could be calculated based on various factors
      suggestedImprovements: [
        'Test with different headlines',
        'Add more social proof',
        'Experiment with urgency levels'
      ]
    };

  } catch (error) {
    console.error('Error generating copy:', error);
    
    // Fallback content
    return {
      content: `Transform your life with ${request.productName}! This isn't just another product - it's your solution to [specific problem]. Join thousands who've already made the switch. Limited time offer - act now!`,
      style: request.style,
      explanation: 'This copy uses proven psychological triggers like social proof, urgency, and problem-solution framing to drive conversions.',
      alternatives: [
        `Ready to upgrade your [category] game? ${request.productName} delivers results that speak for themselves. Don't wait - your competition isn't.`,
        `Stop settling for less. ${request.productName} gives you the edge you've been looking for. Premium quality, unbeatable results. Get yours today.`
      ],
      confidence: 60,
      suggestedImprovements: ['Add specific benefits', 'Include testimonials', 'Create stronger urgency']
    };
  }
}

// Auto-classify product niche for style optimization
export function classifyProductNiche(productDescription: string): string {
  const keywords = productDescription.toLowerCase();
  
  if (keywords.includes('fitness') || keywords.includes('health') || keywords.includes('weight')) return 'health-fitness';
  if (keywords.includes('business') || keywords.includes('course') || keywords.includes('training')) return 'business-education';
  if (keywords.includes('beauty') || keywords.includes('skincare') || keywords.includes('cosmetic')) return 'beauty-lifestyle';
  if (keywords.includes('tech') || keywords.includes('software') || keywords.includes('app')) return 'technology';
  if (keywords.includes('fashion') || keywords.includes('clothing') || keywords.includes('apparel')) return 'fashion';
  
  return 'general';
}

// Get style recommendations based on niche and goals
export function getStyleRecommendations(
  niche: string,
  contentType: CopywritingRequest['contentType']
): { primary: CopywritingStyle['id']; alternatives: CopywritingStyle['id'][] } {
  const recommendations: Record<string, { primary: CopywritingStyle['id']; alternatives: CopywritingStyle['id'][] }> = {
    'health-fitness': { primary: 'hormozi', alternatives: ['chatbot', 'launchboom'] },
    'business-education': { primary: 'hormozi', alternatives: ['launchboom', 'chatbot'] },
    'beauty-lifestyle': { primary: 'busayo', alternatives: ['chatbot', 'launchboom'] },
    'technology': { primary: 'hormozi', alternatives: ['launchboom', 'chatbot'] },
    'fashion': { primary: 'busayo', alternatives: ['chatbot', 'launchboom'] },
    'general': { primary: 'hormozi', alternatives: ['chatbot', 'launchboom'] }
  };
  
  return recommendations[niche] || recommendations['general'];
}