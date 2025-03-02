"use server";

import { type z } from "zod";
import { headers } from "next/headers";
import { ResetSchema } from "../schemas";
import { getUserByEmail } from "@/utils/data/user";
import { labels } from "@/views/labels";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { getResetPasswordRatelimit } from "@/utils/ratelimit";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.invalidEmail };
	}

	const { email } = validatedFields.data;

	// Rate limiting
	const headersList = headers();
	const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
	const identifier = `${ip}:${email}`;

	try {
		const ratelimit = getResetPasswordRatelimit();
		const { success, reset } = await ratelimit.limit(identifier);

		if (!success) {
			const waitTimeSeconds = Math.ceil((reset - Date.now()) / 1000);
			return {
				error: labels.rateLimitExceeded?.replace("{time}", `${waitTimeSeconds}s`),
				status: 429,
				waitTimeSeconds,
			};
		}
	} catch (error) {
		console.error("Rate limit error:", error);
	}

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser?.password) {
		return { error: labels.errors.emailNotFound };
	}

	const passwordResetToken = await generatePasswordResetToken(email);
	await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

	return { success: labels.resetEmailSend };
};
