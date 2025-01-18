export const getBaseUrl = () => {
  // browser should use relative path
  if (typeof window !== "undefined") return "";

  // SSR should use absolute URLs
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // For server-side requests on Vercel
  if (process.env.NODE_ENV === 'production') {
    // Use the host header if available
    const protocol = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? 'http' : 'https';
    return `${protocol}://${process.env.VERCEL_URL}`;
  }

  // assume localhost for development
  return "http://localhost:3000";
}; 