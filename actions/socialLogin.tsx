"use server";
import { AuthError } from "next-auth";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { labels } from "@/shared/utils/labels";

export const login = async (provider: "google" | "github") => {
	try {
		await signIn(provider, {
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: labels.errors.invalidCredentials };
				case "OAuthAccountNotLinked":
					return { error: labels.errors.emailIsUsedWithDifferentProvider };
				case "CallbackRouteError":
					if (
						error.cause &&
						typeof error.cause === "object" &&
						"name" in error.cause &&
						error.cause.name === "RegistrationDisabledError"
					) {
						return { error: labels.registrationCurrentlyDisabled };
					}
					return { error: labels.errors.somethingWentWrong };
				default:
					return { error: labels.errors.somethingWentWrong };
			}
		}

		if (error instanceof Error && error.name === "RegistrationDisabledError") {
			return { error: labels.registrationCurrentlyDisabled };
		}

		throw error;
	}
};
