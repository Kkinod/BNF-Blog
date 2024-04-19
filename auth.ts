// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { getServerSession } from "next-auth";
// import prisma from "./connect";

// export const authOptions = {
// 	adapter: PrismaAdapter(prisma),
// 	providers: [
// 		GoogleProvider({
// 			clientId: process.env.GOOGLE_ID as string,
// 			clientSecret: process.env.GOOGLE_SECRET as string,
// 		}),
// 		GithubProvider({
// 			clientId: process.env.GITHUB_ID as string,
// 			clientSecret: process.env.GITHUB_SECRET as string,
// 		}),
// 	],
// };

// export const getAuthSession = () => getServerSession(authOptions);
import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type UserRole } from "@prisma/client";
import authConfig from "./auth.config";
import { getUserById } from "@/utils/data/user";
import prisma from "@/utils/connect";

export type ExtendedUser = DefaultSession["user"] & {
	role: UserRole;
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
	pages: {
		signIn: "/login",
		error: "/error",
	},
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

			// TODO: Add 2FA check

			return true;
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as "ADMIN" | "USER";
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.role = existingUser.role;

			return token;
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
});
