"use server";

import { type z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { type SettingsSchema } from "../schemas";
import { prisma } from "@/shared/utils/connect";
import { getUserByEmail, getUserById } from "@/features/auth/utils/data/user";
import { currentUser } from "@/features/auth/utils/currentUser";
import { labels } from "@/shared/utils/labels";
import { generateVerificationToken } from "@/features/auth/utils/tokens";
import { sendVerificationEmail } from "@/features/auth/utils/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();
	const saltRounds = 10;

	if (!user) {
		return { error: labels.errors.unauthorized };
	}

	const dbUser = await getUserById(user.id as string);

	if (!dbUser) {
		return { error: labels.errors.unauthorized };
	}

	// We remove the confirmNewPassword field, which is not needed in the database
	values.confirmNewPassword = undefined;

	// Always set email to undefined to prevent changing it
	values.email = undefined;

	if (user.isOAuth) {
		values.password = undefined;
		values.newPassword = undefined;
		values.isTwoFactorEnabled = false;
	}

	if (values.newPassword) {
		if (!values.password) {
			return { error: labels.errors.passwordIsRequired };
		}

		if (!dbUser.password) {
			return { error: labels.errors.incorrectPassword };
		}

		const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

		if (!passwordMatch) {
			return { error: labels.errors.incorrectPassword };
		}

		const hashedPassword = await bcrypt.hash(values.newPassword, saltRounds);

		values.password = hashedPassword;
		values.newPassword = undefined;
	} else if (values.password) {
		return { error: labels.errors.passwordAndNewPasswordIsRequired };
	}

	try {
		await prisma.user.update({
			where: { id: dbUser.id },
			data: {
				...values,
			},
		});

		revalidatePath("/");
		return { success: labels.settingsUdpated };
	} catch (error) {
		console.error("Settings update error:", error);
		return { error: labels.errors.somethingWentWrong };
	}
};
