"use server";

import { type z } from "zod";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { LoginSchema } from "../schemas";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { getUserByEmail } from "@/features/auth/utils/data/user";
import { generateVerificationToken, generateTwoFactorToken } from "@/features/auth/utils/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/features/auth/utils/mail";
import { getTwoFactorTokenByEmail } from "@/features/auth/utils/data/twoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/features/auth/utils/data/twoFactorConfirmation";
import { getLoginRatelimit } from "@/features/auth/utils/ratelimit";
import { handleRateLimit } from "@/features/auth/utils/rateLimitHelper";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.errorLogin };
	}

	const { email, password, code } = validatedFields.data;

	const ratelimit = getLoginRatelimit();
	const rateLimitResult = await handleRateLimit(ratelimit, {
		email,
		errorMessage: labels.loginRateLimitExceeded || "",
	});

	if (!rateLimitResult.success) {
		return {
			error: rateLimitResult.error,
			status: rateLimitResult.status,
			waitTimeSeconds: rateLimitResult.waitTimeSeconds,
		};
	}

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email) {
		return { error: labels.errors.invalidCredentials };
	}

	if (!existingUser.password) {
		return { error: labels.errors.invalidCredentials };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(existingUser.email);

		await sendVerificationEmail(verificationToken.email, verificationToken.token);

		return { success: labels.confirmationEmailSent };
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
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

			return {
				twoFactor: true,
				expiresAt: twoFactorToken.expires.getTime(),
			};
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
