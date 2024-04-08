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
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import prisma from "@/utils/connect";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
});
