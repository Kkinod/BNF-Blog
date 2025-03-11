import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import xss from "xss";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import { COMMENT_LIMITS } from "@/config/constants";
import { getCommentRatelimit } from "@/features/auth/utils/ratelimit";
import { handleRateLimit } from "@/features/auth/utils/rateLimitHelper";
import { xssOptions } from "@/shared/utils/xss-config";
import {
	handleApiError,
	methodNotAllowed,
	createUnauthorizedError,
	createForbiddenError,
	createApiError,
} from "@/shared/utils/api-error-handler";

export interface CommentRequestBody {
	postSlug: string;
	desc: string;
}

// GET ALL COMMENTS OF A POSTS
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const postSlug = searchParams.get("postSlug");

		const comments = await prisma.comment.findMany({
			where: { ...(postSlug && { postSlug }) },
			include: { user: true },
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(comments, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}

// CREATE A COMMENT
export async function POST(req: NextRequest) {
	try {
		const session = await currentUser();
		if (!session) {
			throw createUnauthorizedError(labels.errors.invalidCredentials);
		}

		const role = await currentRole();
		if (role !== UserRole.ADMIN) {
			throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
		}

		// Rate limiting
		const ratelimit = getCommentRatelimit();
		const rateLimitResult = await handleRateLimit(ratelimit, {
			identifier: `${session.email}`,
			errorMessage: labels.rateLimitExceeded || "Rate limit exceeded. Please try again later.",
		});

		if (!rateLimitResult.success) {
			const headers = new Headers();
			headers.set("Retry-After", rateLimitResult.waitTimeSeconds?.toString() || "60");

			return NextResponse.json(
				{
					error: rateLimitResult.error,
					waitTimeSeconds: rateLimitResult.waitTimeSeconds,
				},
				{
					status: 429,
					headers,
				},
			);
		}

		const body = (await req.json()) as CommentRequestBody;
		const userEmail = session.email || "";

		if (!body.desc || !body.desc.trim()) {
			throw createApiError(labels.commentEmpty, 400, "ValidationError");
		}

		if (body.desc.length > COMMENT_LIMITS.MAX_LENGTH) {
			throw createApiError(labels.commentTooLong, 400, "ValidationError");
		}

		const sanitizedDesc = xss(body.desc, xssOptions);

		const comment = await prisma.comment.create({
			data: {
				...body,
				desc: sanitizedDesc,
				userEmail,
			},
		});

		return NextResponse.json(comment, { status: 200 });
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
