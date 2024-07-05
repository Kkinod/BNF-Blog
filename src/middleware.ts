import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import authConfig from "../auth.config";
import { apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from "../routes";
import { currentRole } from "./lib/currentUser";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	// const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	// const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname.startsWith(route));
	const isPublicRoute = publicRoutes.some((route) => {
		return route === nextUrl.pathname || nextUrl.pathname.startsWith(`${route}/`);
	});
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return null;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return null;
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/login", nextUrl));
	}

	if (nextUrl.pathname === "/write") {
		const role = await currentRole();
		if (!role || role !== UserRole.ADMIN) {
			return Response.redirect(new URL("/", nextUrl));
		}
	}

	return null;
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
