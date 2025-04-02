import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { currentRole } from "@/features/auth/utils/currentUser";
import {
	handleApiError,
	methodNotAllowed,
	createForbiddenError,
} from "@/shared/utils/api-error-handler";
import { labels } from "@/shared/utils/labels";
import {
	getRegistrationState,
	saveRegistrationState,
} from "@/features/settings/utils/settings.service";

export async function GET() {
	try {
		const isRegistrationEnabled = await getRegistrationState();

		return NextResponse.json({
			isRegistrationEnabled,
		});
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST(request: Request) {
	try {
		const role = await currentRole();

		if (role !== UserRole.SUPERADMIN) {
			throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
		}

		const body = (await request.json()) as { isEnabled?: boolean };
		const isEnabled = body.isEnabled;

		if (typeof isEnabled !== "boolean") {
			return NextResponse.json({ error: labels.errors.isEnablemMustBeABoolean }, { status: 400 });
		}

		await saveRegistrationState(isEnabled);

		return NextResponse.json({
			success: isEnabled ? labels.registrationEnabledSuccess : labels.registrationDisabledSuccess,
			isRegistrationEnabled: isEnabled,
		});
	} catch (error) {
		return handleApiError(error);
	}
}

export async function PUT() {
	return methodNotAllowed(["GET", "POST"]);
}

export async function DELETE() {
	return methodNotAllowed(["GET", "POST"]);
}

export async function PATCH() {
	return methodNotAllowed(["GET", "POST"]);
}
