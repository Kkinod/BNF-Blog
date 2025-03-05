import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { auth } from "../auth";

import {
	apiAuthPrefix,
	DEFAULT_LOGIN_REDIRECT,
	authRoutes,
	publicRoutes,
	protectedRoutes,
} from "../routes";
import { currentRole } from "./features/auth/utils/currentUser";
import { routes } from "./shared/utils/routes";

export const middleware = auth(async (req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.some((route) => {
		return route === nextUrl.pathname || nextUrl.pathname.startsWith(`${route}/`);
	});
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return;
	}

	if (!isLoggedIn && (isProtectedRoute || !isPublicRoute)) {
		return NextResponse.redirect(new URL(routes.login, nextUrl));
	}

	if (
		nextUrl.pathname === routes.admin ||
		nextUrl.pathname.startsWith(routes.admin) ||
		nextUrl.pathname === routes.write
	) {
		const role = await currentRole();
		if (!role || role !== UserRole.ADMIN) {
			return NextResponse.redirect(new URL(routes.notFound, nextUrl));
		}
	}

	return;
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
