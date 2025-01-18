export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL; // SSR should use vercel url
  return `http://localhost:3000`; // dev SSR should use localhost
}; 