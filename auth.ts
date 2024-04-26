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
import prisma from "@/utils/connect";
import { getUserById } from "@/utils/data/user";
import { getTwoFactorConfirmationByUserId } from "@/utils/data/twoFactorConfirmation";

export type ExtendedUser = DefaultSession["user"] & {
	role: UserRole;
	isTwoFactorEnabled: boolean;
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

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

				console.log({ twoFactorConfirmation });

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

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

			return token;
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
});
