export const routes = {
	// Podstawowe ścieżki
	home: "/",
	write: "/write",

	// Auth routes
	login: "/login",
	register: "/register",
	auth: "/auth",
	settings: "/settings",
	server: "/server",
	admin: "/admin",

	// Dynamiczne ścieżki
	post: (slug: string, category: string) => `/posts/${slug}?cat=${category}`,
	category: (category: string) => `/category?cat=${category}`,
};
