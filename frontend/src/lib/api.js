// API base URL configuration
// In development: uses proxy (empty string means relative URLs work with Vite proxy)
// In production: uses VITE_API_URL environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper to construct full API URLs
export function getApiUrl(path) {
  // If path already starts with http, return as-is (for absolute URLs)
  if (path.startsWith('http')) {
    return path;
  }
  
  // In development with proxy, use relative URLs
  if (!API_BASE_URL) {
    return path;
  }
  
  // In production, prepend the API base URL
  return `${API_BASE_URL}${path}`;
}
