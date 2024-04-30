"use server";

import { type z } from "zod";
import { AuthError } from "next-auth";
import { LoginSchema } from "../schemas";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import prisma from "@/utils/connect";
import { labels } from "@/views/labels";
import { getUserByEmail } from "@/utils/data/user";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/utils/data/twoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/utils/data/twoFactorConfirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.errorLogin };
	}

	const { email, password, code } = validatedFields.data;

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

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const bcrypt = require("bcrypt") as typeof import("bcrypt");
		const passwordsMatch = await bcrypt.compare(password, existingUser.password);

		if (!passwordsMatch) {
			return { error: labels.errors.invalidCredentials };
		}

		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return { error: labels.errors.invalidCode };
			}

			if (twoFactorToken.token !== code) {
				return { error: labels.errors.invalidCode };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: labels.errors.codeExpired };
			}

			await prisma.twoFactorToken.delete({
				where: { id: twoFactorToken.id },
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

			if (existingConfirmation) {
				await prisma.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});
			}

			await prisma.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

			return { twoFactor: true };
		}
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
