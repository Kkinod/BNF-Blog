"use server";

import { type z } from "zod";
import { AuthError } from "next-auth";
import { LoginSchema } from "../schemas";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { labels } from "@/views/labels";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/utils/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.errorLogin };
	}

	const { email, password } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: labels.errors.invalidCredentials };
	}

	// TODO: zabezpieczyć przed powtórynym, natychmiastym wysłaniem emaila!
	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(existingUser.email);

		await sendVerificationEmail(verificationToken.email, verificationToken.token);

		return { success: labels.confirmationEmailSent };
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: labels.errors.invalidCredentials };
				default:
					return { error: labels.errors.somethingWentWrong };
			}
		}

		throw error;
	}
};
