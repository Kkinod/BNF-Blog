"use server";

import bcrypt from "bcrypt";
import { type z } from "zod";
import { RegisterSchema } from "../schemas";
import prisma from "@/utils/connect";
import { labels } from "@/views/labels";
import { getUserByEmail } from "@/utils/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const saltRounds = 10;
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errorLogin };
	}

	const { email, password, name } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: labels.emailAlreadyInUse };
	}

	await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	return { success: labels.successRegister };
};
