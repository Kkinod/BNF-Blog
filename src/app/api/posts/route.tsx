import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/utils/connect";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import { POST_PER_PAGE } from "@/config/constants";
import { labels } from "@/shared/utils/labels";
import { slugify } from "@/shared/utils/slugify";
import {
	handleApiError,
	methodNotAllowed,
	createUnauthorizedError,
	createForbiddenError,
	createNotFoundError,
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

export interface ListPost {
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
	user?: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
	};
}

export interface PostRequestBody {
	title: string;
	desc: string;
	img: string;
	slug: string;
	catSlug: string;
	isVisible: boolean;
}

export interface PostUpdateBody extends Partial<PostRequestBody> {
	id: string;
	isPick?: boolean;
}

export interface PostsResponse {
	posts: ListPost[];
	count: number;
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
			where: query.where,
		};

		const [posts, count] = await prisma.$transaction([
			prisma.post.findMany(query),
			prisma.post.count(countQuery),
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
		const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
		if (!isAdmin) {
			throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
		}

		const body = (await req.json()) as PostRequestBody;
		const userEmail = session.email || "";

		// Check if image URL is a data URL (base64)
		if (body.img && body.img.startsWith("data:")) {
			// Extract base64 part and calculate size
			const base64Data = body.img.split(",")[1];
			if (base64Data) {
				// Calculate size in bytes (base64 string length * 0.75)
				const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
				const sizeInMB = sizeInBytes / (1024 * 1024);

				// Check if size exceeds 1.5 MB
				if (sizeInMB > 1.5) {
					return NextResponse.json({ error: labels.errors.imageTooLarge }, { status: 400 });
				}
			}
		}

		// Generate slug from title if not provided
		if (!body.slug && body.title) {
			body.slug = slugify(body.title);
		}

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
	return methodNotAllowed(["GET", "POST", "PATCH"]);
}

//DELETE POST
export async function DELETE(req: NextRequest) {
	try {
		const session = await currentUser();
		if (!session) {
			throw createUnauthorizedError(labels.errors.invalidCredentials);
		}

		const role = await currentRole();
		const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
		if (!isAdmin) {
			throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
		}

		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json({ error: labels.errors.postIdRequired }, { status: 400 });
		}

		const existingPost = await prisma.post.findUnique({
			where: { id },
		});

		if (!existingPost) {
			throw createNotFoundError(labels.errors.postNotFound);
		}

		await prisma.post.delete({
			where: { id },
		});

		return NextResponse.json({ message: labels.posts.deleteSuccess }, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}

//EDIT POST
export async function PATCH(req: NextRequest) {
	try {
		const session = await currentUser();
		if (!session) {
			throw createUnauthorizedError(labels.errors.invalidCredentials);
		}

		const role = await currentRole();
		const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
		if (!isAdmin) {
			throw createForbiddenError(labels.errors.youDoNoteHavePermissionToViewThisContent);
		}

		const body = (await req.json()) as PostUpdateBody;
		const { id, ...updateData } = body;

		if (!id) {
			return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
		}

		// Check if image URL is being updated and is a data URL (base64)
		if (updateData.img && updateData.img.startsWith("data:")) {
			// Extract base64 part and calculate size
			const base64Data = updateData.img.split(",")[1];
			if (base64Data) {
				// Calculate size in bytes (base64 string length * 0.75)
				const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
				const sizeInMB = sizeInBytes / (1024 * 1024);

				// Check if size exceeds 1.5 MB
				if (sizeInMB > 1.5) {
					return NextResponse.json({ error: labels.errors.imageTooLarge }, { status: 400 });
				}
			}
		}

		const existingPost = await prisma.post.findUnique({
			where: { id },
		});

		if (!existingPost) {
			throw createNotFoundError("Post not found");
		}

		try {
			// If title is being updated, check for uniqueness excluding the current post
			if (updateData.title) {
				const postWithSameTitle = await prisma.post.findFirst({
					where: {
						title: updateData.title,
						id: { not: id },
					},
				});

				if (postWithSameTitle) {
					return NextResponse.json({ error: labels.errors.postTitleExists }, { status: 409 });
				}

				// Auto-generate slug from title if title is updated and slug is not provided
				if (!updateData.slug) {
					updateData.slug = slugify(updateData.title);

					// Check if the generated slug already exists (excluding current post)
					const postWithSameSlug = await prisma.post.findFirst({
						where: {
							slug: updateData.slug,
							id: { not: id },
						},
					});

					// If slug exists, make it unique by adding post ID
					if (postWithSameSlug) {
						updateData.slug = `${updateData.slug}-${id.substring(0, 6)}`;
					}
				}
			}

			const updatedPost = await prisma.post.update({
				where: { id },
				data: updateData,
			});

			return NextResponse.json(updatedPost, { status: 200 });
		} catch (dbError) {
			// Special handling for unique constraint violations (e.g., slug uniqueness)
			if (dbError && typeof dbError === "object" && "code" in dbError && dbError.code === "P2002") {
				return NextResponse.json({ error: labels.errors.postTitleExists }, { status: 409 });
			}
			throw dbError;
		}
	} catch (error) {
		return handleApiError(error);
	}
}
