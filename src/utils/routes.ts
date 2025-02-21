export const routes = {
	// basic paths
	home: "/",
	notFound: "/404",

	// Auth routes
	login: "/login",
	register: "/register",
	auth: "/auth",
	settings: "/settings",
	server: "/server",
	admin: "/admin",
	write: "/write",

	// dynamic paths
	post: (slug: string, category: string) => `/posts/${slug}?cat=${category}`,
	category: (category: string) => `/category?cat=${category}`,
};
