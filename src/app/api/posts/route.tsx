import { type NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/utils/connect";

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
}

interface PostRequestBody {
	title: string;
	desc: string;
	img: string;
	slug: string;
	catSlug: string;
}

export const POST_PER_PAGE = 4;

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);

	const pageParam = searchParams.get("page");
	const page = parseInt(pageParam ?? "1", 10);
	const cat = searchParams.get("cat");

	const query = {
		orderBy: {
			createdAt: "desc" as const,
		},
		take: POST_PER_PAGE,
		skip: POST_PER_PAGE * (page - 1),
		where: {
			...(cat && { catSlug: cat }),
		},
	};

	try {
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
	const session = await auth();

	if (!session) {
		return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
	}

	try {
		const body: PostRequestBody = (await req.json()) as PostRequestBody;
		const userEmail = session?.user?.email || "";
		const post = await prisma.post.create({
			data: { ...body, userEmail },
		});

		return new NextResponse(JSON.stringify(post), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
	}
};
