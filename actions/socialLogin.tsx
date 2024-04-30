"use server";
import { AuthError } from "next-auth";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";

export const login = async (provider: "google" | "github") => {
	try {
		await signIn(provider, {
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" };
				default:
					return { error: "Something went wrong!" };
			}
		}

		throw error;
	}
};
