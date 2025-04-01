import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { type Posts } from "../route";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { currentRole } from "@/features/auth/utils/currentUser";
import {
	handleApiError,
	methodNotAllowed,
	createNotFoundError,
} from "@/shared/utils/api-error-handler";

export interface User {
	id: string;
	name: string | null;
	email: string | null;
	emailVerified: Date | null;
	image: string | null;
}

export interface Post extends Posts {
	user: User;
}

interface Params {
	slug: string;
}

//GET SINGLE POST
export async function GET(req: Request, { params }: { params: Params }) {
	try {
		const { slug } = params;
		const role = await currentRole();
		const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPERADMIN;

		// For admin users, don't filter by visibility
		const postWhereCondition = isAdmin ? { slug } : { slug, isVisible: true };

		const post = await prisma.post.findUnique({
			where: postWhereCondition,
			include: { user: true },
		});

		if (!post) {
			throw createNotFoundError(labels.errors.postNotFound);
		}

		// Only increment views for non-admin users
		if (!isAdmin) {
			await prisma.post.update({
				where: { slug },
				data: { views: { increment: 1 } },
			});
		}

		return NextResponse.json(post, { status: 200 });
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
