import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credential from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas";
import { prisma } from "@/shared/utils/connect";
import { getUserById, getUserByEmail } from "@/features/auth/utils/data/user";
import { getTwoFactorConfirmationByUserId } from "@/features/auth/utils/data/twoFactorConfirmation";
import { getAccountByUserId } from "@/features/auth/utils/data/accout";

export type ExtendedUser = DefaultSession["user"] & {
	role: UserRole;
	isTwoFactorEnabled: boolean;
	isOAuth: boolean;
};

declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
		error: "/error",
	},
	trustHost: true,
	cookies: {
		callbackUrl: {
			name:
				process.env.NODE_ENV === "production"
					? "__Secure-next-auth.callback-url"
					: "next-auth.callback-url",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: true,
			},
		},
		csrfToken: {
			name:
				process.env.NODE_ENV === "production"
					? "__Host-next-auth.csrf-token"
					: "next-auth.csrf-token",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: true,
			},
		},
	},
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Github({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Credential({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);
					if (!user || !user.password) return null;

					// const bcrypt = await import("bcryptjs");
					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (passwordsMatch) return user;
				}

				return null;
			},
		}),
	],
	events: {
		async linkAccount({ user }) {
			await prisma.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// Allow 0Auth without email verification
			if (account?.provider !== "credentials") return true;

			const existingUser = await getUserById(user.id as string);

			// Prevent sign in without email verification
			if (!existingUser?.emailVerified) return false;

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

				if (!twoFactorConfirmation) return false;

				// Delete two factor confirmation for next sign in
				await prisma.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}

			return true;
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as "ADMIN" | "USER";
			}

			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email as string;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.isOAuth = !!existingAccount;
			token.name = existingUser.name;
			token.email = existingUser.email;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

			return token;
		},
	},
});
