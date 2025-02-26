import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import xss from "xss";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";
import { currentUser, currentRole } from "@/lib/currentUser";
import { COMMENT_LIMITS } from "@/config/constants";
import { getRatelimit } from "@/utils/ratelimit";

interface CommentRequestBody {
	postSlug: string;
	desc: string;
}

//GET ALL COMMENTS OF A POSTS
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

//CREATE A COMMENT
export const POST = async (req: NextRequest) => {
	const startTime = Date.now();
	const session = await currentUser();
	const role = await currentRole();

	if (!session) {
		return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
	}

	if (role !== UserRole.ADMIN) {
		return new NextResponse(null, { status: 403 });
	}

	// Rate limiting
	const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
	const userIdentifier = `${ip}:${session.email || "anonymous"}`;

	try {
		const ratelimit = getRatelimit();
		const { success, reset, remaining } = await ratelimit.limit(userIdentifier);

		if (!success) {
			const waitTimeSeconds = Math.ceil((reset - Date.now()) / 1000);
			return new NextResponse(
				JSON.stringify({
					message: labels.rateLimitExceeded || "Rate limit exceeded. Please try again later.",
					remaining,
					reset,
					waitTimeSeconds,
				}),
				{
					status: 429,
					headers: {
						"Retry-After": waitTimeSeconds.toString(),
						"X-RateLimit-Remaining": remaining.toString(),
						"X-RateLimit-Reset": reset.toString(),
					},
				},
			);
		}
	} catch (error) {
		console.error("Rate limit error:", error);
		// Continue with the request even if rate limiting fails
	}

	try {
		const body = (await req.json()) as CommentRequestBody;
		const userEmail = session.email || "";

		//Check if the comment is not empty
		if (!body.desc || !body.desc.trim()) {
			return new NextResponse(JSON.stringify({ message: labels.commentEmpty }), { status: 400 });
		}

		//Comment length check
		if (body.desc.length > COMMENT_LIMITS.MAX_LENGTH) {
			return new NextResponse(JSON.stringify({ message: labels.commentTooLong }), { status: 400 });
		}

		const sanitizedDesc = xss(body.desc);

		const comment = await prisma.comment.create({
			data: {
				...body,
				desc: sanitizedDesc,
				userEmail,
			},
		});

		console.log(`Request processing time: ${Date.now() - startTime}ms`);
		return new NextResponse(JSON.stringify(comment), { status: 200 });
	} catch (err) {
		console.error(`Error after ${Date.now() - startTime}ms:`, err);
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
};
