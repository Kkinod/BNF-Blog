import { prisma } from "@/utils/connect";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				accounts: true,
			},
		});

		return user;
	} catch {
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });

		return user;
	} catch {
		return null;
	}
};
