"use server";

import { type z } from "zod";
import { RegisterSchema } from "../schemas";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";
import { getUserByEmail } from "@/utils/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getRegisterRatelimit } from "@/utils/ratelimit";
import { handleRateLimit } from "@/utils/rateLimitHelper";

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

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const bcrypt = require("bcrypt") as typeof import("bcrypt");
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
