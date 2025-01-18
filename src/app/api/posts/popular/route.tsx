import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";

export const GET = async () => {
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

		return new NextResponse(JSON.stringify(posts), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
};
