import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/utils/data/verificationToken";
import prisma from "@/utils/connect";
import { getPasswordResetTokenByEmail } from "@/utils/data/paswordResetToken";

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
	const expires = new Date(new Date().getTime() + 3600 * 1000); // one hour

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
