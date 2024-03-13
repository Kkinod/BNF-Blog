import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export interface Posts {
	_id: string;
	createdAt: Date;
	slug: string;
	title: string;
	desc: string;
	img: string | null;
	views: number;
	catSlug: string;
	userEmail: string;
}

export const GET = async (req: string) => {
	const { searchParams } = new URL(req.url);

	const pageParam = searchParams.get("page");
	const page = parseInt(pageParam, 10);
	const cat = searchParams.get("cat");

	const POST_PER_PAGE = 2;

	const query = {
		take: POST_PER_PAGE,
		skip: POST_PER_PAGE * (page - 1),
		where: {
			...(cat && { catSlug: cat }),
		},
	};

	try {
		const [posts, count] = (await prisma.$transaction([
			prisma.post.findMany(query),
			prisma.post.count({ where: query.where }),
		])) as Posts[];

		return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
	}
};
