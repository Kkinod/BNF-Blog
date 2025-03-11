import { NextResponse } from "next/server";
import { prisma } from "@/shared/utils/connect";
import { handleApiError, methodNotAllowed } from "@/shared/utils/api-error-handler";

export async function GET() {
	try {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

		const posts = await prisma.post.findMany({
			take: 3,
			where: {
				createdAt: {
					gte: oneYearAgo,
				},
				isVisible: true,
			},
			orderBy: {
				views: "desc",
			},
			include: {
				user: true,
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
