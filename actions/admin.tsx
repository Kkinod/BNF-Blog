"use server";

import { UserRole } from "@prisma/client";
import { currentRole } from "@/lib/currentUser";
import { labels } from "@/views/labels";

export const admin = async () => {
	const role = await currentRole();

	if (role === UserRole.ADMIN) {
		return { success: labels.allowed };
	}

	return { error: labels.errors.forbidden };
};
