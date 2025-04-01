import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/utils/connect";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import { labels } from "@/shared/utils/labels";
import {
	handleApiError,
	methodNotAllowed,
	createUnauthorizedError,
	createForbiddenError,
	createNotFoundError,
} from "@/shared/utils/api-error-handler";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
	try {
		const session = await currentUser();
		if (!session) {
			throw createUnauthorizedError(labels.errors.invalidCredentials);
		}

		const role = await currentRole();
		if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN) {
			throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
		}

		const { slug } = params;

		const post = await prisma.post.findUnique({
			where: { slug },
		});

		if (!post) {
			throw createNotFoundError(labels.errors.postNotFound);
		}

		return NextResponse.json(post);
	} catch (error) {
		return handleApiError(error);
	}
}

export async function PUT() {
	return methodNotAllowed(["GET"]);
}

export async function DELETE() {
	return methodNotAllowed(["GET"]);
}

export async function PATCH() {
	return methodNotAllowed(["GET"]);
}

export async function POST() {
	return methodNotAllowed(["GET"]);
}
