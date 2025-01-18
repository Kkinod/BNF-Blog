import { prisma } from "@/utils/connect";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
	try {
		const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
			where: { userId },
		});

		return twoFactorConfirmation;
	} catch {
		return null;
	}
};
