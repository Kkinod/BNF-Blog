"use server";

import { type z } from "zod";
import { headers } from "next/headers";
import { RegisterSchema } from "../schemas";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";
import { getUserByEmail } from "@/utils/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getRegisterRatelimit } from "@/utils/ratelimit";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const saltRounds = 10;
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.errorLogin };
	}

	const { email, password, name } = validatedFields.data;

	// Rate limiting
	const headersList = headers();
	const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
	const identifier = `${ip}`;

	try {
		const ratelimit = getRegisterRatelimit();
		const { success, reset } = await ratelimit.limit(identifier);

		if (!success) {
			const waitTimeSeconds = Math.ceil((reset - Date.now()) / 1000);
			return {
				error: labels.registerRateLimitExceeded,
				status: 429,
				waitTimeSeconds,
			};
		}
	} catch (error) {
		console.error("Rate limit error:", error);
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

	return { success: labels.successRegister };
};
