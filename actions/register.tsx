"use server";

import { type z } from "zod";
import { RegisterSchema } from "../schemas";
import { labels } from "@/views/labels";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errorLogin };
	}

	return { success: labels.successLogin };
};
