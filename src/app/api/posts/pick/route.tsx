import { NextResponse, type NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";
import { currentUser, currentRole } from "@/lib/currentUser";

interface PickRequestBody {
	postId: string;
	isPick: boolean;
}

export const GET = async () => {
	try {
		const posts = await prisma.post.findMany({
			where: {
				isPick: true,
				isVisible: true,
			},
			include: {
				user: true,
			},
		});

		return new NextResponse(JSON.stringify(posts), {
			status: 200,
			headers: {
				"Cache-Control": "public, max-age=10, stale-while-revalidate=59",
			},
		});
	} catch (err) {
		console.error("[GET_PICKED_POSTS_ERROR]", err);
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
};

export async function PATCH(req: NextRequest) {
	try {
		const session = await currentUser();
		const role = await currentRole();

		if (!session) {
			console.log("[PICK_POST_AUTH_ERROR] No session");
			return new NextResponse(JSON.stringify({ message: labels.errors.unauthorized }), {
				status: 401,
			});
		}

		if (role !== UserRole.ADMIN) {
			console.log("[PICK_POST_AUTH_ERROR] User is not admin", { userEmail: session.email });
			return new NextResponse(JSON.stringify({ message: labels.errors.forbidden }), {
				status: 403,
			});
		}

		const body = (await req.json()) as PickRequestBody;
		const { postId, isPick } = body;

		const post = await prisma.post.update({
			where: {
				id: postId,
			},
			data: {
				isPick,
			},
		});

		return new NextResponse(JSON.stringify(post), {
			status: 200,
			headers: {
				"Cache-Control": "no-store", // Nie cachujemy odpowiedzi PATCH
			},
		});
	} catch (error) {
		console.error("[UPDATE_POST_PICK_ERROR]", {
			error,
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
		});

		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
}
