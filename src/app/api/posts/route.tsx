import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/utils/connect";
import { currentUser, currentRole } from "@/lib/currentUser";
import { POST_PER_PAGE } from "@/config/constants";

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

interface PostRequestBody {
	title: string;
	desc: string;
	img: string;
	slug: string;
	catSlug: string;
	isVisible: boolean;
}

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const all = searchParams.get("all");
	const cat = searchParams.get("cat");

	try {
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

		return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
	}
};

//CREATE A POST
export const POST = async (req: NextRequest) => {
	const session = await currentUser();
	const role = await currentRole();

	if (!session) {
		return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
	}

	if (role !== UserRole.ADMIN) {
		return new NextResponse(null, { status: 403 });
	}

	try {
		const body: PostRequestBody = (await req.json()) as PostRequestBody;
		const userEmail = session.email || "";
		const post = await prisma.post.create({
			data: {
				...body,
				userEmail,
				isVisible: true,
			},
		});

		return new NextResponse(JSON.stringify(post), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
	}
};
