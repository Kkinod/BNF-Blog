import { NextResponse } from "next/server";
import { type Posts } from "../route";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";

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
export const GET = async (req: Request, { params }: { params: Params }) => {
	const { slug } = params;

	try {
		const post = await prisma.post.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			include: { user: true },
		});

		if (!post) {
			return new NextResponse(JSON.stringify({ message: labels.errors.postNotFound }), {
				status: 404,
			});
		}

		await prisma.post.update({
			where: { slug },
			data: { views: { increment: 1 } },
		});

		return new NextResponse(JSON.stringify(post), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
};
