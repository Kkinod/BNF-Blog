"use server";

import { prisma } from "@/utils/connect";
import { getUserByEmail } from "@/utils/data/user";
import { getVerificationTokenByToken } from "@/utils/data/verificationToken";
import { labels } from "@/views/labels";

export const newVerification = async (token: string) => {
	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) {
		return { error: labels.errors.tokenDoesNotExist };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: labels.errors.tokenHasExpired };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: labels.errors.emailDesNotExist };
	}

	await prisma.user.update({
		where: { id: existingUser.id },
		data: { emailVerified: new Date(), email: existingToken.email },
	});

	await prisma.verificationToken.delete({
		where: { identifier: existingToken.identifier },
	});

	return { success: labels.emailVerified };
};
