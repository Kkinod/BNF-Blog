import { NextResponse, NextRequest } from "next/server";
import { Session } from "next-auth";
import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";

import authConfig from "../auth.config";
import { apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from "../routes";
import { currentRole } from "./lib/currentUser";

const { auth } = NextAuth(authConfig);

const middleware = auth(async function middleware(
	req: NextRequest & { auth?: Session | null },
): Promise<Response | void> {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.some((route) => {
		return route === nextUrl.pathname || nextUrl.pathname.startsWith(`${route}/`);
	});
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return;
	}

	if (!isLoggedIn && !isPublicRoute) {
		return NextResponse.redirect(new URL("/login", nextUrl));
	}

	if (
		nextUrl.pathname === "/admin" ||
		nextUrl.pathname.startsWith("/admin/") ||
		nextUrl.pathname === "/write"
	) {
		const role = await currentRole();
		if (!role || role !== UserRole.ADMIN) {
			return NextResponse.redirect(new URL("/404", nextUrl));
		}
	}

	return;
});

export default middleware;

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
