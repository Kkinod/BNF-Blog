import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import xss from "xss";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";
import { currentUser, currentRole } from "@/lib/currentUser";
import { COMMENT_LIMITS } from "@/config/constants";
import { commentRatelimit } from "@/utils/ratelimit";

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
	const session = await currentUser();
	const role = await currentRole();

	if (!session) {
		return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
	}

	if (role !== UserRole.ADMIN) {
		return new NextResponse(null, { status: 403 });
	}

	//rate limiting
	const ip = req.ip || "127.0.0.1";
	const userIdentifier = `${ip}:${session.email || "anonymous"}`;

	try {
		const { success, reset, remaining } = await commentRatelimit.limit(userIdentifier);

		if (!success) {
			const waitTimeSeconds = Math.ceil((reset - Date.now()) / 1000);

			return new NextResponse(
				JSON.stringify({
					message: labels.rateLimitExceeded || "Rate limit exceeded. Please try again later.",
					remaining,
					reset,
					waitTimeSeconds,
				}),
				{ status: 429 },
			);
		}
	} catch (error) {
		console.error("Rate limit error:", error);
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

		return new NextResponse(JSON.stringify(comment), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
};
