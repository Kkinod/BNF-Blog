import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = (): PrismaClient => {
	return new PrismaClient();
};

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
