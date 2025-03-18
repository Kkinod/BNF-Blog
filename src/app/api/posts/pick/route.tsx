import { NextResponse, type NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import {
	handleApiError,
	methodNotAllowed,
	createUnauthorizedError,
	createForbiddenError,
} from "@/shared/utils/api-error-handler";

export interface PickRequestBody {
	postId: string;
	isPick: boolean;
}

export interface PickPost {
	id: string;
	createdAt: string;
	updatedAt: string | null;
	slug: string;
	title: string;
	img: string | null;
	views: number;
	isVisible: boolean;
	isPick: boolean;
	catSlug: string;
	userEmail: string;
	user: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
	};
}

export async function GET() {
	try {
		const posts = await prisma.post.findMany({
			where: {
				isPick: true,
				isVisible: true,
			},
			select: {
				id: true,
				createdAt: true,
				updatedAt: true,
				slug: true,
				title: true,
				img: true,
				views: true,
				isVisible: true,
				isPick: true,
				catSlug: true,
				userEmail: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
			},
		});

		return NextResponse.json(posts, {
			status: 200,
			headers: {
				"Cache-Control": "public, max-age=10, stale-while-revalidate=59",
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const session = await currentUser();
		if (!session) {
			throw createUnauthorizedError(labels.errors.unauthorized);
		}

		const role = await currentRole();
		if (role !== UserRole.ADMIN) {
			throw createForbiddenError(labels.errors.forbidden);
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

export async function POST() {
	return methodNotAllowed(["GET", "PATCH"]);
}

export async function PUT() {
	return methodNotAllowed(["GET", "PATCH"]);
}

export async function DELETE() {
	return methodNotAllowed(["GET", "PATCH"]);
}
