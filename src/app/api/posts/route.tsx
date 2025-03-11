import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/utils/connect";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import { POST_PER_PAGE } from "@/config/constants";
import { labels } from "@/shared/utils/labels";
import {
	handleApiError,
	methodNotAllowed,
	createUnauthorizedError,
	createForbiddenError,
} from "@/shared/utils/api-error-handler";

export interface Posts {
	id: string;
	createdAt: Date;
	slug: string;
	title: string;
	desc: string;
	img: string | null;
	views: number;
	catSlug: string;
	userEmail: string;
	isVisible: boolean;
	isPick: boolean;
}

export interface PostRequestBody {
	title: string;
	desc: string;
	img: string;
	slug: string;
	catSlug: string;
	isVisible: boolean;
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const all = searchParams.get("all");
		const cat = searchParams.get("cat");

		const query = {
			take: all ? undefined : POST_PER_PAGE,
			skip: all ? undefined : POST_PER_PAGE * (parseInt(searchParams.get("page") ?? "1", 10) - 1),
			orderBy: {
				createdAt: "desc" as const,
			},
			where: {
				...(cat && { catSlug: cat }),
				...(!all && { isVisible: true }),
			},
		};

		const [posts, count] = await prisma.$transaction([
			prisma.post.findMany(query),
			prisma.post.count({ where: query.where }),
		]);

		return NextResponse.json({ posts, count }, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}

//CREATE A POST
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

		const body = (await req.json()) as PostRequestBody;
		const userEmail = session.email || "";

		try {
			const post = await prisma.post.create({
				data: {
					...body,
					userEmail,
					isVisible: true,
				},
			});

			return NextResponse.json(post, { status: 200 });
		} catch (dbError) {
			// Special handling for unique constraint violations
			if (dbError && typeof dbError === "object" && "code" in dbError && dbError.code === "P2002") {
				return NextResponse.json({ error: labels.errors.postTitleExists }, { status: 409 });
			}
			throw dbError;
		}
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
