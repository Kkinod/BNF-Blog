import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { currentRole } from "@/features/auth/utils/currentUser";
import {
	handleApiError,
	methodNotAllowed,
	createForbiddenError,
} from "@/shared/utils/api-error-handler";
import { labels } from "@/shared/utils/labels";

export async function GET(_request: Request) {
	try {
		const role = await currentRole();

		if (role === UserRole.ADMIN || role === UserRole.SUPERADMIN) {
			return NextResponse.json({
				authorized: true,
				message: labels.adminOnlyApiRoute,
			});
		}

		throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST() {
	return methodNotAllowed(["GET"]);
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
