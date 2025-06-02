
// Map our app's objective names to Facebook's objective names
export function mapObjectiveToFacebook(objective: string): string {
  const mapping: Record<string, string> = {
    'conversion': 'CONVERSIONS',
    'awareness': 'BRAND_AWARENESS', 
    'traffic': 'LINK_CLICKS',
    'engagement': 'POST_ENGAGEMENT',
    'app_installs': 'APP_INSTALLS',
    'video_views': 'VIDEO_VIEWS',
    'lead_generation': 'LEAD_GENERATION',
    'messages': 'MESSAGES'
  };
  
  return mapping[objective] || 'CONVERSIONS';
}

// Get optimization goal based on objective
export function getOptimizationGoal(objective: string): string {
  const mapping: Record<string, string> = {
    'conversion': 'CONVERSIONS',
    'awareness': 'REACH',
    'traffic': 'LINK_CLICKS',
    'engagement': 'POST_ENGAGEMENT',
    'app_installs': 'APP_INSTALLS',
    'video_views': 'VIDEO_VIEWS',
    'lead_generation': 'LEAD_GENERATION',
    'messages': 'CONVERSATIONS'
  };
  
  return mapping[objective] || 'CONVERSIONS';
}

// Get billing event based on objective
export function getBillingEvent(objective: string): string {
  const mapping: Record<string, string> = {
    'conversion': 'IMPRESSIONS',
    'awareness': 'IMPRESSIONS',
    'traffic': 'LINK_CLICKS',
    'engagement': 'IMPRESSIONS',
    'app_installs': 'IMPRESSIONS',
    'video_views': 'IMPRESSIONS',
    'lead_generation': 'IMPRESSIONS',
    'messages': 'IMPRESSIONS'
  };
  
  return mapping[objective] || 'IMPRESSIONS';
}

// Parse target audience string into Facebook targeting spec
export function parseTargetAudience(targetAudienceStr?: string): Record<string, any> {
  if (!targetAudienceStr || targetAudienceStr === 'Default audience') {
    return {};
  }
  
  // This is a simplified parser - in a real app you'd want more sophisticated parsing
  const targeting: Record<string, any> = {};
  
  // Extract age ranges
  const ageMatch = targetAudienceStr.match(/(\d+)\s*-\s*(\d+)\s*years?\s*old/i);
  if (ageMatch) {
    targeting.age_min = parseInt(ageMatch[1]);
    targeting.age_max = parseInt(ageMatch[2]);
  }
  
  // Extract gender preferences
  if (/\bmen\b/i.test(targetAudienceStr) && !/\bwomen\b/i.test(targetAudienceStr)) {
    targeting.genders = [1]; // Men only
  } else if (!/\bmen\b/i.test(targetAudienceStr) && /\bwomen\b/i.test(targetAudienceStr)) {
    targeting.genders = [2]; // Women only
  }
  
  // Extract interests (very simplified)
  const interestsMatch = targetAudienceStr.match(/interests?:\s*([^,\.]+)/i);
  if (interestsMatch) {
    const interestStr = interestsMatch[1].trim();
    targeting.flexible_spec = [{
      interests: [{ name: interestStr, id: null }] // ID would need to be looked up from Facebook's API
    }];
  }
  
  // Extract locations (very simplified)
  const locationMatch = targetAudienceStr.match(/locations?:\s*([^,\.]+)/i);
  if (locationMatch) {
    const location = locationMatch[1].trim();
    if (location !== 'US' && location !== 'United States') {
      targeting.geo_locations = {
        regions: [{ key: location }],
        location_types: ['home', 'recent']
      };
    }
  }
  
  return targeting;
}
