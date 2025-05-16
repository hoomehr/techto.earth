// Define a set of fallback images for different categories
const fallbackImages: Record<string, string> = {
  // Courses
  farming:
    "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZhcm18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  restaurant:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  crafts:
    "https://images.unsplash.com/photo-1567964217888-c8a3651b4a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29vZHdvcmtpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  business:
    "https://images.unsplash.com/photo-1664575602554-2087b04935a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",

  // Events
  "farm-tour":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  workshop:
    "https://images.unsplash.com/photo-1544397012-f1ead2c3a315?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29ya3Nob3B8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  networking:
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV0d29ya2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  "job-fair":
    "https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am9iJTIwZmFpcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

  // Groups
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  sustainability:
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VzdGFpbmFiaWxpdHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",

  // Blog categories
  "success-stories":
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VjY2Vzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  "farming-tips":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  "restaurant-business":
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  craftsmanship:
    "https://images.unsplash.com/photo-1567964217888-c8a3651b4a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29vZHdvcmtpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  "sustainability-blog":
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VzdGFpbmFiaWxpdHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",

  // Specific blog posts
  "software-engineer-to-organic-farmer":
    "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZhcm18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  "coding-skills-farm-to-table-restaurant":
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  "ux-design-to-artisanal-woodworking":
    "https://images.unsplash.com/photo-1567964217888-c8a3651b4a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29vZHdvcmtpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
}

// Default fallback image if no category match is found
const defaultFallback =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"

/**
 * Get an appropriate image URL based on the provided URL, category, and slug
 */
export function getImageUrl(imageUrl: string | null | undefined, category?: string, slug?: string): string {
  // If a valid image URL is provided, use it
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith("http")) {
    return imageUrl
  }

  // Try to find a fallback based on slug
  if (slug && typeof slug === 'string' && fallbackImages[slug]) {
    return fallbackImages[slug]
  }

  // Try to find a fallback based on category
  if (category && typeof category === 'string' && fallbackImages[category]) {
    return fallbackImages[category]
  }

  // Return default fallback
  return defaultFallback
}
