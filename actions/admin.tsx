"use server";

import { UserRole } from "@prisma/client";
import { currentRole } from "@/features/auth/utils/currentUser";
import { labels } from "@/shared/utils/labels";

export const admin = async () => {
	const role = await currentRole();

	if (role === UserRole.ADMIN) {
		return { success: labels.allowed };
	}

	return { error: labels.errors.forbidden };
};
