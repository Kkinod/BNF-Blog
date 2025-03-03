"use server";

import { type z } from "zod";
import { NewPasswordSchema } from "../schemas";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { getPasswordResetTokenByToken } from "@/features/auth/utils/data/paswordResetToken";
import { getUserByEmail } from "@/features/auth/utils/data/user";

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token?: string | null,
) => {
	const saltRounds = 10;

	if (!token) {
		return { error: labels.errors.missingToken };
	}

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errors.errorLogin };
	}

	const { password } = validatedFields.data;

	const existingToken = await getPasswordResetTokenByToken(token);

	if (!existingToken) {
		return { error: labels.errors.errorToken };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: labels.errors.tokenHasExpired };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: labels.errors.emailDesNotExist };
	}

	const bcrypt = require("bcrypt");
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	await prisma?.user.update({
		where: { id: existingUser.id },
		data: { password: hashedPassword },
	});

	await prisma.passwordResetToken.delete({
		where: { id: existingToken.id },
	});

	return { success: labels.passwordUpdated };
};
