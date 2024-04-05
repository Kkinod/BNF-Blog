"use server";

import { type z } from "zod";
import { LoginSchema } from "../schemas";
import { labels } from "@/views/labels";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: labels.errorLogin };
	}

	return { success: labels.successLogin };
};
