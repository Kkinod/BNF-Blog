"use server";

import { type z } from "zod";
import { ResetSchema } from "../schemas";
import { getUserByEmail } from "@/utils/data/user";
import { labels } from "@/views/labels";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { getResetPasswordRatelimit } from "@/utils/ratelimit";
import { handleRateLimit } from "@/utils/rateLimitHelper";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.invalidEmail };
	}

	const { email } = validatedFields.data;

	// Rate limiting
	const ratelimit = getResetPasswordRatelimit();
	const rateLimitResult = await handleRateLimit(ratelimit, {
		email,
		errorMessage: labels.rateLimitExceeded || "",
	});

	if (!rateLimitResult.success) {
		return {
			error: rateLimitResult.error,
			status: rateLimitResult.status,
			waitTimeSeconds: rateLimitResult.waitTimeSeconds,
		};
	}

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser?.password) {
		return { error: labels.errors.emailNotFound };
	}

	const passwordResetToken = await generatePasswordResetToken(email);
	await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

	return { success: labels.resetEmailSend };
};
