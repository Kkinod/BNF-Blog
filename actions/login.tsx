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
import {
	getLoginRatelimit,
	getResendVerificationEmailRatelimit,
} from "@/features/auth/utils/ratelimit";
import { handleRateLimit } from "@/features/auth/utils/rateLimitHelper";
import { SECURITY } from "@/config/constants";

// Response time normalization
const CONSTANT_TIME_DELAY_MS = SECURITY.CONSTANT_AUTH_DELAY_MS;

// Helper function for response time normalization
const addConstantTimeDelay = async () => {
	return new Promise((resolve) => setTimeout(resolve, CONSTANT_TIME_DELAY_MS));
};

export const login = async (values: z.infer<typeof LoginSchema>) => {
	// Start timing the operation for consistent response time
	const startTime = Date.now();

	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		// Add delay to ensure constant response time
		await addConstantTimeDelay();
		return { error: labels.errors.errorLogin };
	}

	const { email, password, code } = validatedFields.data;

	const ratelimit = getLoginRatelimit();
	const rateLimitResult = await handleRateLimit(ratelimit, {
		email,
		errorMessage: labels.loginRateLimitExceeded || "",
	});

	if (!rateLimitResult.success) {
		// Add delay to ensure constant response time
		await addConstantTimeDelay();
		return {
			error: rateLimitResult.error,
			status: rateLimitResult.status,
			waitTimeSeconds: rateLimitResult.waitTimeSeconds,
		};
	}

	const existingUser = await getUserByEmail(email);

	// Perform verification with consistent timing
	const passwordsMatch = existingUser?.password
		? await bcrypt.compare(password, existingUser.password)
		: await bcrypt.compare(password, await bcrypt.hash("dummy", 10)); // Consistent operation timing

	// Normalize response time
	const elapsedTime = Date.now() - startTime;

	// Ensure minimum processing time
	if (elapsedTime < CONSTANT_TIME_DELAY_MS) {
		await new Promise((resolve) => setTimeout(resolve, CONSTANT_TIME_DELAY_MS - elapsedTime));
	}

	if (!existingUser || !existingUser.email || !existingUser.password || !passwordsMatch) {
		return { error: labels.errors.invalidCredentials };
	}

	if (!existingUser.emailVerified) {
		const resendRatelimit = getResendVerificationEmailRatelimit();

		const rateLimitResult = await handleRateLimit(resendRatelimit, {
			identifier: `verification_${existingUser.email}`,
			errorMessage: labels.errors.resendVerificationRateLimitExceeded || "",
		});

		// Ensure we've spent at least CONSTANT_TIME_DELAY_MS since start
		const currentElapsedTime = Date.now() - startTime;
		if (currentElapsedTime < CONSTANT_TIME_DELAY_MS) {
			await new Promise((resolve) =>
				setTimeout(resolve, CONSTANT_TIME_DELAY_MS - currentElapsedTime),
			);
		}

		if (!rateLimitResult.success) {
			return {
				success: labels.confirmationEmailSent,
				verification: true,
				waitTimeSeconds: rateLimitResult.waitTimeSeconds || 0,
			};
		}

		const verificationToken = await generateVerificationToken(existingUser.email);
		await sendVerificationEmail(verificationToken.email, verificationToken.token);

		return {
			success: labels.confirmationEmailSent,
			verification: true,
		};
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		// Ensure we've spent at least CONSTANT_TIME_DELAY_MS since start
		const currentElapsedTime = Date.now() - startTime;
		if (currentElapsedTime < CONSTANT_TIME_DELAY_MS) {
			await new Promise((resolve) =>
				setTimeout(resolve, CONSTANT_TIME_DELAY_MS - currentElapsedTime),
			);
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
		// Ensure we've spent at least CONSTANT_TIME_DELAY_MS since start
		const finalElapsedTime = Date.now() - startTime;
		if (finalElapsedTime < CONSTANT_TIME_DELAY_MS) {
			await new Promise((resolve) =>
				setTimeout(resolve, CONSTANT_TIME_DELAY_MS - finalElapsedTime),
			);
		}

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
