export const routes = {
	// basic paths
	home: "/",
	notFound: "/404",

	// Auth routes
	login: "/login",
	register: "/register",
	auth: "/auth",
	settings: "/settings",
	profil: "/profil",
	admin: "/admin",
	write: "/write",

	// dynamic paths
	post: (slug: string, category: string) => `/posts/${slug}?cat=${category}`,
	category: (category: string) => `/category?cat=${category}`,
};

export function getLocalizedRoute(path: string, locale: string): string {
	if (path === "/" || path === "") {
		return `/${locale}`;
	}

	if (path.includes("?")) {
		const [pathBase, params] = path.split("?");
		return `/${locale}${pathBase}?${params}`;
	}

	return `/${locale}${path}`;
}

type Routes = typeof routes;

export function getLocalizedRoutes(locale: string): Routes {
	return {
		home: getLocalizedRoute(routes.home, locale),
		notFound: getLocalizedRoute(routes.notFound, locale),
		login: getLocalizedRoute(routes.login, locale),
		register: getLocalizedRoute(routes.register, locale),
		auth: getLocalizedRoute(routes.auth, locale),
		settings: getLocalizedRoute(routes.settings, locale),
		profil: getLocalizedRoute(routes.profil, locale),
		admin: getLocalizedRoute(routes.admin, locale),
		write: getLocalizedRoute(routes.write, locale),

		post: (slug: string, category: string) =>
			getLocalizedRoute(routes.post(slug, category), locale),

		category: (category: string) => getLocalizedRoute(routes.category(category), locale),
	};
}

export type LocalizedRoutes = ReturnType<typeof getLocalizedRoutes>;
