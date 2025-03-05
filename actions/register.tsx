"use server";

import { type z } from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "../schemas";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { getUserByEmail } from "@/features/auth/utils/data/user";
import { generateVerificationToken } from "@/features/auth/utils/tokens";
import { sendVerificationEmail } from "@/features/auth/utils/mail";
import { getRegisterRatelimit } from "@/features/auth/utils/ratelimit";
import { handleRateLimit } from "@/features/auth/utils/rateLimitHelper";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const saltRounds = 10;
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.errorLogin };
	}

	const { email, password, name } = validatedFields.data;

	const ratelimit = getRegisterRatelimit();
	const rateLimitResult = await handleRateLimit(ratelimit, {
		email,
		errorMessage: labels.registerRateLimitExceeded || "",
	});

	if (!rateLimitResult.success) {
		return {
			error: rateLimitResult.error,
			status: rateLimitResult.status,
			waitTimeSeconds: rateLimitResult.waitTimeSeconds,
		};
	}

	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: labels.errors.emailAlreadyInUse };
	}

	await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	const verificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(verificationToken.email, verificationToken.token);

	return {
		success: labels.confirmationEmailSent,
		verification: true,
	};
};
