import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/utils/connect";
import { type ListPost } from "@/app/api/posts/route";
import { currentRole } from "@/features/auth/utils/currentUser";
import { handleApiError, methodNotAllowed } from "@/shared/utils/api-error-handler";

export interface SearchPostsResponse {
	posts: ListPost[];
	count: number;
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const query = searchParams.get("query") || "";
		const category = searchParams.get("category") || null;

		// Check if user is admin to determine if hidden posts should be included
		const role = await currentRole();
		const isAdmin = role === UserRole.ADMIN;

		const postsQuery = {
			where: {
				title: {
					contains: query,
					mode: "insensitive" as const,
				},
				// Filter by category if provided
				...(category && { catSlug: category }),
				// Only admins can see hidden posts
				...(isAdmin ? {} : { isVisible: true }),
			},
			orderBy: {
				createdAt: "desc" as const,
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
		};

		const countQuery = {
			where: postsQuery.where,
		};

		// Execute queries in parallel for better performance
		const [posts, count] = await prisma.$transaction([
			prisma.post.findMany(postsQuery),
			prisma.post.count(countQuery),
		]);

		// Set cache control headers for performance
		// Use shorter cache time since search results change frequently
		return NextResponse.json(
			{ posts, count },
			{
				status: 200,
				headers: {
					"Cache-Control": "public, max-age=60, stale-while-revalidate=30",
				},
			},
		);
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

export async function PATCH() {
	return methodNotAllowed(["GET"]);
}

export async function DELETE() {
	return methodNotAllowed(["GET"]);
}
