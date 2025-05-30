export const publicRoutes = [
	"/",
	"/new-verification",
	"/api/categories",
	"/api/posts",
	"/api/posts/[slug]",
	"/api/posts/popular",
	"/api/posts/pick",
	"/posts",
	"/posts/[slug]",
	"/api/comments",
	"/blog",
	"/category",
];

export const authRoutes = ["/login", "/register", "/error", "/reset", "/new-password"];

export const protectedRoutes = ["/settings", "/profil", "/write"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";
