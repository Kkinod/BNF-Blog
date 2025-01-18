export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // browser should use relative path
    return "";
  }
  
  // SSR should use vercel url
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}; 