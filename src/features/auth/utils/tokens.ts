import crypt from "crypto";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/shared/utils/connect";
import { getVerificationTokenByEmail } from "@/features/auth/utils/data/verificationToken";
import { getPasswordResetTokenByEmail } from "@/features/auth/utils/data/paswordResetToken";
import { getTwoFactorTokenByEmail } from "@/features/auth/utils/data/twoFactorToken";

export const generatePasswordResetToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000); // one hour

	const existingToken = await getPasswordResetTokenByEmail(email);

	if (existingToken) {
		await prisma.passwordResetToken.delete({
			where: { id: existingToken.id },
		});
	}

	const passwordResetToken = await prisma.passwordResetToken.create({
		data: {
			email,
			token,
			expires,
		},
	});

	return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000 * 48); // 2 days

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await prisma.verificationToken.delete({
			where: { identifier: existingToken.identifier },
		});
	}

	const verificationToken = await prisma.verificationToken.create({
		data: {
			email,
			token,
			expires,
		},
	});

	return verificationToken;
};

export const generateTwoFactorToken = async (email: string) => {
	const token = crypt.randomInt(100_000, 1_000_000).toString();
	const expires = new Date(new Date().getTime() + 300 * 1000); // 5 minutes

	const existingToken = await getTwoFactorTokenByEmail(email);

	if (existingToken) {
		await prisma.twoFactorToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const twoFactorToken = await prisma.twoFactorToken.create({
		data: {
			email,
			token,
			expires,
		},
	});

	return twoFactorToken;
};
