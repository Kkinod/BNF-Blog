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

interface CommentRequestBody {
	postSlug: string;
	desc: string;
}

// GET ALL COMMENTS OF A POSTS
export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);

	const postSlug = searchParams.get("postSlug");

	try {
		const comments = await prisma.comment.findMany({
			where: { ...(postSlug && { postSlug }) },
			include: { user: true },
			orderBy: {
				createdAt: "desc",
			},
		});

		return new NextResponse(JSON.stringify(comments), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
	}
};

// CREATE A COMMENT
export const POST = async (req: NextRequest) => {
	const session = await currentUser();
	const role = await currentRole();

	if (!session) {
		return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
	}

	if (role !== UserRole.ADMIN) {
		return new NextResponse(null, { status: 403 });
	}

	// Rate limiting
	const ratelimit = getCommentRatelimit();
	const rateLimitResult = await handleRateLimit(ratelimit, {
		identifier: `${session.email}`,
		errorMessage: labels.rateLimitExceeded || "Rate limit exceeded. Please try again later.",
	});

	if (!rateLimitResult.success) {
		return new NextResponse(
			JSON.stringify({
				message: rateLimitResult.error,
				waitTimeSeconds: rateLimitResult.waitTimeSeconds,
			}),
			{
				status: 429,
				headers: {
					"Retry-After": rateLimitResult.waitTimeSeconds?.toString() || "60",
				},
			},
		);
	}

	try {
		const body = (await req.json()) as CommentRequestBody;
		const userEmail = session.email || "";

		if (!body.desc || !body.desc.trim()) {
			return new NextResponse(JSON.stringify({ message: labels.commentEmpty }), { status: 400 });
		}

		if (body.desc.length > COMMENT_LIMITS.MAX_LENGTH) {
			return new NextResponse(JSON.stringify({ message: labels.commentTooLong }), { status: 400 });
		}

		const sanitizedDesc = xss(body.desc, xssOptions);

		const comment = await prisma.comment.create({
			data: {
				...body,
				desc: sanitizedDesc,
				userEmail,
			},
		});

		return new NextResponse(JSON.stringify(comment), { status: 200 });
	} catch (err) {
		console.error(err);
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
};
