import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/utils/connect";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import {
	handleApiError,
	methodNotAllowed,
	createUnauthorizedError,
	createForbiddenError,
} from "@/shared/utils/api-error-handler";

export interface VisibilityRequestBody {
	postId: string;
	isVisible: boolean;
}

export async function PATCH(req: NextRequest) {
	try {
		const session = await currentUser();
		const role = await currentRole();

		if (!session) {
			throw createUnauthorizedError();
		}

		if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN) {
			throw createForbiddenError();
		}

		const body = (await req.json()) as VisibilityRequestBody;
		const { postId, isVisible } = body;

		const post = await prisma.post.update({
			where: {
				id: postId,
			},
			data: {
				isVisible,
			},
		});

		return NextResponse.json(post, {
			status: 200,
			headers: {
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}

export async function GET() {
	return methodNotAllowed(["PATCH"]);
}

export async function POST() {
	return methodNotAllowed(["PATCH"]);
}

export async function PUT() {
	return methodNotAllowed(["PATCH"]);
}

export async function DELETE() {
	return methodNotAllowed(["PATCH"]);
}
