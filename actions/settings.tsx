"use server";

import { type z } from "zod";
import { revalidatePath } from "next/cache";
import { type SettingsSchema } from "../schemas";
import prisma from "@/utils/connect";
import { getUserById } from "@/utils/data/user";
import { currentUser } from "@/lib/currentUser";
import { labels } from "@/views/labels";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();

	if (!user) {
		return { error: labels.errors.unauthorized };
	}

	const dbUser = await getUserById(user.id as string);

	if (!dbUser) {
		return { error: labels.errors.unauthorized };
	}

	await prisma.user.update({
		where: { id: dbUser.id },
		data: {
			...values,
		},
	});

	revalidatePath("/");
	return { success: labels.settingsUdpated };
};
