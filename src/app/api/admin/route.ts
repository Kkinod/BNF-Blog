import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { currentRole } from "@/features/auth/utils/currentUser";
import {
	handleApiError,
	methodNotAllowed,
	createForbiddenError,
} from "@/shared/utils/api-error-handler";
import { labels } from "@/shared/utils/labels";

/**
 * Handles GET requests to the admin endpoint.
 * Checks if the user has ADMIN role and returns appropriate status.
 */
export async function GET(_request: Request) {
	try {
		// Get user role - main business logic
		const role = await currentRole();

		// Check permissions - only ADMIN has access
		if (role === UserRole.ADMIN) {
			return NextResponse.json({
				authorized: true,
				message: labels.adminOnlyApiRoute,
			});
		}

		// No permissions - create and throw specialized error
		throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
	} catch (error) {
		// Central error handling
		return handleApiError(error);
	}
}

/**
 * Handling other HTTP methods
 */
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
