import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "../auth";

import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
	protectedRoutes,
} from "../routes";

import { currentRole } from "./features/auth/utils/currentUser";
import { routes } from "./shared/utils/routes";
import { i18nConfig } from "./i18n";

const locales = i18nConfig.locales;
const defaultLocale = i18nConfig.defaultLocale;

function getLocale(request: Request): string {
	const cookieValue = request.headers.get("cookie")?.match(/NEXT_LOCALE=([^;]+)/)?.[1];
	if (cookieValue && locales.includes(cookieValue)) {
		return cookieValue;
	}

	const acceptLanguage = request.headers.get("accept-language") || "";

	const preferredLanguages = acceptLanguage
		.split(",")
		.map((lang) => {
			const [tag, priority = "1.0"] = lang.trim().split(";q=");
			return { tag: tag.split("-")[0], priority: parseFloat(priority) };
		})
		.sort((a, b) => b.priority - a.priority)
		.map((lang) => lang.tag);

	for (const lang of preferredLanguages) {
		if (locales.includes(lang)) {
			return lang;
		}
	}

	return defaultLocale;
}

function addCacheHeaders(headers: Headers, isApi: boolean = false): void {
	if (isApi) {
		headers.set("Cache-Control", "no-store, must-revalidate");
		headers.set("Pragma", "no-cache");
	} else {
		headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
	}
}

export const middleware = auth(async (req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;
	const pathname = nextUrl.pathname;

	// Type assertion to ensure apiAuthPrefix is treated as string
	const apiAuthPrefixStr = apiAuthPrefix as string;
	const isApiAuthRoute = pathname.startsWith(apiAuthPrefixStr);
	const isApiRoute = pathname.startsWith("/api/");

	const shouldSkipLocaleRedirect =
		isApiRoute || pathname.startsWith("/_next/") || pathname.includes(".") || isApiAuthRoute;

	// Check if the path already contains the locale parameter
	const pathLocale = locales.find(
		(locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
	);

	if (!pathLocale && !shouldSkipLocaleRedirect) {
		const preferredLocale = getLocale(req);
		const response = NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, nextUrl));

		response.cookies.set("NEXT_LOCALE", preferredLocale, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
		});

		response.headers.set("X-Middleware-Locale", preferredLocale);

		return response;
	}

	if (pathname === "/" && !shouldSkipLocaleRedirect) {
		const locale = getLocale(req);

		// Add header with locale information for debugging
		const response = NextResponse.redirect(new URL(`/${locale}`, nextUrl));

		response.cookies.set("NEXT_LOCALE", locale, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
		});

		response.headers.set("X-Middleware-Locale", locale);

		return response;
	}

	// Simplified function to check if a path matches a route pattern
	const isPathMatchingRoute = (path: string, routePattern: string) => {
		// Handle exact matches
		if (path === routePattern) return true;

		// Handle dynamic routes (e.g. /posts/[slug])
		if (routePattern.includes("[") && routePattern.includes("]")) {
			const pathParts = path.split("/");
			const routeParts = routePattern.split("/");

			// Different number of segments means no match
			if (pathParts.length !== routeParts.length) return false;

			// Check each segment
			return routeParts.every((routePart, i) => {
				// If it's a dynamic segment [something], it matches anything
				if (routePart.startsWith("[") && routePart.endsWith("]")) return true;
				// Otherwise, segments must match exactly
				return routePart === pathParts[i];
			});
		}

		// Handle prefix matches (e.g. /posts/ should match /posts/123)
		if (routePattern.endsWith("/")) {
			return path.startsWith(routePattern);
		}

		// Handle API routes that should match their sub-routes
		if (routePattern === "/api/posts" || routePattern === "/posts") {
			return path.startsWith(`${routePattern}/`);
		}

		return false;
	};

	// Match path without locale for isPathMatchingRoute check
	let pathWithoutLocale = pathname;
	let locale = defaultLocale;

	if (pathLocale) {
		pathWithoutLocale = pathname.replace(`/${pathLocale}`, "") || "/";
		locale = pathLocale;
	}

	const pathWithoutQuery = pathWithoutLocale.split("?")[0];
	const isPublicRoute = publicRoutes.some((route) => isPathMatchingRoute(pathWithoutQuery, route));
	const isProtectedRoute = protectedRoutes.some((route) =>
		isPathMatchingRoute(pathWithoutQuery, route),
	);

	// Check if this is a regular API route (not auth API)
	const isRegularApiRoute = isApiRoute && !isApiAuthRoute;

	// For API routes, only proceed if they're public or the user is logged in
	if (isRegularApiRoute) {
		if (isPublicRoute || isLoggedIn) {
			return NextResponse.next();
		}
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Convert path without locale prefix
	const isAuthRoute =
		Array.isArray(authRoutes) &&
		authRoutes.some((route) => isPathMatchingRoute(pathWithoutQuery, route));

	if (isApiAuthRoute) {
		return NextResponse.next();
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			// Ensure DEFAULT_LOGIN_REDIRECT is treated as string
			return NextResponse.redirect(
				new URL(`/${locale}${DEFAULT_LOGIN_REDIRECT as string}`, nextUrl),
			);
		}
		return NextResponse.next();
	}

	if (!isLoggedIn && (isProtectedRoute || !isPublicRoute)) {
		let callbackUrl = pathname;
		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return NextResponse.redirect(
			new URL(`/${locale}/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
		);
	}

	const adminOnlyRoutes = ["/admin", "/write"];

	if (adminOnlyRoutes.some((route) => isPathMatchingRoute(pathWithoutQuery, route))) {
		const role = await currentRole();

		if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN) {
			return NextResponse.redirect(new URL(`/${locale}${routes.home}`, nextUrl));
		}
	}

	// Add cache headers to response (only for non-API routes)
	const response = NextResponse.next();

	if (pathLocale) {
		response.cookies.set("NEXT_LOCALE", pathLocale, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
		});
	}

	// Only add cache headers to non-API routes
	if (!isApiRoute) {
		addCacheHeaders(response.headers, false);
	} else {
		addCacheHeaders(response.headers, true);
	}

	response.headers.set("X-Language-Preference", locale);

	return response;
});

export const config = {
	matcher: [
		// Match all paths except:
		// 1. Files with extensions (e.g. .js, .css)
		// 2. Next.js internal paths (_next)
		// 3. Public files (favicon.ico, etc.)
		"/((?!_next|.*\\..*|favicon.ico).*)",
		"/",
	],
};
