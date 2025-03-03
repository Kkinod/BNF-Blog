"use server";

import { labels } from "@/shared/utils/labels";
import { getUserByEmail } from "@/features/auth/utils/data/user";
import { generateVerificationToken } from "@/features/auth/utils/tokens";
import { sendVerificationEmail } from "@/features/auth/utils/mail";
import { getResendVerificationEmailRatelimit } from "@/features/auth/utils/ratelimit";
import { handleRateLimit } from "@/features/auth/utils/rateLimitHelper";
import { formatTimeMMSS } from "@/shared/utils/timeFormat";

type ResendVerificationSuccess = {
	success: string;
	error?: never;
	status?: never;
	waitTimeSeconds?: never;
};

type ResendVerificationError = {
	error: string;
	success?: never;
	status?: number;
	waitTimeSeconds?: number;
};

type ResendVerificationResult = ResendVerificationSuccess | ResendVerificationError;

export const resendVerificationEmail = async (email: string): Promise<ResendVerificationResult> => {
	if (!email) {
		return { error: labels.errors.emailIsRequired };
	}

	const ratelimit = getResendVerificationEmailRatelimit();
	const rateLimitResult = await handleRateLimit(ratelimit, {
		email,
		errorMessage: labels.errors.resendVerificationRateLimitExceeded || "",
		formatTime: formatTimeMMSS,
	});

	if (!rateLimitResult.success) {
		return {
			error: rateLimitResult.error || "",
			status: rateLimitResult.status,
			waitTimeSeconds: rateLimitResult.waitTimeSeconds,
		};
	}

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { success: labels.verificationEmailSent };
	}

	if (existingUser.emailVerified) {
		return { error: labels.errors.emailAlreadyVerified };
	}

	const verificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(verificationToken.email, verificationToken.token);

	return {
		success: labels.verificationEmailSent,
	};
};
