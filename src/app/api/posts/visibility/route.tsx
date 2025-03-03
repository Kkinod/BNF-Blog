import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/utils/connect";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import { labels } from "@/shared/utils/labels";

interface VisibilityRequestBody {
	postId: string;
	isVisible: boolean;
}

export async function PATCH(req: NextRequest) {
	try {
		const session = await currentUser();
		const role = await currentRole();

		if (!session) {
			return new NextResponse(JSON.stringify({ message: labels.errors.unauthorized }), {
				status: 401,
			});
		}

		if (role !== UserRole.ADMIN) {
			return new NextResponse(JSON.stringify({ message: labels.errors.forbidden }), {
				status: 403,
			});
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

		return new NextResponse(JSON.stringify(post), { status: 200 });
	} catch (error) {
		console.error("[UPDATE_POST_VISIBILITY]", error);
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
}
